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


enable_blendmixin = ->
  f_proto = Function::

  ensure_can_blend = ->
    unless _.has(f_proto, 'mixinto_class')
      throw new TypeError 'class mixins disabled; call mixit.enable_classmixin()'
    unless _.has(f_proto, 'mixinto_proto')
      throw new TypeError 'proto mixins disabled; call mixit.enable_protomixin()'
    f_proto.__can_blend = true

  ensure_mixinblend = (mixinblend) ->
    unless _.has(mixin_conf, 'classmixin')
      throw new HELPERS.ArgumentError("Expected mixin_conf to have .classmixin")
    unless _.has(mixin_conf, 'protomixin')
      throw new HELPERS.ArgumentError("Expected mixin_conf to have .protomixin")

  f_proto.blended_mixinto = (mixinblend) ->
    if !f_proto.__can_blend
      ensure_can_blend()

    ensure_blendmixin(mixinblend)

    {protomixin, classmixin} = mixinblend

    @mixinto_proto(protomixin)
    @mixinto_class(classmixin)


module.exports = {enable_classmixin, enable_protomixin, enable_blendmixin}