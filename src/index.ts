import {parseIOptions} from './options';
import {
  compose,
  diffArrays,
  isEmpty,
  isObject,
  isPlainObject,
} from './utility';


const USAGE = (target?): string => {
  return `Expected non-null object, got ${target}`;
};

interface IAdapting {
  method: Function;
  preAdapter: Function;
  postAdapter: Function;
  key: string;
}

export var mix = function(target: Object, mixin: IMixin, options: IMixOptions = {}) {
  ////////////////////////////
  // setup & pre-mixing checks
  if (target === undefined) {
    throw new TypeError(USAGE());
  } else if (!isObject(target)) {
    throw new TypeError(USAGE(target));
  }
  if (!isPlainObject(mixin)) {
    throw new TypeError('Expected mixin to be an object literal');
  }
  let {
    adapterTo,
    premix,
    adapterFrom,
    postmix,
    omit,
  } = parseIOptions(options, mixin);
  let keysToMixIn = diffArrays(
    Object.getOwnPropertyNames(mixin).filter(function(key) {
      return (mixin[key] !== premix) && (mixin[key] !== postmix);
    }),
    omit);
  if (isEmpty(keysToMixIn)) {
    throw new Error('All mixin keys have been omitted!');
  }

  ////////////////////
  // initialize mixing
  premix.call(mixin, target);

  //////////////
  // perform mix
  let adaptings: IAdapting[] = [];
  keysToMixIn.forEach((key: string) => {
    let adapters = adapterTo[key] || adapterFrom[key];
    if (adapters) {
      // defer attaching adapters until all other
      // data/behavior have been mixed in
      adaptings.push({
        key,
        preAdapter: adapterTo[key],
        postAdapter: adapterFrom[key],
        method: mixin[key],
      });
    } else  {
      target[key] = mixin[key];
    }
  });
  adaptings.forEach(function(adapting) {
    // attach adapters now
    let {preAdapter, postAdapter, method, key} = adapting;
    if (preAdapter) {
      target[key] = compose(method, preAdapter, target);
      if (postAdapter) {
        target[key] = compose(postAdapter, target[key], target);
      }
    } else if (postAdapter) {
      target[key] = compose(postAdapter, method, target);
    }
  });

  //////////////////
  // finalize mixing
  postmix.call(mixin, target);
  return target;
};
