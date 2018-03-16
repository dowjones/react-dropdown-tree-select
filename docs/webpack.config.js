const path = require('path')

const baseConfig = {
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.css'],
    modules: ['node_modules']
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options: {
            localIdentName: 'react-dropdown-tree-select__[local]--[hash:base64:5]',
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader'
        }
      ],
      include: /src/
    }]
  },
  devServer: {
    contentBase: './docs',
    port: 3000,
    historyApiFallback: true,
    open: true,
    watchContentBase: true
  }
}

module.exports = [{
  ...baseConfig,
  entry: __dirname,
  output: {
    path: __dirname,
    filename: 'bundle.js'
  }
}, {
  ...baseConfig,
  entry: path.join(__dirname, 'examples/bootstrap'),
  output: {
    path: path.join(__dirname, 'examples/bootstrap'),
    filename: 'bundle.js'
  }
}, {
  ...baseConfig,
  entry: path.join(__dirname, 'examples/material'),
  output: {
    path: path.join(__dirname, 'examples/material'),
    filename: 'bundle.js'
  }
}, {
  ...baseConfig,
  entry: path.join(__dirname, 'examples/simple'),
  output: {
    path: path.join(__dirname, 'examples/simple'),
    filename: 'bundle.js'
  }
}]
