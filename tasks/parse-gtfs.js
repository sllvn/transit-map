const csv = require('csv')
const fs = require('fs')
const _ = require('lodash')
const GeoJSON = require('geojson')

function parseGtfsFile (filename) {
  return new Promise((resolve, reject) => {
    const file = fs.readFileSync(`./data/king-county-gtfs/${filename}.txt`, 'utf8')
    csv.parse(file, { columns: true }, (err, data) => {
      if (err) { reject(err) }
      resolve(data)
    })
  })
}

const loadRoute = shortName =>
  parseGtfsFile('routes').then(data => _.find(data, { route_short_name: shortName }))

const loadTripsForRoute = routeId =>
  parseGtfsFile('trips').then(data => _.filter(data, { route_id: routeId }))

const loadTripsForBlock = blockId =>
  parseGtfsFile('trips').then(data => _.filter(data, { block_id: blockId }))

const loadShape = shapeId =>
  parseGtfsFile('shapes').then(data => _.filter(data, { shape_id: shapeId }))

/*
 * a route has many trips
 * a trip has a few blocks
 * for one ride, you want all blocks for that trip and direction
*/

// TODO: convert this promise mess to use generators + co
loadRoute('26')
  .then(route => loadTripsForRoute(route.route_id))
  .then(trips => trips[0].block_id)
  .then(loadTripsForBlock)
  .then(trips => _.chain(trips).filter({ direction_id: '1' }).map('shape_id').uniq().value())
  .then(shapeIds => shapeIds[0])
  .then(loadShape)
  .then(vertices => {
    const points = _.reduce(vertices, (acc, v) => acc.concat([[v.shape_pt_lon, v.shape_pt_lat]]), [])
    const geojson = GeoJSON.parse([{ line: points }], { LineString: 'line' })
    console.log(JSON.stringify(geojson))
  })
