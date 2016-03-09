/* globals L */
import React from 'react'
import ReactDOM from 'react-dom'

import 'mapbox.js'
import 'mapbox.js/dist/mapbox.css'
import '../../lib/leaflet.rotatedMarker'
import './mapbox.css'

class Mapbox extends React.Component {
  constructor () {
    super()
    this.state = { paths: [], markers: [] }
  }

  componentDidMount () {
    L.mapbox.accessToken = this.props.mapboxAccessToken
    this.map = L.mapbox.map(this.refs.map, 'mapbox.light').setView(this.props.mapCenter, 13)
  }

  transformOrientation (orientation) {
    return 360 - orientation
  }

  addPaths (paths) {
    const newPaths = paths.reduce((acc, path) => {
      const style = { color: path.color }
      const newPath = L.geoJson(path.geojson, { style }).addTo(this.map)
      newPath.bindPopup(`<div class="map-popup">${path.popup}</div>`)
      return acc.concat(newPath)
    }, [])
    this.setState({ paths: [...this.state.paths, ...newPaths] })
  }

  removePaths () {
    this.state.paths.forEach(path => this.map.removeLayer(path))
    this.setState({ paths: [] })
  }

  addMarkers (markers) {
    const newMarkers = markers.reduce((acc, marker) => {
      const newMarker = L.marker([marker.lat, marker.lng], {
        icon: marker.icon,
        rotationAngle: this.transformOrientation(marker.orientation),
        rotationOrigin: 'center center'
      }).addTo(this.map)
      if (typeof marker.popup === 'object') {
        newMarker.bindPopup(`<div id="test" class="map-popup"></div>`)
        newMarker.on('popupopen', e => ReactDOM.render(marker.popup, e.popup._contentNode))
      } else {
        newMarker.bindPopup(`<div id="test" class="map-popup">${marker.popup}</div>`)
      }
      return acc.concat(newMarker)
    }, [])
    this.setState({ markers: [...this.state.markers, ...newMarkers] })
  }

  removeMarkers () {
    this.state.markers.forEach(marker => this.map.removeLayer(marker))
    this.setState({ markers: [] })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return false
  }

  componentWillReceiveProps (nextProps) {
    this.removePaths()
    this.addPaths(nextProps.paths)
    this.removeMarkers()
    this.addMarkers(nextProps.markers)
  }

  render () {
    return <div ref='map' id='map'></div>
  }
}

Mapbox.propTypes = {
  paths: React.PropTypes.array,
  mapboxAccessToken: React.PropTypes.string.isRequired,
  mapCenter: React.PropTypes.array.isRequired
}

export default Mapbox

