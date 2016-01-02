"use strict";
let gulp = require('gulp');
let ts = require('gulp-typescript');
let tslint = require('gulp-tslint');
let del = require('del');

let series = gulp.series, 
    parallel = gulp.parallel, 
    task = gulp.task;
    
const SRC = {
  base: 'src',
  files() {
    return [`${this.base}/**/*.ts`];
  }
};

const DIST = {base: 'dist'};
    
task('compile', () => {
    let project = ts.createProject('tsconfig.json');
    return project
        .src()
        .pipe(ts(project))
        .js.pipe(gulp.dest(DIST.base));
});

task('clean', (done) => {
    // async completion API
    del([`${DIST.base}/**/*`], {force: true}, done)
});

task('test', (done) => {
    console.log('testing');
    done()
});

task('lint', (done) => {
    return gulp
        .src(SRC.files().concat([
            '!**/*.spec.ts'
        ]))
        .pipe(tslint())
        .pipe(tslint.report("verbose"));
});

task('build', series(parallel('clean', 'lint'), 'compile', 'test'));
