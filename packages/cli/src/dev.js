const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const open = require('open')
const path = require('path')
const args = require('minimist')(process.argv.slice(2))

const webpackConfig = require('./config/webpack.config')

const port = 3000

// 初始化一个启动器
const app = express()
const compiler = webpack(webpackConfig)
app.use(express.static(path.join(__dirname, '../')))
// 服务器
app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: '',
  }),
)

// 热加载
app.use(webpackHotMiddleware(compiler))
app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }
  const uri = `http://localhost:${port}`
  console.log(`Listening at ${uri}\n`)
  open(uri)
})
