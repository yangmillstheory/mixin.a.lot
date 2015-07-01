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

  @_parse_hooks: (mixin, hooks) ->
    for own hook_key, methods of hooks
      if methods != undefined
        unless Array.isArray(methods) && _.all(methods, Utils.is_nonempty_string)
          throw new ValueError "#{hook_key}: expected an Array of mixin method names"
        for methodname in methods
          unless _.isFunction mixin[methodname]
            throw new ValueError "#{methodname} isn't a method on #{mixin}"
      else
        hooks[hook_key] = []

    before: hooks.hook_before
    after: hooks.hook_after

  @_parse_omits: (mixin, omits) ->
    if omits != undefined
      unless Array.isArray(omits) && omits.length
        throw new ValueError "Expected omits option to be a nonempty Array"
      diff = _.difference(omits, mixin.mixin_keys)
      if diff.length
        throw new ValueError "Some omit keys aren't in mixin: #{diff}"
    (omits?.length && omits) || []

  @_attach_hook = ({context, mixinprop, mixinfunc}, before = false) ->
    hookname = (before && "before_#{mixinprop}") || "after_#{mixinprop}"

    unless _.isFunction(context[hookname])
      throw errors.NotImplemented "Unimplemented hook: #{hookname}"
    if before
      hooked_mixinfunc = _.compose mixinfunc, context[hookname]
    else
      hooked_mixinfunc = _.compose context[hookname], mixinfunc
    context[mixinprop] = hooked_mixinfunc

  @attach_before_hook = ->
    @_attach_hook(arguments..., true)

  @attach_after_hook = ->
    @_attach_hook(arguments...)

  @parse_mix_opts: (mixin, options) ->
    {omits, hook_before, hook_after} = options

    omits = @_parse_omits(mixin, omits)
    {before, after} = @_parse_hooks(mixin, {hook_before, hook_after})

    {omits, methodhooks: {before, after}}

  @validate_mixin: (mixin) ->
    unless mixin instanceof @
      throw new TypeError "Expected a Mixin instance"
    for mixinhook_key in @_mixing_hooks
      supplied_hook = mixin[mixinhook_key]
      if supplied_hook? && !_.isFunction supplied_hook
        throw new TypeError "Expected a function for #{mixinhook_key}"

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