import * as _arr from 'lodash/array'
import * as _obj from 'lodash/object'
import * as _lang from 'lodash/lang'
import * as _util from 'lodash/utility'
import {OptionType, option_type_of} from './keys'
import errors from '../errors'


const DEFAULT_MIX_OPTIONS: MixOptions = {
    omits: [],
    pre_mixing_advice: _util.noop,
    pre_method_advice:{},
    post_mixing_advice: _util.noop,
    post_method_advice: {}
};

let assert_method_advice = (key: string, advice, target): void => {
    if (!_obj.isPlainObject(advice)) {
        throw new errors.value_error(
            `${key}: expected dict of mixin methods to callbacks`);
    }
    _obj.forOwn(advice, (callback: Function, method_name: string) => {
        if (!_lang.isFunction(callback)) {
            throw new errors.value_error(`hook for ${method_name} isn't a function`);
        } else if (!_lang.isFunction(target[method_name])) {
            throw new errors.value_error(`${method_name} isn't a method on ${target}`);
        }
    });
};

let assert_mixing_advice = (key: string, advice): void => {
    if (!_lang.isFunction(advice)) {
        throw new TypeError(`Expected a function for ${key}`);
    }
};

let assert_omits = (omits: string[], target): void => {

};

export var parse_mix_options = (
    options: MixOptions, target: Object): MixOptions => {
    let parsed: MixOptions = _lang.clone(DEFAULT_MIX_OPTIONS);
    if (!_lang.isPlainObject(options)) {
        throw new TypeError('Expected options dictionary')
    }
    _obj.forOwn(options, (value, key: string) => {
        switch (option_type_of(key)) {
            case (OptionType.PRE_METHOD_ADVICE):
                assert_method_advice(key, value, target);
                parsed.pre_method_advice = value;
                break;
            case (OptionType.PRE_MIXING_ADVICE):
                assert_mixing_advice(key, value);
                parsed.pre_mixing_advice = value;
                break;
            case (OptionType.POST_METHOD_ADVICE):
                assert_method_advice(key, value, target);
                parsed.post_method_advice = value;
                break;
            case (OptionType.POST_MIXING_ADVICE):
                assert_mixing_advice(key, value);
                parsed.post_mixing_advice= value;
                break;
            case (OptionType.OMITS):
                assert_omits(value, target);
                parsed.omits = value;
                break;
        }
    });
    return parsed;
};
