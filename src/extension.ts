import * as vscode from "vscode"
import { runReformat } from "./ly"

const getProvider = (
  context: vscode.ExtensionContext
): vscode.DocumentFormattingEditProvider => {
  const provider: vscode.DocumentFormattingEditProvider = {
    async provideDocumentFormattingEdits(
      document: vscode.TextDocument
    ): Promise<vscode.TextEdit[]> {
      let edits: vscode.TextEdit[] = []
      try {
        await document.save()
        const reformattedCode = runReformat(document, context)
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
  return provider
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const activate = (context: vscode.ExtensionContext) => {
  vscode.languages.registerDocumentFormattingEditProvider(
    `lilypond`,
    getProvider(context)
  )
}
