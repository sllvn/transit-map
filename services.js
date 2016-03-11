const models = require('./models')

function *loadVehiclesForRoute () {
  // TODO
  return [{"lat":47.54014505002782,"lng":-122.33924797897193,"orientation":169.5613514446955,"vehicleId":"1_2308","scheduleDeviation":644},{"lat":47.64931947980658,"lng":-122.349747,"orientation":90,"vehicleId":"1_2442","scheduleDeviation":431},{"lat":47.60651351376696,"lng":-122.33483030497152,"orientation":310.7636052031628,"vehicleId":"1_2533","scheduleDeviation":265},{"lat":47.64473569954061,"lng":-122.3929360762997,"orientation":89.57559458020296,"vehicleId":"1_2873","scheduleDeviation":-242},{"lat":47.600094,"lng":-122.327667,"orientation":269.4871358753964,"vehicleId":"","scheduleDeviation":0},{"lat":47.654095,"lng":-122.411751,"orientation":180,"vehicleId":"","scheduleDeviation":0},{"lat":47.642110949198035,"lng":-122.34476527277002,"orientation":98.18286782477759,"vehicleId":"1_2302","scheduleDeviation":-68},{"lat":47.70211947215461,"lng":-122.36128446788223,"orientation":207.37468104102422,"vehicleId":"1_2474","scheduleDeviation":215},{"lat":47.655647,"lng":-122.33590063372594,"orientation":0,"vehicleId":"1_3658","scheduleDeviation":395},{"lat":47.64947005116564,"lng":-122.33634032483947,"orientation":269.6484965597647,"vehicleId":"1_2871","scheduleDeviation":-16},{"lat":47.59320779765995,"lng":-122.329048,"orientation":90,"vehicleId":"1_2883","scheduleDeviation":70},{"lat":47.60461162867954,"lng":-122.33309118328282,"orientation":132.45612113353,"vehicleId":"1_7017","scheduleDeviation":108},{"lat":47.678841,"lng":-122.325157,"orientation":337.61986494665064,"vehicleId":"","scheduleDeviation":0},{"lat":47.58023100004074,"lng":-122.329063,"orientation":90,"vehicleId":"1_2480","scheduleDeviation":79}]
}

function *loadRoute (shortName) {
  try {
    const route = yield models.Route
      .filter({ shortName })
      .getJoin({
        shapes: { _apply: seq => seq.limit(1) },
        alerts: true
      })
      .run()

    return {
      shortName: route[0].shortName,
      direction: 'south',
      routeShape: route[0].shapes[0].geojson,
      alerts: route[0].alerts,
      vehicles: yield loadVehiclesForRoute(shortName),
      connectingRoutes: []
    }
  } catch (err) {
    console.error('err', err)
  }
}

module.exports = { loadRoute, loadVehiclesForRoute }
