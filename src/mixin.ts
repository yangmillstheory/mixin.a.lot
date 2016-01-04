import * as _ from 'lodash';


export class Mixin {

  public mixin_keys: string[];

  private name: string;

  public static from_pojo(spec: IMixinSpec, freeze: boolean): Mixin {
    if (!_.isPlainObject(spec)) {
      throw new TypeError('Expected non-empty object literal');
    } else if (typeof spec.name !== 'string') {
      throw new Error('Expected String name in mixin spec');
    }
    let mixin_name: string = spec.name;
    let mixin_keys: string[] = _.chain(spec)
      .keys()
      .select(mixin_key => {
          return mixin_key !== 'name';
      })
      .value();
    if (!mixin_keys.length) {
      throw new Error('Found nothing to mix in!');
    }
    let mixin = new Mixin(mixin_name, mixin_keys);
    _.each(mixin_keys, key => {
      Object.defineProperty(mixin, key, {
        enumerable: true,
        get() {
          return spec[key];
        },
        set() {
          throw new Error(`Cannot change ${key} on ${mixin}`);
        },
      });
    });
    if (freeze) {
      Object.freeze(mixin);
    }
    return mixin;
  }

  public constructor(name: string, mixin_keys: string[]) {
    Object.defineProperty(this, 'name', {
      enumerable: true,
      configurable: false,
      get() {
        return name;
      },
    });
    this.mixin_keys = mixin_keys;
    this.mixin_keys.sort();
  }

  public toString() {
    return `Mixin(${this.name}: ${this.mixin_keys.join(', ')})`;
  }

}

Object.freeze(Mixin);
Object.freeze(Mixin.prototype);

export var make_mixin = (spec: IMixinSpec, freeze: boolean = true): Mixin => {
    return Mixin.from_pojo(spec, freeze);
};

export var is_mixin = (thing) => {
  return thing instanceof Mixin;
};
