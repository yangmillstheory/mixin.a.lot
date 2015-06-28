UTIL = require './util'
_ = require 'underscore'

class Mixin

  constructor: (@name) ->

  toString: ->
    "Mixin(#{@name})"

  @make_mixin: (obj) ->
    unless _.isObject(obj) && !_.isArray(obj) && !_.isEmpty(obj)
      throw new TypeError "Expected non-empty mixin object"
    unless _.isString obj.name && obj.name
      throw new UTIL.ArgumentError "Expected String name in options argument"

    mixin = new Mixin(obj.name)

    for key, value of obj
      Object.defineProperty mixin, key,
        enumerable: true
        configurable: false
        writable: false
        value: value

    mixin


module.exports = Mixin.make_mixin