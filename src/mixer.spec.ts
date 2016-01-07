import {noop} from './utility';
import {expect} from 'chai';
import {spy, stub} from 'sinon';
import {make_mixin, mix} from './index';
import {default_mixin_spec} from './spec-utils';

describe('mixing', () => {

  it('should expect Mixins', () => {
    [1, 'String', [], {}].forEach(non_Mixin => {
      expect(() => {
        mix({}, non_Mixin);
      }).to.throw(TypeError, 'Expected a Mixin instance');
    });
  });

  it('should expect valid targets', () => {
    [1, 'string', true, null, undefined].forEach(target => {
      expect(() => {
        mix(target, make_mixin(default_mixin_spec()));
      }).to.throw(TypeError, `Expected non-null object or function, got ${target}`);
    });
  });

  it('should mix into the target', () => {
    // need to stub the mixin spec;
    // it's tough to stub the mixin since it's immutable
    let mixin_spec = default_mixin_spec();
    stub(mixin_spec, 'baz').returns(['baz']);

    let mixin = make_mixin(mixin_spec);
    let target = {};

    mix(target, mixin);

    expect(target.bar).to.equal(1);
    expect(target.baz()).to.deep.equal(['baz']);
  });

  it('should be order-dependent', () => {
    let mixin_1 = make_mixin({name: 'mixin_1', foo: 'bar1', baz: 'qux'});
    let mixin_2 = make_mixin({name: 'mixin_2', foo: 'bar2', qux: 'baz'});
    let target = {};

    mix(target, mixin_1);
    mix(target, mixin_2);

    expect(target.foo).to.equal('bar2');
    expect(target.baz).to.equal('qux');
    expect(target.qux).to.equal('baz');
  });

  describe('mixing advice', () => {

    beforeEach(() => {
      this.mixin = make_mixin(default_mixin_spec());
    });

    it('should expect functions as mixing advice', () => {
      let mix_opts = {pre_mixing_advice: 1};

      expect(() => {
        mix({}, this.mixin, mix_opts);
      }).to.throw(TypeError, 'Expected a function for pre_mixing_advice');

      mix_opts = {post_mixing_advice: []};

      expect(() => {
        mix({}, this.mixin, mix_opts);
      }).to.throw(TypeError, 'Expected a function for post_mixing_advice');
    });

    describe('pre_mixing_advice', () => {

      it('should call an options pre-mixing advice on the target', () => {
        let mix_opts = {pre_mixing_advice: noop};
        spy(mix_opts, 'pre_mixing_advice');

        let target = {};
        mix(target, this.mixin, mix_opts, 'arg1', 'arg2');

        expect(mix_opts.pre_mixing_advice.calledWith('arg1', 'arg2')).to.be.ok;
        expect(mix_opts.pre_mixing_advice.calledOn(target)).to.be.ok;
      });

      it('should call an options pre-mixing advice before mixing in', () => {
        let mix_opts = {pre_mixing_advice: noop};
        let error = new Error;
        let threw = false;
        let target = {};

        stub(mix_opts, 'pre_mixing_advice').throws(error);
        expect(this.mixin.foo).to.exist;

        try {
          mix(target, this.mixin, mix_opts, 'arg1', 'arg2');
        } catch (e) {
          threw = true;
        } finally {
          expect(threw).to.be.ok;
          expect(target.foo).not.to.exist; // wasn't mixed in!
          expect(mix_opts.pre_mixing_advice.calledWith('arg1', 'arg2'));
        }
      });

    });

    describe('post_mixing_advice', () => {

      it('should call an options post-mixing advice on the target', () => {
        let mix_opts = {post_mixing_advice: noop};
        spy(mix_opts, 'post_mixing_advice');

        let target = {};
        mix(target, this.mixin, mix_opts, 'arg1', 'arg2');

        expect(mix_opts.post_mixing_advice.calledWith('arg1', 'arg2')).to.be.ok;
        expect(mix_opts.post_mixing_advice.calledOn(target)).to.be.ok;
      });

      it('should call an options post-mixing advice after mixing in', () => {
        let mix_opts = {post_mixing_advice: noop};
        let error = new Error;
        let threw = false;

        stub(mix_opts, 'post_mixing_advice').throws(error);
        expect(this.mixin.bar).to.equal(1);

        let target = {};

        try {
          mix(target, this.mixin, mix_opts, 'arg1', 'arg2');
        } catch (e) {
          threw = true;
        } finally {
          expect(threw).to.be.ok;
          expect(target.bar).to.equal(1);
        }
      });

    });

  });

  describe('mix options', () => {

    beforeEach(() => {
      // need to hold onto mixin_spec for stubbing;
      // it's tough to stub the mixin since it's immutable
      this.mixin_spec = default_mixin_spec();
      this.mixin = make_mixin(this.mixin_spec);
    });

    describe('omitting mixin methods', () => {

      it('should omit some mixin keys', () => {
        let target = {};
        mix(target, this.mixin, {omits: ['bar']});

        expect(target.bar).to.not.exist;
        expect(target.baz).to.exist;
      });

      it('should expect a non-empty Array for omissions', () => {
        [[], {}, null, 1, 'String'].forEach(omits => {
          expect(() => {
            mix({}, this.mixin, {omits});
          }).to.throw(TypeError, 'Expected omits option to be a nonempty Array');
        });
      });

      it('should expect omission keys that are in the mixin', () => {
        expect(() => {
          mix({}, this.mixin, {omits: ['non_mixin_key']});
        }).to.throw("Some omit keys aren't in mixin: non_mixin_key");
      });

      it('should not mangle the prototype hierarchy when omitting keys', () => {
        let target = {};
        target.__proto__ = Object.create({
          bar() {
            return 'protobar';
          },
        });

        mix(target, this.mixin, {omits: ['bar']});

        expect(target.bar).to.exist;
        expect(target.bar()).to.equal('protobar');
      });

      it('should not omit all mixin keys', () => {
        expect(() => {
          mix({}, this.mixin, {omits: ['bar', 'baz', 'foo']});
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
            method_2: noop,
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
              baz: noop,    // valid method
              non_existent_method_1: noop,  // invalid
              non_existent_method_2: noop,  // invalid
            },
            not_in_mixin: 'non_existent_method_1',
          },
          {
            pre_method_advice: {
              baz: noop, // valid method
              foo: noop, // non-method property
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
        stub(this.mixin_spec, 'baz', value => {
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
        expect(options.pre_method_advice.baz.calledOn(target)).to.be.ok;
      });

      it('should call post_method_advice after the method on the target', () => {
        stub(this.mixin_spec, 'baz', baz => {
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
        expect(options.post_method_advice.baz.calledOn(target)).to.be.ok;
      });

    });

  });

});

