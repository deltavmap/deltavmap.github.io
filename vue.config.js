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
  },
  pages: {
    index: {
      // entry for the page
      entry: 'src/pages/home/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Delta V Map',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    // subpage: 'src/subpage/main.js'
    calculators: {
      // entry for the page
      entry: 'src/pages/calculators/main.js',
      // the source template
      template: 'public/calculators.html',
      // output as dist/index.html
      filename: 'calculators.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Calculators | Delta V Map',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'calculators']
    }
  }
}
