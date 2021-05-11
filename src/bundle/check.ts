// RUN FROM ROOT DIRECTORY
// Checks that python-ly is properly bundled
// `npm run bundle:check`

import * as fs from "fs"
import * as path from "path"

const lyDir = "./ly"
// https://docs.python.org/3/library/sys.html#sys.platform
const platforms = ["linux", "macos", "windows"]
const binName = "python-ly"

const binPaths = platforms.map((platform) => {
  return path.join(lyDir, `dist-${platform}`, binName)
})

binPaths.forEach((binPath) => {
  if (!fs.existsSync(binPath)) {
    throw new Error(`"python-ly" bundle incomplete: Missing: ${binPath}`)
  }
})
