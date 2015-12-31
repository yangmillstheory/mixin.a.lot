import {normalize_option_key} from './keys'
import * as _arr from 'lodash/array'
import * as _obj from 'lodash/object'
import * as _lang from 'lodash/lang'
import * as _util from 'lodash/utility'

// Terminology: https://en.wikipedia.org/wiki/Advice_(programming)
interface Advice {
    pre:  Function,
    post: Function,
}

// Internal representation of MixOptions which is a client interface.
export interface IMixOptions {
    omits: string[],
    mixing_advice: Advice,
    method_advice: {
        [method_name: string]: Advice 
    },
}

const DEFAULT_OPTIONS: IMixOptions = {
    omits: [], 
    mixing_advice: {pre: _.noop, post: _.noop},
    method_advice: {},
};

 
export var parse_options: (options: MixOptions) => IMixOptions = (options) => {
    let parsed: IMixOptions = {
        omits: null,
        mixing_advice: null,
        method_advice: null
    };
    if (!_.isPlainObject(options)) {
        throw new TypeError('Expected defined options')
    }
    _.forOwn(options, (value, key) => {
        parsed[value] = options[key];
    });
    return <IMixOptions>_.defaultsDeep(parsed, DEFAULT_OPTIONS);
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