// RUN FROM ROOT DIRECTORY
// Generates COMMANDS.md and SETTINGS.md
// `npm run generateDocs`

import * as fs from "fs"

const packageJSON = fs.readFileSync(`./package.json`, "utf-8").toString()
const packageObject = JSON.parse(packageJSON)

type Setting = {
  type: string
  title: string
  default: string
  group: string
  description: string
}

type UntitledSetting = {
  type: string
  default: string
  group: string
  description: string
}
const settings: Record<string, UntitledSetting> =
  packageObject.contributes.configuration.properties

const groupedSettings: Record<string, Setting[]> = {}

Object.entries(settings).forEach(([settingTitle, setting]) => {
  if (!(setting.group in groupedSettings)) {
    groupedSettings[setting.group] = []
  }
  groupedSettings[setting.group].push({ ...setting, title: settingTitle })
})

// generate SETTINGS.md
let settingFileContent = [
  `# Settings`,
  `### Can be accessed via \`Settings (JSON)\` or \`Settings (UI)\``,
]

Object.entries(groupedSettings).forEach(([groupName, settings]) => {
  settingFileContent.push(`## ${groupName}`)

  settings.forEach((setting) => {
    settingFileContent = settingFileContent.concat([
      `### ${setting.title}`,
      setting.description,
      `Type: \`${setting.type}\``,
      `Default value: ${
        setting.default.toString().length
          ? `\`${setting.default.toString()}\``
          : `N/A`
      }`,
    ])
  })
})

fs.writeFileSync(`./docs/SETTINGS.md`, settingFileContent.join(`\n\n`))
