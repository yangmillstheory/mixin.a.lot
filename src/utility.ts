///////////////////
// arrays & objects

export var diffArrays = function(minuend: any[], ...subtrahends: (any[])[]): any[] {
  let diffTwoArrays = function(a1: any[], a2: any[]): any[] {
    let diff = [];
    for (let value of a1) {
      if (a2.indexOf(value) === -1) {
        diff.push(value);
      }
    }
    return diff;
  };
  return subtrahends.reduce((diffSoFar, subtrahend) => {
    return diffTwoArrays(diffSoFar, subtrahend);
  }, minuend);
};

export var forOwn = function(iteratee, iterator: (value, key: string) => void) {
  for (let key in iteratee) {
    if (iteratee.hasOwnProperty(key)) {
      iterator(iteratee[key], key);
    }
  }
};

export var mixInto = function(target, ...sources) {
  sources.forEach(function(source) {
    forOwn(source, function(value, key: string) {
      target[key] = value;
    });
  });
  return target;
};


////////////////
// type-checking

export var isFunction = function(thing) {
  return typeof thing === 'function';
};

export var isPlainObject = function(thing) {
  // slightly modified from:
  // 
  //    https://github.com/lodash/lodash/blob/master/lodash.js#L9976
  let isObjectLike = () => {
    return !!thing && typeof thing === 'object';
  };
  let objectProto = Object.prototype;
  if (!isObjectLike() || objectProto.toString.call(thing) !== '[object Object]') {
    return false;
  }
  let proto = objectProto;
  if (isFunction(thing.constructor)) {
    proto = Object.getPrototypeOf(thing);
  }
  if (!proto) {
    return true;
  }
  let funcToString = Function.prototype.toString;
  let ctor = proto.constructor;
  return (isFunction(ctor) &&
    ctor instanceof ctor &&
    funcToString.call(ctor) === funcToString.call(Object));
};

export var isObject = function(thing) {
  let type = typeof thing;
  return !!thing && (type === 'object' || type === 'function');
};

export var isString = function(thing) {
  return typeof thing === 'string';
};

export var isEmpty = function(array: any[]) {
  return array.length === 0;
};


////////////
// functions

export var compose = function(f: Function, g: Function, context: Object): Function {
  return function() {
    return f.call(context, g.apply(context, [].slice.call(arguments)));
  };
};

export const NOOP = Object.freeze(new Function());
