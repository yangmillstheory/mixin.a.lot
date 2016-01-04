// import * as _ from 'lodash';
import {expect} from 'chai';
// import {spy, stub} from 'sinon';
import {make_mixin} from './index';
// import {default_mixin} from './spec-utils';

describe('making a mixin', () => {

  beforeEach(() => {
    this.invalid_mixins = [[], 'string', 1, null, undefined];
  });

  it('should reject bad mixin types', () => {
    this.invalid_mixins.forEach(mixin => {
      expect(() => {
        make_mixin(mixin);
      }).to.throw(TypeError, 'Expected non-empty object');
    });
  });

  it('should reject objects with no name property', () => {
    expect(() => {
      make_mixin({
        quack() {
          console.log('Quack!');
        },
      });
    }).to.throw('Expected String name in mixin spec');
  });

  it('should reject objects with only a name property', () => {
    expect(() => {
      make_mixin({name: 'Example Mixin'});
    }).to.throw('Found nothing to mix in!');
  });

  it('should return an immutable Mixin', () => {
    let mixin = make_mixin({
      name: 'Example Mixin',
      speak() {
        return 'Hello, World!';
      },
    });

    mixin.foo = 'bar';
    delete mixin.name;
    delete mixin.speak;

    expect(mixin.foo).to.not.exist;
    expect(mixin.name).to.equal('Example Mixin');
    expect(mixin.speak()).to.equal('Hello, World!');
  });

});

