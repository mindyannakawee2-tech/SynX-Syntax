# SynX-Syntax

SynX is **Lua, but easier to read**.

It keeps Lua behavior and replaces a few keywords:

- `local` → `set`
- `function` → `work`
- `require` → `import`
- `return` → `export`
- `end` → `}` (with `{` block opens)

## Included Toolchain

This repository now includes:

- Lexer (`src/lexer.js`)
- Token definitions (`src/token.js`)
- Parser (`src/parser.js`)
- Transpiler SynX → Lua (`src/transpiler.js`)
- Compiler pipeline (`src/compiler.js`)
- CLI compiler (`bin/synxc.js`)
- VS Code language support scaffold (`vscode-synx/`)

## Quick Example

```synx
set math = import "math"

work greet(user) {
  export "hello " .. user
}

print(greet("SynX"))
```

## Compile Example

```bash
node bin/synxc.js examples/hello.synx
```

## Tests

```bash
npm test
```

Language reference is in [`SYNTAX.md`](SYNTAX.md).
