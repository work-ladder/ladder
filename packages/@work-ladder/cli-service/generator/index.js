module.exports = (api) => {
  api.extendPackage({
    scripts: {
      start: 'wlc-service serve',
      build: 'wlc-service build',
    },
    dependencies: {
      react: '^16.13.0',
      'react-dom': '^16.13.0',
    },
    browserslist: ['> 1%', 'last 2 versions'],
  })
}
