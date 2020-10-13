const path = require('path')
const { error, chalk } = require('@work-ladder/cli-shared-utils')
const defaultsdeep = require('lodash.defaultsdeep')
const { defaults, schema } = require('./options')

function loadOptions(configPath) {
  let config = {}
  let configFileName = 'cs.config.js'
  for (let i = 0; i < configPath.length; i++) {
    try {
      const userConfig = require(configPath[i])
      configFileName = configPath[i].split('/').pop()

      if (typeof userConfig === 'function') {
        config = userConfig()
      }

      config = userConfig

      if (!config || typeof config !== 'object') {
        error(`错误加载配置 ${chalk.bold(configFileName)}: 应该是一个函数或是对象`)

        config = {}

        continue
      }

      return {
        config,
        configFileName,
      }
    } catch (e) {
      config = {}
    }
  }

  return {
    config,
    configFileName,
  }
}

module.exports = class Service {
  constructor(context) {
    this.context = context
  }

  run(command) {
    const resolveOptions = this.resolveUserOptions(defaults)

    if (['serve', 'build', 'test'].includes(command)) {
      const scriptPath = `./script/${command}`
      require(scriptPath)(resolveOptions)
        .then(() => {})
        .catch((e) => {
          console.log('命令执行错误:')
          console.log(e)
        })
    } else {
      console.log(`未知的命令(script): ${command}.`)
    }
  }

  /**
   * 获取用户 options 设置
   */
  resolveUserOptions(defaultOptions) {
    // config 有2种名字，优先级如下
    const optionsPath = [
      path.resolve(this.context, 'cs.config.js'),
      path.resolve(this.context, '.csrc.js'),
      path.resolve(this.context, 'work-ladder.config.js'),
    ]

    const { config: userOptions, configFileName } = loadOptions(optionsPath)

    const resolved = defaultsdeep(userOptions, defaultOptions)

    const { error: validateError } = schema.validate(resolved)

    if (validateError) {
      const msg = validateError.details
        ? validateError.details.map((e) => `${e.message}\n`).join('')
        : ''
      error(`在 ${chalk.bold(configFileName)} 参数类型配置错误: \n${msg}`)
    }

    return resolved
  }
}
