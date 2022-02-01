module.exports = {
  isString
}

function isString(s) {
  return !!(typeof s === 'string' || s instanceof String)
}
