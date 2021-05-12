import * as commandExists from "command-exists"
import * as vscode from "vscode"
import {
  getConfiguration,
  getExecutablePath,
  getPythonPath,
  outputChan,
} from "./util"
import * as cp from "child_process"

const checkPythonInstallation = (pythonPath: string) => {
  if (!commandExists.sync(pythonPath)) {
    throw new Error(`Python installation not found at \`${pythonPath}\``)
  }
}

export const checkLyInstallation = (pythonPath: string) => {
  const res = cp.spawnSync(pythonPath, [`-c`, `import ly`])
  outputChan.appendLine(`[COMMAND]: ${pythonPath} -c "import ly"`)
  if (res.error || res.status !== 0) {
    outputChan.appendLine(`[STDOUT]: ${res.stdout.toString()}`)
    outputChan.appendLine(`[STDERR]: ${res.stderr.toString()}`)
    throw new Error(
      `python-ly not installed. Please install python-ly (${pythonPath} -m pip install python-ly).`
    )
  }
}

const handleLyCommandOutput = (res: cp.SpawnSyncReturns<Buffer>): string => {
  if (res.error) {
    outputChan.appendLine(`[STDOUT]: ${res.stdout.toString()}`)
    outputChan.appendLine(`[STDERR]: ${res.stderr.toString()}`)
    throw res.error
  }
  if (res.status !== 0) {
    outputChan.appendLine(`[STDOUT]: ${res.stdout.toString()}`)
    outputChan.appendLine(`[STDERR]: ${res.stderr.toString()}`)
    throw new Error(`Python-ly error. See output for "VSLilyPond: Formatter".`)
  }
  outputChan.appendLine(`[LOG]: Formatting succeeded.`)
  return res.stdout.toString()
}

const runReformatWithPython = (
  pythonPath: string,
  doc: vscode.TextDocument,
  timeoutMS: number
): string => {
  outputChan.appendLine(
    `[LOG]: Reformatting "${doc.fileName}" with "${pythonPath}", timeout: "${timeoutMS}ms"`
  )
  const res = cp.spawnSync(pythonPath, [`-m`, `ly`, `reformat`, doc.fileName], {
    timeout: timeoutMS,
  })
  outputChan.appendLine(
    `[COMMAND]: ${pythonPath} -m ly reformat ${doc.fileName}`
  )
  return handleLyCommandOutput(res)
}

const runReformatWithBundledPythonLy = (
  executablePath: string,
  doc: vscode.TextDocument,
  timeoutMS: number
): string => {
  outputChan.appendLine(
    `[LOG]: Reformatting "${doc.fileName}" with bundled "${executablePath}", timeout: "${timeoutMS}ms"`
  )
  const res = cp.spawnSync(executablePath, [`reformat`, doc.fileName], {
    timeout: timeoutMS,
  })
  outputChan.appendLine(`[COMMAND]: ${executablePath} reformat ${doc.fileName}`)
  return handleLyCommandOutput(res)
}

export const runReformat = (
  doc: vscode.TextDocument,
  context: vscode.ExtensionContext
): string => {
  const config = getConfiguration(doc)
  const timeoutMS = config?.general?.reformatTimeout ?? 10000
  if (config?.general?.useBundledPythonLy) {
    const executablePath = getExecutablePath(context)
    return runReformatWithBundledPythonLy(executablePath, doc, timeoutMS)
  } else {
    const pythonPath = getPythonPath(doc)
    checkPythonInstallation(pythonPath)
    checkLyInstallation(pythonPath)
    return runReformatWithPython(pythonPath, doc, timeoutMS)
  }
}
