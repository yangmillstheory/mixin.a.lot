"use strict";
let gulp = require('gulp');
let tslint = require('gulp-tslint');
let del = require('del');
let child_process = require('child_process');
let karma = require('karma');
let _ = require('lodash');


let series = gulp.series; 
let parallel = gulp.parallel; 
let task = gulp.task;
    
const SRC = {
    base: 'src',
    ts() {
        return [
            `${this.base}/**/*.ts`,
            `!${this.base}/*.spec.ts`,
            `!${this.base}/spec-utils.ts`
        ];
    },
    spec() {
        return [
            `${this.base}/*.spec.ts`,
            `${this.base}/spec-utils.ts`
        ];
    }
};

const DIST = {base: 'dist'};
    
let do_tslint = (globs, options) => {
    if (!options) {
        options = {};
    }
    _.defaults(options, {
        emitError: false,
        summarizeFailureOutput: true
    })
    return gulp.src(globs)
        .pipe(tslint())
        .pipe(tslint.report("verbose", options));
};

task('compile', (done) => {
    child_process.exec('node_modules/.bin/tsc', done);
});

task('clean', (done) => {
    del([`${DIST.base}/**/*`], {force: true}, done);
});

task('test', (done) => {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

task('lint:ts', () => {
    return do_tslint(SRC.ts());
});

task('lint:spec', () => {
    return do_tslint(SRC.spec());
});

task('lint', parallel('lint:ts', 'lint:spec'));

task('build', series(parallel('clean', 'lint'), 'compile', 'test'));
