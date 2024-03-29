/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MessageBar, MessageBarType, Stack } from '@fluentui/react'
import { memo } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from 'react-error-boundary'

import { ALERT_MESSAGE } from './CauseDisErrorBoundary.constants.js'
import { ClearStateButton } from './controls/ClearStateButton.js'
import { SaveStateButton } from './controls/SaveStateButton.js'

const ErrorFallback: React.FC<FallbackProps> = memo(function ErrorFallback({
	error,
	resetErrorBoundary,
}) {
	return (
		<Stack gap="gap.smaller">
			<MessageBar messageBarType={MessageBarType.severeWarning}>
				{ALERT_MESSAGE}
			</MessageBar>
			{error.message}
			<br />
			<textarea value={error.stack} rows={20} cols={150} readOnly />
			<div style={{ display: 'flex' }}>
				<ClearStateButton label="Reset" onClick={resetErrorBoundary} />
				<SaveStateButton
					label="Save"
					filename={`ErrorReport-${new Date().toLocaleString()}`}
					error={error}
				/>
			</div>
		</Stack>
	)
})

export const CauseDisErrorBoundary: React.FC<
	React.PropsWithChildren<{
		// no props
	}>
> = memo(function CauseDisErrorBoundary({ children }) {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
	)
})
