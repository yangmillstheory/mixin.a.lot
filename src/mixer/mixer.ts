import {parse_options} from '../options'
import errors from '../errors'
import * as _ from 'lodash'


export var mix = function(target, mixin: Mixin, options?: MixOptions) {
    if (Object.getPrototypeOf(mixin) !== Mixin.prototype) {
        throw new TypeError('Expected a Mixin instance');
    }
    if (options === undefined) {
        options = {};
    }
    let mixing_args = Array.prototype.splice.call(arguments, 2);
    let {
        pre_method_advice, post_method_advice,
        pre_mixing_advice, post_mixing_advice,
        omits
    } = parse_options(options, mixin);
    pre_mixing_advice.call(target, ...mixing_args);
    _.chain(mixin.mixin_keys)
        .difference(omits)
        .tap(keys => {
            if (_.isEmpty(keys)) {
                throw errors.value_error('Found nothing to mix in!');
            }
        })
        .each(key => {
            if (pre_method_advice.hasOwnProperty(key)) {
                let bound_advice = pre_method_advice[key].bind(target);
                let mixin_method = mixin[key]; 
                target[key] = _.flow(bound_advice, mixin_method);
            } else if (post_method_advice.hasOwnProperty(key)) {
                let bound_advice = post_method_advice[key].bind(target);
                let mixin_method = mixin[key]; 
                target[key] = _.flow(mixin_method, bound_advice);
            } else {
                target[key] = mixin[key]
            }
        });
    post_mixing_advice.call(target, ...mixing_args);
    return target;  
};
