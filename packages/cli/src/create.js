const { promisify } = require('util')
const inquirer = require('inquirer')
const ora = require('ora')
const axios = require('axios')
const downloadGit = require('download-git-repo')
const { downloadDirectory, copyTempToLocalhost } = require('./util/index')

const downloadGitAsync = promisify(downloadGit)

module.exports = async (projectName) => {
  // 链接 github 仓库
  const spinner = ora('正在链接远程模板')
  spinner.start()
  const { data: repos } = await axios
    .get('https://api.github.com/orgs/work-ladder/repos')
    .catch((err) => {
      console.log(err)
    })
  spinner.succeed()
  // 名字有 template 的才是模板
  const tempRepos = repos
    .filter((item) => item.name.includes('template'))
    .map((item) => item.name)
  const { repo } = await inquirer.prompt([
    {
      type: 'list',
      name: 'repo',
      message: '请选择',
      choices: tempRepos,
    },
  ])

  const project = `work-ladder/${repo}`

  // 下载项目到临时文件夹 C:\Users\lee\.myTemplate
  const dest = `${downloadDirectory}\\${repo}`
  // 把项目下载当对应的目录中
  try {
    console.log('开始下载项目')
    await downloadGitAsync(project, dest)
    console.log('项目下载完成')
  } catch (error) {
    console.log('下载项目发生错误:', error)
  }

  console.log('开始创建项目')
  // // 把项目从临时目录移到用户命令行位置
  await copyTempToLocalhost(dest, projectName)
  console.log('项目创建完成')
}
