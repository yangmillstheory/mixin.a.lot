import {
  is_empty,
  is_plain_object,
  is_string,
} from './utility';


export class Mixin {

  public mixin_keys: string[];

  private name: string;

  public static from_pojo(spec: IMixinSpec, freeze: boolean): Mixin {
    if (!is_plain_object(spec)) {
      throw new TypeError('Expected non-empty object literal');
    } else if (!is_string(spec.name)) {
      throw new Error('Expected String name in mixin spec');
    }
    let mixin_name: string = spec.name;
    let mixin_keys: string[] = Object.keys(spec)
      .filter(mixin_key => {
          return mixin_key !== 'name';
      });
    if (is_empty(mixin_keys)) {
      throw new Error('Found nothing to mix in!');
    }
    let mixin = new Mixin(mixin_name, mixin_keys);
    mixin_keys.forEach(key => {
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
