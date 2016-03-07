import React from 'react'
import ReactDOM from 'react-dom'

import Mapbox from './mapbox'
import Filter from './filter'
import { getJson } from './utils'

class App extends React.Component {
  constructor () {
    super()
    this.state = { routes: [] }
  }

  componentDidMount () {
    const routeNumber = 40

    Promise.all([
      getJson(`/api/${routeNumber}/route.json`),
      getJson(`/api/${routeNumber}/vehicles.json`)
    ]).then(data => {
      this.setState({
        routes: [
          {
            shortName: '40',
            color: '#ae63ca',
            routeGeojson: data[0],
            vehicleGeojson: data[1]
          }
        ]
      })
    })
  }

  render () {
    const { routes } = this.state

    return (
      <div>
        <h1>Seattle Transit Map</h1>
        <Filter />
        <Mapbox
          mapboxAccessToken='pk.eyJ1IjoibGljeWV1cyIsImEiOiJuZ1gtOWtjIn0.qaaGvywaJ_kCmwmlTSNyVw'
          mapCenter={[47.652126, -122.350906]}
          routes={routes}
        />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

