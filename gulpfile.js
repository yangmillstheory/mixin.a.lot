"use strict";
let gulp = require('gulp');
let tslint = require('gulp-tslint');
let del = require('del');
let child_process = require('child_process');
let karma = require('karma');
let _ = require('lodash');

let series = gulp.series;
let parallel = gulp.parallel;
let task = gulp.task;

const SRC = {base: 'src'};
const DIST = {base: 'dist'};


task('compile', (done) => {
  child_process.exec('node_modules/.bin/tsc', done);
});

task('clean', (done) => {
  del([`${DIST.base}/**/*`], {force: true}, done);
});

task('test', (done) => {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

let tslint_stream = (glob, rules) => {
  let configuration = {
    tslint: require('tslint')
  };
  if (rules) {
    _.assign(configuration, rules);
  }
  return gulp.src(glob)
    .pipe(tslint({configuration}))
    .pipe(tslint.report('verbose', {
        summarizeFailureOutput: true,
        emitError: false
    }));
}

task('lint:ts', (done) => {
  return tslint_stream(`${SRC.base}/**/!(*spec).ts`);
});

task('lint:spec', (done) => {
  let rules = _.merge(require('./tslint.json'), {
    'rules': {

    }
  });
  return tslint_stream(`${SRC.base}/**/*.spec.ts`, rules);
});

task('lint', parallel('lint:ts', 'lint:spec'));

task('build', series(parallel('clean', 'lint'), 'compile', 'test'));
