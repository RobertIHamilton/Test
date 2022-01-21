/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	FileType,
	createFileWithPath,
	fetchFile,
	FileWithPath,
} from '@data-wrangling-components/utilities'
import { useCallback, useMemo } from 'react'
import { NodeResponseStatus, PageType } from '~enums'
import { useGetCSVResult, useGetStepUrlsByStatus } from '~hooks'
import { Workspace } from '~interfaces'
import {
	useCausalFactors,
	useConfidenceInterval,
	useDefineQuestion,
	useEstimators,
	usePrimarySpecificationConfig,
	useRefutationType,
	useAllTableColumns,
	useProjectFiles,
	useAllModelVariables,
	useFileCollection,
	usePrimaryTable,
	useDefaultDatasetResult,
	useOriginalTables,
	useRunHistory,
} from '~state'
import { isDataUrl } from '~utils'

export const useSaveProject = (): (() => Promise<void>) => {
	const fileCollection = useFileCollection()
	const confidenceInterval = useConfidenceInterval()
	const primarySpecification = usePrimarySpecificationConfig()
	const causalFactors = useCausalFactors()
	const defineQuestion = useDefineQuestion()
	const estimators = useEstimators()
	const refutations = useRefutationType()
	const projectFiles = useProjectFiles()
	const todoPages = useGetStepUrlsByStatus()({ exclude: true })
	const [tableColumns] = useAllTableColumns(projectFiles)
	const [exposure] = useAllModelVariables(projectFiles, PageType.Exposure)
	const [outcome] = useAllModelVariables(projectFiles, PageType.Outcome)
	const [control] = useAllModelVariables(projectFiles, PageType.Control)
	const [population] = useAllModelVariables(projectFiles, PageType.Population)
	const modelVariables = useMemo(
		() => ({
			exposure,
			outcome,
			control,
			population,
		}),
		[exposure, outcome, control, population],
	)
	const download = useDownload(fileCollection)

	//TODO: Add postLoad steps into workspace
	return useCallback(async () => {
		const workspace: Partial<Workspace> = {
			primarySpecification,
			confidenceInterval,
			causalFactors,
			defineQuestion,
			estimators,
			refutations,
			tableColumns,
			modelVariables,
			todoPages,
		}
		await download(workspace)
	}, [
		confidenceInterval,
		primarySpecification,
		causalFactors,
		defineQuestion,
		estimators,
		refutations,
		tableColumns,
		modelVariables,
		todoPages,
		download,
	])
}

const usePrimary = (): (() => FileWithPath | undefined) => {
	const primaryTable = usePrimaryTable()
	const originalTables = useOriginalTables()
	return useCallback(() => {
		const ogTables = originalTables.find(
			file => file.tableId === primaryTable.id,
		)
		if (ogTables) {
			const options = {
				name: `subject_${primaryTable.name}`,
				type: 'text/csv',
			}
			return createFileWithPath(new Blob([ogTables.table.toCSV()]), options)
		}
	}, [primaryTable, originalTables])
}

const useTables = fileCollection => {
	return useCallback(
		primary => {
			const files = fileCollection.list(FileType.table)
			if (primary) {
				files.push(primary)
			}
			return files.map(file => {
				const isPrimary = files.length === 1 || file.name === primary.name
				return {
					url: `zip://${file.name}`,
					name: file.name,
					primary: isPrimary,
				}
			})
		},
		[fileCollection],
	)
}

const useCSVResult = (): Promise<FileWithPath | undefined> => {
	const getCSVResult = useGetCSVResult()
	const runHistory = useRunHistory()
	return useMemo(async () => {
		const completed = runHistory.find(
			run =>
				run.isActive && run.status?.status === NodeResponseStatus.Completed,
		)
		if (completed) {
			const options = {
				name: 'results.csv',
				type: 'text/csv',
			}
			const csvResult = await getCSVResult()
			if (csvResult) {
				return createFileWithPath(csvResult, options)
			}
		}
		return undefined
	}, [getCSVResult, runHistory])
}

const useResults = () => {
	const defaultDatasetResult = useDefaultDatasetResult()
	const csvResult = useCSVResult()
	return useMemo(async () => {
		const file = await csvResult
		if (file) {
			return {
				file,
				url: `zip://${file.name}`,
			}
		} else if (defaultDatasetResult?.url) {
			let { url } = defaultDatasetResult
			let file
			if (isDataUrl(defaultDatasetResult.url)) {
				const f = await fetchFile(defaultDatasetResult.url)
				const options = {
					name: 'results.csv',
					type: 'text/csv',
				}
				file = createFileWithPath(f, options)
				url = `zip://${file.name}`
			}
			return {
				file,
				url,
			}
		}
	}, [defaultDatasetResult, csvResult])
}

const useDownload = fileCollection => {
	const results = useResults()
	const getPrimary = usePrimary()
	const getTables = useTables(fileCollection)
	return useCallback(
		async (workspace: Partial<Workspace>) => {
			const primary: FileWithPath | undefined = getPrimary()
			const tables = getTables(primary)
			const result: { file: FileWithPath; url: string } | undefined =
				await results
			workspace.tables = tables
			if (fileCollection.name) {
				workspace.name = fileCollection.name
			}
			if (result?.url) {
				workspace.defaultResult = { url: result.url }
			}
			const options = {
				name: 'workspace_config.json',
				type: 'application/json',
			}
			const file = createFileWithPath(
				new Blob([JSON.stringify(workspace, null, 4)]),
				options,
			)
			const files = [file, primary]
			if (result?.file) {
				files.push(result.file)
			}
			const copy = fileCollection.copy()
			/* eslint-disable @essex/adjacent-await */
			await copy.add(files)
			await copy.toZip()
		},
		[fileCollection, results, getTables, getPrimary],
	)
}