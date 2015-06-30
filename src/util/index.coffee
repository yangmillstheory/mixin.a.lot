_ = require 'underscore'


MixinUtils =

  ArgumentError: class ArgumentError extends Error

  check_mix: (mixin, options) ->
    {omit} = options
    if omit?
      if (!Array.isArray(omit) || !omit)
        throw new MixinUtils.ArgumentError "Expected omit option to be a nonempty Array"
      diff = _.difference(omit, _.keys(mixin))
      if diff.length
        throw new MixinUtils.ArgumentError "Some omit keys aren't in mixin object: #{diff}"



module.exports = MixinUtils