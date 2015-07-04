var enable_classmixing, enable_protomixing, make;

enable_protomixing = require('./protomixing').enable_protomixing;

enable_classmixing = require('./classmixing').enable_classmixing;

make = require('./mixin').make;

module.exports = {
  enable_classmixing: enable_classmixing,
  enable_protomixing: enable_protomixing,
  make: make
};

var enable_classmixing, get_classmixer;

get_classmixer = require('../mixer').get_classmixer;

enable_classmixing = function() {
  if (Function.prototype.mixinto_class != null) {
    throw new Error("Function.prototype.mixinto_class is already defined!");
  }
  return Object.defineProperty(Function.prototype, 'mixinto_class', {
    enumerable: false,
    value: get_classmixer()
  });
};

module.exports = {
  enable_classmixing: enable_classmixing
};

var NotImplemented, NotMutable, ValueError, _, error_class, errors,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

errors = {
  NotImplemented: NotImplemented = (function(superClass) {
    extend(NotImplemented, superClass);

    function NotImplemented() {
      return NotImplemented.__super__.constructor.apply(this, arguments);
    }

    return NotImplemented;

  })(Error),
  NotMutable: NotMutable = (function(superClass) {
    extend(NotMutable, superClass);

    function NotMutable() {
      return NotMutable.__super__.constructor.apply(this, arguments);
    }

    return NotMutable;

  })(Error),
  ValueError: ValueError = (function(superClass) {
    extend(ValueError, superClass);

    function ValueError() {
      return ValueError.__super__.constructor.apply(this, arguments);
    }

    return ValueError;

  })(Error)
};

for (_ in errors) {
  if (!hasProp.call(errors, _)) continue;
  error_class = errors[_];
  Object.freeze(error_class);
}

Object.freeze(errors);

module.exports = errors;

var MIXER, Mixin, PARSER, UTILS, _, errors, get_classmixer, get_protomixer,
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  slice = [].slice;

_ = require('underscore');

errors = require('../errors');

Mixin = require('../mixin');

UTILS = {
  is_nonempty_string: function(thing) {
    return _.isString(thing) && (thing.length > 0);
  },
  is_obj_literal: function(thing) {
    return _.isObject(thing) && !Array.isArray(thing) && !_.isFunction(thing);
  }
};

PARSER = {
  _parse_methodhooks: function(mixin, methodhooks) {
    var hook_key, i, len, methodname, methods;
    for (hook_key in methodhooks) {
      if (!hasProp.call(methodhooks, hook_key)) continue;
      methods = methodhooks[hook_key];
      if (methods !== void 0) {
        if (!(Array.isArray(methods) && _.all(methods, UTILS.is_nonempty_string))) {
          throw new errors.ValueError(hook_key + ": expected an Array of mixin method names");
        }
        for (i = 0, len = methods.length; i < len; i++) {
          methodname = methods[i];
          if (!_.isFunction(mixin[methodname])) {
            throw new errors.ValueError(methodname + " isn't a method on " + mixin);
          }
        }
      } else {
        methodhooks[hook_key] = [];
      }
    }
    return {
      before: methodhooks.hook_before,
      after: methodhooks.hook_after
    };
  },
  _parse_mixinghooks: function(mixin, mixinghooks) {
    var hook, mixinghook_key;
    for (mixinghook_key in mixinghooks) {
      if (!hasProp.call(mixinghooks, mixinghook_key)) continue;
      hook = mixinghooks[mixinghook_key];
      if (hook != null) {
        if (!_.isFunction(hook)) {
          throw new TypeError("Expected a function for " + mixinghook_key);
        }
      } else {
        mixinghooks[mixinghook_key] = null;
      }
    }
    return {
      pre: mixinghooks.premixing_hook,
      post: mixinghooks.postmixing_hook
    };
  },
  _parse_omits: function(mixin, omits) {
    var diff;
    if (omits !== void 0) {
      if (!(Array.isArray(omits) && omits.length)) {
        throw new errors.ValueError("Expected omits option to be a nonempty Array");
      }
      diff = _.difference(omits, mixin.mixin_keys);
      if (diff.length) {
        throw new errors.ValueError("Some omit keys aren't in mixin: " + diff);
      }
    }
    return ((omits != null ? omits.length : void 0) && omits) || [];
  },
  parse_mix: function(mixin, options) {
    var after, before, hook_after, hook_before, omits, post, postmixing_hook, pre, premixing_hook, ref, ref1;
    omits = options.omits;
    hook_before = options.hook_before, hook_after = options.hook_after;
    premixing_hook = options.premixing_hook, postmixing_hook = options.postmixing_hook;
    omits = this._parse_omits(mixin, omits);
    ref = this._parse_methodhooks(mixin, {
      hook_before: hook_before,
      hook_after: hook_after
    }), before = ref.before, after = ref.after;
    ref1 = this._parse_mixinghooks(mixin, {
      premixing_hook: premixing_hook,
      postmixing_hook: postmixing_hook
    }), pre = ref1.pre, post = ref1.post;
    return {
      omits: omits,
      methodhooks: {
        before: before,
        after: after
      },
      mixinghooks: {
        pre: pre,
        post: post
      }
    };
  }
};

MIXER = {
  _mix_with_hook: function(arg, before) {
    var hooked_mixinfunc, hookname, mixinprop, mixinvalue, mixtarget;
    mixtarget = arg.mixtarget, mixinprop = arg.mixinprop, mixinvalue = arg.mixinvalue;
    if (before == null) {
      before = false;
    }
    hookname = (before && ("before_" + mixinprop)) || ("after_" + mixinprop);
    if (!_.isFunction(mixtarget[hookname])) {
      throw errors.NotImplemented("Unimplemented hook: " + hookname);
    }
    if (before) {
      hooked_mixinfunc = _.compose(mixinvalue, mixtarget[hookname]);
    } else {
      hooked_mixinfunc = _.compose(mixtarget[hookname], mixinvalue);
    }
    return mixtarget[mixinprop] = hooked_mixinfunc;
  },
  _mix_without_hook: function(arg) {
    var mixinprop, mixinvalue, mixtarget;
    mixtarget = arg.mixtarget, mixinprop = arg.mixinprop, mixinvalue = arg.mixinvalue;
    return mixtarget[mixinprop] = mixinvalue;
  },
  mix: function(mixtarget, mixin, options) {
    var __, k, methodhooks, mixcontent, mixing_in, mixinghook_args, mixinghooks, mixinprop, mixinvalue, omits, postmixing_hook, premixing_hook, ref, ref1, ref2, v;
    if (options == null) {
      options = {};
    }
    Mixin.validate(mixin);
    ref = PARSER.parse_mix(mixin, options), omits = ref.omits, methodhooks = ref.methodhooks, mixinghooks = ref.mixinghooks;
    premixing_hook = mixin.premixing_hook, postmixing_hook = mixin.postmixing_hook;
    __ = arguments[0], __ = arguments[1], __ = arguments[2], mixinghook_args = arguments[3];
    if ((ref1 = mixinghooks.pre) != null) {
      ref1.call(mixtarget, mixinghook_args);
    }
    if (premixing_hook != null) {
      premixing_hook.call(mixtarget, mixinghook_args);
    }
    mixing_in = _.object((function() {
      var results;
      results = [];
      for (k in mixin) {
        v = mixin[k];
        if (indexOf.call(mixin.mixin_keys, k) >= 0 && indexOf.call(omits, k) < 0) {
          results.push([k, v]);
        }
      }
      return results;
    })());
    if (_.isEmpty(mixing_in)) {
      throw new errors.ValueError("Found nothing to mix in!");
    }
    for (mixinprop in mixing_in) {
      mixinvalue = mixing_in[mixinprop];
      mixcontent = {
        mixtarget: mixtarget,
        mixinprop: mixinprop,
        mixinvalue: mixinvalue
      };
      if (!(indexOf.call(_.union(methodhooks.before, methodhooks.after), mixinprop) >= 0)) {
        this._mix_without_hook(mixcontent);
      } else {
        this._mix_with_hook(mixcontent, (indexOf.call(methodhooks.before, mixinprop) >= 0));
      }
    }
    if ((ref2 = mixinghooks.post) != null) {
      ref2.call(mixtarget, mixinghook_args);
    }
    if (postmixing_hook != null) {
      postmixing_hook.call(mixtarget, mixinghook_args);
    }
    return mixtarget;
  }
};

get_protomixer = function() {
  return function() {
    return MIXER.mix.apply(MIXER, [this.prototype].concat(slice.call(arguments)));
  };
};

get_classmixer = function() {
  return function() {
    return MIXER.mix.apply(MIXER, [this].concat(slice.call(arguments)));
  };
};

module.exports = {
  get_protomixer: get_protomixer,
  get_classmixer: get_classmixer
};

var Mixin, _, errors, make, validate,
  hasProp = {}.hasOwnProperty;

_ = require('underscore');

errors = require('../errors');

Mixin = (function() {
  function Mixin() {}


  /*
    An immutable class wrapping an immutable mixin instances that wrap simple
    object literals.
  
    Mixins have no special behavior or data other than
  
      - name
      - toString()
      - mixin_keys
          (Array of property names that to mix in)
      - pre/post mixinghooks
          (functions invoked with the mixtarget context before/after mixing)
  
    and immutability.
  
    The augmentation logic is in the factory method .from_obj, which is
    the only meaningful way to create instances.
   */

  Mixin.validate = function(mixin) {
    var hook, hook_name, postmixing_hook, premixing_hook, ref, results;
    if (!(mixin instanceof this)) {
      throw new TypeError("Expected a Mixin instance");
    }
    premixing_hook = mixin.premixing_hook, postmixing_hook = mixin.postmixing_hook;
    ref = {
      premixing_hook: premixing_hook,
      postmixing_hook: postmixing_hook
    };
    results = [];
    for (hook_name in ref) {
      if (!hasProp.call(ref, hook_name)) continue;
      hook = ref[hook_name];
      if ((hook != null) && !_.isFunction(hook)) {
        throw new TypeError("Expected a function for " + hook_name);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Mixin.from_obj = function(obj, freeze) {
    var fn, key, mixin, mkeys, ref, value;
    if (freeze == null) {
      freeze = true;
    }
    if (!(_.isObject(obj) && !_.isArray(obj))) {
      throw new TypeError("Expected non-empty object");
    }
    if (!(_.isString(obj.name) && obj.name)) {
      throw new errors.ValueError("Expected String name in options argument");
    }
    mixin = new Mixin;
    mkeys = Object.keys(_.omit(obj, 'name')).sort();
    if (_.isEmpty(mkeys)) {
      throw new errors.ValueError("Found nothing to mix in!");
    }
    ref = _.extend(obj, {
      mixin_keys: mkeys
    });
    fn = (function(_this) {
      return function(key, value) {
        return Object.defineProperty(mixin, key, {
          enumerable: true,
          get: function() {
            return value;
          },
          set: function() {
            throw new errors.NotMutable("Cannot change " + key + " on " + mixin);
          }
        });
      };
    })(this);
    for (key in ref) {
      value = ref[key];
      fn(key, value);
    }
    return (freeze && Object.freeze(mixin)) || mixin;
  };

  Mixin.prototype.toString = function() {
    var string_keys;
    string_keys = _.without(this.mixin_keys, 'name');
    return "Mixin(" + this.name + ": " + (string_keys.join(', ')) + ")";
  };

  return Mixin;

})();

Object.freeze(Mixin);

Object.freeze(Mixin.prototype);

make = Mixin.from_obj.bind(Mixin);

validate = Mixin.validate.bind(Mixin);

module.exports = {
  make: make,
  validate: validate
};

var enable_protomixing, get_protomixer;

get_protomixer = require('../mixer').get_protomixer;

enable_protomixing = function() {
  if (Function.prototype.mixinto_proto != null) {
    throw new Error("Function.prototype.mixinto_proto is already defined!");
  }
  return Object.defineProperty(Function.prototype, 'mixinto_proto', {
    enumerable: false,
    value: get_protomixer()
  });
};

module.exports = {
  enable_protomixing: enable_protomixing
};
