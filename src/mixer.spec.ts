import * as _ from 'lodash';
import {make_mixin} from './mixin';
import {expect} from 'chai';
import {default_mixin} from './spec-utils';
import {mix} from './mixer';
import {spy, stub} from 'sinon';
// import {
//   not_implemented_error
// } from './errors';

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

  describe('mixing hooks', () => {

    beforeEach(() => {
      this.mixin = default_mixin();
    });

    it('should throw an error with non-Function options  mixing hooks', () => {
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

      it('should invoke an options pre-mixing hook', () => {
        let mix_opts = {pre_mixing_advice: _.noop};
        spy(mix_opts, 'pre_mixing_advice');

        let target = {};
        mix(target, this.mixin, mix_opts, 'arg1', 'arg2');

        expect(mix_opts.pre_mixing_advice.calledWith('arg1', 'arg2')).to.be.ok;
        expect(mix_opts.pre_mixing_advice.calledOn(target)).to.be.ok;
      });

      it('should invoke an options pre-mixing hook before mixing in', () => {
        let mix_opts = {pre_mixing_advice: _.noop};
        let error = new Error;
        let threw = false;
        let target = {};

        stub(mix_opts, 'pre_mixing_advice').throws(error);
        expect(this.mixin.foo).to.exist;

        try {
          mix(target, this.mixin, mix_opts, 'arg1', 'arg2');
        } catch (error) {
          threw = true;
        } finally {
          expect(threw).to.be.ok;
          expect(target.foo).not.to.exist; // wasn't mixed in!
          expect(mix_opts.pre_mixing_advice.calledWith('arg1', 'arg2'));
        }
      });

    });

  });

});
