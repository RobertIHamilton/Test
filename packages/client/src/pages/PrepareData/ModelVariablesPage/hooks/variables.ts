/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IContextualMenuItem } from '@fluentui/react'
import { useMemo } from 'react'
import {
	ColumnAsTargetArgs,
	SelectedArgs,
	SubjectIdentifierArgs,
	SubjectIdentifierDataArgs,
} from './interfaces'
import { FactorsOrDefinitions } from './types'
import { ColumnRelation, ColumnRelevance, PageType } from '~enums'
import { DefinitionTable, BasicTable } from '~interfaces'

export const useDefinitionOptions = ({
	defineQuestionData,
	type,
	causalFactors,
}: Omit<
	SelectedArgs,
	'definitionOptions' | 'selectedDefinition'
>): FactorsOrDefinitions => {
	return useMemo((): FactorsOrDefinitions => {
		if (type === PageType.Control) {
			return causalFactors
		}
		return defineQuestionData?.definition || []
	}, [defineQuestionData, causalFactors, type])
}

export const useSelected = ({
	defineQuestionData,
	definitionOptions,
	selectedDefinition,
	type,
	causalFactors,
}: SelectedArgs): string => {
	return useMemo((): string => {
		let options = defineQuestionData?.definition?.flatMap(x => x.variable) || []
		if (type === PageType.Control) {
			options = causalFactors.flatMap(x => x.variable)
		}
		if (!selectedDefinition.length || !options.includes(selectedDefinition)) {
			return definitionOptions[0]?.variable as string
		}
		return selectedDefinition
	}, [
		defineQuestionData,
		definitionOptions,
		selectedDefinition,
		type,
		causalFactors,
	])
}

export const useRelationType = (type: string): ColumnRelation => {
	return useMemo((): ColumnRelation => {
		switch (type) {
			case PageType.Outcome:
				return ColumnRelation.OutcomeDefinition
			case PageType.Exposure:
				return ColumnRelation.ExposureDefinition
			case PageType.Control:
				return ColumnRelation.ControlDefinition
			case PageType.Population:
			default:
				return ColumnRelation.PopulationDefinition
		}
	}, [type])
}

export const useSubjectIdentifier = ({
	allTableColumns,
	relationType,
	modelVariables,
}: SubjectIdentifierArgs): string[] => {
	return useMemo(() => {
		const projectTableColumns = allTableColumns.flatMap(x => x)
		const columns =
			modelVariables.length > 0
				? (modelVariables
						.flat()
						.flatMap(a => a?.filters)
						.filter(x => x)
						.map(a => a?.columnName) as string[])
				: []

		return (
			projectTableColumns
				?.filter(
					c =>
						c?.relevance === ColumnRelevance.SubjectIdentifier ||
						columns.includes(c?.name as string) ||
						(c?.relevance === ColumnRelevance.CausallyRelevantToQuestion &&
							c?.relation?.includes(relationType)),
				)
				.map(x => x?.name || '')
				.concat(columns) || []
		)
	}, [allTableColumns, relationType, modelVariables])
}

export const useSubjectIdentifierData = ({
	allOriginalTables,
	subjectIdentifier,
	setTableIdentifier,
}: SubjectIdentifierDataArgs): DefinitionTable => {
	return useMemo((): DefinitionTable => {
		const mainTable = allOriginalTables
			.map(originalTable => {
				const table = { ...originalTable }
				const columns = subjectIdentifier.filter(x =>
					table?.columns.columnNames().includes(x),
				)

				if (!columns.length) return null
				table.columns = table.columns.select(columns)

				return table as BasicTable
			})
			.find(x => x)

		const columnNames = mainTable?.columns?.columnNames()
		const data = {
			columnNames,
			columns: mainTable?.columns,
			tableId: mainTable?.tableId,
		} as DefinitionTable
		setTableIdentifier(data)
		return data
	}, [allOriginalTables, subjectIdentifier, setTableIdentifier])
}

export const useColumnsAsTarget = ({
	subjectIdentifierData,
	causalFactors,
	type,
	onUpdateTargetVariable,
}: ColumnAsTargetArgs): IContextualMenuItem[] => {
	return useMemo(() => {
		const selectedColumns =
			type === PageType.Control ? causalFactors.map(x => x.column) : []

		return (
			subjectIdentifierData?.columnNames &&
			subjectIdentifierData?.columnNames
				.filter(x => !selectedColumns.includes(x))
				.map(opt => {
					return {
						key: opt,
						text: opt,
						canCheck: true,
						onClick: onUpdateTargetVariable,
					}
				})
		)
	}, [subjectIdentifierData, causalFactors, type, onUpdateTargetVariable])
}