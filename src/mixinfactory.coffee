_ = require 'underscore'
Utils = require './util'


errors =

  NotImplemented: class NotImplemented extends Error

  NotMutable: class NotMutable extends Error

  ValueError: class ValueError extends Error


class Mixin
  ###
    An immutable class wrapping an immutable mixin instances that wrap simple
    object literals.

    Mixins have no special behavior or data other than

      - name
      - toString()
      - mixin_keys (Array of property names that to mix in)

    and immutability.

    The augmentation logic is in the factory method .from_obj, which is
    the only meaningful way to create instances.
  ###


  @_mixing_hooks: [
    'premixing_hook'
    'postmixing_hook'
  ]

  @validate: (mixin) ->
    unless mixin instanceof @
      throw new TypeError "Expected a Mixin instance"

  @from_obj: (obj, freeze = true) ->
    unless _.isObject(obj) && !_.isArray(obj)
      throw new TypeError "Expected non-empty object"
    unless _.isString(obj.name) && obj.name
      throw new ValueError "Expected String name in options argument"

    mixin = new Mixin
    mkeys = Object.keys(_.omit(obj, 'name')).sort()

    if _.isEmpty(mkeys)
      throw new ValueError "Found nothing to mix in!"

    for key, value of _.extend(obj, mixin_keys: mkeys)
      do (key, value) =>
        Object.defineProperty mixin, key,
          enumerable: true
          get: ->
            value
          set: =>
            throw new NotMutable "Cannot change #{key} on #{mixin}"
    (freeze && Object.freeze mixin) || mixin

  toString: ->
    string_keys = _.without(@mixin_keys, 'name')
    "Mixin(#{@name}: #{string_keys.join(', ')})"


Object.freeze(Mixin)
Object.freeze(Mixin::)


module.exports = {Mixin, errors}