var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: __dirname + '/client',
  entry: {
    javascript: './app.jsx'
  },

  output: {
    filename: 'app.js',
    path: __dirname + '/dist',
    publicPath: '/dist/'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: [[
            'react-transform', {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module']
              }]
            }
          ]]
        }
      },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(html|png)$/, loader: 'file?name=[name].[ext]j' },
      { test: /\.css$/, loader: 'style!css' }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      devServer: 'http://localhost:8080/dist',
      template: './index.ejs',
      title: 'Transit Map',
      inject: 'body'
    }),
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ]
}
