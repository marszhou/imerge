#!/usr/bin/env node
'use strict';

const program = require('commander')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const ImageMerge = require('./src/image-merge')

program
  .version('0.0.1')
  .arguments('<file...>')
  .option('-o, --output <filename>', 'output file path')
  .option('-d, --direction <type>', 'indicate merge image direction, option values: [horizontal, vertical], default is [vertical]', /^(horizontal|vertical)$/i,'vertical')
  .option('--dir <dir>', 'input directory')
  .option('--background <color>', 'fill background with [0x000000]', '0x000000')
  .action((_files) => {
    // console.log(file, program.output, program.direction)
    let files = []
    let errors = []
    if (_files.length > 0) {
      _files.forEach(file => {
        let _path = file
        if (!path.isAbsolute(_path)) {
          _path = path.normalize(path.join(__dirname, _path))
        }
        let _exists = fs.existsSync(_path)
        if (_exists) {
          files.push(_path)
        } else {
          errors.push(chalk.bold.red('File not exists: ') + _path)
        }
      })
    }

    let dir = program.dir
    if (dir) {
      dir = path.isAbsolute(dir) ? path.normalize(dir) : path.normalize(path.join(__dirname, dir))
      if (!fs.existsSync(dir)) {
        errors.push(chalk.bold.red('Directory not exists: ') + dir)
      } else {
        files = files.concat(fs.readdirSync(dir).map(file => path.join(dir, file)))
      }
    }

    if (errors.length > 0) {
      console.log(errors.join('\n'))
      program.outputHelp()
      process.exit(1)
    }
    // console.log(__dirname, __filename)
    console.log(files)
  })
  .parse(process.argv);

