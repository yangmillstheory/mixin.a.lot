gulp = require 'gulp'

coffee = require 'gulp-coffee'
symlink = require 'gulp-symlink'
del = require 'del'

SRC = 'src'
DIST = 'dist'
SPEC = 'spec'

SPEC_SRC = [
  "#{SRC}/util/spec.coffee"
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


gulp.task 'symlink', ->
  gulp
    .src("#{DIST}/**/*.js")
    .pipe(symlink (file) ->
      "#{file.path.replace "#{DIST}", SPEC}"
    )

gulp.task 'coffee', gulp.series('coffee:src', 'coffee:spec')
gulp.task 'build', gulp.series('clean', 'coffee', 'symlink')

gulp.task 'unittest', ->
