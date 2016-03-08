import React from 'react'
import ReactDOM from 'react-dom'
import findIndex from 'lodash/findIndex'

import TransitMap from './components/transit-map'
import Filter from './components/filter'
import { getJson } from './utils'

class App extends React.Component {
  constructor () {
    super()
    this.state = { routes: [] }
  }

  componentDidMount () {
    getJson(`/api/routes.json`)
      .then(data => {
        this.setState({ routes: data.routes })
      })
  }

  loadRoute (routeNumber) {
    getJson(`/api/${routeNumber}.json`)
      .then(data => {
        const { routes } = this.state
        const changeIndex = findIndex(routes, { shortName: data.shortName })
        const newRoutes = [
          ...routes.slice(0, changeIndex),
          {
            ...this.state.routes[changeIndex],
            ...{
              isEnabled: true,
              routeGeojson: data.routeShape,
              vehicleGeojson: data.vehiclesShape,
              connectingRouteShortName: data.connectingRoutes[0].shortName,
              connectingRouteGeojson: data.connectingRoutes[0].routeShape
            }
          },
          ...routes.slice(changeIndex + 1)
        ]
        this.setState({ routes: newRoutes })
      })
  }

  handleFilterChange (routeShortName) {
    const { routes } = this.state
    const changeIndex = findIndex(routes, { shortName: routeShortName })
    const foundRoute = routes[changeIndex]
    if (!foundRoute.isEnabled) {
      this.loadRoute(foundRoute.shortName)
    } else {
      const newRoutes = [
        ...routes.slice(0, changeIndex),
        { ...foundRoute, isEnabled: false },
        ...routes.slice(changeIndex + 1)
      ]
      this.setState({ routes: newRoutes })
    }
  }

  render () {
    const { routes } = this.state

    return (
      <div>
        <h1>Seattle Transit Map</h1>
        <Filter
          routes={routes}
          onChange={this.handleFilterChange.bind(this)}
        />
        <TransitMap
          routes={routes}
        />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

