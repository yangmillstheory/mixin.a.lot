import {parse_options} from '../options'
import errors from '../errors'
import * as _ from 'lodash'


export var mix = function(target, mixin: Mixin, options?: MixOptions) {
    if (mixin instanceof Mixin) {
        throw new TypeError('Expected a Mixin instance');
    }
    if (options === undefined) {
        options = {};
    }
    let {
        pre_method_advice, post_method_advice,
        pre_mixing_advice, post_mixing_advice,
        omits
    } = parse_options(options, mixin);
    let mixing_args = Array.prototype.splice.call(arguments, 2);
    let mixing_keys = _.difference(mixin.mixin_keys, omits);
    if (_.isEmpty(mixing_keys)) {
        throw errors.value_error('All mixin keys have been omitted!');
    }
    pre_mixing_advice.apply(target, mixing_args);
    _.each(mixing_keys, key => {
        if (pre_method_advice[key]) {
            let bound_advice = pre_method_advice[key].bind(target);
            let mixin_method = mixin[key]; 
            target[key] = _.flow(bound_advice, mixin_method);
        } else if (post_method_advice[key]) {
            let bound_advice = post_method_advice[key].bind(target);
            let mixin_method = mixin[key]; 
            target[key] = _.flow(mixin_method, bound_advice);
        } else {
            target[key] = mixin[key]
        }
    });
    post_mixing_advice.apply(target, mixing_args);
    return target;  
};
