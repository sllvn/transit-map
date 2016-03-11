const promisify = require('es6-promisify')
const request = promisify(require('request')) // TODO: replace with isomorphic-fetch
const _ = require('lodash')
const async = require('async')

require('dotenv').load()
const API_KEY = process.env.OBA_API_KEY

const routeIdMap = {
  '26': '1_100151',
  '28': '1_100169',
  '40': '1_102574'
}

function getVehiclesForRoute (routeShortName) {
  // TODO: const routeId = `${route.agency_id}_${route.route_id}`
  const routeId = routeIdMap[routeShortName]

  return new Promise((resolve, reject) => {
    request(`http://api.pugetsound.onebusaway.org/api/where/trips-for-route/${routeId}.json?key=${API_KEY}`).then(response => {
      const res = JSON.parse(response[0].body)
      const tripIds = _.map(res.data.list, 'tripId')

      async.reduce(tripIds, [], _.throttle(getTripDetails, 0), (err, result) => {
        if (err) { reject(err) }

        const vehicles = result.map(v => _.pick(v, ['lat', 'lng', 'orientation', 'vehicleId', 'scheduleDeviation']))
        resolve(vehicles)
      })
    })
  })
}

function getTripDetails (acc, tripId, cb) {
  return request(`http://api.pugetsound.onebusaway.org/api/where/trip-details/${tripId}.json?key=${API_KEY}`)
    .then(response => {
      const res = JSON.parse(response[0].body)
      const status = res.data.entry.status
      const routeDetails = Object.assign({}, mungeStatus(status))
      cb(null, acc.concat(routeDetails))
    })
    .catch(err => console.log('err requesting trip status', err))
}

function mungeStatus (status) {
  return Object.assign({}, _.pick(status, ['orientation', 'vehicleId', 'scheduleDeviation']), {
    lat: status.position.lat,
    lng: status.position.lon
  })
}

module.exports = { getVehiclesForRoute }
