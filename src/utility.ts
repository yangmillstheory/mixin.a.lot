///////////////////
// arrays & objects

export var diff_arrays = (minuend: any[], ...subtrahends: (any[])[]): any[] => {
  let diff_two_arrays = (a1: any[], a2: any[]): any[] => {
    let diff = [];
    for (let value of a1) {
      if (a2.indexOf(value) === -1) {
        diff.push(value);
      }
    }
    return diff;
  };
  return subtrahends.reduce((diff_so_far, subtrahend) => {
    return diff_two_arrays(diff_so_far, subtrahend);
  }, minuend);
};

export var for_own = function(iteratee, iterator: (value, key: string) => void) {
  for (let key in iteratee) {
    if (iteratee.hasOwnProperty(key)) {
      iterator(iteratee[key], key);
    }
  }
};

export var copy_object = (target, ...sources) => {
  sources.forEach(source => {
    for_own(source, (value, key: string) => {
      target[key] = value;
    });
  });
  return target;
};


////////////////
// type-checking

export var is_function = (thing) => {
  return typeof thing === 'function';
};

export var is_plain_object = (thing) => {
  // slightly modified from:
  // 
  //    https://github.com/lodash/lodash/blob/master/lodash.js#L9976
  let is_object_like = () => {
    return !!thing && typeof thing === 'object';
  };
  let object_proto = Object.prototype;
  if (!is_object_like() || object_proto.toString.call(thing) !== '[object Object]') {
    return false;
  }
  let proto = object_proto;
  if (is_function(thing.constructor)) {
    proto = Object.getPrototypeOf(thing);
  }
  if (!proto) {
    return true;
  }
  let func_to_string = Function.prototype.toString;
  let ctor = proto.constructor;
  return (is_function(ctor) &&
    ctor instanceof ctor &&
    func_to_string.call(ctor) === func_to_string.call(Object));
};

export var is_object = (thing) => {
  let type = typeof thing;
  return !!thing && (type === 'object' || type === 'function');
};

export var is_string = (thing) => {
  return typeof thing === 'string';
};

export var is_empty = (thing: any[]) => {
  return thing.length === 0;
};


////////////
// functions

export var compose = (f: Function, g: Function): Function => {
  return function(...args) {
    return f(g(...args));
  };
};

export var NOOP = Object.freeze(new Function());
