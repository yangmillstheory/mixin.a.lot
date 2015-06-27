"use strict"


HELPERS = require './helpers'
_ = require 'underscore'


postmixin_hooks = [
  'post_classmixin'
  'post_protomixin'
]


enable_classmixin = ->
  Function::mixinto_class = (mixin) ->
    HELPERS.validate_mixin(mixin)

    for key, value of mixin when key not in postmixin_hooks
      @[key] = value
    if typeof mixin.post_classmixin == 'function'
      mixin.post_classmixin.call(@, (HELPERS.rest_of.apply @, arguments)...)
    @


enable_protomixin = ->
  Function::mixinto_proto = (mixin) ->
    HELPERS.validate_mixin(mixin)

    for key, value of mixin when key not in postmixin_hooks
      @::[key] = value
    if typeof mixin.post_protomixin == 'function'
      mixin.post_protomixin.call(@::, (HELPERS.rest_of.apply @, arguments)...)
    @


module.exports = {enable_classmixin, enable_protomixin}