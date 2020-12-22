import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Loading from './loading'
import TabbedItineraries from './tabbed-itineraries'
import ErrorMessage from '../form/error-message'

import {
  getActiveError,
  getActiveItineraries,
  getActiveSearch
} from '../../util/state'
import { setMainPanelContent } from '../../actions/ui'

class NarrativeRoutingResults extends Component {
  static propTypes = {
    routingType: PropTypes.string
  }

  componentDidUpdate (prevProps) {
    if ((!prevProps.itineraries || prevProps.itineraries.length === 0) &&
        (this.props.itineraries && this.props.itineraries.length > 0)) {
      this.props.setMainPanelContent(null)
    }
    if (!prevProps.error && this.props.error) this.props.setMainPanelContent(null)
  }

  render () {
    const {
      error,
      pending,
      itineraries,
      mainPanelContent
    } = this.props

    if (pending) return <Loading />
    if (error) return <ErrorMessage />
    if (mainPanelContent) return null

    return (
      // TODO: If multiple routing types exist, do the check here.
      <TabbedItineraries itineraries={itineraries} />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const activeSearch = getActiveSearch(state.otp)
  const pending = activeSearch ? Boolean(activeSearch.pending) : false
  return {
    mainPanelContent: state.otp.ui.mainPanelContent,
    error: getActiveError(state.otp),
    itineraries: getActiveItineraries(state.otp),
    pending,
    routingType: activeSearch && activeSearch.query.routingType
  }
}

const mapDispatchToProps = {
  setMainPanelContent
}

export default connect(mapStateToProps, mapDispatchToProps)(NarrativeRoutingResults)
