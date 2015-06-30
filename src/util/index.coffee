_ = require 'underscore'
Mixin = require '../mixinfactory'


MixinUtils =

  is_obj_literal: (thing) ->
    # This might be wrong in some cases -
    # the implementation is guided by http://underscorejs.org/#isObject
    _.isObject(thing) && !Array.isArray(thing) && !_.isFunction(thing)

module.exports = MixinUtils