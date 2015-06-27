"use strict"


HELPERS = require('./helpers')


module_kw = [
  'postextend'
  'postinclude'
]


###
  Allow class-level mixins; i.e., mix into a Function.
###
extensions = ->
  Function::extend = (mixin) ->
    HELPERS.validate_mixin(mixin)

    for key, value of mixin when key not in module_kw
      @[key] = value
    if typeof mixin.postextend == 'function'
      mixin.postextend.call(@, (HELPERS.rest_of.apply @, arguments)...)
    @


###
  Allow instance-level mixins; i.e., mix into a Function.prototype.
###
inclusions = ->
  Function::include = (mixin) ->
    HELPERS.validate_mixin(mixin)

    for key, value of mixin when key not in module_kw
      @::[key] = value
    if typeof mixin.postinclude == 'function'
      mixin.postinclude.call(@::, (HELPERS.rest_of.apply @, arguments)...)
    @


module.exports = {extensions, inclusions}