{Mixin, errors} = require '../mixin'
{get_protomixer} = require '../mixer'
_ = require 'underscore'


enable_protomixing = ->
  if Function::mixinto_proto
    throw new Error "Function.prototype.mixinto_proto is already defined!"
  Object.defineProperty Function::, 'mixinto_proto',
    enumerable: false
    value: get_protomixer()

module.exports = enable_protomixing