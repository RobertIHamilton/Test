/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { chart } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { select } from 'd3'
import { memo, useEffect, useRef } from 'react'

import type { DrawingContainerProps } from './DrawingContainer.types.js'

export const DrawingContainer: React.FC<
	React.PropsWithChildren<DrawingContainerProps>
> = memo(function DrawingContainer({
	width,
	height,
	margin = DEFAULT_MARGIN,
	className = 'chart',
	children,
	handleClickOutside,
	handleContainerClick,
}) {
	const theme = useThematic()
	const svgWidth = width + margin.left + margin.right
	const svgHeight = height + margin.top + margin.bottom

	const ref = useRef<SVGSVGElement>(null)

	const handleDocumentClick = (event: MouseEvent) => {
		if (
			ref.current &&
			event.target instanceof Node &&
			!ref.current.contains(event.target)
		) {
			handleClickOutside()
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleDocumentClick, true)
		return () => {
			document.removeEventListener('click', handleDocumentClick, true)
		}
	}, [])

	useEffect(() => {
		if (ref.current) {
			const svg = select(ref.current)
			chart(svg, theme)
		}
	}, [theme, ref])
	return (
		<svg
			ref={ref}
			className={className}
			width={svgWidth}
			height={svgHeight}
			onClick={handleContainerClick}
		>
			<g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
		</svg>
	)
})

const DEFAULT_MARGIN = { top: 0, bottom: 0, right: 0, left: 0 }
