// RUN FROM ROOT DIRECTORY
// Checks that python-ly is properly bundled
// `npm run bundle:check`

import * as fs from "fs"

// can't import from '../consts' as that file imports vscode
const platformPythonLyRelativePathMap = {
  linux: "ly/dist-linux/python-ly",
  darwin: "ly/dist-macos/python-ly",
  win32: "ly/dist-windows/python-ly.exe",
}

Object.values(platformPythonLyRelativePathMap).forEach((binPath) => {
  if (!fs.existsSync(binPath)) {
    throw new Error(`"python-ly" bundle incomplete: Missing: ${binPath}`)
  }
})
