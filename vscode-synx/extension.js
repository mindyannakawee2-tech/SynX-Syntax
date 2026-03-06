const vscode = require('vscode');
const { validateSynxText } = require('./validator');

function toSeverity(vscodeSeverity, text) {
  return text === 'error' ? vscodeSeverity.Error : vscodeSeverity.Warning;
}

function activate(context) {
  const diagnostics = vscode.languages.createDiagnosticCollection('synx');

  const validate = (document) => {
    if (!document || document.languageId !== 'synx') return;

    const issues = validateSynxText(document.getText());
    const converted = issues.map((issue) => {
      const range = new vscode.Range(issue.line, issue.start, issue.line, issue.end);
      return new vscode.Diagnostic(range, issue.message, toSeverity(vscode.DiagnosticSeverity, issue.severity));
    });

    diagnostics.set(document.uri, converted);
  };

  const validateAllOpenSynxFiles = () => {
    vscode.workspace.textDocuments
      .filter((doc) => doc.languageId === 'synx')
      .forEach(validate);
  };

  context.subscriptions.push(diagnostics);
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(validate));
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => validate(event.document)));
  context.subscriptions.push(vscode.workspace.onDidCloseTextDocument((document) => diagnostics.delete(document.uri)));

  const validateCommand = vscode.commands.registerCommand('synx.validateDocument', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('No active editor to validate.');
      return;
    }
    validate(editor.document);
    vscode.window.showInformationMessage('SynX validation complete.');
  });

  context.subscriptions.push(validateCommand);
  validateAllOpenSynxFiles();
}

function deactivate() {}

module.exports = { activate, deactivate };
