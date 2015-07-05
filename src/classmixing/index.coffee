{get_classmixer} = require '../mixer'


CLASSMIXING_KEY = 'mixinto_class'


enable_classmixing = ->
  if Function::[CLASSMIXING_KEY]?
    false
  else
    Object.defineProperty Function::, CLASSMIXING_KEY,
      enumerable: false
      value: get_classmixer()
    true

module.exports = {enable_classmixing}