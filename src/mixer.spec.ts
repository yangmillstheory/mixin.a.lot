import * as _ from 'lodash';
import {expect} from 'chai';
import {default_mixin} from './spec-utils';
import {mix} from './mixer';
import {make_mixin} from './mixin';

describe('mixer', () => {
  it('should throw an error when mixing non-Mixins', () => {
    _.each([1, 'String', [], {}], (non_Mixin) => {
      expect(() => {
        mix({}, non_Mixin);
      }).to.throw(TypeError, 'Expected a Mixin instance');
    });
  });
});
