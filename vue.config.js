module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },

    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : '/',

    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: true,
        includeLocales: false,
        enableBridge: true
      }
    }
}
