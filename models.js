const thinky = require('thinky')()
const type = thinky.type

const Shape = thinky.createModel('Shape', {
  id: type.string(),
  geojson: type.object()
})

const Alert = thinky.createModel('Alert', {
  id: type.string(),
  datePublished: type.date(),
  url: type.string(),
  content: type.string()
})

const Route = thinky.createModel('Route', {
  id: type.string(),
  shortName: type.string(),
  longName: type.string(),
  url: type.string(),
  alertFeedUrl: type.string(),
  alerts: type.array(),
  vehicles: type.array()
})

Route.hasAndBelongsToMany(Shape, 'shapes', 'id', 'id')
Route.hasMany(Alert, 'alerts', 'id', 'routeId')

module.exports = { thinky, Shape, Alert, Route }
