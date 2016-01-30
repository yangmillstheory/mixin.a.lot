import {expect} from 'chai';
import {spy, stub} from 'sinon';
import {mix} from './index';
import {loggerMixin} from './spec-utils';
import {isString} from './utility';

describe('mixing', () => {

  it('should expect object literals for mixins', () => {
    [1, 'String', [], new Function()].forEach(function(thing) {
      expect(function() {
        mix({}, thing);
      }).to.throw(TypeError, 'Expected mixin to be an object literal');
    });
  });

  it('should expect objects for targets', () => {
    [1, 'string', true, null, undefined].forEach(function(target) {
      expect(function() {
        mix(target, loggerMixin());
      }).to.throw(TypeError, `Expected non-null object, got ${target}`);
    });
  });

  it('should mix into the target', () => {
    let target = {};
    let logger = loggerMixin();

    mix(target, logger);
    Object.getOwnPropertyNames(logger).forEach(function(key: string) {
      expect(target[key]).to.equal(logger[key]);
    });
  });

  it('should mix in order', () => {
    let mixin1 = {name: 'mixin1', foo: 'bar1', baz: 'qux'};
    let mixin2 = {name: 'mixin2', foo: 'bar2', qux: 'baz'};
    let target = {};

    mix(target, mixin1);
    mix(target, mixin2);

    expect(target.name).to.equal('mixin2');
    expect(target.foo).to.equal('bar2');
    expect(target.baz).to.equal('qux');
    expect(target.qux).to.equal('baz');
  });

  it('should overwrite existing properties', () => {
    expect(mix({name: 'foo'}, {name: 'bar'}).name).to.equal('bar');
  });

  it('should call mixin methods on the target context', () => {
    let mixin = {method: spy()};
    let target = {};

    mix(target, mixin);

    target.method();
    expect(target.method.calledOn(target)).to.be.true;
  });

  describe('mixing adapters', () => {

    it('should expect functions for mixing callbacks', () => {
      let mixin: IMixin = {
        name: 'mixin',
        premix: 1,
      };

      expect(function() {
        mix({}, mixin);
      }).to.throw(TypeError, 'Expected a function for premix');

      mixin = {
        name: 'mixin',
        postmix: [],
      };

      expect(function() {
        mix({}, mixin);
      }).to.throw(TypeError, 'Expected a function for postmix');
    });

    describe('premix', () => {

      it('should call it on the mixin with the target as a parameter', () => {
        let mixee = {
          logname: 1
        };
        let logger = loggerMixin({
          premix(target) {
            if (!isString(target.logname)) {
              throw new TypeError(`Expected string logname; got ${target.logname}`);
            }
          },
        });
        spy(logger, 'premix');

        expect(logger.log).to.exist;
        expect(function() {
          mix(mixee, logger);
        }).to.throw(`Expected string logname; got 1`);

        expect(logger.premix.calledOn(logger)).to.be.true;
        expect(logger.premix.calledWithExactly(mixee)).to.be.true;
        expect(mixee.log).not.to.exist; // nothing mixed in
      });

      it('should call it before mixing in', () => {
        // can't spy on "mixing in" part since that's internal to .mix()
        let error = new Error;
        let threw = false;
        let target = {};

        let logger = loggerMixin({
          premix: stub().throws(error)
        });
        expect(logger.log).to.exist;

        try {
          mix(target, logger);
        } catch (e) {
          threw = true;
        } finally {
          expect(threw).to.be.true;
          expect(target.log).not.to.exist; // wasn't mixed in!
        }
      });

      it('should not mix it into the target', () => {
        let target = {};
        let logger = loggerMixin({
          premix: spy()
        });

        mix(target, logger);

        expect(target.premix).not.to.exist;
        expect(target.log).to.exist;
      });

    });

    describe('postmix', () => {

      it('should call it on the mixin with the target as a parameter', () => {
        let mixee = {};
        let loggers = [];
        let logger = loggerMixin({
          postmix(target): void {
            loggers.push(target);
          },
        });
        spy(logger, 'postmix');

        mix(mixee, logger);

        expect(logger.postmix.calledOn(logger)).to.be.true;
        expect(logger.postmix.calledWithExactly(mixee)).to.be.true;

        expect(logger.log).to.exist; // mixing was successful
        expect(loggers).to.contain(mixee);
      });

      it('should call it after mixing in', () => {
        let error = new Error;
        let threw = false;
        let target = {};

        let mixin = loggerMixin({
          postmix: stub().throws(error)
        });
        expect(mixin.log).to.exist;

        try {
          mix(target, mixin);
        } catch (e) {
          threw = true;
        }
        expect(threw).to.be.true;
        expect(target.log).to.equal(mixin.log); // was mixed in before throwing
      });

      it('should not mix it into the target', () => {
        let target = {};
        let mixin = loggerMixin({
          postmix: new Function()
        });

        mix(target, mixin);

        expect(target.postmix).not.to.exist;
        expect(target.log).to.exist;
      });

    });

  });

  describe('mix options', () => {

    beforeEach(() => {
      this.logger = loggerMixin({
        errLog: '/logs/app.err',
        infLog: '/logs/app.log',
      });
    });

    describe('omitting mixin methods', () => {

      it('should omit some mixin keys', () => {
        let target = {};
        mix(target, this.logger, {omit: ['errLog', 'infLog']});

        expect(target.errLog).not.to.exist;
        expect(target.infLog).not.to.exist;
        expect(target.log).to.exist;
      });

      it('should expect a non-empty Array for omissions', () => {
        [[], {}, null, 1, 'String'].forEach(function(omit) {
          expect(function() {
            mix({}, this.logger, {omit});
          }).to.throw(TypeError, 'Expected omit option to be a nonempty Array');
        });
      });

      it('should expect omission keys that are in the mixin', () => {
        expect(function() {
          mix({}, this.logger, {omit: ['non_mixin_key']});
        }).to.throw("Some omit keys aren't in mixin: non_mixin_key");
      });

      it('should not change the prototype chain when omitting keys', () => {
        let target = {};

        target.__proto__ = {
          log() {
            return 'protolog';
          },
        };

        mix(target, this.logger, {omit: ['log']});

        expect(target.log).to.exist;
        expect(target.log()).to.equal('protolog');
      });

      it('should not omit all mixin keys', () => {
        expect(function() {
          mix({}, this.logger, {
            omit: Object.getOwnPropertyNames(this.logger)
          });
        }).to.throw('All mixin keys have been omitted!');
      });

    });

    describe('mixin method adapters', () => {

      it('should expect a map of mixin method names to functions', () => {
        ['String', 1, null, [], true].forEach(adapterTo => {
          expect(function() {
            mix({}, this.logger, {adapterTo});
          }).to.throw(
            TypeError,
            'adapterTo: expected dict of mixin methods to functions');
        });
      });

      it('should expect functions as values in method adapters', () => {
        [
          {log: 1},
          {log: true},
          {log: null},
          {log: 'string'},
        ].forEach(adapters => {
          expect(function() {
            mix({}, this.logger, {adapterTo: adapters});
          }).to.throw(TypeError, "adapterTo: value for log isn't a function");
          expect(function() {
            mix({}, this.logger, {adapterFrom: adapters});
          }).to.throw(TypeError, "adapterFrom: value for log isn't a function");
        });
      });

      it('should expect methods that are in the mixin', () => {
        interface IErrorFixture {
          adapters: Object;
          expectedError: string;
        }

        let fixtures: IErrorFixture[] = [
          {
            adapters: {
              log: new Function(),                  // valid method
              notMethod: new Function(),  // invalid - not in mixin
            },
            expectedError: `notMethod isn't a method on ${this.logger}`,
          },
          {
            adapters: {
              log: new Function(),     // valid method
              errLog: new Function(), // non-function property
            },
            expectedError: `errLog isn't a method on ${this.logger}`,
          },
        ];

        fixtures.forEach(function(fixture: IErrorFixture) {
          expect(function() {
            mix({}, this.logger, {
              adapterTo: fixture.adapters
            });
          }).to.throw(fixture.expectedError);
          expect(function() {
            mix({}, this.logger, {
              adapterFrom: fixture.adapters
            });
          }).to.throw(fixture.expectedError);
        });
      });

      describe('adapters', () => {

        beforeEach(() => {
          this.mockConsole = {
            info: spy(),
            error: spy(),
            log: spy(),
          };
        });

        describe('adapterTo', () => {

          it('should be called on the target before the mixin method', () => {
            let target = {};
            let prelog = spy();

            spy(this.logger, 'log');

            mix(target, this.logger, {
              adapterTo: {
                log: prelog
              },
            });

            target.log();

            expect(this.logger.log.calledOnce).to.be.true;
            expect(prelog.calledOnce).to.be.true;

            expect(prelog.calledOn(target)).to.be.true;
            expect(prelog.calledBefore(this.logger.log)).to.be.true;
          });

          it('should be an adapter to the mixin method', () => {
            let mockConsole = this.mockConsole;
            let options: IMixOptions = {
              adapterTo: {
                // prefix every message with ERROR or INFO
                log(error: Error, message: string): string {
                  if (error) {
                    if (!message) {
                      message = error.message;
                    }
                    return `ERROR:${message}`;
                  }
                  return `INFO:${message}`;
                },
              },
            };

            stub(this.logger, 'log', function(message: string): void {
              mockConsole.log(`${this.logname}:${message}`);
            });

            let target = {
              logname: 'prefixLogger'
            };
            mix(target, this.logger, options);

            target.log(null, 'A-OK.');
            expect(mockConsole.log.calledWithExactly('prefixLogger:INFO:A-OK.'))
              .to.be.true;

            target.log(new Error('Uh oh.'));
            expect(mockConsole.log.calledWithExactly('prefixLogger:ERROR:Uh oh.'))
              .to.be.true;
          });

        });

        describe('adapterFrom', () => {

          it('should be called on the target after the mixin method', () => {
            let target = {};
            let postLog = spy();

            spy(this.logger, 'log');

            mix(target, this.logger, {
              adapterFrom: {
                log: postLog
              },
            });

            target.log();

            expect(this.logger.log.calledOnce).to.be.true;
            expect(postLog.calledOnce).to.be.true;

            expect(postLog.calledOn(target)).to.be.true;
            expect(postLog.calledAfter(this.logger.log)).to.be.true;
          });

          it('should adapt to the mixin method', () => {
            let mockConsole = this.mockConsole;
            interface ILogResult {
              error: boolean;
              message: string;
            }

            stub(
              this.logger,
              'log',
              function(error: Error, message: string): ILogResult {
                if (error && !message) {
                  message = error.message;
                }
                // ...
                // log to a file, e.g.
                // ...
                return {
                  error: !!error,
                  message,
                };
              });

            let options: IMixOptions = {
              adapterFrom: {
                // log to console, afterward
                log(logResult: ILogResult): void {
                  if (logResult.error) {
                    mockConsole.error(`${this.logname}:${logResult.message}`);
                  }
                  mockConsole.info(`${this.logname}:${logResult.message}`);
                },
              },
            };

            let target = {
              logname: 'consoleLogger'
            };
            mix(target, this.logger, options);

            target.log(null, 'Hello, World!');
            expect(mockConsole.info.calledWithExactly(
              'consoleLogger:Hello, World!')).to.be.true;

            target.log(new Error('Something bad happened.'));
            expect(mockConsole.error.calledWithExactly(
              'consoleLogger:Something bad happened.')).to.be.true;
          });

        });

        it('should chain adapters', () => {
          let mockConsole = this.mockConsole;

          let logger = loggerMixin({
            initialMessage: 'Hello, World!',

            log(message: string): string {
              message = `${message}::log`;
              mockConsole.log(message);
              return message;
            },
          });

          let options: IMixOptions = {
            adapterTo: {
              log(): string {
                let message = `${this.initialMessage}**info`;
                mockConsole.info(message);
                return message;
              },
            },

            adapterFrom: {
              log(message: string): string {
                message = `${message}++error`;
                mockConsole.error(message);
                return message;
              },
            },
          };

          spy(options.adapterTo, 'log');
          spy(options.adapterFrom, 'log');
          spy(logger, 'log');

          expect(mix({}, logger, options).log())
            .to.equal('Hello, World!**info::log++error');

          expect(mockConsole.info.calledBefore(mockConsole.log));
          expect(mockConsole.log.calledBefore(mockConsole.error));

          expect(
            options.adapterTo.log.calledBefore(logger.log)).to.be.true;
          expect(
            logger.log.calledBefore(options.adapterFrom.log)).to.be.true;
        });

      });

    });

  });

});
