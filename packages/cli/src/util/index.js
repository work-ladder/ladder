const path = require('path')
const { promisify } = require('util')
const fs = require('fs')
const fse = require('fs-extra')
const MetalSmith = require('metalsmith')
const inquirer = require('inquirer')
const ncp = require('ncp')
const { render } = require('consolidate').ejs

const ncpAsync = promisify(ncp)
const renderAsync = promisify(render)

const downloadDirectory = `${
  process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']
}\\.work-ladder`

// 复制项目从临时文件到本地工作项目
const copyTempToLocalhost = async (target, projectName) => {
  const resolvePath = path.join(path.resolve(), projectName)
  // 模板如果有 prompt.js 表示是模板项目，需要进过 ejs 处理
  if (!fs.existsSync(path.join(target, 'prompt.js'))) {
    await ncpAsync(target, resolvePath)
    // 移除临时模板
    // fse.remove(target);
  } else {
    // 让用户填信息
    await new Promise((resolve, reject) => {
      MetalSmith(__dirname)
        .source(target) // 遍历目录
        .destination(resolvePath) // 最终编译好的文件存放位置
        .use(async (files, metal, done) => {
          const args = require(path.join(target, 'prompt.js'))
          const res = await inquirer.prompt(args)
          const met = metal.metadata()
          // 将询问的结果放到 metadata 中保证在下一个中间件中可以获取到
          Object.assign(met, res)
          delete files['prompt.js']
          done()
        })
        .use((files, metal, done) => {
          const res = metal.metadata()
          //  获取文件中的内容
          Reflect.ownKeys(files).forEach(async (file) => {
            //  文件是.js或者.json才是模板引擎
            if (file.includes('.js') || file.includes('.json')) {
              let content = files[file].contents.toString() // 文件内容
              //  我们将 ejs 模板引擎的内容找到 才编译
              if (content.includes('<%')) {
                content = await renderAsync(content, res)
                files[file].contents = Buffer.from(content) // 渲染
              }
            }
          })
          done()
        })
        .build((err) => {
          if (err) {
            reject()
          } else {
            resolve()
          }
        })
    })
  }
}

module.exports = {
  copyTempToLocalhost,
  downloadDirectory,
}
