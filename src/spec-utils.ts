import {noop} from './utility';

export var default_mixin = () => {
  return {
    foo: 'foo',
    bar: 1,
    baz: noop,
  };
};
