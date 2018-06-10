const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const environment = process.env.NODE_ENV === 'production'
  ? require('./config/production')
  : require('./config/development');

const webpackConfig = {
  cache: true,
  debug: true,
  silent: true,
  devtool: 'eval',
  entry: [
    './src/app.js',
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'build.min.js',
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loaders: ['babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-0'],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
        include: path.join(__dirname, 'styles'),

      },
      // Url loader for bootstrap
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin('build.min.css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV === 'production' ? 'production' : 'development'),
      },
      ENVIRONMENT: Object.keys(environment).reduce((o, k) => {
        o[k] = JSON.stringify(environment[k]); // eslint-disable-line no-param-reassign
        return o;
      }, {}),
    }),
  ],
};

if (process.env.NODE_ENV !== 'production') {
  webpackConfig.entry.unshift(
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080/',
  );
  webpackConfig.devtool = 'eval-source-map';
} else {
  webpackConfig.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
  }));
}

module.exports = webpackConfig;
