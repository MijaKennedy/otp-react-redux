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
          latlng: [payload.location.lat, payload.location.lon],
          key: 'AIzaSyBSzbVUDFzRK_qfonNyTaaDVwvL8aQEREg'
          ,
        },
        timeout: 1000, // milliseconds
      })
      .then((r) => {
        const label = r.data.results[0].formatted_address.split(",")[0]; // address string
        const coordinates = r.data.results[0].geometry.location; // {lat: value, lng: value}\
        const payloadType = payload.locationType;

        dispatch(settingLocation({
          location: {
            name: label, 
            lat: coordinates.lat, 
            lon: coordinates.lng,
          },
          locationType: payload.locationType
        }))
        
      })
      .catch((e) => {
        dispatch(
          settingLocation({
            location: payload.location,
            locationType: payload.locationType
          })
        )
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

    client
      .reverseGeocode({
        params: {
          latlng: [currentPosition.coords.latitude, currentPosition.coords.longitude],
          key: 'AIzaSyBSzbVUDFzRK_qfonNyTaaDVwvL8aQEREg'
          ,
        },
        timeout: 1000, // milliseconds
      })
      .then((r) => {
        const label = r.data.results[0].formatted_address.split(",")[0]; // address string
        const coordinates = r.data.results[0].geometry.location; // {lat: value, lng: value}\
        const payloadType = payload.locationType;
        dispatch(settingLocation({
          location: {
            name: label, 
            lat: coordinates.lat, 
            lon: coordinates.lng,
          },
          locationType: payload.locationType
        }))
      })
      .catch((e) => {
        dispatch(
          settingLocation({
            location: payload.location,
            locationType: payload.locationType
          })
        )
        console.warn(e)
      })

    if (currentPosition.error || !currentPosition.coords) return
    payload.location = {
      category: 'CURRENT_LOCATION',
      lat: currentPosition.coords.latitude,
      lon: currentPosition.coords.longitude,
      name: toString(currentPosition.coords.latitude + ", " + currentPosition.coords.longitude)
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
      dispatch(setLocation({ location, locationType, reverseGeocode: true}))
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


export function setMapPopupLocationAndGeocode(mapEvent) {
  const location = coreUtils.map.constructLocation(mapEvent.latlng)
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (key) { console.log("key defined")}
  if (!key) {console.log("key undefined")}

  return function (dispatch, getState) {
    dispatch(setMapPopupLocation({ location }))
    client
      .reverseGeocode({
        params: {
          latlng: mapEvent.latlng,
          key:  'AIzaSyBSzbVUDFzRK_qfonNyTaaDVwvL8aQEREg',
        },
        timeout: 1000, // milliseconds
      })
      .then((r) => {
        const label = r.data.results[0].formatted_address.split(",")[0]; 
        const coordinates = r.data.results[0].geometry.location; // {lat: value, lng: value}

        const location_address = coreUtils.map.constructLocation(label, mapEvent.latlng);
        dispatch(settingLocation({
          location: {
            name: label, 
            lat: coordinates.lat, 
            lon: coordinates.lng,
          },
          locationType: payload.locationType
        }))
        
      })
      .catch((e) => {
        console.warn(e)
        
      });

  }
}
