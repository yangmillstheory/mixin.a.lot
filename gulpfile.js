"use strict";
let gulp = require('gulp');
let typescript = require('gulp-typescript');
let del = require('del');

let series = gulp.series, 
    parallel = gulp.parallel, 
    task = gulp.task;

task('compile', (done) => {
    console.log('compiling');
    done()
});

task('clean', (done) => {
    console.log('cleaning');
    done()
})

task('test', (done) => {
    console.log('testing');
    done()
});

task('lint', (done) => {
    console.log('linting');
    done()
});

task('build', series(parallel('clean', 'lint'), 'compile', 'test'));

// gulp = require 'gulp'

// coffee = require 'gulp-coffee'
// del = require 'del'


// SRC =
//   base: 'src'
//   files: ->
//     ["#{@base}/**/*.coffee"]

// DIST =
//   base: 'dist'
//   files: ->
//     [
//       "#{@base}/**/*.js"
//       "!#{@base}/**/*.spec.js"
//       "!#{@base}/spec-utils/*"
//     ]


// gulp.task 'clean', (postDelete) ->
//   del([DIST.base], force: true, postDelete)


// gulp.task 'coffee', (done) ->
//   gulp
//     .src(SRC.files())
//     .pipe(coffee(bare: true))
//     .pipe(gulp.dest(DIST.base))
//   done?()


// gulp.task 'build', gulp.series('clean', 'coffee')