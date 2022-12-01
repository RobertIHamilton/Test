/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SVGProps } from 'react'

import type { D3ScaleLinear, LineData } from '../types.js'

export enum AnimationType {
	Left = 'left',
	Path = 'path',
}

export type LineProps = SVGProps<SVGPathElement> & {
	xScale: D3ScaleLinear
	yScale: D3ScaleLinear
	data: LineData[]
	animation?: AnimationType
	color: string
}
