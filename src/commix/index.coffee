"use strict"


module_kw = [
  'postextend'
  'postinclude'
]


rest_of = ->
  if arguments.length > 1
     return Array::slice.call arguments, 1
  return []

###
  Allow class-level mixins; i.e., mix into a Function.
###
extensions = ->
  Function::extend = (mixin) ->
    for key, value of mixin when key not in module_kw
      @[key] = value
    if typeof mixin.postextend == 'function'
      mixin.postextend.call(@, rest_of.apply @, arguments)
    @


###
  Allow instance-level mixins; i.e., mix into the prototype.
###
inclusions = ->
  Function::include = (mixin) ->
    for key, value of mixin when key not in module_kw
      @::[key] = value
    if typeof mixin.postinclude == 'function'
      mixin.postinclude.call(@, rest_of.apply @, arguments)
    @


module.exports = commix: {extensions, inclusions}