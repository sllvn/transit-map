import React from 'react'

require('./vehicle-popup.css')

export default class VehiclePopup extends React.Component {
  render () {
    const { route, vehicle } = this.props

    return (
      <div className="vehicle-popup">
        <h5>{route.shortName} <small>({vehicle.vehicleId})</small></h5>
      </div>
    )
  }
}

VehiclePopup.propTypes = {
  route: React.PropTypes.object.isRequired,
  vehicle: React.PropTypes.object.isRequired
}
