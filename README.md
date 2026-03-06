# SynX-Syntax

SynX is **Lua, but easier to read**.

It keeps Lua behavior and replaces a few keywords:

- `local` → `set`
- `function` → `work`
- `require` → `import`
- `return` → `export`
- `end` → `}` (with `{` block opens)

## Included Toolchain

This repository includes:

- Lexer (`src/lexer.js`)
- Token definitions (`src/token.js`)
- Parser (`src/parser.js`)
- Transpiler SynX → Lua (`src/transpiler.js`)
- Compiler pipeline (`src/compiler.js`)
- CLI compiler (`bin/synxc.js`)
- VS Code extension (`vscode-synx/`)

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
npm run compile
```

## Tests

```bash
npm test
```

## VS Code Extension Scripts

```bash
npm run vscode:install
npm run vscode:package
```

Then open `vscode-synx/` in VS Code and press `F5` to run the extension in a development host.

Language reference is in [`SYNTAX.md`](SYNTAX.md).
