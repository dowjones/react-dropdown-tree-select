const path = require('path')

const baseConfig = {
  devtool: 'eval',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.css'],
    modules: ['node_modules'],
  },
  devServer: {
    static: {
      directory: __dirname,
    },
    open: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: 'url-loader',
          options: { limit: 100000 },
        },
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
    ],
  },
}

module.exports = [
  {
    ...baseConfig,
    entry: path.join(__dirname, 'src'),
    output: {
      path: __dirname,
      filename: 'bundle.js',
    },
  },
]
