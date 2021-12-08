/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { DescribeElements, ElementDefinition } from '~interfaces'
import { GenericFn } from '~types'
import { wait } from '~utils'

export const useSaveDefinitions = (
	type: string,
	defineQuestion: DescribeElements,
	setDefineQuestion: GenericFn,
): GenericFn => {
	return useCallback(
		async (definitions: ElementDefinition[]) => {
			const question = {
				...defineQuestion,
				[type]: {
					...defineQuestion[type],
					definition: definitions,
				},
			}
			setDefineQuestion(question)
			await wait(500)
		},
		[setDefineQuestion, defineQuestion, type],
	)
}
