_ = require 'underscore'
errors = require '../errors'


class Mixin
  ###
    An immutable class wrapping an immutable mixin instances that wrap simple
    object literals.

    Mixins have no special behavior or data other than

      - name
      - toString()
      - mixin_keys
          (Array of property names that to mix in)
      - pre/post mixinghooks
          (functions invoked with the mixtarget context before/after mixing)

    and immutability.

    The augmentation logic is in the factory method .from_obj, which is
    the only meaningful way to create instances.
  ###

  @validate: (mixin) ->
    unless mixin instanceof @
      throw new TypeError "Expected a Mixin instance"

    {premixing_hook, postmixing_hook} = mixin

    for own hook_name, hook of {premixing_hook, postmixing_hook}
      if hook? && !_.isFunction hook
        throw new TypeError "Expected a function for #{hook_name}"


  @from_obj: (obj, freeze = true) ->
    unless _.isObject(obj) && !_.isArray(obj)
      throw new TypeError "Expected non-empty object"
    unless _.isString(obj.name) && obj.name
      throw new errors.ValueError "Expected String name in mixin object"

    mixin = new Mixin
    mkeys = Object.keys(_.omit(obj, 'name')).sort()

    if _.isEmpty(mkeys)
      throw new errors.ValueError "Found nothing to mix in!"

    for key, value of _.extend(obj, mixin_keys: mkeys)
      do (key, value) =>
        Object.defineProperty mixin, key,
          enumerable: true
          get: ->
            value
          set: =>
            throw new errors.NotMutable "Cannot change #{key} on #{mixin}"
    (freeze && Object.freeze mixin) || mixin

  toString: ->
    string_keys = _.without(@mixin_keys, 'name')
    "Mixin(#{@name}: #{string_keys.join(', ')})"


Object.freeze(Mixin)
Object.freeze(Mixin::)


make = Mixin.from_obj.bind(Mixin)
validate = Mixin.validate.bind(Mixin)


module.exports = {make, validate}