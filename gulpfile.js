"use strict";
let gulp = require('gulp');
let tslint = require('gulp-tslint');
let ts = require('gulp-typescript');
let del = require('del');
let child_process = require('child_process');
let karma = require('karma');


let series = gulp.series;
let parallel = gulp.parallel;
let task = gulp.task;

const SRC = {
  base: 'src',
  ts() {
    return [
      `${this.base}/**/*.ts`,
      `!${this.base}/**/*.spec.ts`
    ];
  },
  spec() {
    return [`${this.base}/**/*.spec.ts`]
  }
};
const DIST = {base: 'dist'};

let ts_project = ts.createProject('tsconfig.json', {
  typescript: require('typescript'),
});

task('compile:ts', () => {
  return gulp
    .src(SRC.ts())
    .pipe(ts(ts_project))
    .js.pipe(gulp.dest(DIST.base));
});

task('compile:spec', (done) => {
  return gulp
    .src(SRC.spec())
    .pipe(ts(ts_project, ts.reporter.nullReporter))
    .js.pipe(gulp.dest(DIST.base));
});

task('compile', parallel('compile:ts', 'compile:spec'))

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
    configuration.rules = rules;
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
  return tslint_stream(`${SRC.base}/**/*.spec.ts`, {
  });
});

task('lint', parallel('lint:ts', 'lint:spec'));

task('build', series(parallel('clean', 'lint'), 'compile', 'test'));
