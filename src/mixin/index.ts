import * as _ from 'lodash/array';
import * as _ from 'lodash/object';
import * as _ from 'lodash/lang';
import errors from '../errors';


export class Mixin {
    /**
        An immutable mixin type.

        Has no special behavior or data other than immutability and

        - name
        - mixin_keys
            (Array of property names that to mix in)
        - toString()

        The only way to create instances is through the factory method .from_pojo.
    */
    
    public name: string;
    public mixin_keys: string[];
    
    public constructor(name: string) {
        this.name = name;
    }
    
    public toString() {
        return `Mixin(${this.name}: ${_.without(this.mixin_keys, 'name')
            .join(', ')})`;
    }
    
    public static from_pojo(spec: MixinSpec, freeze: boolean = true): Mixin {
        if (!_.isPlainObject(spec) || Array.isArray(spec)) {
            throw new TypeError("Expected non-empty object literal");
        }
        let mixin_keys: string[] = _.chain(spec)
            .tap(spec => {
                if (typeof spec.name !== 'string') {
                    throw errors.value_error("Expected String name in mixin spec")
                }
            })
            .keys()
            .select(mixin_key => {
                return mixin_key !== 'name';
            })
            .tap(mixin_keys => {
                if (!mixin_keys.length) {
                    throw errors.value_error('Found nothing to mix in!')
                }
            })
            .value();
        let mixin = new Mixin(spec.name);
        _.forOwn(mixin_keys, (value, key) => {
            Object.defineProperty(mixin, key, {
                enumerable: true,
                get() {
                    return value;
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
