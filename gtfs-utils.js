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

const getRoute = function *(routeShortName) {
  const routes = yield parseGtfsFile('routes')
  const route = _.find(routes, { route_short_name: routeShortName })
  if (!route) { return }

  console.log(route.route_long_name)
  return {
    gtfs: {
      agency_id: route.agency_id,
      route_id: route.route_id
    },
    shortName: route.route_short_name,
    longName: route.route_desc,
    url: route.route_url
  }
}

const extractShapes = function *(opts) {
  const shapes = yield parseGtfsFile('shapes')
  const shapeIds = opts.shapeIds || _.chain(shapes).map('shape_id').uniq().value()

  return shapeIds.reduce((acc, shapeId) => {
    const shape = _.filter(shapes, { shape_id: shapeId })
    const points = _.reduce(shape, (acc, v) => acc.concat([[v.shape_pt_lon, v.shape_pt_lat]]), [])
    const geojson = GeoJSON.parse([{ line: points }], { LineString: 'line' })
    return acc.concat({ shapeId, geojson })
  }, [])
}

const shapeIdsForRoute = function *(routeId) {
  const trips = yield parseGtfsFile('trips')
  const shapeIdsForRoute = _.chain(trips).filter({ route_id: routeId }).map('shape_id').uniq().value()
  return shapeIdsForRoute
}

module.exports = { getRoute, parseGtfsFile, extractShapes, shapeIdsForRoute }

// const loadRoute = shortName => parseGtfsFile('routes').then(data => _.find(data, { route_short_name: shortName }))
// const loadTripsForRoute = routeId => parseGtfsFile('trips').then(data => _.filter(data, { route_id: routeId }))
// const loadTripsForBlock = blockId => parseGtfsFile('trips').then(data => _.filter(data, { block_id: blockId }))
// const loadShape = shapeId => parseGtfsFile('shapes').then(data => _.filter(data, { shape_id: shapeId }))

// co(function *() {
//   const route = yield loadRoute('26')
//   const trips = yield loadTripsForRoute(route.route_id)
//   const blockIds = _.chain(trips).map('block_id').uniq().value()
//   const blockTrips = yield loadTripsForBlock(blockIds[0])
//   const shapeIds = _.chain(blockTrips).filter({ direction_id: '1' }).map('shape_id').uniq().value()
//   const shape = yield loadShape(shapeIds[0])
//   const points = _.reduce(shape, (acc, v) => acc.concat([[v.shape_pt_lon, v.shape_pt_lat]]), [])
//   const geojson = GeoJSON.parse([{ line: points }], { LineString: 'line' })
//   console.log(JSON.stringify(geojson))
// })
