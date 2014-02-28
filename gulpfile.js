(function() {
    'use strict';

    var gulp = require('gulp'),

        // Plugins
        bump = require('gulp-bump'),
        git = require('gulp-git'),
        roro = require('gulp-roro'),
        uglify = require('gulp-uglify'),
        concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        clean = require('gulp-clean'),
        minifyCSS = require('gulp-minify-css');

    var srcFiles = [
            "./src/Yv.Utils.js",
            "./src/Yv.Toggler.js",
            "./src/Yv.FastButton.js"
        ],
        fileName = 'Yv',
        cssDir = './css',
        cssFile = cssDir + '/Yv.css',
        distFolder = './dist';


    gulp.task('clean', function() {
        return gulp.src(distFolder, {read: false}).pipe(clean());
    });

    gulp.task('js', ['clean'], function() {
        return gulp.src(srcFiles)
            .pipe(concat(fileName + '.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(distFolder));
    });

    gulp.task('css', ['clean'], function() {
        var roroOptions = {
            browsers: ['last 2 versions', 'android 4'],
            dir: cssDir
        };
        gulp.src(cssFile)
            .pipe(roro(roroOptions))
            .pipe(rename({suffix: '.min'}))
            .pipe(minifyCSS())
            .pipe(gulp.dest(distFolder));
    });

    gulp.task('build', ['clean', 'js', 'css']);

    gulp.task('bump', ['build'], function() {
        return gulp.src('./package.json')
            .pipe(bump())
            .pipe(gulp.dest('./'));
    });

    gulp.task('tag', ['bump'], function() {
        var pkg = require('./package.json'),
            v = 'v' + pkg.version,
            message = 'Release ' + v;

        return gulp.src('./')
            .pipe(git.commit(message))
            .pipe(git.tag(v, message))
            .pipe(git.push('origin', 'master', '--tags'))
            .pipe(gulp.dest('./'));
    });
}());
