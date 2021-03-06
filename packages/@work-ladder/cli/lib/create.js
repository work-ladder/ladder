const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const validateNpmPackageName = require('validate-npm-package-name')
const { log, chalk } = require('@work-ladder/cli-shared-utils')
const Creator = require('./generator/Creator')

const create = async (projectName, options) => {
  const cwd = options.cwd || process.cwd()
  const destDir = path.resolve(cwd, projectName)

  const isValidate = validateNpmPackageName(projectName)

  // 判断项目名是否符合规范
  if (!isValidate.validForNewPackages) {
    log(`Invalid project name: "${projectName}", causes of this:`, 'red')
    if (isValidate.errors && isValidate.errors.length > 0) {
      log(`reason: ${isValidate.errors.join('')}`, 'red')
    }
    if (isValidate.warnings && isValidate.warnings.length > 0) {
      log(`reason: ${isValidate.warnings.join('')}`, 'yellow')
    }
    process.exit(1)
  }

  // 判断项目是否有重名的文件夹
  const isProjectExist = fs.existsSync(destDir)

  if (isProjectExist) {
    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: `Warning: 您的项目${chalk.cyan(
          projectName,
        )}已存在，您的操作会导致当前项目${projectName}被覆盖，确定？`,
      },
    ])

    if (!ok) {
      return
    }

    console.log(`\nWill removing ${chalk.cyan(destDir)}...`)
    await fs.remove(destDir)
  }
  const templatePath = '../template-base'
  const templateDir = path.resolve(__dirname, templatePath)
  const args = require(path.join(templateDir, 'prompt.js'))
  const promptArgs = await inquirer.prompt(args)

  const creator = new Creator(projectName, destDir, promptArgs)
  creator.create(options)
  // await fs.ensureDir(destDir);
}

// eslint-disable-next-line consistent-return
module.exports = function (...args) {
  try {
    return create(...args)
  } catch (e) {
    console.log(e)
  }
}
