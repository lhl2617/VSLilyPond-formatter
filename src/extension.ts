import * as vscode from "vscode"
import { checkLyInstallation, checkPythonInstallation, runReformat } from "./ly"
import { getPythonPath } from "./util"

const provider: vscode.DocumentFormattingEditProvider = {
  async provideDocumentFormattingEdits(
    document: vscode.TextDocument
  ): Promise<vscode.TextEdit[]> {
    let edits: vscode.TextEdit[] = []
    try {
      const pythonPath = getPythonPath(document)
      checkPythonInstallation(pythonPath)
      checkLyInstallation(pythonPath)
      await document.save()
      const reformattedCode = runReformat(pythonPath, document)
      edits = [
        vscode.TextEdit.replace(
          new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(document.lineCount, 0)
          ),
          reformattedCode
        ),
      ]
    } catch (err) {
      vscode.window.showErrorMessage(`LilyPond Formatter: ${err.message}`)
    }
    return edits
  },
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const activate = (context: vscode.ExtensionContext) => {
  vscode.languages.registerDocumentFormattingEditProvider(`lilypond`, provider)
}
