// TODO: Typescript, which doesn't make sense to do in this file until common types are established
/* eslint-disable react/prop-types */
import { Button, Label } from 'react-bootstrap'
import AnimateHeight from 'react-animate-height'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { ComponentContext } from '../../util/contexts'
import { getColorAndNameFromRoute, getModeFromRoute } from '../../util/viewer'
import { getFormattedMode } from '../../util/i18n'

import RouteDetails from './route-details'

export const StyledRouteRow = styled.div`
  background-color: white;
  border-bottom: 1px solid gray;
`

export const RouteRowButton = styled(Button)`
  align-items: center;
  display: flex;
  padding: 6px;
  transition: all ease-in-out 0.1s;
  width: 100%;
`

export const RouteRowElement = styled.span``

export const OperatorImg = styled.img`
  height: 25px;
  margin-right: 8px;
`

export const ModeIconElement = styled.span`
  display: inline-block;
  height: 22px;
  vertical-align: bottom;
`

const RouteNameElement = styled(Label)`
  background-color: ${(props) =>
    props.backgroundColor === '#ffffff' || props.backgroundColor === 'white'
      ? 'rgba(0,0,0,0)'
      : props.backgroundColor};
  color: ${(props) => props.color};
  flex: 0 1 auto;
  font-size: medium;
  font-weight: 400;
  margin-left: ${(props) =>
    props.backgroundColor === '#ffffff' || props.backgroundColor === 'white'
      ? 0
      : '8px'};
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const RouteName = ({ operator, route }) => {
  const { backgroundColor, color, longName } = getColorAndNameFromRoute(
    operator,
    route
  )
  return (
    <RouteNameElement
      backgroundColor={backgroundColor}
      color={color}
      title={`${route.shortName} ${longName}`}
    >
      <b>{route.shortName}</b> {longName}
    </RouteNameElement>
  )
}

export class RouteRow extends PureComponent {
  static contextType = ComponentContext

  constructor(props) {
    super(props)
    // Create a ref used to scroll to
    this.activeRef = React.createRef()
    this.state = { newHeight: 0 }
  }

  componentDidMount = () => {
    const { getVehiclePositionsForRoute, isActive, route } = this.props
    if (isActive && route?.id) {
      // Update data to populate map
      getVehiclePositionsForRoute(route.id)
      // This is fired when coming back from the route details view
      this.activeRef.current.scrollIntoView()
    }
  }

  componentDidUpdate() {
    /*
       If the initial route row list is being rendered and there is an active
       route, scroll to it. The initialRender prop prohibits the row being scrolled to
       if the user has clicked on a route
    */
    if (this.props.isActive && this.props.initialRender) {
      this.activeRef.current.scrollIntoView()
    }
  }

  _onClick = () => {
    const {
      findRoute,
      getVehiclePositionsForRoute,
      isActive,
      route,
      setViewedRoute
    } = this.props
    if (isActive) {
      // Deselect current route if active.
      setViewedRoute({ patternId: null, routeId: null })
    } else {
      // Otherwise, set active and fetch route patterns.
      findRoute({ routeId: route.id })
      getVehiclePositionsForRoute(route.id)
      setViewedRoute({ routeId: route.id })
    }
  }

  // Used to ensure details are visible until animation completes
  setNewHeight = (newHeight) => {
    this.setState({ newHeight })
  }

  render() {
    const { intl, isActive, operator, route } = this.props
    const { newHeight } = this.state
    const { ModeIcon } = this.context

    return (
      <StyledRouteRow isActive={isActive} ref={this.activeRef}>
        <RouteRowButton
          className="clear-button-formatting"
          isActive={isActive}
          onClick={this._onClick}
        >
          <RouteRowElement>
            {operator && operator.logo && (
              <OperatorImg
                alt={intl.formatMessage(
                  {
                    id: 'components.RouteRow.operatorLogoAltText'
                  },
                  { operatorName: operator.name }
                )}
                src={operator.logo}
              />
            )}
          </RouteRowElement>
          {route.mode && (
            <ModeIconElement>
              <ModeIcon
                aria-label={getFormattedMode(
                  getModeFromRoute(route).toLowerCase(),
                  intl
                )}
                height={22}
                mode={getModeFromRoute(route)}
                width={22}
              />
            </ModeIconElement>
          )}
          <RouteName operator={operator} route={route} />
        </RouteRowButton>
        <AnimateHeight
          duration={500}
          height={isActive ? 'auto' : 0}
          onHeightAnimationEnd={this.setNewHeight}
        >
          {(newHeight > 0 || isActive) && (
            <RouteDetails operator={operator} route={route} />
          )}
        </AnimateHeight>
      </StyledRouteRow>
    )
  }
}
