/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { RefutationOption } from '../types/refutation/RefutationOption.js'
import { RefutationTestMethod } from '../types/refutation/RefutationTestMethod.js'

const REFUTATIONS: RefutationOption[] = [
	{
		method_name: RefutationTestMethod.PlaceboTreatment,
		label: 'Replace exposure with placebo',
		helpText:
			'In each simulation, we replace the true exposure variable with an independent random variable and re-compute the estimated effect. If our estimate is robust, we expect that the new estimated effect to be close to 0.',
		description: 'Replace exposure with an independent random variable',
	},
	{
		method_name: RefutationTestMethod.DataSubset,
		label: 'Remove random subset of data',
		helpText:
			'In each simulation, we replace the original dataset with a randomly selected subset and re-compute the estimated effect. If our estimate is robust, we expect that the newly estimated effect does not change significantly with the new data subset.',
		description: 'Replace the original dataset with a randomly selected subset',
	},
	{
		method_name: RefutationTestMethod.Bootstrap,
		label: 'Bootstrap sample dataset',
		helpText:
			'In each simulation, we replace the original dataset with a bootstrapped sample from our original dataset. If our estimate is robust, we expect that the newly estimated effect does not change significantly with the new bootstrapped dataset.',
		description: 'Replace the original dataset with a bootstrapped sample',
	},
	// {
	// 	method_name: RefutationTestMethod.AddUnobservedCommonCause,
	// 	label: 'Add an unobserved common cause',
	// 	helpText:
	// 		'In each simulation, we add a confounder to the dataset that is correlated with the exposure and outcome and re-compute the estimated effect. If our estimate is robust, we expect the newly estimated effect does not change significantly with the addition of the new confounder.',
	// 	description:
	// 		'Add a confounder that is correlated with exposure and outcome',
	// },
	{
		method_name: RefutationTestMethod.RandomCommonCause,
		label: 'Add a random common cause',
		helpText:
			'In each simulation, we add an independent random variable as a confounder to the dataset and re-compute the estimated effect. If our estimate is robust, we expect that the newly estimated effect does not change significantly with the addition of the new confounder.',
		description: 'Add an independent random confounder to the dataset',
	},
]

export function useRefutationOptions(): RefutationOption[] {
	return REFUTATIONS
}
