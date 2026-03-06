function transpile(ast) {
  const out = [];

  const emitExpr = (expr) => {
    switch (expr.type) {
      case 'Number': return expr.value;
      case 'String': return `"${expr.value}"`;
      case 'Literal': return expr.value;
      case 'Identifier': return expr.name;
      case 'BinaryExpr': return `${emitExpr(expr.left)} ${expr.op} ${emitExpr(expr.right)}`;
      case 'Call': return `${expr.callee}(${expr.args.map(emitExpr).join(', ')})`;
      case 'Table': return '{}';
      default: throw new Error(`Unsupported expression type: ${expr.type}`);
    }
  };

  const emitBlock = (body, indent = '') => {
    for (const stmt of body) emitStmt(stmt, indent);
  };

  const emitStmt = (stmt, indent = '') => {
    switch (stmt.type) {
      case 'Import':
        out.push(`${indent}require("${stmt.path}")`);
        break;
      case 'SetImport':
        out.push(`${indent}local ${stmt.name} = require("${stmt.path}")`);
        break;
      case 'Set':
        out.push(`${indent}local ${stmt.name} = ${emitExpr(stmt.expr)}`);
        break;
      case 'Work':
        out.push(`${indent}function ${stmt.name}(${stmt.params.join(', ')})`);
        emitBlock(stmt.body, `${indent}  `);
        out.push(`${indent}end`);
        break;
      case 'Export':
        out.push(`${indent}return${stmt.expr ? ` ${emitExpr(stmt.expr)}` : ''}`);
        break;
      case 'If':
        out.push(`${indent}if ${emitExpr(stmt.test)} then`);
        emitBlock(stmt.consequent, `${indent}  `);
        if (stmt.alternate) {
          if (stmt.alternate.type === 'If') {
            out.push(`${indent}else`);
            emitStmt(stmt.alternate, `${indent}`);
          } else {
            out.push(`${indent}else`);
            emitBlock(stmt.alternate.body, `${indent}  `);
          }
        }
        out.push(`${indent}end`);
        break;
      case 'ExprStmt':
        out.push(`${indent}${emitExpr(stmt.expr)}`);
        break;
      default:
        throw new Error(`Unsupported statement type: ${stmt.type}`);
    }
  };

  emitBlock(ast.body);
  return out.join('\n');
}

module.exports = { transpile };
