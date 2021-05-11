# Settings

### Can be accessed via `Settings (JSON)` or `Settings (UI)`

## General

### lilypondFormatter.general.useBundledPythonLy

Use the bundled `python-ly` installation instead of the one installed in the Python installation pointed by `lilypondFormatter.general.pathToPython`

Type: `boolean`

Default value: `true`

### lilypondFormatter.general.pathToPython

Path to `python` executable with `python-ly`. Effectual only if `lilypondFormatter.general.useBundledPythonLy` is set to false. Default (`python`) assumes python is in PATH variables.

Type: `string`

Default value: `python`

### lilypondFormatter.general.reformatTimeout

Maximum timeout (in ms) for reformatting process.

Type: `number`

Default value: `10000`