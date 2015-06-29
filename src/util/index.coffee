_ = require 'underscore'


UTIL =

  ArgumentError: class ArgumentError extends Error

  validate_mixin_opts: (mixin, options) ->
    omit = options.omit
    if omit?
      if (!Array.isArray(omit) || !omit)
        throw new UTIL.ArgumentError "Expected omit option to be a nonempty Array"
      diff = _.difference(omit, _.keys(mixin))
      if diff.length
        throw new UTIL.ArgumentError "Some omit keys aren't in mixin object: #{diff}"


module.exports = UTIL