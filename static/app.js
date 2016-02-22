/* globals $, L */

L.mapbox.accessToken = 'pk.eyJ1IjoibGljeWV1cyIsImEiOiJuZ1gtOWtjIn0.qaaGvywaJ_kCmwmlTSNyVw'

const mapCenter = [47.652126, -122.350906]
const map = L.mapbox.map('map', 'mapbox.light').setView(mapCenter, 13)

$.getJSON('/api/routes/40', geojson => {
  const geojsonStyle = {
    color: '#ae63ca'
  }
  L.geoJson(geojson, { style: geojsonStyle }).addTo(map)
})

const icon = L.icon({
  iconUrl: 'right-arrow.png',
  iconSize: [20, 20]
})

$.getJSON('/api/routes/40/vehicles', geojson => {
  geojson.features.forEach(vehicle => {
    L.marker([vehicle.geometry.coordinates[1], vehicle.geometry.coordinates[0]], {
      icon: icon,
      rotationAngle: transformOrientation(vehicle.properties.orientation),
      rotationOrigin: 'center center'
    }).addTo(map)
  })
})

function transformOrientation (orientation) {
  return 360 - orientation
}

