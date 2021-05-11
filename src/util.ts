import * as vscode from "vscode"

// get configuration for a document
export const getConfiguration = (doc: vscode.TextDocument) => {
  return vscode.workspace.getConfiguration(`lilypondFormatter`, doc.uri)
}

export const getPythonPath = (doc: vscode.TextDocument) => {
  const config = getConfiguration(doc)
  return config?.general?.pathToPython ?? `python`
}

export const outputChan = vscode.window.createOutputChannel(
  `VSLilyPond: Formatter`
)
