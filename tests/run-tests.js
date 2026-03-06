const assert = require('assert');
const { lex } = require('../src/lexer');
const { parse } = require('../src/parser');
const { compile } = require('../src/compiler');

const source = `set name = "SynX"\nwork greet(user) {\n  export "hi " .. user\n}\nprint(greet(name))\n`;

const tokens = lex(source);
assert(tokens.length > 5, 'lexer should produce tokens');

const ast = parse(tokens);
assert(ast.type === 'Program', 'parser should create program AST');
assert(ast.body.some((n) => n.type === 'Work'), 'parser should parse work declaration');

const { lua } = compile(source);
assert(lua.includes('local name = "SynX"'), 'compiler should map set -> local');
assert(lua.includes('function greet(user)'), 'compiler should map work -> function');
assert(lua.includes('return "hi " .. user'), 'compiler should map export -> return');

console.log('All tests passed.');
