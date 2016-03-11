const fs = require('fs')
const chalk = require('chalk')
const koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
const morgan = require('koa-morgan')
const utils = require('./utils')
const services = require('./services')

const app = koa()
const router = Router()

app.use(morgan.middleware('dev'))

router.get('/api/routes', function *(next) {
  this.body = {
    "routes": [
      {
        "shortName": "26",
        "longName": "East Green Lake to Downtown Seattle"
      },
      {
        "shortName": "28",
        "longName": "Whittier Heights to Fremont to Downtown Seattle"
      },
      {
        "shortName": "40",
        "longName": "Northgate TC to Ballard to Fremont to Westlake to"
      }
    ]
  }
})

router.get('/api/routes/:routeShortName', function *(next) {
  // this.body = JSON.parse(fs.readFileSync(`./data/${this.params.routeShortName}.geojson`, 'utf8'))
  const route = yield services.loadRoute('26')
  this.body = route
})

router.get('/api/routes/:routeShortName/vehicles', function *(next) {
  this.body = yield utils.createGeojsonForRoute(this.params.routeShortName)
})

app.use(serve(__dirname + '/client'))

app.use(router.routes())

const port = process.env.PORT || 3000
app.listen(port)
console.log(chalk.green(`listening on port ${port}`))
