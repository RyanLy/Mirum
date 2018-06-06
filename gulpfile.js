const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');
const stream = require('webpack-stream');

const path = {
  ALL: ['src/**/*.jsx', 'src/**/*.js'],
  CSS: ['styles/**/*.sass'],
  DEST_BUILD: 'dist/build',
};

gulp.task('webpack', [], () => gulp.src(path.ALL) // gulp looks for all source files under specified path
  .pipe(stream(webpackConfig)) // blend in the webpack config into the source files
  .pipe(gulp.dest(path.DEST_BUILD)));

gulp.task('index', () => gulp.src('index.html')
  .pipe(gulp.dest(path.DEST_BUILD)));

gulp.task('webpack-dev-server', () => {
  // modify some webpack config options
  const myConfig = Object.create(webpackConfig);
  new WebpackDevServer(webpack(myConfig), {
    publicPath: '/',
    hot: true,
    inline: true,
    stats: {
      colors: true,
    },
    historyApiFallback: {
      index: 'index.html',
    },
  }).listen(8080, 'localhost', (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

gulp.task('build', ['webpack', 'index']);

gulp.task('default', ['webpack-dev-server']);
