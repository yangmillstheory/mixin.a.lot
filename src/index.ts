import {parse_ioptions} from './options';
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

interface IMixJoint {
  method: Function;
  advice: Function;
  key: string;
}

export var mix = function(target, mixin: IMixin, options: IMixOptions = {}) {
  if (target === undefined) {
    throw new TypeError(USAGE());
  } else if (!(is_function(target) || is_object(target))) {
    throw new TypeError(USAGE(target));
  }
  if (!is_plain_object(mixin)) {
    throw new TypeError('Expected mixin to be an object literal');
  }
  let {
    pre_method_advice, post_method_advice,
    pre_mixing_hook, post_mixing_hook,
    omit,
  } = parse_ioptions(options, mixin);
  let keys_to_mix_in = diff_arrays(
    Object.getOwnPropertyNames(mixin).filter(key => {
      return (mixin[key] !== pre_mixing_hook) && (mixin[key] !== post_mixing_hook);
    }),
    omit);
  if (is_empty(keys_to_mix_in)) {
    throw new Error('All mixin keys have been omitted!');
  }
  pre_mixing_hook.call(mixin, target);
  let mix_joints: IMixJoint[] = [];
  keys_to_mix_in.forEach((key: string) => {
    let advice = pre_method_advice[key] || post_method_advice[key];
    if (advice) {
      // defer binding the composite methods until
      // after all other data/behavior have been mixed in
      mix_joints.push({
        advice,
        method: mixin[key],
        key: key,
      });
    } else  {
      target[key] = mixin[key];
    }
  });
  mix_joints.forEach(composite => {
    let {advice, method, key} = composite;
    if (pre_method_advice[key]) {
      target[key] = compose(method, advice, target);
    } else if (post_method_advice[key]) {
      target[key] = compose(advice, method, target);
    }
  });
  post_mixing_hook.call(mixin, target);
  return target;
};
