const TokenType = Object.freeze({
  Keyword: 'Keyword',
  Identifier: 'Identifier',
  String: 'String',
  Number: 'Number',
  Symbol: 'Symbol',
  Newline: 'Newline',
  EOF: 'EOF'
});

const KEYWORDS = new Set([
  'set', 'work', 'import', 'export', 'if', 'else', 'while', 'for', 'in', 'true', 'false', 'nil'
]);

module.exports = { TokenType, KEYWORDS };
