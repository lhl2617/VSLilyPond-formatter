// https://nodejs.org/api/process.html#process_process_platform
export const platformPythonLyRelativePathMap = new Map([
  [`linux`, "ly/dist-linux/python-ly"],
  [`darwin`, "ly/dist-macos/python-ly"],
  [`win32`, "ly/dist-windows/python-ly.exe"],
])
