import {NOOP_FN} from '../utility'
import {ValueError} from '../errors'
import * as _arr from 'lodash/array'
import * as _obj from 'lodash/object'
import {normalize_option_key} from './keys'

const DEFAULT_OPTIONS: MixOptions = {
    omits: [], 
    post_mixing_hook: NOOP_FN,
    post_method_hook: {},
    pre_mixing_hook: NOOP_FN,
    pre_method_hook: {},
};

let validate_omits = (mixin_keys: string[], omits: string[]) => {
    if (!(Array.isArray(omits) && omits.length)) {
        throw new ValueError('Expected omits option to be a nonempty Array');
    }
    let difference = _arr.difference(omits, mixin_keys);
    if (difference.length) {
        throw new ValueError(`Some omit keys are not in the mixin: ${difference}`);
    }
};

export function parse(options: MixOptions): MixOptions {
    let parsed = {};
    for (let key in options) {
        if (!options.hasOwnProperty(key)) {
            continue;
        }
        parsed[normalize_option_key(key)] = options[key];
    }
    return <MixOptions>_.defaults(parsed, DEFAULT_OPTIONS);
};

// parse_methodhook = (mixin, options, {aliases}) ->
//   [hook_key, methodmap] = first_alias_pair(aliases, options)
//   if hook_key?
//     unless UTILS.is_obj_literal(methodmap)
//       throw new errors.ValueError "#{hook_key}: expected dict of mixin methods to callbacks"
//     for own methodname, hook of methodmap
//       unless _.isFunction hook
//         throw new errors.ValueError "hook for #{methodname} isn't a function"
//       unless _.isFunction mixin[methodname]
//         throw new errors.ValueError "#{methodname} isn't a method on #{mixin}"
//   else
//     methodmap = {}
//   methodmap

// parse_mixinghook = (mixin, options, {aliases}) ->
//   [hook_key, hook] = first_alias_pair(aliases, options)
//   if hook?
//     if !_.isFunction hook
//       throw new TypeError "Expected a function for #{hook_key}"
//   else
//     hook = null
//   hook