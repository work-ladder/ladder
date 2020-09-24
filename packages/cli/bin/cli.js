#!/usr/bin/env node
const path = require('path')
const { Command } = require('commander')
const chalk = require('chalk')
const pkg = require('../package.json')

const program = new Command()
program.version('0.0.1')

program
  .command('create <app>')
  .description('创建一个项目')
  .action(async (app, cmd) => {
    await require(path.join(__dirname, '../src/create'))(app)
  })

program.arguments('<command>').action((cmd) => {
  program.outputHelp()
  console.log(`${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`)
  console.log()
})

program.version(pkg.version).parse(process.argv)
