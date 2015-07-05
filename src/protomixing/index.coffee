{get_protomixer} = require '../mixer'


PROTOMIXING_KEY = 'mixinto_proto'


enable_protomixing = ->
  if Function::[PROTOMIXING_KEY]?
    false
  else
    Object.defineProperty Function::, PROTOMIXING_KEY,
      enumerable: false
      value: get_protomixer()
    true

module.exports = {enable_protomixing}