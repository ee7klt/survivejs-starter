const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const stylelint = require('stylelint');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};


process.env.BABEL_ENV = TARGET;
const common = {
  entry: {
    app: PATHS.app
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      // connect eslint to webpack so that it can emit ESLInt messages for us
      loaders: ['eslint'],
      include: PATHS.app
    },
    {
      test: /\.css$/,
      loaders: ['postcss'],
      include: PATHS.app,
    }
    ],
    postcss: function() {
      return [stylelint({
        rules: {
          'color-hex-case': 'lower'
        }
      })]
    },
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        loaders:['babel?cacheDirectory'],
        include: PATHS.app
      }
    ]
  }
}

// run this if webpack is called outside npm_lifecycle_event

if (TARGET === 'start' || !TARGET) {
  // module.exports = merge(common, {});
  // Hot module replacement
  //  connect bundle running in-memory
  //  inline: webpack generates client portion

// merge will concat objects
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,
      hitoryApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true
      })
    ]
  })
}

if (TARGET === 'build') {
  module.exports = merge(common, {});



}
