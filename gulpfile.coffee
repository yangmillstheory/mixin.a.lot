gulp = require 'gulp'

coffee = require 'gulp-coffee'
concat = require 'gulp-concat'

source = require 'vinyl-source-stream'
buffer = require 'vinyl-buffer'
uglify = require 'gulp-uglify'
sourcemaps = require 'gulp-sourcemaps'
browserify = require 'browserify'

del = require 'del'


SRC =
  base: 'src'
  files: ->
    ["#{@base}/**/*.coffee"]

DIST =
  base: "dist"
  main: "dist/server/index.js"

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


# implementation credit:
#
#   https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md
gulp.task 'browserify', ->
  browserify(entries: DIST.main, debug: true)
    .bundle()
    .pipe(source(DIST.CLIENT.file))
    .pipe(buffer())
    .pipe(sourcemaps.init loadMaps: true)
    .pipe(uglify())
    .pipe(sourcemaps.write './')
    .pipe(gulp.dest DIST.CLIENT.base)


gulp.task 'build', gulp.series('clean', 'coffee', 'browserify')