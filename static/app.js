/* globals $, L */

L.mapbox.accessToken = 'pk.eyJ1IjoibGljeWV1cyIsImEiOiJuZ1gtOWtjIn0.qaaGvywaJ_kCmwmlTSNyVw'

const mapCenter = [47.652126, -122.350906]
const map = L.mapbox.map('map', 'mapbox.light').setView(mapCenter, 13)


const icon = L.icon({
  iconUrl: 'right-arrow.png',
  iconSize: [20, 20]
})

const routeNumbers = [28, 40]

routeNumbers.forEach(routeNumber => {
  $.getJSON(`/api/routes/${routeNumber}`, geojson => {
    const geojsonStyle = {
      color: '#ae63ca'
    }
    L.geoJson(geojson, { style: geojsonStyle }).addTo(map)
  })

  $.getJSON(`/api/routes/${routeNumber}/vehicles`, geojson => {
    geojson.features.forEach(vehicle => {
      const marker = L.marker([vehicle.geometry.coordinates[1], vehicle.geometry.coordinates[0]], {
        icon: icon,
        rotationAngle: transformOrientation(vehicle.properties.orientation),
        rotationOrigin: 'center center'
      }).addTo(map)
      marker.bindPopup('<div class="vehicle-popup"><h5>' + vehicle.properties.routeShortName + ' <small>(' + vehicle.properties.vehicleId + ')</small></h5></div>')
    })
  })
})

function transformOrientation (orientation) {
  return 360 - orientation
}

