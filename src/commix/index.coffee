"use strict"


module_kw = [
  'postextend'
  'postinclude'
]


HELPERS =
  rest_of: ->
    if arguments.length > 1
       return Array::slice.call arguments, 1
    return []

  validate_mixin: (mixin) ->
    if Array.isArray(mixin)
      throw new TypeError("Expected object, got Array")
    else if !mixin?
      throw new TypeError("Expected object, got null-equivalent")
    else if typeof mixin != 'object'
      throw new TypeError("Expected object, got something else")


###
  Allow class-level mixins; i.e., mix into a Function.
###
extensions = ->
  Function::extend = (mixin) ->
    HELPERS.validate_mixin(mixin)

    for key, value of mixin when key not in module_kw
      @[key] = value
    if typeof mixin.postextend == 'function'
      mixin.postextend.call(@, HELPERS.rest_of.apply @, arguments)
    @


###
  Allow instance-level mixins; i.e., mix into the prototype.
###
inclusions = ->
  Function::include = (mixin) ->
    HELPERS.validate_mixin(mixin)

    for key, value of mixin when key not in module_kw
      @::[key] = value
    if typeof mixin.postinclude == 'function'
      mixin.postinclude.call(@, HELPERS.rest_of.apply @, arguments)
    @


module.exports = commix: {extensions, inclusions}