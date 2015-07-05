{get_protomixer} = require '../mixer'


enable_protomixing = ->
  if Function::mixinto_proto?
    false
  else
    Object.defineProperty Function::, 'mixinto_proto',
      enumerable: false
      value: get_protomixer()
    true

module.exports = {enable_protomixing}