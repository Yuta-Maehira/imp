module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "./src/assets/sass/prepends.scss";'
      }
    }
  },
  publicPath: '/influencer-marketing-tool/',
  outputDir: 'docs'
}
