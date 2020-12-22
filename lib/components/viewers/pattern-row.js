import React, { Component } from 'react'
import { VelocityTransitionGroup } from 'velocity-react'

import Icon from '../narrative/icon'
import { getStatusLabel, stopTimeComparator } from '../../util/viewer'
import StopTimeCell from './stop-time-cell'

/**
 * Represents a single pattern row for displaying arrival times in the stop
 * viewer.
 */
export default class PatternRow extends Component {
  constructor () {
    super()
    this.state = { expanded: false }
  }

  _toggleExpandedView = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  _renderNextArrivalsView = () => {
    const {
      pattern,
      route,
      stopTimes,
      homeTimezone,
      stopViewerArriving,
      stopViewerConfig,
      timeFormat
    } = this.props
    // sort stop times by next departure
    let sortedStopTimes = []
    const hasStopTimes = stopTimes && stopTimes.length > 0
    if (hasStopTimes) {
      sortedStopTimes = stopTimes
        .concat()
        .sort(stopTimeComparator)
        // We request only x departures per pattern, but the patterns are merged
        // according to shared headsigns, so we need to slice the stop times
        // here as well to ensure only x times are shown per route/headsign combo.
        // This is applied after the sort, so we're keeping the soonest departures.
        .slice(0, stopViewerConfig.numberOfDepartures)
    } else {
      // Do not include pattern row if it has no stop times.
      return null
    }
    const routeName = route.shortName ? route.shortName : route.longName

    return (
      <>
        {/* header row */}
        <div className='header'>
          {/* route name */}
          <div className='route-name'>
            <b>{routeName}</b> To {pattern.headsign}
          </div>
          {/* next departure preview */}
          {hasStopTimes && (
            <div className='next-trip-preview'>
              <StopTimeCell
                homeTimezone={homeTimezone}
                soonText={stopViewerArriving}
                stopTime={sortedStopTimes[0]}
                timeFormat={timeFormat}
              />
            </div>
          )}

          {/* expansion chevron button */}
          <div className='expansion-button-container'>
            <button className='expansion-button' onClick={this._toggleExpandedView}>
              <Icon type={`chevron-${this.state.expanded ? 'up' : 'down'}`} />
            </button>
          </div>
        </div>

        {/* expanded view */}
        <VelocityTransitionGroup
          enter={{ animation: 'slideDown' }}
          leave={{ animation: 'slideUp' }}>
          {this.state.expanded && (
            <div>
              <div className='trip-table'>
                {/* trips table header row */}
                <div className='header'>
                  <div className='cell' />
                  <div className='cell time-column'>DEPARTURE</div>
                  <div className='cell status-column'>STATUS</div>
                </div>

                {/* list of upcoming trips */}
                {hasStopTimes && (
                  sortedStopTimes.map((stopTime, i) => {
                    return (
                      <div
                        className='trip-row'
                        style={{ display: 'table-row', marginTop: 6, fontSize: 14 }}
                        key={i}>
                        <div className='cell'>
                          To {stopTime.headsign}
                        </div>
                        <div className='cell time-column'>
                          <StopTimeCell
                            homeTimezone={homeTimezone}
                            soonText={stopViewerArriving}
                            stopTime={stopTime}
                            timeFormat={timeFormat}
                          />
                        </div>
                        <div className='cell status-column'>
                          {stopTime.realtimeState === 'UPDATED'
                            ? getStatusLabel(stopTime.departureDelay)
                            : <div
                              className='status-label'
                              style={{ backgroundColor: '#bbb' }}>
                              Scheduled
                            </div>
                          }
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </VelocityTransitionGroup>
      </>
    )
  }

  render () {
    return (
      <div className='route-row'>
        {this._renderNextArrivalsView()}
      </div>
    )
  }
}
