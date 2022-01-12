/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { CausalModelLevel } from '~enums'
import { useAlternativeModels } from '~hooks'
import { NodeProperties } from '~interfaces'
import {
	useConfidenceInterval,
	useDefineQuestion,
	useEstimators,
	useRefutationType,
} from '~state'

export const useNodeProperties = (): NodeProperties => {
	const definitions = useDefineQuestion()
	const estimators = useEstimators()
	const refutationType = useRefutationType()
	const confidenceInterval = useConfidenceInterval()
	const maximumLevel = useAlternativeModels(CausalModelLevel.Maximum, false)
	const intermediateLevel = useAlternativeModels(
		CausalModelLevel.Intermediate,
		false,
	)
	const minimumModel = useAlternativeModels(CausalModelLevel.Minimum, false)
	const unadjustedModel = useAlternativeModels(
		CausalModelLevel.Unadjusted,
		false,
	)
	return useMemo(() => {
		return {
			definitions,
			estimators,
			refutationType,
			confidenceInterval,
			maximumLevel,
			minimumModel,
			intermediateLevel,
			unadjustedModel,
		}
	}, [
		definitions,
		estimators,
		refutationType,
		confidenceInterval,
		maximumLevel,
		minimumModel,
		intermediateLevel,
		unadjustedModel,
	])
}