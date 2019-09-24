const _LS = window.localStorage

export function getStore (key) {
  return _LS.getItem(key)
}

export function setStore (key, value) {
  return _LS.setItem(key, value)
}

export function removeStore (key) {
  return _LS.removeItem(key)
}

export function getJSONStore (key) {

  if (_LS.getItem(key) === null || _LS.getItem(key) ===undefined || _LS.getItem(key) ==='undefined') {
    return null
  }
  return JSON.parse(_LS.getItem(key))
}

export function setJSONStore (key, value) {
  return _LS.setItem(key, JSON.stringify(value))
}
