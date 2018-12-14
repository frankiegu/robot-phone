'use strict'
const path = require('path')
const webpack = require('webpack')

//https://juejin.im/entry/5a41bea551882506e50ce3d1

module.exports = {
  // modules that you want to packing
  entry: {
    vendor: ['vue/dist/vue.esm.js', 'axios', 'vue-router', 'iview']
  },
  output: {
    path: path.join(__dirname, '../static/js'), // 打包后文件输出的位置
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library'
    }),
    // https://juejin.im/entry/5769f8dc128fe10057d2f4ae
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    // 压缩打包的文件
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
