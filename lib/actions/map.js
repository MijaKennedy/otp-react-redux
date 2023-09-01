import { createAction } from 'redux-actions'
import coreUtils from '@opentripplanner/core-utils'
import getGeocoder from '@opentripplanner/geocoder'
import {Client} from "@googlemaps/google-maps-services-js";
import { clearActiveSearch } from './form'
import { routingQuery } from './api'
import { setMapCenter, setMapZoom } from './config'

/* SET_LOCATION action creator. Updates a from or to location in the store
 *
 * payload format: {
 *   type: 'from' or 'to'
 *   location: {
 *     name: (string),
 *     lat: (number)
 *     lat: (number)
 *   }
 */

// Private actions
const clearingLocation = createAction('CLEAR_LOCATION')
const settingLocation = createAction('SET_LOCATION')
const client = new Client({});


// Public actions
export const forgetPlace = createAction('FORGET_PLACE')
export const rememberPlace = createAction('REMEMBER_PLACE')
export const forgetStop = createAction('FORGET_STOP')
export const rememberStop = createAction('REMEMBER_STOP')

export function clearLocation(payload) {
  return function (dispatch, getState) {
    // Dispatch the clear location action and then clear the active search (so
    // that the map and narrative are not showing a search when one or both
    // locations are not defined).
    dispatch(clearingLocation(payload))
    dispatch(clearActiveSearch())
  }
}

export function zoomToStop(stop) {
  return function (dispatch, getState) {
    if (!stop) return
    dispatch(setMapZoom({ zoom: 17 }))
    dispatch(setMapCenter({ lat: stop.lat, lon: stop.lon }))
  }
}

export function setLocation(payload) {
  return function (dispatch, getState) {
    const state = getState()

    // reverse geocode point location if requested
    if (payload.reverseGeocode) {
      client
      .reverseGeocode({
        params: {
          locations: payload.location,
          key: 'AIzaSyBSzbVUDFzRK_qfonNyTaaDVwvL8aQEREg',
        },
        timeout: 1000, // milliseconds
      })
      .then((r) => {
        dispatch(settingLocation({
          r,
          locationType: r.locationType
        }))
      })
      .catch((e) => {
        console.warn(e)
      })
    } else {
      // update the location in the store
      dispatch(settingLocation(payload))
    }
  }
}

/* payload is simply { type: 'from'|'to' }; location filled in automatically */

export function setLocationToCurrent(payload, intl) {
  return function (dispatch, getState) {
    const currentPosition = getState().otp.location.currentPosition
    if (currentPosition.error || !currentPosition.coords) return
    payload.location = {
      category: 'CURRENT_LOCATION',
      lat: currentPosition.coords.latitude,
      lon: currentPosition.coords.longitude,
      name: intl.formatMessage({ id: 'actions.map.currentLocation' })
    }
    dispatch(settingLocation(payload))
  }
}

/**
 * Handler for @opentripplanner/location-field onLocationSelected
 */
export function onLocationSelected(
  intl,
  { location, locationType, resultType }
) {
  return function (dispatch, getState) {
    if (resultType === 'CURRENT_LOCATION') {
      dispatch(setLocationToCurrent({ locationType }, intl))
    } else {
      dispatch(setLocation({ location, locationType }))
    }
  }
}

export function switchLocations() {
  return function (dispatch, getState) {
    const { from, to } = getState().otp.currentQuery
    // First, reverse the locations.
    dispatch(
      settingLocation({
        location: to,
        locationType: 'from'
      })
    )
    dispatch(
      settingLocation({
        location: from,
        locationType: 'to'
      })
    )
    // Then kick off a routing query (if the query is invalid, search will abort).
    return dispatch(routingQuery())
  }
}

export const setLegDiagram = createAction('SET_LEG_DIAGRAM')

export const setElevationPoint = createAction('SET_ELEVATION_POINT')

export const setMapPopupLocation = createAction('SET_MAP_POPUP_LOCATION')

//modify to use google geocoding: 
export function setMapPopupLocationAndGeocode(mapEvent) {
  const location = coreUtils.map.constructLocation(mapEvent.latlng)
  return function (dispatch, getState) {
    dispatch(setMapPopupLocation({ location }))
    console.log("key ", process.env.GOOGLE_MAPS_API_KEY)
    client
      .reverseGeocode({
        params: {
          latlng: mapEvent.latlng,
          key:  'AIzaSyBSzbVUDFzRK_qfonNyTaaDVwvL8aQEREg',
        },
        timeout: 1000, // milliseconds
      })
      .then((r) => {
        const address = r.data.results[0].formatted_address;
        console.log("address ", address)
        dispatch(setMapPopupLocation({ r }))
      })
      .catch((e) => {
        console.warn(e)
      });

  }
}
