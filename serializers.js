const _ = require('lodash')

function serializeRoutes (routes) {
  return _.map(routes, r => _.pick(r, ['shortName', 'longName']))
}

function serializeRoute (route) {
  return {
    shortName: route.shortName,
    routeShape: route.shapes[0].geojson,
    alerts: route.alerts,
    vehicles: [], // TODO: pull vehicles into separate endpoint
    connectingRoutes: [] // TODO: include connecting routes
  }
}

function serializeVehicles (vehicles) {
  return vehicles
}

module.exports = { serializeRoutes, serializeRoute, serializeVehicles }
