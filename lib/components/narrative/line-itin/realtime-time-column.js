import { isTransit } from '@opentripplanner/core-utils/lib/itinerary'
import {
  legType,
  timeOptionsType
} from '@opentripplanner/core-utils/lib/types'
import { formatTime } from '@opentripplanner/core-utils/lib/time'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import RealtimeStatusLabel, { DelayText, MainContent } from '../../viewers/realtime-status-label'

const StyledStatusLabel = styled(RealtimeStatusLabel)`
  ${MainContent} {
    font-size: 80%;
    line-height: 1em;
  }
  ${DelayText} {
    display: block;
  }
`
/**
 * This component displays the scheduled departure/arrival time for a leg,
 * and, for transit legs, displays any delays or earliness where applicable.
 */
function RealtimeTimeColumn ({
  isDestination,
  leg,
  timeOptions
}) {
  const time = isDestination ? leg.endTime : leg.startTime
  const formattedTime = time && formatTime(time, timeOptions)
  const isTransitLeg = isTransit(leg.mode)
  const isRealtimeTransitLeg = isTransitLeg && leg.realTime

  // For non-transit legs show only the scheduled time.
  if (!isTransitLeg) {
    return <div>{formattedTime}</div>
  }

  const delaySeconds = isDestination ? leg.arrivalDelay : leg.departureDelay
  const originalTimeMillis = time - delaySeconds * 1000
  const originalFormattedTime =
    originalTimeMillis && formatTime(originalTimeMillis, timeOptions)

  return (
    <StyledStatusLabel
      delay={delaySeconds}
      isRealtime={isRealtimeTransitLeg}
      originalTime={originalFormattedTime}
      time={formattedTime} />
  )
}

RealtimeTimeColumn.propTypes = {
  isDestination: PropTypes.bool.isRequired,
  leg: legType.isRequired,
  timeOptions: timeOptionsType
}

RealtimeTimeColumn.defaultProps = {
  timeOptions: null
}

export default RealtimeTimeColumn
