const path = require('path')

const baseConfig = {
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.css'],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: './docs',
    port: 3000,
    historyApiFallback: true,
    open: true,
    watchContentBase: true
  }
}

module.exports = [
  {
    ...baseConfig,
    entry: path.join(__dirname, 'src'),
    output: {
      path: __dirname,
      filename: 'bundle.js'
    }
  }
]
