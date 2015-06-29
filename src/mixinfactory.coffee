UTIL = require './util'
_ = require 'underscore'


class Mixin

  constructor: (@name) ->

  toString: ->
    "Mixin(#{@name})"

  @make_mixin: (obj) ->
    unless _.isObject(obj) && !_.isArray(obj)
      throw new TypeError "Expected non-empty mixin object"
    unless _.isString(obj.name) && obj.name
      throw new UTIL.ArgumentError "Expected String name in options argument"

    mixin = new Mixin(obj.name)
    mkeys = Object.keys(obj).sort()

    for key, value of _.extend(obj, mixin_keys: mkeys)
      do (key, value) ->
        Object.defineProperty mixin, key,
          enumerable: true
          get: ->
            value
          set: ->
            throw new Error "Cannot change #{key} on #{mixin}; Mixins are immutable"
    mixin


Object.freeze(Mixin)
Object.freeze(Mixin::)


module.exports = Mixin