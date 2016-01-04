"use strict";
let gulp = require('gulp');
let tslint = require('gulp-tslint');
let ts = require('gulp-typescript');
let del = require('del');
let mocha = require('gulp-mocha');


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
  },
  all() {
    return this.ts().concat(this.spec())
  }
};

const BUILD = {
  base: 'build',
  js() {
    return [
      `${this.base}/**/*.js`,
      `!${this.base}/**/*.spec.js`
    ];
  },
  spec() {
    return [`${this.base}/**/*.spec.js`]
  }
};

const DIST = {base: 'dist'};

const TS_PROJECT = ts.createProject('tsconfig.json', {
  typescript: require('typescript'),
});

//////////
// compile
gulp.task('compile:ts', () => {
  return gulp
    .src(SRC.ts())
    .pipe(ts(TS_PROJECT))
    .js
    .pipe(gulp.dest(BUILD.base))
    .pipe(gulp.dest(DIST.base));
});

gulp.task('compile:spec', () => {
  return gulp
    .src(SRC.spec())
    // swallow compiler errors/warnings, since we abuse the API here
    .pipe(ts(TS_PROJECT, undefined, ts.reporter.nullReporter))
    .js
    .pipe(gulp.dest(BUILD.base));
});

gulp.task('compile', gulp.series('compile:ts', 'compile:spec'));

///////
// lint
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

gulp.task('lint:ts', (done) => {
  return tslint_stream(SRC.ts());
});

gulp.task('lint:spec', (done) => {
  return tslint_stream(SRC.spec(), {
    // tslint.json overrides
    'no-null-keyword': false,
  });
});

////////
// clean
gulp.task('clean', (done) => {
  del([
    `${DIST.base}/**/*`,
    `${BUILD.base}/**/*`
  ], {force: true}, done);
});


///////
// test
gulp.task('test', () => {
  return gulp.src(BUILD.spec())
    .pipe(mocha({reporter: 'dot', ui: 'bdd'}));
});

gulp.task('lint', gulp.parallel('lint:ts', 'lint:spec'));

//////
// dev
gulp.task('watch', () => {
  gulp.watch(
    SRC.spec(), 
    gulp.series('compile:spec', 'lint:spec', 'test'));
  gulp.watch(
    SRC.ts(), 
    gulp.series('compile:ts', 'lint:ts', 'test'));
});

gulp.task('dev', gulp.series('compile', 'lint', 'watch'));

gulp.task('build', gulp.series(gulp.parallel('clean', 'compile'), 'lint'));
