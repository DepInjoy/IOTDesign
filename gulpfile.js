'use strict';
var path = require('path');
var gulp = require('gulp');
/*
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var coveralls = require('gulp-coveralls');
 */
var babel = require('gulp-babel');
//var shell = require('shelljs');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
// require('babel-core/register');

var handleErr = function (err) {
    console.log(err.message);
    process.exit(1);
};

gulp.task('pre-test', function () {
    return gulp.src(['./*.js'])
        .pipe(babel())
        .pipe(istanbul({includeUntested: true}))
        .pipe(istanbul.hookRequire());
});