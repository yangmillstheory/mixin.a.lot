_ = require 'underscore'
Mixin = require '../mixinfactory'


MixinUtils =

  ArgumentError: class ArgumentError extends Error

  is_obj_literal: (thing) ->
    # This might be wrong in some cases -
    # the implementation is guided by http://underscorejs.org/#isObject
    _.isObject(thing) && !Array.isArray(thing) && !_.isFunction(thing)

#  _check_hooks: (mixin_keys, hooks) ->
#    {pre_mixinmethod_hooks, post_mixinmethod_hooks} = hooks
#
#    for hooknames in [pre_mixinmethod_hooks, post_mixinmethod_hooks]
#      if hooknames != undefined
#        unless Arrays.isArray(hooknames)
#          throw new MixinUtils.ArgumentError "Expected Array of method names for hooks option"
#        methods_to_hook = _.values(hookconfig)[0]
#        diff = _.difference(methods_to_hook, mixin_keys)
#        if diff.length
#          throw new MixinUtils.ArgumentError "Some omit keys aren't in mixin object: #{diff}"

  _check_omits: (mixin_keys, omits) ->
    if omits != undefined
      unless Array.isArray(omits) && omits.length
        throw new MixinUtils.ArgumentError "Expected omits option to be a nonempty Array"
      diff = _.difference(omits, mixin_keys)
      if diff.length
        throw new MixinUtils.ArgumentError "Some omit keys aren't in mixin object: #{diff}"

  check_mix: (mixin, options) ->
    # TODO: de-couple from Mixin class
    {omits, pre_mixinmethod_hooks, post_mixinmethod_hooks} = options
    mixin_keys = mixin.mixin_keys

    @_check_omits(mixin_keys, omits)
#    @_check_hooks(mixin_keys, {pre_mixinmethod_hooks, post_mixinmethod_hooks})

module.exports = MixinUtils