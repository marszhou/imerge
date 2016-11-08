#!/usr/bin/env node
'use strict';

var program = require('commander');

program
  .version('0.0.1')
  .arguments('<file...>')
  .option('-o, --output <filename>', 'output file path')
  .option('-d, --direction <type>', 'indicate merge image direction, option values: [horizontal, vertical], default is [vertical]', /^(horizontal|vertical)$/i,'vertical')
  .option('--dir <dir>', 'input directory')
  .option('--background <color>', 'fill background with [0x000000]', '0x000000')
  .action((file) => {
    console.log(file, program.output, program.direction)
  })
  .parse(process.argv);

