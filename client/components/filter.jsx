import React from 'react'

class Filter extends React.Component {
  render () {
    const { availableRoutes, onChange } = this.props

    return (
      <div>
        {availableRoutes.map((route, key) =>
          <div key={key}>
            <label>
              <input
                type='checkbox'
                checked={route.isEnabled}
                onChange={e => onChange(route.shortName)}
              />
              {route.shortName}
            </label>
          </div>
        )}
      </div>
    )
  }
}

Filter.propTypes = {
  onChange: React.PropTypes.func,
  availableRoutes: React.PropTypes.array.isRequired
}

export default Filter
