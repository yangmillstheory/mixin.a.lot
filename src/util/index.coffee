_ = require 'underscore'
Mixin = require '../mixinfactory'


MixinUtils =

  ArgumentError: class ArgumentError extends Error

  is_obj_literal: (thing) ->
    !_.isObject(thing) || Array.isArray(thing) || _.isFunction(thing)

  check_mix: (mixin, options) ->
    mixin_keys = mixin.mixin_keys
    {omit, hooks} = options

    if omit?
      if (!Array.isArray(omit) || !omit)
        throw new MixinUtils.ArgumentError "Expected omit option to be a nonempty Array"
      diff = _.difference(omit, mixin_keys)
      if diff.length
        throw new MixinUtils.ArgumentError "Some omit keys aren't in mixin object: #{diff}"

    if hooks?
      unless @is_obj_literal(hooks)
        # http://underscorejs.org/#isObject
        throw new MixinUtils.ArgumentError "Expected object literal for hooks option"
      diff = _.difference(Object.keys(hooks), mixin_keys)
      if diff.length
        throw new MixinUtils.ArgumentError "Some hooks keys aren't in mixin object: #{diff}"
      for own _, value of hooks
        unless @is_obj_literal(value) && _.contains(Mixin.mixedmethodhook_keys, Object.keys(value))
          throw new MixinUtils.ArgumentError "Some hooks keys aren't in mixin object: #{diff}"



module.exports = MixinUtils