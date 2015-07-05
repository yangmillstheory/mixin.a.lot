gulp = require 'gulp'

coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
del = require 'del'


SRC =
  base: 'src'
  files: ->
    ["#{@base}/**/*.coffee"]

DIST =
  base: "dist"

  SERVER:
    base: 'dist/server'
    files: ->
      [
        "#{@base}/**/*.js"
        "!#{@base}/**/*.spec.js"
        "!#{@base}/spec-utils/*"
      ]
  CLIENT:
    base: 'dist/client'
    file: "mixin-a-lot.min.js"


gulp.task 'clean', (postDelete) ->
  del([DIST.base], force: true, postDelete)


gulp.task 'coffee', (done) ->
  gulp
    .src(SRC.files())
    .pipe(coffee(bare: true))
    .pipe(gulp.dest(DIST.SERVER.base))
  done?()


gulp.task 'browserify', ->
  gulp
    .src(DIST.SERVER.files())
    .pipe(concat DIST.CLIENT.file)
    .pipe(gulp.dest DIST.CLIENT.base)


gulp.task 'build', gulp.series('clean', 'coffee')