import * as _ from 'lodash';
import {make_mixin} from './mixin';

export var default_mixin_spec = () => {
  return {
    name: 'Default Example Mixin',
    foo: 'foo',
    bar: 1,
    baz: _.noop
  };
};
