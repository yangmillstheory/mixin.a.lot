import {parse_options} from '../options'
import {ValueError} from '../errors'
import * as _arr from 'lodash/array'


// mix_with_hook = ({mixtarget, mixinprop, mixinvalue, methodhooks}, before = false) ->
//   bound_hook = methodhooks[(before && 'before') || 'after'][mixinprop].bind(mixtarget)
//   if before
//     hooked_mixinmethod = _.compose mixinvalue, bound_hook
//   else
//     hooked_mixinmethod = _.compose bound_hook, mixinvalue
//   mixtarget[mixinprop] = hooked_mixinmethod

// mix_without_hook = ({mixtarget, mixinprop, mixinvalue}) ->
//   mixtarget[mixinprop] = mixinvalue

let validate_omits = (mixin_keys: string[], omits: string[]) => {
    if (!(Array.isArray(omits) && omits.length)) {
        throw new ValueError('Expected omits option to be a nonempty Array');
    }
    let difference = _arr.difference(omits, mixin_keys);
    if (difference.length) {
        throw new ValueError(`Some omit keys are not in the mixin: ${difference}`);
    }
};


export var mix = (target: any, mixin: Mixin, options?: MixOptions) => {
    if (Object.getPrototypeOf(mixin) !== Mixin.prototype) {
        throw new TypeError('Expected a Mixin instance');
    }
    if (options === undefined) {
        options = {};
    }
    let {
        pre_method_hook, post_method_hook, 
        pre_mixing_hook, post_mixing_hook,
        omits
    } = parse_options(options);
};

// module.exports =

//   mix: (mixtarget, mixin, options = {}) ->
//     validate(mixin)

//     {omits, methodhooks, mixinghooks} = OPTIONS.parse(mixin, options)
//     [__, __, __, mixinghook_args] = arguments

//     mixinghooks.before?.call(mixtarget, mixinghook_args)
//     mixin.get_premixing_hook()?.call(mixtarget, mixinghook_args)

//     mixing_in = _.object(
//       [k, v] for k, v of mixin when k in mixin.mixin_keys and k not in omits)

//     if _.isEmpty mixing_in
//       throw new errors.ValueError "Found nothing to mix in!"
//     methods_to_hook = _.union(
//       Object.keys(methodhooks.before),
//       Object.keys(methodhooks.after))
//     for mixinprop, mixinvalue of mixing_in
//       mixcontent = {mixtarget, mixinprop, mixinvalue, methodhooks}
//       if not (mixinprop in methods_to_hook)
//         mix_without_hook mixcontent
//       else
//         mix_with_hook mixcontent, (mixinprop of methodhooks.before)

//     mixinghooks.after?.call(mixtarget, mixinghook_args)
//     mixin.get_postmixing_hook()?.call(mixtarget, mixinghook_args)
//     mixtarget