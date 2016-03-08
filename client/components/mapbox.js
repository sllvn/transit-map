/* globals L */
import React from 'react'

import 'mapbox.js'
import 'mapbox.js/dist/mapbox.css'
import '../../lib/leaflet.rotatedMarker'
import './mapbox.css'

class Mapbox extends React.Component {
  componentDidMount () {
    L.mapbox.accessToken = this.props.mapboxAccessToken
    this.map = L.mapbox.map(this.refs.map, 'mapbox.light').setView(this.props.mapCenter, 13)
    this.vehicleIcon = L.icon({
      iconUrl: require('./right-arrow.png'),
      iconSize: [20, 20]
    })
  }

  transformOrientation (orientation) {
    return 360 - orientation
  }

  renderRoute (route) {
    const currentRouteStyle = { color: '#ae63ca' }
    const currentRoute = L.geoJson(route.routeGeojson, { style: currentRouteStyle }).addTo(this.map)
    currentRoute.bindPopup(`<div class="map-popup"><h5>Route: ${route.shortName}</h5></div>`)

    const connectingRouteStyle = { color: '#756dfe' }
    const connectingRoute = L.geoJson(route.connectingRouteGeojson, { style: connectingRouteStyle }).addTo(this.map)
    connectingRoute.bindPopup(`<div class="map-popup"><h5>Connecting Route: ${route.connectingRouteShortName}</h5></div>`)

    route.vehicleGeojson.features.forEach(vehicle => {
      const marker = L.marker([vehicle.geometry.coordinates[1], vehicle.geometry.coordinates[0]], {
        icon: this.vehicleIcon,
        rotationAngle: this.transformOrientation(vehicle.properties.orientation),
        rotationOrigin: 'center center'
      }).addTo(this.map)
      marker.bindPopup('<div class="map-popup"><h5>' + route.shortName + ' <small>(' + vehicle.properties.vehicleId + ')</small></h5></div>')
    })
  }

  componentDidUpdate () {
    const { routes } = this.props

    routes.forEach(this.renderRoute.bind(this))
  }

  render () {
    return <div ref='map' id='map'></div>
  }
}

Mapbox.propTypes = {
  routes: React.PropTypes.array.isRequired,
  mapboxAccessToken: React.PropTypes.string.isRequired,
  mapCenter: React.PropTypes.array.isRequired
}

export default Mapbox

