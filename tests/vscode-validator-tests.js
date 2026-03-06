const assert = require('assert');
const { validateSynxText } = require('../vscode-synx/validator');

const withLuaKeywords = `local x = 1\nfunction bad() {\n  return x\nend\n}`;
const issues1 = validateSynxText(withLuaKeywords);
assert(issues1.some((i) => i.message.includes('`set` instead of `local`')), 'should flag local');
assert(issues1.some((i) => i.message.includes('`work` instead of `function`')), 'should flag function');
assert(issues1.some((i) => i.message.includes('`export` instead of `return`')), 'should flag return');
assert(issues1.some((i) => i.message.includes('instead of `end`')), 'should flag end');

const unbalanced = `work x() {\n  export 1\n`;
const issues2 = validateSynxText(unbalanced);
assert(issues2.some((i) => i.message.includes('Unbalanced braces')), 'should detect unbalanced braces');

const valid = `set x = 1\nwork ok() {\n  export x\n}`;
const issues3 = validateSynxText(valid);
assert.strictEqual(issues3.length, 0, 'valid SynX should have no diagnostics');

console.log('VS Code validator tests passed.');
