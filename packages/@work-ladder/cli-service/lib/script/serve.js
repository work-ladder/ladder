const {
  chalk, clearConsole, success, info, openBrowser,
} = require('@work-ladder/cli-shared-utils')
const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const webpackConfig = require('../webpack.config')
const prepareUrl = require('../utils/prepareUrl')

const defaults = {
  host: '0.0.0.0',
  port: 8000,
  https: false,
}

module.exports = function (options) {
  const compiler = webpack(webpackConfig)
  const server = new WebpackDevServer(compiler, {
    logLevel: 'silent',
    clientLogLevel: 'silent',
    inline: true,
  })

  let isFirstCompile = true

  const { host } = defaults
  const useHttps = defaults.https
  const { port } = defaults

  const protocol = useHttps ? 'https' : 'http'

  const url = prepareUrl(protocol, host, port)

  return new Promise((resolve, reject) => {
    // compile done
    compiler.hooks.done.tap('wlc-service serve', (stats) => {
      if (stats.hasErrors()) {
        return process.exit(1)
      }

      clearConsole()

      success('编译成功！')

      console.log()
      console.log('  应用本地开发模式已启动:')
      console.log(`  - 本地地址:   ${chalk.cyan(url.localUrlForTerminal)}`)
      console.log(`  - 局域网地址: ${chalk.cyan(url.lanUrlForTerminal)}`)

      // open browser
      if (isFirstCompile) {
        isFirstCompile = false

        const browserLocalUrl = url.localUrlForBrowser
        openBrowser(browserLocalUrl)
      }
    })

    // before Compile
    compiler.hooks.beforeCompile.tap('wlc-service serve', () => {
      console.log()
      info('准备开始编译...')
    })

    server.listen(defaults.port, defaults.host, (err) => {
      if (!err) {
        reject(err)
      }

      console.log(chalk.cyan('开发服务正在启动......\n'))
    })

    resolve({
      server,
      url,
    })
  })
}
