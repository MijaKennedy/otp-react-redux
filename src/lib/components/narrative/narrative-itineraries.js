import coreUtils from '@opentripplanner/core-utils'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { connect } from 'react-redux'

import {
  setActiveItinerary,
  setActiveLeg,
  setActiveStep,
  setUseRealtimeResponse,
  setVisibleItinerary,
  updateItineraryFilter
} from '../../actions/narrative'
import Icon from '../narrative/icon'
import { ComponentContext } from '../../util/contexts'
import {
  getActiveItineraries,
  getActiveSearch,
  getRealtimeEffects,
  getResponsesWithErrors
} from '../../util/state'

import SaveTripButton from './save-trip-button'

// TODO: move to utils?
function humanReadableMode (modeStr) {
  if (!modeStr) return 'N/A'
  const arr = modeStr.toLowerCase().replace(/_/g, ' ').split(',')
  if (arr.length > 2) {
    const last = arr.pop()
    return arr.join(', ') + ' and ' + last
  } else {
    return arr.join(' and ')
  }
}

class NarrativeItineraries extends Component {
  static propTypes = {
    containerStyle: PropTypes.object,
    itineraries: PropTypes.array,
    pending: PropTypes.bool,
    activeItinerary: PropTypes.number,
    setActiveItinerary: PropTypes.func,
    setActiveLeg: PropTypes.func,
    setActiveStep: PropTypes.func,
    setUseRealtimeResponse: PropTypes.func,
    useRealtime: PropTypes.bool
  }

  static contextType = ComponentContext

  state = {}

  _toggleDetailedItinerary = () => {
    this.setState({showDetails: !this.state.showDetails})
  }

  _onSortChange = evt => {
    const {value: type} = evt.target
    const {sort, updateItineraryFilter} = this.props
    updateItineraryFilter({sort: {...sort, type}})
  }

  _onSortDirChange = () => {
    const {sort, updateItineraryFilter} = this.props
    const direction = sort.direction === 'ASC' ? 'DESC' : 'ASC'
    updateItineraryFilter({sort: {...sort, direction}})
  }

  _toggleRealtimeItineraryClick = (e) => {
    const {setUseRealtimeResponse, useRealtime} = this.props
    setUseRealtimeResponse({useRealtime: !useRealtime})
  }

  _renderLoadingDivs = () => {
    const {itineraries, modes, pending} = this.props
    if (!pending) return null
    // Construct loading divs as placeholders while all itineraries load.
    const count = modes.combinations
      ? modes.combinations.length - itineraries.length
      : 0
    return Array.from(
      {length: count},
      (v, i) =>
        <div key={i} className='option default-itin'>
          <SkeletonTheme color='#ddd' highlightColor='#eee'>
            <Skeleton count={3} />
          </SkeletonTheme>
        </div>
    )
  }

  render () {
    const {
      activeItinerary,
      activeSearch,
      containerStyle,
      errors,
      itineraries,
      pending,
      realtimeEffects,
      sort,
      useRealtime
    } = this.props
    const { ItineraryBody, LegIcon } = this.context

    if (!activeSearch) return null
    const itineraryIsExpanded = activeItinerary !== undefined && activeItinerary !== null && this.state.showDetails

    const showRealtimeAnnotation = realtimeEffects.isAffectedByRealtimeData && (
      realtimeEffects.exceedsThreshold ||
      realtimeEffects.routesDiffer ||
      !useRealtime
    )
    const resultText = pending
      ? 'Finding your options...'
      : `${itineraries.length} itineraries found.`
    return (
      <div className='options itinerary' style={containerStyle}>
        <div
          className='options header'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexGrow: '0'
          }}
        >
          {itineraryIsExpanded
            ? <>
              <button
                className='clear-button-formatting'
                onClick={this._toggleDetailedItinerary}>
                <i className='fa fa-arrow-left' /> View all options
              </button>

              <SaveTripButton />
            </>
            : <>
              <div
                title={resultText}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                {resultText}
              </div>
              <div style={{display: 'inherit'}} className='sort-options'>
                <button
                  onClick={this._onSortDirChange} className='clear-button-formatting'
                  style={{marginRight: '5px'}}>
                  <i className={`fa fa-sort-amount-${sort.direction.toLowerCase()}`} />
                </button>
                <select
                  onBlur={this._onSortChange}
                  onChange={this._onSortChange}
                  value={sort.value}>
                  <option value='BEST'>Best option</option>
                  <option value='DURATION'>Duration</option>
                  <option value='ARRIVALTIME'>Arrival time</option>
                  <option value='DEPARTURETIME'>Departure time</option>
                  <option value='WALKTIME'>Walk time</option>
                  <option value='COST'>Cost</option>
                </select>
              </div>
            </>
          }
        </div>
        <div
          // FIXME: Change to a ul with li children?
          className='list'
          style={{
            flexGrow: '1',
            overflowY: 'auto'
          }}
        >
          {itineraries.map((itinerary, index) => {
            const active = index === activeItinerary
            // Hide non-active itineraries.
            if (!active && itineraryIsExpanded) return null
            return (
              <ItineraryBody
                active={active}
                expanded={this.state.showDetails}
                index={index}
                itinerary={itinerary}
                key={index}
                LegIcon={LegIcon}
                setActiveLeg={setActiveLeg}
                onClick={active ? this._toggleDetailedItinerary : undefined}
                routingType='ITINERARY'
                showRealtimeAnnotation={showRealtimeAnnotation}
                sort={sort}
                {...this.props}
              />
            )
          })}
          {/* FIXME: Flesh out error design/move to component? */}
          {errors.map((e, i) => {
            const mode = humanReadableMode(e.requestParameters.mode)
            return (
              <div key={i} className='option default-itin'>
                <h4>
                  <Icon className='text-warning' type='exclamation-triangle' />{' '}
                  No trip found for {mode}
                </h4>
                <div>{e.error.msg}</div>
              </div>
            )
          })}
          {this._renderLoadingDivs()}
        </div>
      </div>
    )
  }
}

// connect to the redux store

const mapStateToProps = (state, ownProps) => {
  const activeSearch = getActiveSearch(state.otp)
  const {modes} = state.otp.config
  const {sort} = state.otp.filter
  const pending = activeSearch ? Boolean(activeSearch.pending) : false
  const itineraries = getActiveItineraries(state.otp)
  const realtimeEffects = getRealtimeEffects(state.otp)
  const useRealtime = state.otp.useRealtime
  return {
    activeSearch,
    errors: getResponsesWithErrors(state.otp),
    // swap out realtime itineraries with non-realtime depending on boolean
    itineraries,
    pending,
    realtimeEffects,
    activeItinerary: activeSearch && activeSearch.activeItinerary,
    activeLeg: activeSearch && activeSearch.activeLeg,
    activeStep: activeSearch && activeSearch.activeStep,
    modes,
    sort,
    timeFormat: coreUtils.time.getTimeFormat(state.otp.config),
    useRealtime,
    visibleItinerary: activeSearch && activeSearch.visibleItinerary
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  // FIXME: update signature of these methods,
  // so that only one argument is passed,
  // e.g. setActiveLeg({ index, leg })
  return {
    setActiveItinerary: payload => dispatch(setActiveItinerary(payload)),
    // FIXME
    setActiveLeg: (index, leg) => {
      dispatch(setActiveLeg({index, leg}))
    },
    // FIXME
    setActiveStep: (index, step) => {
      dispatch(setActiveStep({index, step}))
    },
    setUseRealtimeResponse: payload => dispatch(setUseRealtimeResponse(payload)),
    setVisibleItinerary: payload => dispatch(setVisibleItinerary(payload)),
    updateItineraryFilter: payload => dispatch(updateItineraryFilter(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  NarrativeItineraries
)
