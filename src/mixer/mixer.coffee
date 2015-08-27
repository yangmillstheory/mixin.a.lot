_ = require 'underscore'
errors = require '../errors'
{validate} = require '../mixin'
OPTIONS = require './options'


module.exports =

  _mix_with_hook: ({mixtarget, mixinprop, mixinvalue, methodhooks}, before = false) ->
    bound_hook = methodhooks[(before && 'before') || 'after'][mixinprop].bind(mixtarget)
    if before
      hooked_mixinmethod = _.compose mixinvalue, bound_hook
    else
      hooked_mixinmethod = _.compose bound_hook, mixinvalue
    mixtarget[mixinprop] = hooked_mixinmethod

  _mix_without_hook: ({mixtarget, mixinprop, mixinvalue}) ->
    mixtarget[mixinprop] = mixinvalue

  mix: (mixtarget, mixin, options = {}) ->
    validate(mixin)

    {omits, methodhooks, mixinghooks} = OPTIONS.parse(mixin, options)
    [__, __, __, mixinghook_args] = arguments

    mixinghooks.before?.call(mixtarget, mixinghook_args)
    mixin.get_premixing_hook()?.call(mixtarget, mixinghook_args)

    mixing_in = _.object(
      [k, v] for k, v of mixin when k in mixin.mixin_keys and k not in omits)

    if _.isEmpty mixing_in
      throw new errors.ValueError "Found nothing to mix in!"
    methods_to_hook = _.union(
      Object.keys(methodhooks.before),
      Object.keys(methodhooks.after))
    for mixinprop, mixinvalue of mixing_in
      mixcontent = {mixtarget, mixinprop, mixinvalue, methodhooks}
      if not (mixinprop in methods_to_hook)
        @_mix_without_hook mixcontent
      else
        @_mix_with_hook mixcontent, (mixinprop of methodhooks.before)

    mixinghooks.after?.call(mixtarget, mixinghook_args)
    mixin.get_postmixing_hook()?.call(mixtarget, mixinghook_args)
    mixtarget