const { lex } = require('./lexer');
const { parse } = require('./parser');
const { transpile } = require('./transpiler');

function compile(source) {
  const tokens = lex(source);
  const ast = parse(tokens);
  const lua = transpile(ast);
  return { tokens, ast, lua };
}

module.exports = { compile };
