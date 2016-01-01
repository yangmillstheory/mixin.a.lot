import * as _ from 'lodash/array'
import * as _ from 'lodash/object'
import * as _ from 'lodash/lang'
import * as _ from 'lodash/utility'
import {OptionType, option_type_of} from './keys'
import errors from '../errors'


const DEFAULT_MIX_OPTIONS: MixOptions = {
    omits: [],
    pre_mixing_advice: _.noop,
    pre_method_advice:{},
    post_mixing_advice: _.noop,
    post_method_advice: {}
};

let assert_method_advice = (key: string, advice, target): void => {
    if (!_.isPlainObject(advice)) {
        throw errors.value_error(
            `${key}: expected dict of mixin methods to callbacks`);
    }
    _.forOwn(advice, (callback: Function, method_name: string) => {
        if (!_.isFunction(callback)) {
            throw errors.value_error(`hook for ${method_name} isn't a function`);
        } else if (!_.isFunction(target[method_name])) {
            throw errors.value_error(`${method_name} isn't a method on ${target}`);
        }
    });
};

let assert_mixing_advice = (key: string, advice): void => {
    if (!_.isFunction(advice)) {
        throw new TypeError(`Expected a function for ${key}`);
    }
};

let assert_omits = (omits: string[], mixin: Mixin, target): void => {
    if (!Array.isArray(omits)) {
        throw errors.value_error('Expected omits option to be a nonempty Array');
    }
    let diff = _.difference(omits, mixin.mixin_keys);
    if (diff.length) {
        throw errors.value_error(`Some omit keys aren't in mixin: ${diff}`);
    }
};

export var parse = (options: Object, mixin: Mixin, target: Object): MixOptions => {
    if (!_.isPlainObject(options)) {
        throw new TypeError('Expected options dictionary')
    }
    let parsed: MixOptions = _.clone(DEFAULT_MIX_OPTIONS);
    _.forOwn(options, (value, key: string) => {
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
                parsed.post_mixing_advice = value;
                break;
            case (OptionType.OMITS):
                assert_omits(value, mixin, target);
                parsed.omits = value;
                break;
        }
    });
    return parsed;
};
