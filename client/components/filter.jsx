import React from 'react'

class Filter extends React.Component {
  render () {
    const { routes, onChange } = this.props

    return (
      <ul>
        {routes.map((route, key) =>
          <li key={key}>
            <label>
              <input
                type='checkbox'
                checked={route.isEnabled}
                onChange={e => onChange(route.shortName)}
              /> {route.shortName}
            </label>
          </li>
        )}
      </ul>
    )
  }
}

Filter.propTypes = {
  onChange: React.PropTypes.func,
  routes: React.PropTypes.array.isRequired
}

export default Filter
