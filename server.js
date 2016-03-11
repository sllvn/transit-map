const fs = require('fs')
const chalk = require('chalk')
const koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
const morgan = require('koa-morgan')
const utils = require('./utils')
const services = require('./services')
const serializers = require('./serializers')

const app = koa()
const router = Router()

app.use(morgan.middleware('dev'))

router.get('/api/routes', function *(next) {
  const routes = yield services.loadRoutes()
  this.body = { routes: serializers.serializeRoutes(routes) }
})

router.get('/api/routes/:routeShortName', function *(next) {
  const route = yield services.loadRoute(this.params.routeShortName)
  this.body = { route: serializers.serializeRoute(route) }
})

router.get('/api/routes/:routeShortName/vehicles', function *(next) {
  const vehicles = yield utils.createGeojsonForRoute(this.params.routeShortName)
  this.body = { vehicles: serializers.serializeVehicles(vehicles) }
})

app.use(serve(__dirname + '/client'))

app.use(router.routes())

const port = process.env.PORT || 3000
app.listen(port)
console.log(chalk.green(`listening on port ${port}`))
