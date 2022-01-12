/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { RefutationOptionsCallout } from '~components/RefutationOptionsCallout'
import { DescribeElements, Estimator, RefutationOption } from '~interfaces'
import { Bold, Container, Text, Title } from '~styles'
import { addS } from '~utils'

interface SpecificationsListProp {
	estimators: Estimator[]
	definitions: DescribeElements
	hasConfidenceInterval: boolean
	refutationOptions: RefutationOption[]
}

const causalModels = ['Maximum', 'Minimum']
export const SpecificationsList: React.FC<SpecificationsListProp> = memo(
	function SpecificationsList({
		estimators,
		definitions,
		hasConfidenceInterval,
		refutationOptions,
	}) {
		const totalEstimatorsCount = estimators.length

		return (
			<Container>
				<Title>Analysis specifications as combinations of: ​​</Title>

				<List>
					<ListItem>
						{definitions?.population ? (
							<Text>
								<Bold>{definitions.population.definition.length}</Bold>{' '}
								population definition
								{addS(definitions?.population?.definition.length)}
							</Text>
						) : (
							<Link to="/define/population">Define population</Link>
						)}
						​
					</ListItem>
					<ListItem>
						{definitions?.exposure ? (
							<Text>
								<Bold>{definitions.exposure.definition.length}</Bold> exposure
								definition
								{addS(definitions?.exposure?.definition.length)}
							</Text>
						) : (
							<Link to="/define/exposure">Define exposure</Link>
						)}
						​
					</ListItem>
					<ListItem>
						{definitions?.outcome ? (
							<Text>
								<Bold>{definitions.outcome.definition.length}</Bold> outcome
								definition
								{addS(definitions?.outcome?.definition.length)}
							</Text>
						) : (
							<Link to="/define/outcome">Define outcome</Link>
						)}
						​
					</ListItem>
					<ListItem>
						<Bold>{causalModels.length + 1}</Bold> causal models​
					</ListItem>
					<ListItem>
						<Bold>{totalEstimatorsCount}</Bold> estimator configuration
						{addS(totalEstimatorsCount)}
					</ListItem>
				</List>
				<span>For each specification, compute:</span>
				<List>
					<ListItem>Estimated effect</ListItem>
					{hasConfidenceInterval && <ListItem>Confidence interval</ListItem>}
					<ListItem>
						{refutationOptions.length} refutation tests:{' '}
						{refutationOptions.map((o, index) => (
							<RefutationOptionsCallout
								key={index}
								calloutKey={index}
								title={o.label}
								text={o.helpText}
								separate={index > 0}
							/>
						))}
					</ListItem>
				</List>
			</Container>
		)
	},
)

const List = styled.ul``

const ListItem = styled.li`
	padding: 0.5rem;
`