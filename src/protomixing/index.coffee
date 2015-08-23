{get_protomixer} = require '../mixer'


PROTOMIXING_KEY = 'proto_mix'
PROTOMIXING_ALIASES = [
  'mixinto_proto'
]


enable_protomixing = ->
  if Function::[PROTOMIXING_KEY]?
    false
  else
    Object.defineProperty Function::, PROTOMIXING_KEY,
      enumerable: false
      value: get_protomixer()
    for alias in PROTOMIXING_ALIASES
      Object.defineProperty Function::, alias,
        enumerable: false,
        value: (args...) ->
          @[PROTOMIXING_KEY](args...)
    true

module.exports = {enable_protomixing}