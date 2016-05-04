const paths = {
  build: './dist',
  img: {
    src: './assets/images/**/*',
    dest: './dist/assets/images/'
  },
  views: {
    components: './views/partials/',
    src: './views/**/*.hbs',
    ignore: '!./views/partials/*.hbs',
    all: ['./views/**/*.hbs', './views/partials/*']
  },
  css: {
    src: './assets/styles/index.css',
    all: './assets/styles/**/*.css',
    dest: './dist/assets/styles/'
  },
  js: {
    src: './assets/scripts/global.js',
    all: './assets/scripts/**/*.js',
    dest: './dist/assets/scripts/'
  },
};

module.exports = paths;
