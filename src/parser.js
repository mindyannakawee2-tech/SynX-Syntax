const { TokenType } = require('./token');

function parse(tokens) {
  let i = 0;

  const peek = () => tokens[i];
  const next = () => tokens[i++];
  const at = (type, value) => peek().type === type && (value === undefined || peek().value === value);
  const eat = (type, value) => {
    if (!at(type, value)) {
      throw new Error(`Expected ${type}${value ? `(${value})` : ''} at token ${i}, got ${peek().type}(${peek().value})`);
    }
    return next();
  };
  const skipNewlines = () => {
    while (at(TokenType.Newline)) next();
  };

  function parseProgram() {
    const body = [];
    skipNewlines();
    while (!at(TokenType.EOF)) {
      body.push(parseStmt());
      skipNewlines();
    }
    return { type: 'Program', body };
  }

  function parseStmt() {
    if (at(TokenType.Keyword, 'import')) return parseImport(false);
    if (at(TokenType.Keyword, 'set')) return parseSet();
    if (at(TokenType.Keyword, 'work')) return parseWork();
    if (at(TokenType.Keyword, 'export')) return parseExport();
    if (at(TokenType.Keyword, 'if')) return parseIf();
    return parseExprStmt();
  }

  function parseImport(withBinding) {
    if (withBinding) {
      eat(TokenType.Keyword, 'set');
      const name = eat(TokenType.Identifier).value;
      eat(TokenType.Symbol, '=');
      eat(TokenType.Keyword, 'import');
      const path = eat(TokenType.String).value;
      return { type: 'SetImport', name, path };
    }
    eat(TokenType.Keyword, 'import');
    const path = eat(TokenType.String).value;
    return { type: 'Import', path };
  }

  function parseSet() {
    if (tokens[i + 3]?.type === TokenType.Keyword && tokens[i + 3]?.value === 'import') {
      return parseImport(true);
    }
    eat(TokenType.Keyword, 'set');
    const name = eat(TokenType.Identifier).value;
    eat(TokenType.Symbol, '=');
    const expr = parseExpression();
    return { type: 'Set', name, expr };
  }

  function parseWork() {
    eat(TokenType.Keyword, 'work');
    const name = eat(TokenType.Identifier).value;
    eat(TokenType.Symbol, '(');
    const params = [];
    while (!at(TokenType.Symbol, ')')) {
      params.push(eat(TokenType.Identifier).value);
      if (at(TokenType.Symbol, ',')) next();
    }
    eat(TokenType.Symbol, ')');
    const body = parseBlock();
    return { type: 'Work', name, params, body };
  }

  function parseBlock() {
    eat(TokenType.Symbol, '{');
    skipNewlines();
    const body = [];
    while (!at(TokenType.Symbol, '}')) {
      body.push(parseStmt());
      skipNewlines();
    }
    eat(TokenType.Symbol, '}');
    return body;
  }

  function parseIf() {
    eat(TokenType.Keyword, 'if');
    const test = parseExpression();
    const consequent = parseBlock();
    let alternate = null;
    if (at(TokenType.Keyword, 'else')) {
      next();
      alternate = at(TokenType.Keyword, 'if') ? parseIf() : { type: 'Block', body: parseBlock() };
    }
    return { type: 'If', test, consequent, alternate };
  }

  function parseExport() {
    eat(TokenType.Keyword, 'export');
    if (at(TokenType.Newline) || at(TokenType.Symbol, '}')) {
      return { type: 'Export', expr: null };
    }
    return { type: 'Export', expr: parseExpression() };
  }

  function parseExprStmt() {
    return { type: 'ExprStmt', expr: parseExpression() };
  }

  function parseExpression() {
    return parseBinary();
  }

  function parseBinary() {
    let left = parsePrimary();
    while (at(TokenType.Symbol) && ['+', '-', '*', '/', '%', '..', '==', '~=', '<', '>', '<=', '>='].includes(peek().value)) {
      const op = next().value;
      const right = parsePrimary();
      left = { type: 'BinaryExpr', op, left, right };
    }
    return left;
  }

  function parsePrimary() {
    if (at(TokenType.Number)) return { type: 'Number', value: next().value };
    if (at(TokenType.String)) return { type: 'String', value: next().value };
    if (at(TokenType.Keyword, 'true') || at(TokenType.Keyword, 'false') || at(TokenType.Keyword, 'nil')) {
      return { type: 'Literal', value: next().value };
    }
    if (at(TokenType.Identifier)) {
      const ident = next().value;
      if (at(TokenType.Symbol, '(')) {
        next();
        const args = [];
        while (!at(TokenType.Symbol, ')')) {
          args.push(parseExpression());
          if (at(TokenType.Symbol, ',')) next();
        }
        eat(TokenType.Symbol, ')');
        return { type: 'Call', callee: ident, args };
      }
      return { type: 'Identifier', name: ident };
    }
    if (at(TokenType.Symbol, '{')) {
      next();
      eat(TokenType.Symbol, '}');
      return { type: 'Table', entries: [] };
    }
    throw new Error(`Unexpected token ${peek().type}(${peek().value}) at parser index ${i}`);
  }

  return parseProgram();
}

module.exports = { parse };
