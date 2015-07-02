{get_classmixer} = require '../mixer'
_ = require 'underscore'


enable_classmixing = ->
  if Function::mixinto_class
    throw new Error "Function.prototype.mixinto_class is already defined!"
  Object.defineProperty Function::, 'mixinto_class',
    enumerable: false
    value: get_classmixer()

module.exports = {enable_classmixing}