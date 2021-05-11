import * as vscode from "vscode"

const extensionPublisher = "lhl2617"
const extensionName = "lilypond-formatter"

export const extensionPath =
  vscode.extensions.getExtension(`${extensionPublisher}.${extensionName}`)
    ?.extensionPath ?? ".." // root folder if not found (source code)

// https://nodejs.org/api/process.html#process_process_platform
export const platformPythonLyRelativePathMap = new Map([
  [`linux`, "ly/dist-linux/python-ly"],
  [`darwin`, "ly/dist-macos/python-ly"],
  [`win32`, "ly/dist-windows/python-ly.exe"],
])
