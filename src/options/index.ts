import * as _arr from 'lodash/array'
import * as _obj from 'lodash/object'
import * as _lang from 'lodash/lang'
import * as _util from 'lodash/utility'
import {
    PRE_METHOD_ADVICE, POST_METHOD_ADVICE,
    PRE_MIXING_ADVICE, POST_MIXING_ADVICE,
    OMITS, key_type_of
} from './keys'
import errors from '../errors'


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

const DEFAULT_IMIX_OPTIONS: IMixOptions = {
    omits: [],
    mixing_advice: {pre: _.noop, post: _.noop},
    method_advice: {},
};

let assert_method_advice = (advice_given): void => {

};

let assert_mixing_advice = (advice_given): void => {

};

let assert_omits = (omits_given): void => {

};

export var parse_imix_options = (options: MixOptions): IMixOptions => {
    let imix_options: IMixOptions = _lang.clone(DEFAULT_IMIX_OPTIONS);
    if (!_lang.isPlainObject(options)) {
        throw new TypeError('Expected options dictionary')
    }
    _obj.forOwn(options, (value, key: string) => {
        let key_type = key_type_of(key);
        switch (key_type) {
            case (PRE_METHOD_ADVICE):
                assert_method_advice(value);
                imix_options.method_advice = value;
                break;
            case (PRE_MIXING_ADVICE):
                assert_method_advice(value);
                imix_options.mixing_advice.pre = value;
                break;
            case (POST_METHOD_ADVICE):
                assert_mixing_advice(value);
                imix_options.method_advice = value;
                break;
            case (POST_MIXING_ADVICE):
                assert_mixing_advice(value);
                imix_options.mixing_advice.post = value;
                break;
            case (OMITS):
                assert_omits(value);
                imix_options.omits = value;
                break;
        }
    });
    return imix_options;
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