#!/usr/bin/env node --harmony_default_parameters
'use strict';

const program = require('commander')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const ImageMerge = require('./src/image-merge')
const _ = require('lodash')

let files = []
let errors = []

program
  .version('1.0.2')
  .arguments('[file...]')
  .option('-o, --output <filename>', 'output file path')
  .option('-d, --direction <type>', 'indicate merge image direction, option values: [horizontal, vertical], default is [vertical]', /^(horizontal|vertical)$/i, 'vertical')
  .option('--dir <dir>', 'input directory')
  .option('--background <color>', 'fill background with [#FFFFFF]', '#FFFFFF')
  .option('--maxWidth <maxWidth>', 'max width [0]', '0')
  .option('--maxHeight <maxHeight>', 'max height [0]', '0')
  .action((_files) => {
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
    // process.exit(1)
  })
  .parse(process.argv);

let dir = program.dir
if (dir) {
  dir = path.isAbsolute(dir) ? path.normalize(dir) : path.normalize(path.join(__dirname, dir))
  if (!fs.existsSync(dir)) {
    errors.push(chalk.bold.red('Directory not exists: ') + dir)
  } else {
    files = files.concat(fs.readdirSync(dir).map(file => path.join(dir, file)))
  }
}

files = files.filter(file => {
  return ['.BMP', '.JPG', '.JPEG', '.PNG', '.GIF'].indexOf(path.extname(file).toUpperCase()) > -1
})

if (files.length === 0) {
  errors.push(chalk.bold.red('No file input!'))
}

let output = program.output

if (_.isEmpty(output)) {
  errors.push(chalk.bold.red('Output file path required! --output <path>'))
}

let background = program.background
// background = Number(background)

let direction = program.direction

if (errors.length > 0) {
  errors.forEach((error, index) => console.log((index + 1) + '. ' + error))
  program.outputHelp()
  process.exit(1)
}

let maxWidth = Number(program.maxWidth)
maxWidth = maxWidth > 0 ? maxWidth : 0
let maxHeight = Number(program.maxHeight)
maxHeight = maxHeight > 0 ? maxHeight : 0

ImageMerge(files, output, direction, background, maxWidth, maxHeight)
