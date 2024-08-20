'use strict';

import gulp from 'gulp';
import panini from 'panini';
import browser from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import uglifyEs from 'gulp-uglify-es';
import webpack from 'webpack-stream';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';

const uglify = uglifyEs.default;
const sass = gulpSass(dartSass);

export const tasks = {

  /**
   * @returns {*}
   */
  images () {
    return gulp.src('src/assets/images/**/*', { encoding: false })
      .pipe(gulp.dest('build/assets/images/'));
  },

  /**
   * @returns {*}
   */
  fonts () {
    return gulp.src(['src/assets/fonts/**/*', 'node_modules/@fortawesome/fontawesome-free/webfonts/**/*'], { encoding: false })
      .pipe(gulp.dest('build/assets/webfonts/'));
  },

  vendorCSS () {
    return gulp.src('src/assets/sass/vendor.scss')
      .pipe(sass({ silenceDeprecations: ['mixed-decls'], outputStyle: 'compressed' }))
      .pipe(concat('vendor.css'))
      .pipe(cleanCSS({
        inline: ['none']
      }))
      .pipe(gulp.dest('build/assets/css'));
  },

  /**
   * @returns {*}
   */
  sass () {
    return gulp.src('src/assets/sass/app.scss')
      .pipe(sass())
      .pipe(cleanCSS())
      .pipe(gulp.dest('build/assets/css'));
  },

  /**
   * @returns {*}
   */
  vendorJS () {
    return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
      'node_modules/sweetalert2/dist/sweetalert2.min.js',
      'node_modules/@fortawesome/fontawesome-free/js/fontawesome.min.js'
    ])
      .pipe(concat('vendor.js'))
      .pipe(uglify())
      .pipe(gulp.dest('build/assets/js'));
  },

  /**
   * @returns {*}
   */
  javascript () {
    return gulp.src(['src/assets/js/plugins/*.js', 'src/assets/js/app.js'])
      .pipe(webpack({ mode: 'production' }))
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(gulp.dest('build/assets/js'));
  },

  /**
   * Copy page templates into finished HTML files
   * @returns {*}
   */
  pages () {
    return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
      .pipe(panini({
        root: 'src/pages/',
        layouts: 'src/layouts/',
        partials: 'src/partials/',
        helpers: 'src/helpers/',
        data: 'src/data/'
      }))
      .pipe(gulp.dest('build'));
  },

  /**
   * Load updated HTML templates and partials into Panini
   * @param done
   */
  resetPages (done) {
    panini.refresh();
    done();
  },

  /**
   * Reload the browser with BrowserSync
   * @param done
   */
  reload (done) {
    browser.reload();

    done();
  },

  /**
   * Start a server with BrowserSync to preview the site in
   * @param done
   */
  server (done) {
    browser.init(
      {
        server: 'build',
        port: '3300'
      },
      done
    );
  },

  /**
   * Watch tasks
   */
  watch () {
    gulp
      .watch('./src/assets/sass/*.scss')
      .on('all', gulp.series(tasks.sass, tasks.reload));
    gulp
      .watch('./src/assets/js/**/*.js')
      .on('all', gulp.series(tasks.javascript, tasks.reload));
    gulp.watch('src/pages/**/*.html').on(
      'all',
      gulp.series(tasks.pages, tasks.reload)
    );
    gulp
      .watch(
        './src/{layouts,partials,helpers,data}/**/*'
      )
      .on('all', gulp.series(tasks.resetPages, tasks.pages, tasks.reload));
  },
};

export const defaultTasks = () => {
  return gulp.series(tasks.vendorJS, tasks.javascript, tasks.vendorCSS, tasks.sass, tasks.images, tasks.fonts, tasks.pages, tasks.server, tasks.watch);
};

export const buildTasks = () => {
  return gulp.series(tasks.vendorJS, tasks.javascript, tasks.vendorCSS, tasks.sass, tasks.images, tasks.fonts, tasks.pages);
};
