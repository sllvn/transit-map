/* globals fetch */

export function getJson (endpoint) {
  return fetch(endpoint).then(res => res.json()).catch(err => console.error('err', err))
}

