gulp = require 'gulp'

coffee = require 'gulp-coffee'
del = require 'del'

SRC = 'src'
DIST = 'dist'
SPEC = 'spec'


gulp.task 'clean', (postDelete) ->
  del([DIST, "#{SPEC}/**/*.spec.js"], force: true, postDelete?())

gulp.task 'coffee:src', ->
  gulp
    .src("#{SRC}/**/*.coffee")
    .pipe(coffee(bare: true))
    .pipe(gulp.dest(DIST))

gulp.task 'coffee:spec', ->
  gulp
    .src("#{SPEC}/**/*.coffee")
    .pipe(coffee(bare: true))
    .pipe(gulp.dest(SPEC))

gulp.task 'coffee', gulp.parallel('coffee:src', 'coffee:spec')

gulp.task 'unittest', ->
