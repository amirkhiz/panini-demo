'use strict';

import gulp from 'gulp';
import { buildTasks, defaultTasks } from './src/build-tasks/build.js';

gulp.task('default', defaultTasks());
gulp.task('build', buildTasks());

