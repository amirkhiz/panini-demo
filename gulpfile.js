'use strict';

const gulp = require('gulp');
const {
        fonts,
        images,
        javascript,
        pages,
        sass,
        server,
        watch
      } = require('./src/build-tasks/build');

gulp.task(
    'default',
    gulp.series(images, fonts, sass, javascript, pages, server, watch)
);

