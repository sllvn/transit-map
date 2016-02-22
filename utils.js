const promisify = require('es6-promisify')
const request = promisify(require('request'))
const _ = require('lodash')
const async = require('async')
const GeoJSON = require('geojson')
const fs = require('fs')

require('dotenv').load()
const API_KEY = process.env.OBA_API_KEY

function createGeojsonForRoute (routeId) {
  return new Promise((resolve, reject) => {
    request(`http://api.pugetsound.onebusaway.org/api/where/trips-for-route/${routeId}.json?key=${API_KEY}`).then(response => {
      const res = JSON.parse(response[0].body)
      const tripIds = _.map(res.data.list, 'tripId')

      async.reduce(tripIds, [], _.throttle(getTripDetails, 0), (err, result) => {
        if (err) { reject(err) }

        const geojson = GeoJSON.parse(result, { Point: ['lat', 'lng'] })
        resolve(geojson)
      })
    })
  })
}

function getTripDetails (acc, tripId, cb) {
  return request(`http://api.pugetsound.onebusaway.org/api/where/trip-details/${tripId}.json?key=${API_KEY}`)
    .then(response => {
      const res = JSON.parse(response[0].body)
      const status = res.data.entry.status
      cb(null, acc.concat(mungeStatus(status)))
    })
    .catch(err => console.log('err requesting trip status', err))
}

function mungeStatus (status) {
  return Object.assign({}, _.pick(status, ['orientation', 'vehicleId', 'scheduleDeviation']), {
    lat: status.position.lat,
    lng: status.position.lon
  })
}

function mergeGeojson (geojson, route) {
  geojson.features.push({
    type: 'Feature',
    geometry: route,
    properties: {
      shortName: '40'
    }
  })
  return geojson
}

module.exports = {
  createGeojsonForRoute: createGeojsonForRoute
}
