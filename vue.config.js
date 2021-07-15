const path = require('path')
const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
  lintOnSave:false,
  publicPath: isDevelopment ? '/' : '/vue-ant-import/',
  outputDir: path.resolve(__dirname, './docs/'),
  css: { extract: isDevelopment },
  configureWebpack: {
    entry: './example/main.js',
    output: {
      libraryExport: 'default'
    }
  }
}
