import * as vscode from "vscode"
import * as path from "path"
import { extensionPath, platformPythonLyRelativePathMap } from "./consts"

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

export const getExecutablePath = (): string => {
  const relPath = platformPythonLyRelativePathMap.get(process.platform)
  if (relPath === undefined) {
    throw new Error(
      `Platform "${process.platform}" not supported: Please install python-ly and specify the right path to your installation in Settings.`
    )
  }
  const absPath = path.join(extensionPath, relPath)
  return absPath
}
