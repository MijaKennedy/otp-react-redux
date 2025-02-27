import { Route } from '@opentripplanner/types'

// TYPESCRIPT TODO: move this to a larger shared types file, preferably within otp-ui
export interface StopData {
  bikeRental: BikeRental
  fetchStatus: number
  id: string
  lat: number
  locationType: number
  lon: number
  name: string
  nearbyStops: string[]
  parkAndRideLocations: any[]
  routes: Route[]
  stopTimes: StopTime[]
  stopTimesLastUpdated: number
  vehicleRental: VehicleRental
  vehicleType: number
  vehicleTypeSet: boolean
  wheelchairBoarding: number
}

export interface BikeRental {
  stations: any[]
}

// FIXME: incomplete
export interface StopTime {
  departureDelay: number
  headsign: string
  pattern: Pattern
  realtimeDeparture: boolean
  realtimeState: string
  times: Time[]
}

export interface Pattern {
  desc: string
  headsign: string
  id: string
  patternGeometry?: {
    length: number
    points: string
  }
  stops?: StopData[]
}

export interface Time {
  arrivalDelay: number
  continuousDropOff: number
  continuousPickup: number
  departureDelay: number
  headsign: string
  realtime: boolean
  realtimeArrival: number
  realtimeDeparture: number
  realtimeState: string
  scheduledArrival: number
  scheduledDeparture: number
  serviceAreaRadius: number
  serviceDay: number
  stopCount: number
  stopId: string
  stopIndex: number
  timepoint: boolean
  tripId: string
}

export interface VehicleRental {
  errorsByNetwork: { [key: string]: { message?: string; severity?: string } }
  systemInformationDataByNetwork: {
    [key: string]: { message?: string; severity?: string }
  }
}

export interface ViewedRouteState {
  patternId?: string
  routeId: string
}

export interface RouteVehicle {
  patternId: string
}

// Routes have many properties beside id, but none of these are guaranteed.
export interface ViewedRouteObject extends Route {
  patterns?: Record<string, Pattern>
  pending?: boolean
  url?: string
  vehicles?: RouteVehicle[]
}

export type SetViewedRouteHandler = (route?: ViewedRouteState) => void

export type SetViewedStopHandler = (payload: { stopId: string }) => void
