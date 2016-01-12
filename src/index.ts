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
  pre_adapter: Function;
  post_adapter: Function;
  key: string;
}

export var mix = function(target, mixin: IMixin, options: IMixOptions = {}) {
  ////////////////////////////
  // setup & pre-mixing checks
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

  ////////////////////
  // initialize mixing
  pre_mixing_hook.call(mixin, target);

  //////////////
  // perform mix
  let mix_joints: IMixJoint[] = [];
  keys_to_mix_in.forEach((key: string) => {
    let advice = pre_method_advice[key] || post_method_advice[key];
    if (advice) {
      // defer attaching advice until all other
      // data/behavior have been mixed in
      mix_joints.push({
        key,
        pre_adapter: pre_method_advice[key],
        post_adapter: post_method_advice[key],
        method: mixin[key],
      });
    } else  {
      target[key] = mixin[key];
    }
  });
  mix_joints.forEach(mix_joint => {
    // attach advice now
    let {pre_adapter, post_adapter, method, key} = mix_joint;
    if (pre_adapter) {
      target[key] = compose(method, pre_adapter, target);
      if (post_adapter) {
        target[key] = compose(post_adapter, target[key], target);
      }
    } else if (post_adapter) {
      target[key] = compose(post_adapter, method, target);
    }
  });

  //////////////////
  // finalize mixing
  post_mixing_hook.call(mixin, target);
  return target;
};
