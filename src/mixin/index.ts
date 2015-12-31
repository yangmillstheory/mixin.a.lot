import * as _arr from 'lodash/array';
import * as _obj from 'lodash/object';
import * as _lang from 'lodash/lang';
import {NotImplemented, ValueError, NotMutable} from '../errors';


export class Mixin {
    /**
        An immutable mixin type.

        Has no special behavior or data other than immutability and

        - name
        - mixin_keys
            (Array of property names that to mix in)
        - toString()

        The only way to create instances is through the factory method .from_obj.
    */
    
    public name: string;
    public mixin_keys: string[];
    
    public pre_mixing_hook:  (thing: Mixin | typeof Mixin) => void;
    public post_mixing_hook: (thing: Mixin | typeof Mixin) => void;
    
    public constructor(name: string) {
        this.name = name;
    }
    
    public toString() {
        return `Mixin(${this.name}: ${_arr.without(this.mixin_keys, 'name')
            .join(', ')})`;
    }
    
    public static from_obj(spec: MixinSpec, freeze: boolean = true): Mixin {
        if (!_lang.isObject(spec) || Array.isArray(spec)) {
            throw new TypeError("Expected non-empty object literal");
        }
        let keys = Object.keys(spec).sort()
        if (!keys.length) {
            throw new ValueError('Found nothing to mix in!')
        }
        let name = spec.name;
        if (typeof name !== 'string') {
            throw new ValueError("Expected String name in mixin spec")
        }
        let mixin = new Mixin(name);
        for (var key in keys) {
            if (key === 'name' || !keys.hasOwnProperty(key)) {
                continue;
            }
            Object.defineProperty(mixin, key, {
                enumerable: true,
                get() {
                    return spec[key];
                },
                set() {
                    throw new NotMutable(`Cannot change ${key} on ${mixin}`);
                },
            });
        }
        if (freeze) {
            return Object.freeze(mixin);
        }
        return mixin;
    }
}

Object.freeze(Mixin);
Object.freeze(Mixin.prototype);

export var make = (spec: MixinSpec) => {
    return  Mixin.from_obj(spec);
}
