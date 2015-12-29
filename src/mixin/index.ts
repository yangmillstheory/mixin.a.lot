import * as _ from 'lodash/array';
import {NotImplemented} from '../errors';

    
class Mixin {
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
    
    name: string;
    mixin_keys: Array<string>;
    
    static validate(mixin: any): void {
        if (!(mixin instanceof this)) {
            throw new TypeError(`Expected a Mixin instance`); 
        }
    }
    
    toString() {
        return `Mixin(${this.name}: ${_.without(this.mixin_keys, 'name').join(', ')})`;
    }
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

//   @from_obj: (obj, freeze = true) ->
//     unless _.isObject(obj) && !_.isArray(obj)
//       throw new TypeError "Expected non-empty object"
//     unless _.isString(obj.name) && obj.name
//       throw new errors.ValueError "Expected String name in mixin object"

//     mixin = new Mixin
//     mkeys = Object.keys(_.omit(obj, 'name')).sort()

//     if _.isEmpty(mkeys)
//       throw new errors.ValueError "Found nothing to mix in!"

//     for key, value of _.extend(obj, mixin_keys: mkeys)
//       do (key, value) =>
//         Object.defineProperty mixin, key,
//           enumerable: true
//           get: ->
//             value
//           set: =>
//             throw new errors.NotMutable "Cannot change #{key} on #{mixin}"
//     (freeze && Object.freeze mixin) || mixin


//   get_postmixing_hook: ->
//     hook_key = _.find @constructor.postmixing_hook_keys, (key) => @[key]?
//     @[hook_key]

//   get_premixing_hook: ->
//     hook_key = _.find @constructor.premixing_hook_keys, (key) => @[key]?
//     @[hook_key]


Object.freeze(Mixin);
Object.freeze(Mixin.prototype);


let make = Mixin.from_obj.bind(Mixin);
let validate = Mixin.validate.bind(Mixin);

export {make, validate};
