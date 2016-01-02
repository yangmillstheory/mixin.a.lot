import * as _ from 'lodash';
import errors from '../errors';


export class Mixin {
    /**
        An immutable mixin type.

        Has no special behavior or data other than immutability and

        - mixin_keys
            (Array of property names that to mix in)
        - toString()

        The only way to create instances is through the factory method .from_pojo.
    */

    private name: string;
    public mixin_keys: string[];

    public constructor(name: string, mixin_keys: string[]) {
        this.name = name;
        this.mixin_keys = mixin_keys;
    }

    public toString() {
        return `Mixin(${this.name}: ${_.without(this.mixin_keys, 'name')
            .join(', ')})`;
    }

    public static from_pojo(spec: MixinSpec, freeze: boolean = true): Mixin {
        if (!_.isPlainObject(spec)) {
            throw new TypeError("Expected non-empty object literal");
        } else if (typeof spec.name !== 'string') {
            throw errors.value_error("Expected String name in mixin spec")
        }
        let mixin_name: string = spec.name; 
        let mixin_keys: string[] = _.chain(spec)
            .keys()
            .select(mixin_key => {
                return mixin_key !== 'name';
            })
            .value();
        if (!mixin_keys.length) {
            throw errors.value_error('Found nothing to mix in!')
        }
        let mixin = new Mixin(mixin_name, mixin_keys);
        _.each(mixin_keys, key => {
            Object.defineProperty(mixin, key, {
                enumerable: true,
                get() {
                    return spec[key];
                },
                set() {
                    throw errors.not_mutable_error(`Cannot change ${key} on ${mixin}`);
                },
            });
        });
        if (freeze) {
            return Object.freeze(mixin);
        }
        return mixin;
    }
}

Object.freeze(Mixin);
Object.freeze(Mixin.prototype);

export var make = (spec: MixinSpec) => {
    return Mixin.from_pojo(spec);
};
