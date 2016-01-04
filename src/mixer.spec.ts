import * as _ from 'lodash';
import {make_mixin} from './mixin';
import {expect} from 'chai';
import {default_mixin} from './spec-utils';
import {mix} from './mixer';
import {spy, stub} from 'sinon';

describe('mixing', () => {

  it('should throw an error when mixing non-Mixins', () => {
    [1, 'String', [], {}].forEach(non_Mixin => {
      expect(() => {
        mix({}, non_Mixin);
      }).to.throw(TypeError, 'Expected a Mixin instance');
    });
  });

  it('should throw an error when mixing into invalid targets', () => {
    [1, 'string', true, null, undefined].forEach(target => {
      expect(() => {
        mix(target, default_mixin());
      }).to.throw(TypeError, `Expected non-null object or function, got ${target}`);
    });
  });

  it('should mix into the target', () => {
    let mixin = default_mixin();
    let target = {};

    stub(mixin, 'baz').returns(['baz']);
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
      this.mixin = default_mixin();
    });

    it('should throw an error with non-Function options mixing advice', () => {
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

      it('should call an options pre-mixing advice', () => {
        let mix_opts = {pre_mixing_advice: _.noop};
        spy(mix_opts, 'pre_mixing_advice');

        let target = {};
        mix(target, this.mixin, mix_opts, 'arg1', 'arg2');

        expect(mix_opts.pre_mixing_advice.calledWith('arg1', 'arg2')).to.be.ok;
        expect(mix_opts.pre_mixing_advice.calledOn(target)).to.be.ok;
      });

      it('should call an options pre-mixing advice before mixing in', () => {
        let mix_opts = {pre_mixing_advice: _.noop};
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

      it('should call an options post-mixing advice with the target context', () => {
        let mix_opts = {post_mixing_advice: _.noop};
        spy(mix_opts, 'post_mixing_advice');

        let target = {};
        mix(target, this.mixin, mix_opts, 'arg1', 'arg2');

        expect(mix_opts.post_mixing_advice.calledWith('arg1', 'arg2')).to.be.ok;
        expect(mix_opts.post_mixing_advice.calledOn(target)).to.be.ok;
      });

      it('should call an options post-mixing advice after mixing in', () => {
        let mix_opts = {post_mixing_advice: _.noop};
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
      this.mixin = default_mixin();
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

      it('should throw an error when omitting a non-existing mixin key', () => {
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
            method_2: _.noop,
          },
          {method_1: null},
          {method_1: 'string'},
        ].forEach(pre_method_advice => {
          expect(() => {
            mix({}, this.mixin, {pre_method_advice});
          }).to.throw(TypeError, "pre_method_advice for method_1 isn't a function");
        });
      });

    });

  });

});

