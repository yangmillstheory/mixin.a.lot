"use strict";
var gulp = require('gulp');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');
var del = require('del');
var mocha = require('gulp-mocha');


var typings = function() {
  return ['typings/tsd.d.ts', 'typings.d.ts'];
};

var SRC = {
  base: 'src',
  ts: function() {
    return [
      this.base + '/**/*.ts',
      '!' + this.base + '/**/*.spec.ts'
    ];
  },
  spec: function() {
    return [this.base + '/**/*.spec.ts']
  },
  all: function() {
    return this.ts().concat(this.spec())
  }
};

var BUILD = {
  base: 'build',
  js: function() {
    return [
      this.base + '/**/*.js',
      '!' + this.base + '/**/*.spec.js'
    ];
  },
  spec: function() {
    return [this.base + '/**/*.spec.js']
  }
};

var DIST = {base: 'dist'};

var TS_PROJECT = ts.createProject('tsconfig.json', {
  typescript: require('typescript'),
});

//////////
// compile
gulp.task('compile:ts', function() {
  return gulp
    .src(SRC.ts().concat(typings()), {base: SRC.base})
    .pipe(ts(TS_PROJECT))
    .js
    .pipe(gulp.dest(BUILD.base))
    .pipe(gulp.dest(DIST.base));
});

gulp.task('compile:spec', function() {
  return gulp
    .src(SRC.spec().concat(typings()))
    // swallow compiler errors/warnings, since we abuse the API here
    .pipe(ts(TS_PROJECT, undefined, ts.reporter.nullReporter))
    .js
    .pipe(gulp.dest(BUILD.base));
});

gulp.task('compile', gulp.series('compile:ts', 'compile:spec'));

///////
// lint
var tslint_stream = function(glob, rules) {
  return gulp.src(glob)
    .pipe(tslint({
      configuration: {
        tslint: require('tslint'),
        rules: rules,
      } 
    }))
    .pipe(tslint.report('verbose', {
      summarizeFailureOutput: true,
      emitError: false
    }));
};

gulp.task('lint:ts', function(done) {
  return tslint_stream(SRC.ts());
});

gulp.task('lint:spec', function(done) {
  return tslint_stream(SRC.spec(), {
    // tslint.json overrides
    'no-null-keyword': false,
  });
});

////////
// clean
gulp.task('clean', function(done) {
  del([
    DIST.base + '/**/*',
    BUILD.base + '/**/*'
  ], {force: true}, done);
});


///////
// test
gulp.task('test', function() {
  return gulp.src(BUILD.spec())
    .pipe(mocha({reporter: 'dot', ui: 'bdd'}));
});

gulp.task('lint', gulp.parallel('lint:ts', 'lint:spec'));

//////
// dev
gulp.task('watch', function() {
  gulp.watch(
    SRC.spec(), 
    gulp.series('compile:spec', 'lint:spec', 'test'));
  gulp.watch(
    SRC.ts(), 
    gulp.series('compile:ts', 'lint:ts', 'test'));
});

gulp.task('dev', gulp.series('compile', 'lint', 'watch'));

gulp.task('build', gulp.series(gulp.parallel('clean', 'compile'), 'lint'));
