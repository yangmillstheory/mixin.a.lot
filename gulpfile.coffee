gulp = require 'gulp'

coffee = require 'gulp-coffee'
del = require 'del'

SRC = 'src'
DIST = 'dist'
SPEC = 'spec'

SPEC_SRC = [
  "#{SRC}/util/spec/**/*.coffee"
  "#{SRC}/**/*.spec.coffee"
]


gulp.task 'clean', (postDelete) ->
  del([DIST, SPEC], force: true, postDelete?())

gulp.task 'coffee:src', ->
  # TODO: concatenate
  gulp
    .src([
      "#{SRC}/**/*.coffee"
    ].concat ("!#{glob}" for glob in SPEC_SRC))
    .pipe(coffee(bare: true))
    .pipe(gulp.dest(DIST))

gulp.task 'coffee:spec', ->
  gulp
    .src(SPEC_SRC, base: SRC)
    .pipe(coffee(bare: true))
    .pipe(gulp.dest(SPEC))

gulp.task 'coffee', gulp.parallel('coffee:src', 'coffee:spec')
gulp.task 'build', gulp.series('clean', 'coffee')

gulp.task 'unittest', ->
