_ = require 'underscore'
errors = require '../errors'
{validate} = require '../mixin'
OPTIONS = require './options'


module.exports =

  _hookname: (mixinprop, before = false) ->
    (before && "before_#{mixinprop}") || "after_#{mixinprop}"

  _mix_with_hook: ({mixtarget, mixinprop, mixinvalue}, before = false) ->
    hookname = @_hookname(mixinprop, before)

    unless _.isFunction(mixtarget[hookname])
      throw errors.NotImplemented "Unimplemented hook: #{hookname}"
    if before
      hooked_mixinfunc = _.compose mixinvalue, mixtarget[hookname]
    else
      hooked_mixinfunc = _.compose mixtarget[hookname], mixinvalue
    mixtarget[mixinprop] = hooked_mixinfunc

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
    for mixinprop, mixinvalue of mixing_in
      mixcontent = {mixtarget, mixinprop, mixinvalue}

      if not (mixinprop in _.union(methodhooks.before, methodhooks.after))
        @_mix_without_hook mixcontent
      else
        @_mix_with_hook mixcontent, (mixinprop in methodhooks.before)

    mixinghooks.after?.call(mixtarget, mixinghook_args)
    mixin.get_postmixing_hook()?.call(mixtarget, mixinghook_args)

    mixtarget