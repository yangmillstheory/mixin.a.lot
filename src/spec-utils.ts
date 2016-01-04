import * as _ from 'lodash';

export var default_mixin_spec = () => {
  return {
    name: 'Default Example Mixin',
    foo: 'foo',
    bar: 1,
    baz: _.noop,
  };
};
