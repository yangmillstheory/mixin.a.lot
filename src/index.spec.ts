import {expect} from 'chai';
import {spy, stub} from 'sinon';
import {mix} from './index';
import {logger_mixin} from './spec-utils';
import {is_string} from './utility';

describe('mixing', () => {

  it('should expect plain old javascript objects', () => {
    [1, 'String', [], new Function()].forEach(thing => {
      expect(() => {
        mix({}, thing);
      }).to.throw(TypeError, 'Expected mixin to be an object literal');
    });
  });

  it('should expect objects or function targets', () => {
    [1, 'string', true, null, undefined].forEach(target => {
      expect(() => {
        mix(target, logger_mixin());
      }).to.throw(TypeError, `Expected non-null object or function, got ${target}`);
    });
  });

  it('should mix into the target', () => {
    let target = {};
    let logger = logger_mixin();

    mix(target, logger);
    Object.getOwnPropertyNames(logger).forEach((key: string) => {
      expect(target[key]).to.equal(logger[key]);
    });
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

  it('should call mixin methods on the target context', () => {
    let mixin = {method: spy()};
    let target = {};

    mix(target, mixin);

    target.method();
    expect(target.method.calledOn(target)).to.be.true;
  });

  describe('mixing adapters', () => {

    it('should expect functions as mixing adapters', () => {
      let mixin = logger_mixin();
      mixin.pre_mix = 1;

      expect(() => {
        mix({}, mixin);
      }).to.throw(TypeError, 'Expected a function for pre_mix');

      mixin = logger_mixin({
        post_mix: []
      });

      expect(() => {
        mix({}, mixin);
      }).to.throw(TypeError, 'Expected a function for post_mix');
    });

    describe('pre_mix', () => {

      it('should call it on the mixin with the target as a parameter', () => {
        let mixee = {logname: 1};
        let mixin = logger_mixin({
          pre_mix(target) {
            if (!is_string(target.logname)) {
              throw new TypeError(`Expected string logname; got ${target.logname}`);
            }
          },
        });
        spy(mixin, 'pre_mix');

        expect(() => {
          mix(mixee, mixin);
        }).to.throw(`Expected string logname; got 1`);

        expect(mixin.pre_mix.calledOn(mixin)).to.be.true;
        expect(mixin.pre_mix.calledWithExactly(mixee)).to.be.true;
        expect(mixee.log).not.to.exist; // nothing mixed in
      });

      it('should call it before mixing in', () => {
        // can't spy on "mixing in" part since that's internal to .mix()
        let error = new Error;
        let threw = false;
        let target = {};
        let pre_mix = stub();
        pre_mix.throws(error);

        let mixin = logger_mixin({pre_mix});
        expect(mixin.log).to.exist;

        try {
          mix(target, mixin);
        } catch (e) {
          threw = true;
        } finally {
          expect(threw).to.be.true;
          expect(target.log).not.to.exist; // wasn't mixed in!
        }
      });

      it('should not mix it into the target', () => {
        let target = {};
        let mixin = logger_mixin({
          pre_mix: spy()
        });

        mix(target, mixin);

        expect(target.pre_mix).to.be.undefined;
      });

    });

    describe('post_mix', () => {

      it('should call it on the mixin with the target as a parameter', () => {
        let mixee = {};
        let loggers = [];
        let mixin = logger_mixin({
          post_mix(target) {
            loggers.push(target);
          },
        });
        spy(mixin, 'post_mix');

        mix(mixee, mixin);

        expect(mixin.post_mix.calledOn(mixin)).to.be.true;
        expect(mixin.post_mix.calledWithExactly(mixee)).to.be.true;

        expect(mixin.log).to.exist; // mixing was successful
        expect(loggers).to.contain(mixee);
      });

      it('should call it after mixing in', () => {
        let error = new Error;
        let threw = false;
        let target = {};
        let post_mix = stub();
        post_mix.throws(error);

        let mixin = logger_mixin({post_mix});
        expect(mixin.log).to.exist;

        try {
          mix(target, mixin);
        } catch (e) {
          threw = true;
        } finally {
          expect(threw).to.be.true;
          expect(target.log).to.equal(mixin.log); // was mixed in before throwing
        }
      });

      it('should not mix it into the target', () => {
        let target = {};
        let mixin = logger_mixin({
          post_mix: new Function()
        });

        mix(target, mixin);

        expect(target.post_mix).to.be.undefined;
      });

    });

  });

  describe('mix options', () => {

    beforeEach(() => {
      this.mixin = logger_mixin({
        err_log: '/logs/app.err',
        inf_log: '/logs/app.log',
      });
    });

    describe('omitting mixin methods', () => {

      it('should omit some mixin keys', () => {
        let target = {};
        mix(target, this.mixin, {omit: ['err_log', 'inf_log']});

        expect(target.err_log).to.not.exist;
        expect(target.inf_log).to.not.exist;
        expect(target.log).to.exist;
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

      it('should not change the prototype chain when omitting keys', () => {
        let target = {};

        target.__proto__ = {
          log() {
            return 'protolog';
          },
        };

        mix(target, this.mixin, {omit: ['log']});

        expect(target.log).to.exist;
        expect(target.log()).to.equal('protolog');
      });

      it('should not omit all mixin keys', () => {
        expect(() => {
          mix({}, this.mixin, {omit: Object.getOwnPropertyNames(this.mixin)});
        }).to.throw('All mixin keys have been omitted!');
      });

    });

    describe('mixin method adapters', () => {

      it('should expect a map of mixin method names to functions', () => {
        ['String', 1, null, [], true].forEach(pre_adapters => {
          expect(() => {
            mix({}, this.mixin, {pre_adapters});
          }).to.throw(
            TypeError,
            'pre_adapters: expected dict of mixin methods to callbacks');
        });
      });

      it('should expect functions as values in method adapters', () => {
        [
          {log: 1},
          {log: true},
          {log: null},
          {log: 'string'},
        ].forEach(pre_adapters => {
          expect(() => {
            mix({}, this.mixin, {pre_adapters});
          }).to.throw(TypeError, "pre_adapters for log isn't a function");
        });
      });

      it('should expect methods that are in the mixin', () => {
        interface IErrorFixture {
          pre_adapters: Object;
          expected_error: string;
        }

        let fixtures: IErrorFixture[] = [
          {
            pre_adapters: {
              log: new Function(),                  // valid method
              non_existent_method: new Function(),  // invalid - not in mixin
            },
            expected_error: `non_existent_method isn't a method on ${this.mixin}`,
          },
          {
            pre_adapters: {
              log: new Function(),     // valid method
              err_log: new Function(), // non-function property
            },
            expected_error: `err_log isn't a method on ${this.mixin}`,
          },
        ];

        fixtures.forEach((fixture: IErrorFixture) => {
          expect(() => {
            mix({}, this.mixin, {
              pre_adapters: fixture.pre_adapters
            });
          }).to.throw(fixture.expected_error);
        });
      });

      describe('adapters', () => {

        beforeEach(() => {
          this.mock_console = {
            info: spy(),
            error: spy(),
            log: spy(),
          };
        });

        describe('pre_adapters', () => {

          it('should be called on the target before the mixin method', () => {
            let target = {};
            let pre_adapters_spy = spy();

            spy(this.mixin, 'log');

            mix(target, this.mixin, {
              pre_adapters: {
                log: pre_adapters_spy
              },
            });

            target.log();

            expect(this.mixin.log.calledOnce).to.be.true;
            expect(pre_adapters_spy.calledOnce).to.be.true;
            expect(pre_adapters_spy.calledBefore(this.mixin.log)).to.be.true;
          });

          it('should be an adapter to the mixin method', () => {
            let mock_console = this.mock_console;
            let options: IMixOptions = {
              pre_adapters: {
                // prefix every message with ERROR or INFO
                log(error: Error, message: string): string {
                  if (error) {
                    return `ERROR:${message}`;
                  }
                  return `INFO:${message}`;
                },
              },
            };

            stub(this.mixin, 'log', function(message: string): void {
              mock_console.log(`${this.logname}:${message}`);
            });

            let target = {
              logname: 'prefix_logger'
            };
            mix(target, this.mixin, options);

            target.log(null, 'A-OK.');
            expect(mock_console.log.calledWithExactly('prefix_logger:INFO:A-OK.'))
              .to.be.true;

            target.log(new Error, 'Uh oh.');
            expect(mock_console.log.calledWithExactly('prefix_logger:ERROR:Uh oh.'))
              .to.be.true;
          });

        });

        describe('post_adapters', () => {

          it('should be called on the target after the mixin method', () => {
            let target = {};
            let post_adapters_spy = spy();

            spy(this.mixin, 'log');

            mix(target, this.mixin, {
              post_adapters: {
                log: post_adapters_spy
              },
            });

            target.log();

            expect(this.mixin.log.calledOnce).to.be.true;
            expect(post_adapters_spy.calledOnce).to.be.true;
            expect(post_adapters_spy.calledAfter(this.mixin.log)).to.be.true;
          });

          it('should adapt to the mixin method', () => {
            let mock_console = this.mock_console;
            interface ILogResult {
              error: boolean;
              message: string;
            }

            let options: IMixOptions = {
              post_adapters: {
                // log to console too
                log(log_result: ILogResult): void {
                  if (log_result.error) {
                    mock_console.error(log_result.message);
                  }
                  mock_console.info(log_result.message);
                },
              },
            };

            stub(
              this.mixin,
              'log',
              function(error: Error, message: string): ILogResult {
                mock_console.log(`${this.logname}:${message}`);
                return {
                  error: !!error,
                  message,
                };
              });

            let target = {
              logname: 'console_logger'
            };
            mix(target, this.mixin, options);

            target.log(null, 'Hello, World!');
            expect(mock_console.info.calledWithExactly('Hello, World!'))
              .to.be.true;

            target.log(new Error, 'Something bad happened.');
            expect(mock_console.error.calledWithExactly('Something bad happened.'))
              .to.be.true;
          });

        });

        it('should chain adapters', () => {
          let mock_console = this.mock_console;

          let mixin: IMixin = {
            initial_message: 'Hello, World!',

            log(message: string): string {
              message = `${message}::log`;
              mock_console.log(message);
              return message;
            },
          };

          let options: IMixOptions = {
            pre_adapters: {
              log(): string {
                let message = `${this.initial_message}**info`;
                mock_console.info(message);
                return message;
              },
            },

            post_adapters: {
              log(message: string): string {
                message = `${message}++error`;
                mock_console.error(message);
                return message;
              },
            },
          };

          spy(options.pre_adapters, 'log');
          spy(options.post_adapters, 'log');
          spy(mixin, 'log');

          expect(mix({}, mixin, options).log())
            .to.equal('Hello, World!**info::log++error');

          expect(mock_console.info.calledBefore(mock_console.log));
          expect(mock_console.log.calledBefore(mock_console.error));

          expect(
            options.pre_adapters.log.calledBefore(mixin.log)).to.be.true;
          expect(
            mixin.log.calledBefore(options.post_adapters.log)).to.be.true;
        });

      });

    });

  });

});

