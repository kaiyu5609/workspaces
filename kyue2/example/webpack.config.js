const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',

  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    /**
     * __dirname: '/Volumes/Seagate/workspaces/kata_projects/my-rollup-ts/example'
     * dir: 'bar'
     * entry: '/Volumes/Seagate/workspaces/kata_projects/my-rollup-ts/example/bar/index.js'
     * 
     * entries: {
     *    bar: '/Volumes/Seagate/workspaces/kata_projects/my-rollup-ts/example/bar/index.js'
     * }
     */
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'index.js')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['webpack-hot-middleware/client?noInfo=true&reload=true', entry]
    }

    return entries
  }, {}),
  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },

  resolve: {
    alias: {
      // chart: '/Volumes/Seagate/workspaces/kata_projects/my-rollup-ts/dist/chart.js'
      Kyue: path.resolve(__dirname, '../dist/kyue.js'),
    }
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'kyue',
          filename: 'kyue.js',
          chunks: 'initial'
        }
      }
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]

}
