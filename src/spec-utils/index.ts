import * as _ from 'lodash';
import {make_mixin} from '../mixin';


let make_spyable_method = (mixin: Mixin, method_name: string): void => {
    mixin.mixin_keys.push(method_name);
    mixin[method_name] = _.noop;
};

export var default_mixin = (): Mixin => {
    let mixin: Mixin = make_mixin({
        name: 'Default Example Mixin',
        foo: 'foo',
        bar: 1,
    });
    make_spyable_method(mixin, 'baz');
    return mixin;
};

export var beforeOnce = fn => {
    return beforeEach(_.once(fn));
};
