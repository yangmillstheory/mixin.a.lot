_ = require 'underscore'


class Mixin
  ###
    Don't make your own Mixin instances; use the factory method @make_mixin,
    which creates immutable instances for use with mixin methods on Function.prototype.

    The philosophy, more or less, is like:

      - https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
  ###

  @MutabilityError: class MutabilityError extends Error
  @ArgumentError: class ArgumentError extends Error

  constructor: (@name) ->

  toString: ->
    string_keys = _.without(@mixin_keys, 'name')
    "Mixin(#{@name}: #{string_keys.join(', ')})"

  @postmixin_hooks = [
    'post_mixinproto'
    'post_mixinclass'
  ]

  @validate_mixin: (mixin) ->
    unless mixin instanceof @
      throw new TypeError "Expected a Mixin instance"

  @from_obj: (obj) ->
    unless _.isObject(obj) && !_.isArray(obj)
      throw new TypeError "Expected non-empty object"
    unless _.isString(obj.name) && obj.name
      throw new @ArgumentError "Expected String name in options argument"

    mixin = new Mixin(obj.name)
    mkeys = Object.keys(obj).sort()

    for key, value of _.extend(obj, mixin_keys: mkeys)
      do (key, value) =>
        Object.defineProperty mixin, key,
          enumerable: true
          get: ->
            value
          set: =>
            throw new @MutabilityError "Cannot change #{key} on #{mixin}"
    mixin


Object.freeze(Mixin)
Object.freeze(Mixin::)


module.exports = Mixin