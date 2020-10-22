import { Field } from 'formik'
import React from 'react'
import {
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock
} from 'react-bootstrap'
import styled from 'styled-components'

import { ALL_DAYS } from '../../util/monitored-trip'
import TripSummary from './trip-summary'

// Styles.
const StyledLabel = styled.label`
  border: 1px solid #ccc;
  border-left: none;
  box-sizing: border-box;
  display: inline-block;
  font-weight: inherit;
  max-width: 150px;
  min-width: 14.28%;
  text-align: center;
  & > span {
    display: block;
    width: 100%;
  }
  &:first-of-type {
    border-left: 1px solid #ccc;
  }
`

const allDays = [
  { name: 'monday', text: 'Mon.' },
  { name: 'tuesday', text: 'Tue.' },
  { name: 'wednesday', text: 'Wed.' },
  { name: 'thursday', text: 'Thu.' },
  { name: 'friday', text: 'Fri.' },
  { name: 'saturday', text: 'Sat.' },
  { name: 'sunday', text: 'Sun.' }
]

/**
 * This component shows summary information for a trip
 * and lets the user edit the trip name and day.
 */
const TripBasicsPane = ({ errors, touched, values: monitoredTrip }) => {
  const { itinerary } = monitoredTrip

  if (!itinerary) {
    return <div>No itinerary to display.</div>
  } else {
    // Show an error indicaton when monitoredTrip.tripName is not blank (from the form's validation schema)
    // and that tripName is not already used.
    let tripNameValidationState = null
    if (touched.tripName) {
      tripNameValidationState = errors.tripName ? 'error' : null
    }

    // Show a combined error indicaton when no day is selected.
    let monitoredDaysValidationState = null
    ALL_DAYS.forEach(day => {
      if (touched[day]) {
        if (!monitoredDaysValidationState) {
          monitoredDaysValidationState = errors[day] ? 'error' : null
        }
      }
    })

    return (
      <div>
        <ControlLabel>Selected itinerary:</ControlLabel>
        <TripSummary monitoredTrip={monitoredTrip} />

        <FormGroup validationState={tripNameValidationState}>
          <ControlLabel>Please provide a name for this trip:</ControlLabel>
          {/* onBlur, onChange, and value are passed automatically. */}
          <Field as={FormControl} name='tripName' />
          <FormControl.Feedback />
          {errors.tripName && <HelpBlock>{errors.tripName}</HelpBlock>}
        </FormGroup>

        <FormGroup validationState={monitoredDaysValidationState}>
          <ControlLabel>What days to you take this trip?</ControlLabel>
          <div>
            {allDays.map(({ name, text }, index) => (
              <StyledLabel className={monitoredTrip[name] ? 'bg-primary' : ''} key={index}>
                <span>{text}</span>
                <Field
                  name={name}
                  type='checkbox'
                />
              </StyledLabel>
            ))}
          </div>
          {monitoredDaysValidationState && <HelpBlock>Please select at least one day to monitor.</HelpBlock>}
        </FormGroup>
      </div>
    )
  }
}

export default TripBasicsPane
