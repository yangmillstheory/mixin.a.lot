_ = require 'underscore'


class Mixin
  ###
    Don't make your own Mixin instances; use the factory method @make_mixin,
    which creates immutable instances for use with mixin methods on Function.prototype.

    The philosophy, more or less, is like:

      - https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/

    The instance property .mixin_keys contains the properties to mix in.
  ###

  @MutabilityError: class MutabilityError extends Error
  @ArgumentError: class ArgumentError extends Error

  @mixing_hooks: [
    'premixing_hook'
    'postmixing_hook'
  ]

  @mixinmethod_hooks: [
    'pre_mixinmethod_hook'
    'post_mixinmethod_hook'
  ]

#  _check_hooks: (mixin_keys, hooks) ->
#    {pre_mixinmethod_hooks, post_mixinmethod_hooks} = hooks
#
#    for hooknames in [pre_mixinmethod_hooks, post_mixinmethod_hooks]
#      if hooknames != undefined
#        unless Arrays.isArray(hooknames)
#          throw new @ArgumentError "Expected Array of method names for hooks option"
#        methods_to_hook = _.values(hookconfig)[0]
#        diff = _.difference(methods_to_hook, mixin_keys)
#        if diff.length
#          throw new @ArgumentError "Some omit keys aren't in mixin object: #{diff}"

  @_check_omits: (mixin_keys, omits) ->
    if omits != undefined
      unless Array.isArray(omits) && omits.length
        throw new @ArgumentError "Expected omits option to be a nonempty Array"
      diff = _.difference(omits, mixin_keys)
      if diff.length
        throw new @ArgumentError "Some omit keys aren't in mixin object: #{diff}"

  @check_mix_opts: (mixin, options) ->
    {omits, pre_mixinmethod_hooks, post_mixinmethod_hooks} = options
    mixin_keys = mixin.mixin_keys

    @_check_omits(mixin_keys, omits)

  @validate_mixin: (mixin) ->
    unless mixin instanceof @
      throw new TypeError "Expected a Mixin instance"
    for mixinhook_key in @mixing_hooks
      supplied_hook = mixin[mixinhook_key]
      if supplied_hook? && !_.isFunction supplied_hook
        throw new TypeError "Expected a function for #{mixinhook_key}"

  @from_obj: (obj, freeze = true) ->
    unless _.isObject(obj) && !_.isArray(obj)
      throw new TypeError "Expected non-empty object"
    unless _.isString(obj.name) && obj.name
      throw new @ArgumentError "Expected String name in options argument"

    mixin = new Mixin
    mkeys = Object.keys(_.omit(obj, 'name')).sort()

    if _.isEmpty(mkeys)
      throw new @ArgumentError "Found nothing to mix in!"

    for key, value of _.extend(obj, mixin_keys: mkeys)
      do (key, value) =>
        Object.defineProperty mixin, key,
          enumerable: true
          get: ->
            value
          set: =>
            throw new @MutabilityError "Cannot change #{key} on #{mixin}"
    (freeze && Object.freeze mixin) || mixin

  toString: ->
    string_keys = _.without(@mixin_keys, 'name')
    "Mixin(#{@name}: #{string_keys.join(', ')})"


Object.freeze(Mixin)
Object.freeze(Mixin::)


module.exports = Mixin