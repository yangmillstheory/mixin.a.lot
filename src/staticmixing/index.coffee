{get_staticmixer} = require '../mixer'


STATICMIXING_KEY = 'static_mix'
STATICMIXING_ALIASES = [
  'mixinto_class'
]


enable_staticmixing = ->
  if Function::[STATICMIXING_KEY]?
    false
  else
    Object.defineProperty Function::, STATICMIXING_KEY,
      enumerable: false
      value: get_staticmixer()
    for alias in STATICMIXING_ALIASES
      Object.defineProperty Function::, alias,
        enumerable: false,
        value: (args...) ->
          @[STATICMIXING_KEY](args...)
    true

module.exports = {enable_staticmixing}