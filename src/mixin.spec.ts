import * as _ from 'lodash';
import {expect} from 'chai';
import {make_mixin} from './index';

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
      make_mixin({name: 'Example'});
    }).to.throw('Found nothing to mix in!');
  });

  it('should return an immutable Mixin', () => {
    let mixin = make_mixin({
      name: 'Example',
      speak() {
        return 'Hello, World!';
      },
    });

    mixin.foo = 'bar';
    delete mixin.name;
    delete mixin.speak;

    expect(mixin.foo).to.not.exist;
    expect(mixin.name).to.equal('Example');
    expect(mixin.speak()).to.equal('Hello, World!');
  });

  it('should allow adding but not modifying the mixin if freeze = false', () => {
    let mixin = make_mixin({name: 'Example', foo: _.noop}, false);

    delete mixin.name;
    delete mixin.foo;

    mixin.bar = _.noop;

    expect(mixin.name).to.equal('Example');
    expect(_.isFunction(mixin.foo)).to.be.ok;
    expect(_.isFunction(mixin.bar)).to.be.ok;
  });

  describe('Mixin', () => {

    beforeEach(() => {
      this.mixin = make_mixin({
        name: 'Example',
        speak() {
          return `Hello, my name is ${this.name}!`;
        },
        shout() {
          return this.speak().toUpperCase();
        },
        whisper() {
          return `${this.speak().toLowerCase().replace('!', '.')}`;
        },
      });
    });

    it('should have a sorted mixin_keys property and the mixin attributes', () => {
      expect(this.mixin.mixin_keys).to.deep.equal([
        'shout',
        'speak',
        'whisper',
      ]);

      expect(this.mixin.name).to.equal('Example');
      expect(this.mixin.speak()).to.equal('Hello, my name is Example!');
      expect(this.mixin.shout()).to.equal('HELLO, MY NAME IS EXAMPLE!');
      expect(this.mixin.whisper()).to.equal('hello, my name is example.');
    });

    it('should stringify', () => {
      expect(this.mixin.toString()).to.equal(
        'Mixin(Example: shout, speak, whisper)');
    });

    it('should be immutable with loud failures on change', () => {
      this.mixin.mixin_keys.forEach(key => {
        expect(() => {
          this.mixin[key] = null;
        }).to.throw(`Cannot change ${key} on ${this.mixin}`);
      });
    });

    it('should have frozen prototype with silent failures on change', () => {
      let proto = Object.getPrototypeOf(this.mixin);
      let keys = Object.keys(proto);

      proto.foo = 'bar';
      proto.baz = () => {
        return 'qux';
      };

      expect(Object.keys(proto)).to.deep.equal(keys);
    });

  });

});

