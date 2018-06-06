var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpackConfig = {
  cache: true,
  debug: true,
  silent: true,
  devtool: 'eval',
  entry: [
     './src/app.js'
  ],
  output: {
    path: path.join(__dirname, "build"),
    filename: 'build.min.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loaders: ['react-hot', 'babel-loader?presets[]=es2015,presets[]=react'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader"),
        include: path.join(__dirname, "styles")

      },
      // Url loader for bootstrap
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("build.min.css"),
    new webpack.DefinePlugin({
      "process.env": {
         NODE_ENV: JSON.stringify("production")
       }
    })
  ]
};

if (process.env.NODE_ENV !== 'production') {
  webpackConfig.entry.unshift(
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080/'
  );
  webpackConfig.devtool = "eval-source-map"
}
else {
  webpackConfig.plugins.unshift(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  );
}

module.exports = webpackConfig
