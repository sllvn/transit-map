const fs = require('fs')
const chalk = require('chalk')
const koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
const morgan = require('koa-morgan')
const utils = require('./utils')

const app = koa()
const router = Router()

app.use(morgan.middleware('dev'))

router.get('/api/routes/:routeShortName', function *(next) {
  this.body = JSON.parse(fs.readFileSync(`./data/${this.params.routeShortName}.geojson`, 'utf8'))
})

router.get('/api/routes/:routeShortName/vehicles', function *(next) {
  this.body = yield utils.createGeojsonForRoute(this.params.routeShortName)
})

app.use(serve(__dirname + '/static'))

app.use(router.routes())

const port = process.env.PORT || 8000
app.listen(port)
console.log(chalk.green(`listening on port ${port}`))
