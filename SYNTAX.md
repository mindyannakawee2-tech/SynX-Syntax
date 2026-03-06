# SynX Language Syntax (Draft v0.3)

SynX is a Lua-inspired language with simpler, explicit keywords.

## Keyword Mapping

| Lua | SynX |
|---|---|
| `local` | `set` |
| `function` | `work` |
| `require` | `import` |
| `return` | `export` |
| `end` | `}` (with `{` block open) |

---

## 1) File Structure

A source file usually contains:

1. `import` statements
2. variable declarations with `set`
3. `work` declarations
4. top-level expressions (optional)

```synx
import "util"

set app_name = "demo"

work run() {
  print(app_name)
}

run()
```

---

## 2) Comments

- Single line: `-- comment`
- Block: `--[[ ... ]]`

```synx
-- one line
--[[
  many lines
]]
```

---

## 3) Variables (`set`)

```synx
set count = 0
set title = "SynX"
count = count + 1
```

---

## 4) Functions (`work`)

```synx
work add(a, b) {
  export a + b
}

set square = work(x) {
  export x * x
}
```

---

## 5) Imports (`import`)

```synx
set math = import "math"
import "startup"
```

---

## 6) Exports (`export`)

```synx
work is_even(n) {
  export n % 2 == 0
}

set M = {}
work M.hello(name) {
  print("hi", name)
}
export M
```

---

## 7) Block Syntax (`{}`)

```synx
if score >= 90 {
  print("A")
} else if score >= 80 {
  print("B")
} else {
  print("C")
}

while count < 10 {
  count = count + 1
}

for i = 1, 5 {
  print(i)
}

for k, v in pairs(data) {
  print(k, v)
}
```

---

## 8) Tables

```synx
set user = {
  name = "mira",
  age = 25,
  tags = {"dev", "ops"}
}

print(user.name)
print(user["age"])
```

---

## 9) Operators and Values

- Arithmetic: `+ - * / % ^`
- Concat: `..`
- Compare: `== ~= < <= > >=`
- Logical: `and or not`
- Length: `#`
- Booleans: `true`, `false`
- Nil: `nil`

---

## 10) Minimal Grammar (Informal)

```ebnf
program      = { stmt } ;
stmt         = import_stmt | set_stmt | assign_stmt | work_decl | if_stmt | while_stmt | for_stmt | expr_stmt | export_stmt ;
import_stmt  = ["set" ident "="] "import" string ;
set_stmt     = "set" ident "=" expr ;
work_decl    = "work" (ident | table_access) "(" [params] ")" block ;
block        = "{" { stmt } "}" ;
export_stmt  = "export" [expr] ;
```

---

## 11) Compiler/Tooling Status in This Repo

Implemented components:

- Lexer: tokenizes SynX source
- Parser: builds AST for core statements (`set`, `work`, `import`, `export`, `if`)
- Transpiler: converts SynX AST to Lua source
- Compiler: orchestrates lex → parse → transpile
- CLI: `node bin/synxc.js <file.synx> [out.lua]`
- VS Code extension scaffold: syntax highlighting, snippets, bracket pairing, and basic diagnostics

---

## 12) Design Rule (Current)

SynX intentionally follows this rule set:

- `local > set`
- `function > work`
- `require > import`
- `return > export`
- `end > {}`
