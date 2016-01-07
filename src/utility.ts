export var diff_arrays = (array1: any[], array2: any[]): any[] => {
  let diff = [];
  for (let value of array1) {
    if (array2.indexOf(value) === -1) {
      diff.push(value);
    }
  }
  return diff;
};

export var for_own = function(iteratee, iterator: (value, key: string) => void) {
  for (let key in iteratee) {
    if (iteratee.hasOwnProperty(key)) {
      iterator(iteratee[key], key);
    }
  }
};

export var copy_object = (target, source) => {
  for_own(source, (value, key: string) => {
    target[key] = value;
  });
  return target;
};

export var is_function = (thing) => {
  return typeof thing === 'function';
};

// slightly modified from:
// 
//    https://github.com/lodash/lodash/blob/master/lodash.js#L9976
export var is_plain_object = (thing) => {
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
  if (proto === null) {
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

export var compose = (f: Function, g: Function): Function => {
  return function(...args) {
    return f(g(...args));
  };
};

export var noop = Object.freeze(new Function());
