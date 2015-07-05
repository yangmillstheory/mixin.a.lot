{get_classmixer} = require '../mixer'


enable_classmixing = ->
  if Function::mixinto_class?
    false
  else
    Object.defineProperty Function::, 'mixinto_class',
      enumerable: false
      value: get_classmixer()
    true

module.exports = {enable_classmixing}