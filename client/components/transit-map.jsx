import React from 'react'

import Mapbox from './mapbox'
import VehiclePopup from './vehicle-popup'

export default class TransitMap extends React.Component {
  render () {
    const routes = this.props.routes.filter(r => r.isEnabled && r.routeGeojson && r.vehicles)

    const paths = routes.reduce((acc, route) => {
      acc = acc.concat({
        color: '#ae63ca',
        popup: `<h5>Route: ${route.shortName}</h5>`,
        geojson: route.routeGeojson
      })

      if (route.connectingRouteGeojson) {
        acc = acc.concat({
          color: '#756dfe',
          popup: `<h5>Route ${route.shortName} continues as route ${route.connectingRouteShortName}</h5>`,
          geojson: route.connectingRouteGeojson
        })
      }

      return acc
    }, [])

    const vehicleIcon = L.icon({
      iconUrl: require('./right-arrow.png'),
      iconSize: [20, 20]
    })

    const markers = routes.reduce((acc, route) => {
      const vehicles = route.vehicles.map(vehicle => {
        return {
          ...vehicle,
          ...{
            icon: vehicleIcon,
            popup: <VehiclePopup route={route} vehicle={vehicle} />
          }
        }
      })
      return acc.concat(vehicles)
    }, [])

    return (
      <Mapbox
        mapboxAccessToken='pk.eyJ1IjoibGljeWV1cyIsImEiOiJuZ1gtOWtjIn0.qaaGvywaJ_kCmwmlTSNyVw'
        mapCenter={[47.652126, -122.350906]}
        paths={paths}
        markers={markers}
      />
    )
  }
}

TransitMap.propTypes = {
  routes: React.PropTypes.array
}
