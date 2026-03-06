function findWordRanges(line, word) {
  const ranges = [];
  const regex = new RegExp(`\\b${word}\\b`, 'g');
  let m;
  while ((m = regex.exec(line)) !== null) {
    ranges.push({ start: m.index, end: m.index + word.length });
  }
  return ranges;
}

function validateSynxText(text) {
  const diagnostics = [];
  const lines = text.split(/\r?\n/);
  let braceDepth = 0;

  lines.forEach((line, lineIndex) => {
    const checks = [
      { lua: 'local', synx: 'set', severity: 'warning' },
      { lua: 'function', synx: 'work', severity: 'error' },
      { lua: 'require', synx: 'import', severity: 'warning' },
      { lua: 'return', synx: 'export', severity: 'warning' },
      { lua: 'end', synx: '}', severity: 'error' }
    ];

    for (const check of checks) {
      for (const range of findWordRanges(line, check.lua)) {
        diagnostics.push({
          line: lineIndex,
          start: range.start,
          end: range.end,
          severity: check.severity,
          message: `Use \`${check.synx}\` instead of \`${check.lua}\` in SynX.`
        });
      }
    }

    for (const ch of line) {
      if (ch === '{') braceDepth += 1;
      if (ch === '}') braceDepth -= 1;
      if (braceDepth < 0) {
        diagnostics.push({
          line: lineIndex,
          start: 0,
          end: Math.max(line.length, 1),
          severity: 'error',
          message: 'Unexpected closing brace `}`.'
        });
        braceDepth = 0;
      }
    }
  });

  if (braceDepth !== 0) {
    diagnostics.push({
      line: Math.max(lines.length - 1, 0),
      start: 0,
      end: Math.max(lines[lines.length - 1]?.length || 1, 1),
      severity: 'error',
      message: 'Unbalanced braces: missing closing `}`.'
    });
  }

  return diagnostics;
}

module.exports = { validateSynxText };
