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
    // TODO: remove cached/stubbed response
    const stub = {"vehicles":[{"lat":47.66684438941471,"lng":-122.32558052671467,"orientation":268.37885408584697,"vehicleId":"","scheduleDeviation":0},{"lat":47.59983797858874,"lng":-122.32906300601019,"orientation":74.32047588826669,"vehicleId":"1_3630","scheduleDeviation":-222},{"lat":47.60619012758435,"lng":-122.33454294908181,"orientation":132.6157967945623,"vehicleId":"1_2887","scheduleDeviation":569},{"lat":47.58322958323692,"lng":-122.329063,"orientation":90,"vehicleId":"1_2800","scheduleDeviation":109},{"lat":47.62500009855978,"lng":-122.34234271784038,"orientation":268.6339048827599,"vehicleId":"1_2311","scheduleDeviation":365},{"lat":47.678841,"lng":-122.325157,"orientation":337.61986494665064,"vehicleId":"","scheduleDeviation":0},{"lat":47.60260878950875,"lng":-122.33126173737138,"orientation":133.04431860352213,"vehicleId":"1_2689","scheduleDeviation":338},{"lat":47.67034168928606,"lng":-122.36618,"orientation":90,"vehicleId":"1_2877","scheduleDeviation":580},{"lat":47.55523120323072,"lng":-122.329544,"orientation":270,"vehicleId":"1_2462","scheduleDeviation":404},{"lat":47.69991828109003,"lng":-122.3554,"orientation":90,"vehicleId":"","scheduleDeviation":0},{"lat":47.652344498912285,"lng":-122.34666724950793,"orientation":114.34108993841676,"vehicleId":"1_2768","scheduleDeviation":208},{"lat":47.60604255563658,"lng":-122.33440717461093,"orientation":132.6157967945623,"vehicleId":"1_2448","scheduleDeviation":327},{"lat":47.732231411427605,"lng":-122.355568,"orientation":90,"vehicleId":"1_2614","scheduleDeviation":330},{"lat":47.6573681221541,"lng":-122.39602271833199,"orientation":115.75883133006585,"vehicleId":"1_2386","scheduleDeviation":732},{"lat":47.567838835947946,"lng":-122.32266605072805,"orientation":90.97876206405171,"vehicleId":"","scheduleDeviation":0},{"lat":47.57527892930188,"lng":-122.329063,"orientation":90,"vehicleId":"1_2449","scheduleDeviation":74},{"lat":47.63251913746903,"lng":-122.342285,"orientation":90,"vehicleId":"1_2389","scheduleDeviation":496}]}
    return setTimeout(() => {
      resolve(stub.vehicles)
    }, 500)

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
