/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { CausalModelLevel, EstimatorsType } from '~enums'
import { PrimarySpecificationConfig } from '~interfaces'

export const primarySpecificationConfigState = atom<PrimarySpecificationConfig>(
	{
		key: 'primary-specification-config-state',
		default: {
			causalModel: CausalModelLevel.Maximum,
			type: EstimatorsType.PropensityScoreStratification,
		},
	},
)

export function usePrimarySpecificationConfig(): PrimarySpecificationConfig {
	return useRecoilValue(primarySpecificationConfigState)
}

export function useSetPrimarySpecificationConfig(): SetterOrUpdater<PrimarySpecificationConfig> {
	return useSetRecoilState(primarySpecificationConfigState)
}

export function useResetPrimarySpecificationConfig(): Resetter {
	return useResetRecoilState(primarySpecificationConfigState)
}
