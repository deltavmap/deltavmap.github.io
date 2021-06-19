// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()]
  },
  lintOnSave: true,
  pwa: {
    name: 'DeltaVMap',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  }
}
