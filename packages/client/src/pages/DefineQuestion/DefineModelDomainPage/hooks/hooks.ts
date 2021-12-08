/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect, useMemo, useState } from 'react'
import { useAddDefinition } from './add'
import { useEditDefinition } from './edit'
import { useRemoveDefinition } from './remove'
import { useSaveDefinitions } from './save'
import { usePageType, useVariableOptions } from '~hooks'
import { ElementDefinition, Item } from '~interfaces'
import { useDefineQuestion, useSetDefineQuestion } from '~state'
import { GenericObject } from '~types'

export const useBusinessLogic = (): GenericObject => {
	const defineQuestion = useDefineQuestion()
	const pageType = usePageType()
	const variables = useVariableOptions()
	const setDefineQuestion = useSetDefineQuestion()
	const [definitions, setDefinitions] = useState<
		ElementDefinition[] | undefined
	>(defineQuestion[pageType]?.definition || [])
	const [definitionToEdit, setDefinitionToEdit] = useState<ElementDefinition>()

	const [labelInterest, setLabelInterest] = useState<string | undefined>(
		defineQuestion[pageType]?.label || '',
	)

	const [descriptionInterest, setDescriptionInterest] = useState<
		string | undefined
	>(defineQuestion[pageType]?.description)

	const saveDefinitions = useSaveDefinitions(
		pageType,
		defineQuestion,
		setDefineQuestion,
	)

	const addDefinition = useAddDefinition(
		setDefinitions,
		saveDefinitions,
		definitions,
	)

	const removeDefinition = useRemoveDefinition(
		setDefinitions,
		saveDefinitions,
		definitions,
	)

	const editDefinition = useEditDefinition(
		setDefinitions,
		setDefinitionToEdit,
		saveDefinitions,
	)

	const itemList = useItemList(definitions)

	useEffect(() => {
		setLabelInterest(defineQuestion[pageType]?.label || '')
		setDescriptionInterest(defineQuestion[pageType]?.description || '')
		setDefinitions(defineQuestion[pageType]?.definition || [])
		setDefinitionToEdit(undefined)
	}, [
		defineQuestion,
		pageType,
		setDefinitionToEdit,
		setDefinitions,
		setLabelInterest,
		setDescriptionInterest,
	])

	return {
		labelInterest,
		descriptionInterest,
		itemList,
		definitionToEdit,
		pageType,
		defineQuestion,
		variables,
		addDefinition,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
	}
}

const useItemList = (definitions): Item[] => {
	return useMemo(() => {
		return definitions?.map(x => {
			const newObj = { ...x }
			delete newObj.column
			return newObj
		})
	}, [definitions])
}
