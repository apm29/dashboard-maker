'use strict'
const path = require('path')

const resolve = dir => path.resolve(__dirname, dir); //我这里为了方便直接引入了最里层
module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
    }
  }
}
