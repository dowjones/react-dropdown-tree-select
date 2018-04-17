/* eslint-disable global-require */

module.exports = () => ({
  sourceMap: true,
  plugins: [
    require('postcss-import')(),
    require('postcss-nested')(),
    require('postcss-cssnext')({
      browsers: ['ie >= 10', 'last 2 versions'],
      warnForDuplicates: false
    })
  ]
})
