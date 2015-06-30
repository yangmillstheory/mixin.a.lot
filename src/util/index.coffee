_ = require 'underscore'


MixinUtils =

  ArgumentError: class ArgumentError extends Error

  check_mix: (mixin, options) ->
    {omit, hooks} = options

    if omit?
      if (!Array.isArray(omit) || !omit)
        throw new MixinUtils.ArgumentError "Expected omit option to be a nonempty Array"
      diff = _.difference(omit, mixin.mixin_keys)
      if diff.length
        throw new MixinUtils.ArgumentError "Some omit keys aren't in mixin object: #{diff}"

    if hooks?
      if !_.isObject(hooks) || Array.isArray(hooks) || _.isFunction(hooks)
        # http://underscorejs.org/#isObject
        throw new MixinUtils.ArgumentError "Expected object literal for hooks option"
      diff = _.difference(Object.keys(hooks), mixin.mixin_keys)
      if diff.length
        throw new MixinUtils.ArgumentError "Some hooks keys aren't in mixin object: #{diff}"




module.exports = MixinUtils