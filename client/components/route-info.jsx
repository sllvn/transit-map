import React from 'react'

import RouteCard from './route-card'

export default class RouteInfo extends React.Component {
  render () {
    const { routes } = this.props

    return (
      <div>
        {routes.map((route, key) =>
          <RouteCard route={route} key={key} />
        )}
      </div>
    )
  }
}

RouteInfo.propTypes = {
  routes: React.PropTypes.array
}

