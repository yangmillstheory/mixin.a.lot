import {noop} from './utility';

export var default_mixin_spec = () => {
  return {
    name: 'Default Example Mixin',
    foo: 'foo',
    bar: 1,
    baz: noop,
  };
};
