const { TokenType, KEYWORDS } = require('./token');

function lex(input) {
  const tokens = [];
  let i = 0;
  let line = 1;
  let col = 1;

  const push = (type, value) => tokens.push({ type, value, line, col });
  const advance = () => {
    const ch = input[i++];
    if (ch === '\n') {
      line += 1;
      col = 1;
    } else {
      col += 1;
    }
    return ch;
  };

  while (i < input.length) {
    const ch = input[i];

    if (ch === ' ' || ch === '\t' || ch === '\r') {
      advance();
      continue;
    }

    if (ch === '\n') {
      advance();
      push(TokenType.Newline, '\n');
      continue;
    }

    if (ch === '-' && input[i + 1] === '-') {
      while (i < input.length && input[i] !== '\n') advance();
      continue;
    }

    if (/[A-Za-z_]/.test(ch)) {
      const start = i;
      while (i < input.length && /[A-Za-z0-9_]/.test(input[i])) advance();
      const value = input.slice(start, i);
      push(KEYWORDS.has(value) ? TokenType.Keyword : TokenType.Identifier, value);
      continue;
    }

    if (/[0-9]/.test(ch)) {
      const start = i;
      while (i < input.length && /[0-9.]/.test(input[i])) advance();
      push(TokenType.Number, input.slice(start, i));
      continue;
    }

    if (ch === '"') {
      advance();
      const start = i;
      while (i < input.length && input[i] !== '"') advance();
      if (i >= input.length) throw new Error(`Unterminated string at ${line}:${col}`);
      const value = input.slice(start, i);
      advance();
      push(TokenType.String, value);
      continue;
    }

    const two = input.slice(i, i + 2);
    if (['==', '~=', '<=', '>=', '..'].includes(two)) {
      advance();
      advance();
      push(TokenType.Symbol, two);
      continue;
    }

    if ('{}(),[]=+-*/%^<>.'.includes(ch)) {
      advance();
      push(TokenType.Symbol, ch);
      continue;
    }

    throw new Error(`Unexpected character '${ch}' at ${line}:${col}`);
  }

  push(TokenType.EOF, 'EOF');
  return tokens;
}

module.exports = { lex };
