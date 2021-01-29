export const AUTH0_AUDIENCE = 'https://otp-middleware'
// This should match the value expected in otp-middleware OtpUser#AUTH0_SCOPE
export const AUTH0_SCOPE = 'otp-user'
export const DEFAULT_APP_TITLE = 'OpenTripPlanner'
export const PERSISTENCE_STRATEGY_OTP_MIDDLEWARE = 'otp_middleware'

export const FETCH_STATUS = {
  UNFETCHED: 0,
  FETCHING: 1,
  FETCHED: 2,
  ERROR: -1
}
export const ACCOUNT_PATH = '/account'
export const ACCOUNT_SETTINGS_PATH = `${ACCOUNT_PATH}/settings`
export const TRIPS_PATH = `${ACCOUNT_PATH}/trips`
export const CREATE_ACCOUNT_PATH = `${ACCOUNT_PATH}/create`
export const CREATE_TRIP_PATH = `${TRIPS_PATH}/new`

// Gets the root URL, e.g. https://otp-instance.example.com:8080, computed once for all.
// TODO: support root URLs that involve paths or subfolders, as in https://otp-ui.example.com/path-to-ui/
export const URL_ROOT = `${window.location.protocol}//${window.location.host}`
