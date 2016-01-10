import {expect} from 'chai';
import {spy, stub} from 'sinon';
import {mix} from './index';
import {default_mixin} from './spec-utils';

describe('mixing', () => {

  it('should expect plain old javascript objects', () => {
    [1, 'String', [], new Function()].forEach(thing => {
      expect(() => {
        mix({}, thing);
      }).to.throw(TypeError, 'Expected mixin to be an object literal');
    });
  });

  it('should objects or function targets', () => {
    [1, 'string', true, null, undefined].forEach(target => {
      expect(() => {
        mix(target, default_mixin());
      }).to.throw(TypeError, `Expected non-null object or function, got ${target}`);
    });
  });

  it('should mix into the target', () => {
    let target = {};
    let mixin = default_mixin();
    stub(mixin, 'baz').returns(['baz']);

    mix(target, mixin);

    expect(target.bar).to.equal(1);
    expect(target.baz()).to.deep.equal(['baz']);
  });

  it('should mix in order', () => {
    let mixin_1 = {name: 'mixin_1', foo: 'bar1', baz: 'qux'};
    let mixin_2 = {name: 'mixin_2', foo: 'bar2', qux: 'baz'};
    let target = {};

    mix(target, mixin_1);
    mix(target, mixin_2);

    expect(target.foo).to.equal('bar2');
    expect(target.baz).to.equal('qux');
    expect(target.qux).to.equal('baz');
  });

  describe('mixing advice', () => {

    it('should expect functions as mixing advice', () => {
      let mixin = default_mixin();
      mixin.pre_mixing_hook = 1;

      expect(() => {
        mix({}, mixin);
      }).to.throw(TypeError, 'Expected a function for pre_mixing_hook');

      mixin = default_mixin({
        post_mixing_hook: []
      });

      expect(() => {
        mix({}, mixin);
      }).to.throw(TypeError, 'Expected a function for post_mixing_hook');
    });

    describe('pre_mixing_hook', () => {

      it('should call it on the target', () => {
        let target = {};
        let mixin = default_mixin({
          pre_mixing_hook: spy()
        });
        mix(target, mixin);

        expect(mixin.pre_mixing_hook.calledOn(target)).to.be.true;
      });

      it('should call it before mixing in', () => {
        let error = new Error;
        let threw = false;
        let target = {};
        let pre_mixing_hook = stub();
        pre_mixing_hook.throws(error);

        let mixin = default_mixin({pre_mixing_hook});
        expect(mixin.foo).to.exist;

        try {
          mix(target, mixin);
        } catch (e) {
          threw = true;
        } finally {
          expect(threw).to.be.true;
          expect(target.foo).not.to.exist; // wasn't mixed in!
        }
      });

      it('should not mix it into the target', () => {
        let target = {};
        let mixin = default_mixin({
          pre_mixing_hook: new Function()
        });

        mix(target, mixin);

        expect(target.pre_mixing_hook).to.be.undefined;
      });

    });

    describe('post_mixing_hook', () => {

      it('should call it on the target', () => {
        let target = {};
        let mixin = default_mixin({
          post_mixing_hook: spy()
        });
        mix(target, mixin);

        expect(mixin.post_mixing_hook.calledOn(target)).to.be.true;
      });

      it('should call it after mixing in', () => {
        let error = new Error;
        let threw = false;
        let target = {};
        let post_mixing_hook = stub();
        post_mixing_hook.throws(error);

        let mixin = default_mixin({post_mixing_hook});
        expect(mixin.bar).to.equal(1);

        try {
          mix(target, mixin);
        } catch (e) {
          threw = true;
        } finally {
          expect(threw).to.be.true;
          expect(target.bar).to.equal(1); // was mixed in before throwing
        }
      });

      it('should not mix it into the target', () => {
        let target = {};
        let mixin = default_mixin({
          post_mixing_hook: new Function()
        });

        mix(target, mixin);

        expect(target.post_mixing_hook).to.be.undefined;
      });

    });

  });

  describe('mix options', () => {

    beforeEach(() => {
      this.mixin = default_mixin();
    });

    describe('omitting mixin methods', () => {

      it('should omit some mixin keys', () => {
        let target = {};
        mix(target, this.mixin, {omit: ['bar']});

        expect(target.bar).to.not.exist;
        expect(target.baz).to.exist;
      });

      it('should expect a non-empty Array for omissions', () => {
        [[], {}, null, 1, 'String'].forEach(omit => {
          expect(() => {
            mix({}, this.mixin, {omit});
          }).to.throw(TypeError, 'Expected omit option to be a nonempty Array');
        });
      });

      it('should expect omission keys that are in the mixin', () => {
        expect(() => {
          mix({}, this.mixin, {omit: ['non_mixin_key']});
        }).to.throw("Some omit keys aren't in mixin: non_mixin_key");
      });

      it('should not mangle the prototype hierarchy when omitting keys', () => {
        let target = {};
        target.__proto__ = Object.create({
          bar() {
            return 'protobar';
          },
        });

        mix(target, this.mixin, {omit: ['bar']});

        expect(target.bar).to.exist;
        expect(target.bar()).to.equal('protobar');
      });

      it('should not omit all mixin keys', () => {
        expect(() => {
          mix({}, this.mixin, {omit: ['bar', 'baz', 'foo']});
        }).to.throw('All mixin keys have been omitted!');
      });

    });

    describe('mixin method advice', () => {

      it('should expect a map of mixin method names to functions', () => {
        ['String', 1, null, [], true].forEach(pre_method_advice => {
          expect(() => {
            mix({}, this.mixin, {pre_method_advice});
          }).to.throw(
            TypeError,
            'pre_method_advice: expected dict of mixin methods to callbacks');
        });
      });

      it('should expect functions as values in method advice', () => {
        [
          {method_1: 1},
          {
            method_1: true,
            method_2: new Function(),
          },
          {method_1: null},
          {method_1: 'string'},
        ].forEach(pre_method_advice => {
          expect(() => {
            mix({}, this.mixin, {pre_method_advice});
          }).to.throw(TypeError, "pre_method_advice for method_1 isn't a function");
        });
      });

      it('should expect methods that are in the mixin', () => {
        [
          {
            pre_method_advice: {
              baz: new Function(),    // valid method
              non_existent_method_1: new Function(),  // invalid
              non_existent_method_2: new Function(),  // invalid
            },
            not_in_mixin: 'non_existent_method_1',
          },
          {
            pre_method_advice: {
              baz: new Function(), // valid method
              foo: new Function(), // non-method property
            },
            not_in_mixin: 'foo',
          },
        ].forEach(fixture => {
          let {pre_method_advice, not_in_mixin} = fixture;
          expect(() => {
            mix({}, this.mixin, {pre_method_advice});
          }).to.throw(`${not_in_mixin} isn't a method on ${this.mixin}`);
        });
      });

      it('should call pre_method_advice before the method on the target', () => {
        stub(this.mixin, 'baz', value => {
          return [value];
        });

        let options = {
          pre_method_advice: {
            baz() {
              return 'before_baz';
            },
          },
        };
        spy(options.pre_method_advice, 'baz');

        let target = {};
        mix(target, this.mixin, options);

        expect(target.baz()).to.deep.equal(['before_baz']);
        expect(options.pre_method_advice.baz.calledOn(target)).to.be.true;
      });

      it('should call post_method_advice after the method on the target', () => {
        stub(this.mixin, 'baz', baz => {
          return ['baz'];
        });

        let options = {
          post_method_advice: {
            baz(baz) {
              return baz.concat(['after_baz']);
            },
          },
        };
        spy(options.post_method_advice, 'baz');

        let target = {};
        mix(target, this.mixin, options);

        expect(target.baz()).to.deep.equal(['baz', 'after_baz']);
        expect(options.post_method_advice.baz.calledOn(target)).to.be.true;
      });

    });

  });

});

