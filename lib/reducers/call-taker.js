import update from 'immutability-helper'
import moment from 'moment'

import {constructNewCall} from '../util/call-taker'
import {FETCH_STATUS} from '../util/constants'

function createCallTakerReducer () {
  const initialState = {
    activeCall: null,
    callHistory: {
      calls: {
        status: FETCH_STATUS.UNFETCHED,
        data: []
      },
      visible: false
    },
    fieldTrip: {
      activeId: null,
      filter: {
        tab: 'new'
      },
      groupSize: null,
      requests: {
        status: FETCH_STATUS.UNFETCHED,
        data: []
      },
      visible: false
    },
    session: null
  }
  return (state = initialState, action) => {
    switch (action.type) {
      case 'BEGIN_CALL': {
        const newCall = constructNewCall()
        // Initialize new call and show call history window.
        return update(state, {
          activeCall: { $set: newCall },
          callHistory: { visible: { $set: true } }
        })
      }
      case 'REQUESTING_CALLS': {
        return update(state, {
          callHistory: { calls: { status: { $set: FETCH_STATUS.FETCHING } } }
        })
      }
      case 'RECEIVED_CALLS': {
        const data = action.payload.calls
        const calls = {
          status: FETCH_STATUS.FETCHED,
          data: data.sort((a, b) => moment(b.endTime) - moment(a.endTime))
        }
        return update(state, {
          callHistory: { calls: { $set: calls } }
        })
      }
      case 'REQUESTING_FIELD_TRIPS': {
        return update(state, {
          fieldTrip: { requests: { status: { $set: FETCH_STATUS.FETCHING } } }
        })
      }
      case 'RECEIVED_FIELD_TRIPS': {
        const data = action.payload.fieldTrips
        const requests = {
          status: FETCH_STATUS.FETCHED,
          data: data.sort((a, b) => moment(b.endTime) - moment(a.endTime))
        }
        return update(state, {
          fieldTrip: { requests: { $set: requests } }
        })
      }
      case 'SET_FIELD_TRIP_FILTER': {
        return update(state, {
          fieldTrip: { filter: { $merge: action.payload } }
        })
      }
      case 'SET_GROUP_SIZE': {
        return update(state, {
          fieldTrip: { groupSize: { $set: action.payload } }
        })
      }
      case 'SET_ACTIVE_FIELD_TRIP': {
        return update(state, {
          fieldTrip: {
            activeId: { $set: action.payload },
            groupSize: { $set: null }
          }
        })
      }
      case 'RECEIVED_FIELD_TRIP_DETAILS': {
        const {fieldTrip} = action.payload
        const index = state.fieldTrip.requests.data.findIndex(req => req.id === fieldTrip.id)
        return update(state, {
          fieldTrip: { requests: { data: { [index]: { $set: fieldTrip } } } }
        })
      }
      case 'RECEIVED_QUERIES': {
        const {callId, queries} = action.payload
        const {data} = state.callHistory.calls
        const index = data.findIndex(call => call.id === callId)
        const call = {...data[index], queries}
        return update(state, {
          callHistory: { calls: { data: { [index]: { $set: call } } } }
        })
      }
      case 'ROUTING_RESPONSE': {
        if (state.activeCall) {
          // If call is in progress, record search ID when a routing response is
          // fulfilled.
          // TODO: How should we handle routing errors.
          return update(state, {
            activeCall: { searches: { $push: [action.payload.searchId] } }
          })
        } else if (state.callHistory.visible) {
          // If call not in progress, but history is visible,
          // construct new call and add search.
          const newCall = constructNewCall()
          newCall.searches.push(action.payload.searchId)
          // Initialize new call and show call history window.
          return update(state, { activeCall: { $set: newCall } })
        }
        // Otherwise, ignore.
        return state
      }
      case 'STORE_SESSION': {
        const {session} = action.payload
        if (!session || !session.username) {
          const sessionId = session ? session.sessionId : 'N/A'
          // Session is invalid if username is missing.
          window.alert(`Session ID ${sessionId} is invalid!`)
          // TODO: Should we return to URL_ROOT at this point?
          return update(state, { session: { $set: null } })
        }
        return update(state, { session: { $set: session } })
      }
      case 'TOGGLE_CALL_HISTORY': {
        return update(state, {
          callHistory: { visible: { $set: !state.callHistory.visible } }
        })
      }
      case 'TOGGLE_FIELD_TRIPS': {
        return update(state, {
          fieldTrip: {
            activeId: { $set: null },
            visible: { $set: !state.fieldTrip.visible }
          }
        })
      }
      case 'END_CALL': {
        return update(state, {
          activeCall: { $set: null }
        })
      }
      default:
        return state
    }
  }
}

export default createCallTakerReducer
