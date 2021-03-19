import React from 'react'
import { ControlLabel } from 'react-bootstrap'
import { connect } from 'react-redux'

import * as userActions from '../../../actions/user'
import { CREATE_ACCOUNT_PLACES_PATH, PLACES_PATH } from '../../../util/constants'
import { isHomeOrWork } from '../../../util/user'
import FavoritePlaceRow from './favorite-place-row'

/**
 * Renders an editable list user's favorite locations, and lets the user add a new one.
 * Additions, edits, and deletions of places take effect immediately.
 */
const FavoritePlacesList = ({ deleteUserPlace, isCreating, loggedInUser }) => {
  const { savedLocations } = loggedInUser
  return (
    <div>
      <ControlLabel>Add the places you frequent often to save time planning trips:</ControlLabel>

      {savedLocations.map((place, index) => (
        <FavoritePlaceRow
          isFixed={isHomeOrWork(place)}
          key={index}
          onDelete={() => deleteUserPlace(index)}
          path={`${isCreating ? CREATE_ACCOUNT_PLACES_PATH : PLACES_PATH}/${index}`}
          place={place}
        />
      )
      )}

      {/* For adding a new place. */}
      <FavoritePlaceRow path={`${PLACES_PATH}/new`} />
    </div>
  )
}

// connect to the redux store

const mapStateToProps = (state, ownProps) => {
  const path = state.router.location.pathname
  const isCreating = path === CREATE_ACCOUNT_PLACES_PATH
  return {
    isCreating,
    loggedInUser: state.user.loggedInUser
  }
}

const mapDispatchToProps = {
  deleteUserPlace: userActions.deleteUserPlace
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePlacesList)
