const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    'react-dropdown-tree-select': './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js',
    libraryTarget: 'umd',
    library: 'ReactDropdownTreeSelect',
    umdNamedDefine: true
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new ExtractTextPlugin('styles.min.css'),
    new webpack
      .optimize
      .UglifyJsPlugin({sourceMap: true, exclude: /node_modules/}),
    new UnminifiedWebpackPlugin(),
    new BundleAnalyzerPlugin({analyzerMode: 'static', openAnalyzer: false})
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                localIdentName: 'react-dropdown-tree-select__[local]--[hash:base64:5]',
                importLoaders: 1,
                minimize: true
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        }),
        include: /src/,
        exclude: /node_modules/
      }
    ]
  }
}
