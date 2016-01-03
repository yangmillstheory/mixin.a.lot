import * as _ from 'lodash'
import {expect} from 'chai'
import {default_mixin} from './spec-utils'
import {mix} from './mixer'
import {make_mixin} from './mixin'
import {
  value_error,
  not_implemented_error
} from './errors'

describe('mixer', () => {
  it('should throw an error when mixing non-Mixins', () => {
    _.each([1, 'String', [], {}], (non_Mixin) => {
      expect(() => {
        mix({}, non_Mixin)
      }).to.throw(new TypeError('Expected a Mixin instance'))
    });
  });
});