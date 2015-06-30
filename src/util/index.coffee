_ = require 'underscore'
Mixin = require '../mixinfactory'


MixinUtils =

  ArgumentError: class ArgumentError extends Error

  is_obj_literal: (thing) ->
    # This might be wrong in some cases -
    # the implementation is guided by http://underscorejs.org/#isObject
    !_.isObject(thing) || Array.isArray(thing) || _.isFunction(thing)

  _check_hooks: (mixin_keys, hooks) ->
    if hooks?
      unless @is_obj_literal(hooks)
        throw new MixinUtils.ArgumentError "Expected object literal for hooks option"
      diff = _.difference(Object.keys(hooks), mixin_keys)
      if diff.length
        throw new MixinUtils.ArgumentError "Some hooks keys aren't in mixin object: #{diff}"
      for own _, value of hooks
        unless @is_obj_literal(value) && _.contains(Mixin.mixedmethodhook_keys, Object.keys(value))
          throw new MixinUtils.ArgumentError "Some hooks keys aren't in mixin object: #{diff}"

  _check_omits: (mixin_keys, omits) ->
    if omits?
      if !Array.isArray(omits) || !omits
        throw new MixinUtils.ArgumentError "Expected omits option to be a nonempty Array"
      diff = _.difference(omits, mixin_keys)
      if diff.length
        throw new MixinUtils.ArgumentError "Some omit keys aren't in mixin object: #{diff}"

  check_mix: (mixin, options) ->
    {omits, hooks} = options
    mixin_keys = mixin.mixin_keys

    @_check_omits(mixin_keys, omits)
    @_check_hooks(mixin_keys, hooks)

module.exports = MixinUtils