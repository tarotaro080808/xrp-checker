module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      swDest: 'service-worker.js'
    }
  }
}
