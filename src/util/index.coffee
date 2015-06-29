_ = require 'underscore'


UTIL =

  rest_of: ->
    if arguments.length > 2
      return Array::slice.call arguments, 2
    return []

  maybe_call_mixin_hook: (mixin_hook, ctx, mixin_hook_args) ->
    if _.isFunction mixin_hook
      mixin_hook.call(ctx::, mixin_hook_args...)

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