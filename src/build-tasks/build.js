'use strict';

const gulp = require('gulp');
const panini = require('panini');
const browser = require('browser-sync');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const webpack = require('webpack-stream');

const self = module.exports = {

  /**
   *
   * @returns {*}
   */
  images() {
    return gulp.src('src/assets/images/**/*').pipe(gulp.dest(
        'build/assets/images/'));
  },

  /**
   *
   * @returns {*}
   */
  fonts() {
    return gulp.src('src/assets/fonts/**/*').pipe(gulp.dest(
        'build/assets/fonts/'));
  },

  /**
   *
   * @returns {*}
   */
  sass() {
    return gulp.src('src/assets/sass/app.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('build/assets/css'));
  },

  /**
   * @returns {*}
   */
  javascript() {
    return gulp.src(['src/assets/js/plugins/*.js', 'src/assets/js/app.js'])
        .pipe(webpack({mode: 'production'}))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js'));
  },

  /**
   * Copy page templates into finished HTML files
   * @returns {*}
   */
  pages() {
    return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
        .pipe(panini({
                       root    : 'src/pages/',
                       layouts : 'src/layouts/',
                       partials: 'src/partials/',
                       helpers : 'src/helpers/',
                       data    : 'src/data/'
                     }))
        .pipe(gulp.dest('build'));
  },

  /**
   * Load updated HTML templates and partials into Panini
   * @param done
   */
  resetPages(done) {
    panini.refresh();
    done();
  },

  /**
   * Reload the browser with BrowserSync
   * @param done
   */
  reload(done) {
    browser.reload();

    done();
  },

  /**
   * Start a server with BrowserSync to preview the site in
   * @param done
   */
  server(done) {
    browser.init(
        {
          server: 'build',
          port  : '3300'
        },
        done
    );
  },

  /**
   * Watch tasks
   */
  watch() {
    gulp
        .watch('./src/assets/sass/*.scss')
        .on('all', gulp.series(self.sass, self.reload));
    gulp
        .watch('./src/assets/js/**/*.js')
        .on('all', gulp.series(self.javascript, self.reload));
    gulp.watch('src/pages/**/*.html').on(
        'all',
        gulp.series(self.pages, self.reload)
    );
    gulp
        .watch(
            './src/{layouts,partials,helpers,data}/**/*'
        )
        .on('all', gulp.series(self.resetPages, self.pages, self.reload));
  }
};