import React from 'react'
import ReactDOM from 'react-dom'
import findIndex from 'lodash/findIndex'

import Mapbox from './components/mapbox'
import Filter from './components/filter'
import { getJson } from './utils'

class App extends React.Component {
  constructor () {
    super()
    // TODO: combine active routes and available routes, active routes = available routes with isEnabled: true
    this.state = {
      activeRoutes: [],
      availableRoutes: [ // TODO: pull from API
        { shortName: '26', isEnabled: true },
        { shortName: '28', isEnabled: false },
        { shortName: '40', isEnabled: false }
      ]
    }
  }

  componentDidMount () {
    // TODO: create fake data for 28 and 40, hook up fake API endpoints
    const routeNumber = 26

    getJson(`/api/${routeNumber}.json`)
      .then(data => {
        this.setState({
          activeRoutes: [
            {
              shortName: data.shortName,
              routeGeojson: data.routeShape,
              vehicleGeojson: data.vehiclesShape,
              connectingRouteShortName: data.connectingRoutes[0].shortName,
              connectingRouteGeojson: data.connectingRoutes[0].routeShape
            }
          ]
        })
      })
  }

  handleFilterChange (routeShortName) {
    const { availableRoutes } = this.state
    const changeIndex = findIndex(availableRoutes, { shortName: routeShortName })
    const newRoutes = [
      ...availableRoutes.slice(0, changeIndex),
      { ...availableRoutes[changeIndex], isEnabled: !availableRoutes[changeIndex].isEnabled },
      ...availableRoutes.slice(changeIndex + 1)
    ]
    this.setState({ availableRoutes: newRoutes })
  }

  render () {
    const { activeRoutes, availableRoutes } = this.state

    return (
      <div>
        <h1>Seattle Transit Map</h1>
        <Filter
          availableRoutes={availableRoutes}
          onChange={this.handleFilterChange.bind(this)}
        />
        <Mapbox
          mapboxAccessToken='pk.eyJ1IjoibGljeWV1cyIsImEiOiJuZ1gtOWtjIn0.qaaGvywaJ_kCmwmlTSNyVw'
          mapCenter={[47.652126, -122.350906]}
          routes={activeRoutes}
        />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

