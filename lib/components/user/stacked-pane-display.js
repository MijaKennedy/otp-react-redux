import PropTypes from 'prop-types'
import React from 'react'

import FormNavigationButtons from './form-navigation-buttons'
import { PageHeading, StackedPaneContainer } from './styled'

/**
 * This component handles the flow between screens for new OTP user accounts.
 */
const StackedPaneDisplay = ({ onCancel, paneSequence, title }) => (
  <>
    {title && <PageHeading>{title}</PageHeading>}
    {
      paneSequence.map(({ pane: Pane, props, title }, index) => (
        <StackedPaneContainer key={index}>
          <h3>{title}</h3>
          <div><Pane {...props} /></div>
        </StackedPaneContainer>
      ))
    }

    <FormNavigationButtons
      backButton={{
        onClick: onCancel,
        text: 'Cancel'
      }}
      okayButton={{
        text: 'Save Preferences',
        type: 'submit'
      }}
    />
  </>
)

StackedPaneDisplay.propTypes = {
  onCancel: PropTypes.func.isRequired,
  paneSequence: PropTypes.array.isRequired
}

export default StackedPaneDisplay
