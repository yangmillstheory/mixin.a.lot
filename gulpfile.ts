gulp = require 'gulp'

coffee = require 'gulp-coffee'
del = require 'del'


SRC =
  base: 'src'
  files: ->
    ["#{@base}/**/*.coffee"]

DIST =
  base: 'dist'
  files: ->
    [
      "#{@base}/**/*.js"
      "!#{@base}/**/*.spec.js"
      "!#{@base}/spec-utils/*"
    ]


gulp.task 'clean', (postDelete) ->
  del([DIST.base], force: true, postDelete)


gulp.task 'coffee', (done) ->
  gulp
    .src(SRC.files())
    .pipe(coffee(bare: true))
    .pipe(gulp.dest(DIST.base))
  done?()


gulp.task 'build', gulp.series('clean', 'coffee')