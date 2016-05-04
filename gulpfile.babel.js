import gulp from 'gulp';
import del from 'del';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import size from 'gulp-size';
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import atImport from 'postcss-import';
import apply from 'postcss-apply';
import reporter from 'postcss-reporter';
import stylelint from 'stylelint';
import eslint from 'gulp-eslint';
import imagemin from 'gulp-imagemin';
import handlebars from 'gulp-compile-handlebars';
import uglify from 'gulp-uglify';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserSync from 'browser-sync';
import paths from './paths';

const bs = browserSync.create();

// Styles
/////////////////////////

const styles = function () {
  const processors = [ atImport, cssnext, apply ];

  return gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(postcss(processors))
    .pipe(size({
      showFiles: true,
      gzip: true,
    }))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(bs.stream());
};

// Scripts
/////////////////////////

const bundler = watchify(browserify(paths.js.src, watchify.args));

function bundle() {
  return bundler
    .transform(babelify)
    .bundle()
    .pipe(source('./bundle.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(size({
        showFiles: true,
        gzip: true,
      }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(bs.stream());
}

bundler.on('update', bundle);

const scripts = bundle;

// Templates
/////////////////////////

const templates = () => {
  const options = {
    ignorePartials: true,
    batch: [paths.views.components],
  };

  const hbsConfig = {
    base: './',
  };

  return gulp.src([paths.views.src, paths.views.ignore])
    .pipe(plumber())
    .pipe(handlebars(hbsConfig, options))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(`${paths.build}/`))
    .pipe(bs.stream({ once: true }));
};

// Image Processing
/////////////////////////

const images = () => {
  return gulp.src(paths.img.src)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
    }))
    .pipe(size({
      showFiles: true,
      gzip: true,
    }))
    .pipe(gulp.dest(paths.img.dest));
};

// Linting
/////////////////////////

// Lint Styles
const lintStyles = () => {
  return gulp.src(paths.css.all)
    .pipe(postcss([ stylelint, reporter({ clearMessages: true }) ]));
};

// Lint Scripts
const lintScripts = () => {
  return gulp.src(paths.js.src)
    .pipe(eslint())
    .pipe(eslint.failAfterError());
};

const lint = gulp.series(lintStyles, lintScripts);

// Clean Build Directory
/////////////////////////

const clean = () => del(paths.build);

// Server
/////////////////////////

const connect = () => bs.init({
  server: {
    baseDir: paths.build,
  },
});

// Watch
/////////////////////////

const watch = () => {
  gulp.watch(paths.css.all, styles);
  gulp.watch(paths.js.all, scripts);
  gulp.watch(paths.views.all, templates);
  gulp.watch(paths.img.src, images);
};

// Exports Functions as Proper Tasks

export { clean, templates, styles, scripts, images, lint, watch, connect };

// Default Tasks
/////////////////////////

const build = gulp.series(clean, gulp.parallel(templates, styles, scripts, images));
const all = gulp.series(build, gulp.parallel(lint, connect, watch));

export default all;
