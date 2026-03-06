#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { compile } = require('../src/compiler');

const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Usage: synxc <file.synx> [out.lua]');
  process.exit(1);
}

const source = fs.readFileSync(inputFile, 'utf8');
const { lua } = compile(source);

const outFile = process.argv[3] || inputFile.replace(/\.synx$/i, '.lua');
fs.writeFileSync(outFile, lua, 'utf8');
console.log(`Compiled ${path.basename(inputFile)} -> ${path.basename(outFile)}`);
