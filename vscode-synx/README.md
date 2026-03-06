# SynX VS Code Support

This extension provides:

- Syntax highlighting for `.synx`
- Auto-closing and bracket pairing for `{}` blocks
- Snippets (`set`, `work`, `if`)
- Diagnostics for Lua keyword misuse (`local`, `function`, `require`, `return`, `end`)
- Brace-balance diagnostics
- Command: **SynX: Validate Current Document**

## Run in VS Code (Development Host)

1. Open `vscode-synx/` in VS Code.
2. Run `npm install`.
3. Press `F5` to launch Extension Development Host.
4. Create/open a `.synx` file and test highlighting + diagnostics.

## Package the extension

```bash
cd vscode-synx
npm run package
```

## Publish the extension

```bash
cd vscode-synx
npm run publish
```
