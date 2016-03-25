const fs = require('fs')
const co = require('co')

const models = require('../models')
const utils = require('../gtfs-utils')

function *importRoute (shortName) {
  // TODO
  // const alert = new models.Alert({
  //   datePublished: new Date('Tue, 01 Mar 2016 12:00:07 -0600'),
  //   url: 'http://content.govdelivery.com/accounts/WAKING/bulletins/139671f',
  //   content: '<p>On Sunday, March 6, from the start of service until about 11:00 AM, north downtown Seattle, west Queen Anne and Aurora Av N,&nbsp;transit service will be rerouted during the <a href="http://www.hotchocolate15k.com/seattle/">Hot Chocolate 15K &amp; 5K Run.</a></p> <p>During this event, Metro bus routes <a href="http://metro.kingcounty.gov/tops/bus/schedules/s001_2_.html">1</a>, <a href="http://metro.kingcounty.gov/tops/bus/schedules/s002_2_.html">2</a>, <a href="http://metro.kingcounty.gov/tops/bus/schedules/s003_2_.html">3</a>, <a href="http://metro.kingcounty.gov/tops/bus/schedules/s004_2_.html">4</a>, <a href="http://metro.kingcounty.gov/tops/bus/schedules/s005_2_.html">5</a>, <a href="http://metro.kingcounty.gov/tops/bus/schedules/s013_2_.html">13</a>, <a href="http://metro.kingcounty.gov/tops/bus/schedules/s016_2_.html">16</a>, <a href="http://metro.kingcounty.gov/tops/bus/schedules/s024_2_.html">24</a>, <a href="http://metro.kingcounty.gov/tops/bus/schedules/s033_2_.html">33</a> and <a href="http://metro.kingcounty.gov/travel-options/bus/rapidride/e-line/">RapidRide D and E Line</a> will be rerouted and will travel instead via alternate nearby streets, depending on the route, destination and direction of travel.</p> <p>Visit the <a href="http://metro.kingcounty.gov/up/rr/reroutes.html">Metro Service Advisories page</a> for specific reroute information. Transit reroute start and end times may be subject to change.</p><p>Visit <a href="http://links.govdelivery.com/track?type=click&amp;enid=bWFpbGluZ2lkPTIwMTEwODAyLjIyNjE3NjEmbWVzc2FnZWlkPU1EQi1QUkQtQlVMLTIwMTEwODAyLjIyNjE3NjEmZGF0YWJhc2VpZD0xMDAxJnNlcmlhbD0xMjc2OTYxMjc5JmVtYWlsaWQ9Y2FicmluYS5iZWxsQGtpbmdjb3VudHkuZ292JnVzZXJpZD1jYWJyaW5hLmJlbGxAa2luZ2NvdW50eS5nb3YmZmw9JmV4dHJhPU11bHRpdmFyaWF0ZUlkPSYmJg==&amp;&amp;&amp;118&amp;&amp;&amp;http://tripplanner.kingcounty.gov/cgi-bin/itin_page.pl?resptype=U" title="http://links.govdelivery.com/track?type=click&amp;enid=bWFpbGluZ2lkPTIwMTEwODAyLjIyNjE3NjEmbWVzc2FnZWlkPU1EQi1QUkQtQlVMLTIwMTEwODAyLjIyNjE3NjEmZGF0YWJhc2VpZD0xMDAxJnNlcmlhbD0xMjc2OTYxMjc5JmVtYWlsaWQ9Y2FicmluYS5iZWxsQGtpbmdjb3VudHkuZ292JnVzZXJpZD1jYWJyaW5hLmJl">Metro&rsquo;s Online Regional Trip Planner</a> to find out how to get to and from events and locations.</p> <p>Thank you for riding and for using Metro&rsquo;s services.</p>'
  // })

  // TODO
  const gtfsRoute = yield utils.getRoute(shortName)
  const route = new models.Route(gtfsRoute)
  // TODO: handle alertFeedUrl, load alerts

  const shapeIds = yield utils.shapeIdsForRoute(route.gtfs.route_id)
  const shapes = yield utils.extractShapes({ shapeIds })

  route.shapes = shapes.reduce((acc, shape) => {
    console.log('reducing', shape.shapeId)
    return acc.concat(new models.Shape({
      geojson: shape.geojson
    }))
  }, [])

  const savedRoute = yield route.saveAll()
}

co(function *() {
  // console.log('importing route 5')
  // yield importRoute('5')
  // console.log('importing route 16')
  // yield importRoute('16')
  // console.log('importing route 26')
  // yield importRoute('26')
  // console.log('importing route 28')
  // yield importRoute('28')
  // console.log('importing route 40')
  // yield importRoute('40')
  console.log('importing route 131')
  yield importRoute('131')
  console.log('importing route 132')
  yield importRoute('132')

  yield models.thinky.r.getPool().drain()
})
