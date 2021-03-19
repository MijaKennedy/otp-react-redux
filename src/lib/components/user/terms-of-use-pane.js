import React from 'react'
import { Checkbox, ControlLabel, FormGroup } from 'react-bootstrap'

import { TERMS_OF_SERVICE_PATH, TERMS_OF_STORAGE_PATH } from '../../util/constants'

/**
 * User terms of use pane.
 */
const TermsOfUsePane = ({
  disableCheckTerms,
  handleBlur,
  handleChange,
  values: userData
}) => {
  const {
    hasConsentedToTerms,
    storeTripHistory
  } = userData

  return (
    <div>
      <ControlLabel>You must agree to the terms of service to continue.</ControlLabel>

      <FormGroup>
        <Checkbox
          checked={hasConsentedToTerms}
          disabled={disableCheckTerms}
          name='hasConsentedToTerms'
          onBlur={disableCheckTerms ? null : handleBlur}
          onChange={disableCheckTerms ? null : handleChange}
        >
          {/* TODO: Implement the link */}
            I have read and consent to the <a href={`/#${TERMS_OF_SERVICE_PATH}`} target='_blank'>Terms of Service</a> for using the Trip Planner.
        </Checkbox>
      </FormGroup>

      <FormGroup>
        <Checkbox
          checked={storeTripHistory}
          name='storeTripHistory'
          onBlur={handleBlur}
          onChange={handleChange}
        >
          {/* TODO: Implement the link */}
            Optional: I consent to the Trip Planner storing my historical planned trips in order to
            improve transit services in my area. <a href={`/#${TERMS_OF_STORAGE_PATH}`} target='_blank'>More info...</a>
        </Checkbox>
      </FormGroup>
    </div>
  )
}

export default TermsOfUsePane
