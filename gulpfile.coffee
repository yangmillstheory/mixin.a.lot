gulp = require 'gulp'

coffee = require 'gulp-coffee'
del = require 'del'

SRC = 'src'
DEST = 'dist'
SPEC = 'spec'


gulp.task 'clean', (postDelete) ->
  del(DEST, force: true, postDelete?())

gulp.task 'coffee:src', ->
  gulp
    .src("#{SRC}/**/*.coffee")
    .pipe(coffee(bare: true))
    .pipe(gulp.dest(DEST))

gulp.task 'coffee:spec', ->
  gulp
    .src("#{SPEC}/**/*.spec.coffee")
    .pipe(coffee(bare: true))
    .pipe(gulp.dest(SPEC))

gulp.task 'coffee', gulp.parallel('coffee:src', 'coffee:spec')

gulp.task 'unittest', ->
