const vscode = require('vscode');

function activate(context) {
  const diagnostics = vscode.languages.createDiagnosticCollection('synx');
  context.subscriptions.push(diagnostics);

  const validate = (document) => {
    if (document.languageId !== 'synx') return;
    const diags = [];
    const text = document.getText();
    const lines = text.split(/\r?\n/);

    lines.forEach((line, idx) => {
      if (line.includes('function ')) {
        const range = new vscode.Range(idx, 0, idx, line.length);
        diags.push(new vscode.Diagnostic(range, 'Use `work` instead of `function` in SynX.', vscode.DiagnosticSeverity.Error));
      }
      if (line.includes('local ')) {
        const range = new vscode.Range(idx, 0, idx, line.length);
        diags.push(new vscode.Diagnostic(range, 'Use `set` instead of `local` in SynX.', vscode.DiagnosticSeverity.Warning));
      }
    });

    diagnostics.set(document.uri, diags);
  };

  if (vscode.window.activeTextEditor) validate(vscode.window.activeTextEditor.document);
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(validate));
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => validate(e.document)));
}

function deactivate() {}

module.exports = { activate, deactivate };
