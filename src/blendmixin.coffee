HELPERS = require './helpers'
_ = require 'underscore'


enable_blendmixin = ->
  f_proto = Function::

  ensure_can_blend = ->
    unless _.has(f_proto, 'mixinto_class')
      throw new TypeError 'class mixins disabled; call mixit.enable_classmixin()'
    unless _.has(f_proto, 'mixinto_proto')
      throw new TypeError 'proto mixins disabled; call mixit.enable_protomixin()'
    f_proto.__can_blend = true

  ensure_blend = (blend) ->
    unless _.has(mixin_conf, 'classmixin')
      throw new HELPERS.ArgumentError("Expected mixin_conf to have .classmixin")
    unless _.has(mixin_conf, 'protomixin')
      throw new HELPERS.ArgumentError("Expected mixin_conf to have .protomixin")

  f_proto.blended_mixinto = (blend) ->
    if !f_proto.__can_blend
      ensure_can_blend()

    ensure_blend(blend)

    {protomixin, classmixin} = blend

    @mixinto_proto(protomixin)
    @mixinto_class(classmixin)


module.exports = enable_blendmixin