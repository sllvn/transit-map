import React from 'react'

export default class RouteCard extends React.Component {
  constructor () {
    super()
    this.state = { isShowingAlerts: false }
  }

  toggleRouteAlerts (e) {
    e.preventDefault()
    this.setState({ isShowingAlerts: !this.state.isShowingAlerts })
  }

  getAlertHtml (alert) {
    return { __html: alert.content }
  }

  render () {
    const { isShowingAlerts } = this.state
    const { route } = this.props

    return (
      <div className="card">
        <div className="card-block">
          <h4 className="card-title">{route.shortName} - {route.longName}</h4>

          {route.connectingRouteShortName && (
            <p>This route continues as <strong>Route {route.connectingRouteShortName}</strong></p>
          )}

          {route.alerts.length > 0 && (
            <p className="alert alert-danger">
              This route has active service alerts.
              {' '}
              {isShowingAlerts ? (
                <a href='#' onClick={this.toggleRouteAlerts.bind(this)}>Hide</a>
              ) : (
                <a href='#' onClick={this.toggleRouteAlerts.bind(this)}>View More...</a>
              )}
            </p>
          )}

          {isShowingAlerts && route.alerts.map((alert, key) =>
            <div className="route-alert alert alert-danger alert-dismissable" key={key}>
              <button type="button" className="close" aria-label="Close" onClick={this.toggleRouteAlerts.bind(this)}>
                <span aria-hidden="true">&times;</span>
              </button>
              <h5><a href="{alert.url}">{alert.datePublished}</a></h5>
              <div dangerouslySetInnerHTML={this.getAlertHtml(alert)} />
            </div>
          )}
        </div>
      </div>
    )
  }
}

RouteCard.propTypes = {
  route: React.PropTypes.object.isRequired
}
