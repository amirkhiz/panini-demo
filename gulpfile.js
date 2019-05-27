'use strict';

const gulp = require('gulp');
const {sass, javascript, pages, server, watch} = require(
    './src/build-tasks/build');

gulp.task('panini', pages);

gulp.task('default', gulp.series(sass, javascript, 'panini', server, watch));

