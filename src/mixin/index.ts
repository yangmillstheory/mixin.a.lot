/// <reference path="index.d.ts" />
import * as _arr from 'lodash/array';
import * as _obj from 'lodash/object';
import * as _lang from 'lodash/lang';
import {NotImplemented, ValueError, NotMutable} from '../errors';


export class Mixin {
    /**
        An immutable mixin type.

        Has no special behavior or data other than immutability and

        - name
        - toString()
        - mixin_keys
            (Array of property names that to mix in)
        - pre/post mixinghooks (optional)
            (functions invoked with the mixtarget context before/after mixing)

        The only way to create instances is through the factory method .from_obj.
     */
    
    public name: string;
    public mixin_keys: string[];
    
    private constructor(name: string) {
        this.name = name;
    }
    
    public toString() {
        return `Mixin(${this.name}: ${_arr.without(this.mixin_keys, 'name')
            .join(', ')})`;
    }
    
    public from_obj(spec: MixinSpec, freeze: boolean = true): Mixin {
        if (!_lang.isObject(spec) || Array.isArray(spec)) {
            throw new TypeError("Expected non-empty object literal");
        }
        let name = spec.name;
        if (typeof name !== 'string') {
            throw new ValueError("Expected String name in mixin object")
        }
        delete spec.name;
        let mixin = new Mixin(name);
        let mkeys = Object.keys(spec).sort()
        if (!mkeys.length) {
            throw new ValueError('Found nothing to mix in!')
        }
        for (let key in mkeys) {
            if (!mkeys.hasOwnProperty(key)) {
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


//     for own hook_name, hook of @_parse_mixinghooks(mixin)
//       if hook? && !_.isFunction hook
//         throw new TypeError "Expected a function for #{hook_name}"

//   @premixing_hook_keys = [
//     'premixing_hook'
//     'premixing'
//     'premix'
//   ]

//   @postmixing_hook_keys = [
//     'postmixing_hook'
//     'postmixing'
//     'postmix'
//   ]

//   @_parse_mixinghooks: (mixin) ->
//     mixinghooks = {}
//     before = _.find @premixing_hook_keys, (alias) -> _.has(mixin, alias)
//     after = _.find @postmixing_hook_keys, (alias) -> _.has(mixin, alias)
//     if before?
//       mixinghooks[before] = mixin[before]
//     if after?
//       mixinghooks[after] = mixin[after]
//     mixinghooks



//   get_postmixing_hook: ->
//     hook_key = _.find @constructor.postmixing_hook_keys, (key) => @[key]?
//     @[hook_key]

//   get_premixing_hook: ->
//     hook_key = _.find @constructor.premixing_hook_keys, (key) => @[key]?
//     @[hook_key]


Object.freeze(Mixin);
Object.freeze(Mixin.prototype);


export {make: Mixin.from_obj.bind(Mixin)};
