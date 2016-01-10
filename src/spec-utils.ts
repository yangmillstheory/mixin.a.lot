import {copy_object} from './utility';


export var default_mixin = (props: Object = {}) => {
  return copy_object(
    {
      foo: 'foo',
      bar: 1,
      baz: new Function(),
    },
    props);
};
