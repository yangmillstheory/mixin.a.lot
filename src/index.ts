import {parse_imix_options} from './options';
import {
  compose,
  diff_arrays,
  is_empty,
  is_function,
  is_object,
  is_plain_object,
} from './utility';


const USAGE = (target?): string => {
  return `Expected non-null object or function, got ${target}`;
};

export var mix = function(target, mixin: Mixin, options?: MixOptions) {
  if (target === undefined) {
    throw new TypeError(USAGE());
  } else if (!(is_function(target) || is_object(target))) {
    throw new TypeError(USAGE(target));
  }
  if (!is_plain_object(mixin)) {
    throw new TypeError('Expected mixin to be an object literal');
  }
  if (options === undefined) {
    options = {};
  }
  let {
    pre_method_advice, post_method_advice,
    pre_mixing_hook, post_mixing_hook,
    omit,
  } = parse_imix_options(options, mixin);
  let mixing_keys = diff_arrays(Object.getOwnPropertyNames(mixin), omit);
  if (is_empty(mixing_keys)) {
    throw new Error('All mixin keys have been omitted!');
  }
  pre_mixing_hook.apply(target);
  mixing_keys.forEach((key: string) => {
    if (pre_method_advice[key]) {
      let bound_advice = pre_method_advice[key].bind(target);
      let mixin_method = mixin[key];
      target[key] = compose(mixin_method, bound_advice);
    } else if (post_method_advice[key]) {
      let bound_advice = post_method_advice[key].bind(target);
      let mixin_method = mixin[key];
      target[key] = compose(bound_advice, mixin_method);
    } else {
      target[key] = mixin[key];
    }
  });
  post_mixing_hook.apply(target);
  return target;
};
