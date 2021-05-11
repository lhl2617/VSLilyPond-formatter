#!/usr/bin/env python3
import os
import subprocess
import shutil
import sys

# maps from sys.platform to GH-Actions friendly folder
# https://docs.python.org/3/library/sys.html#sys.platform
PLATFORM_DICT = {
    "linux": "linux",
    "darwin": "macos",
    "win32": "windows",
}

PLATFORM = PLATFORM_DICT.get(sys.platform)

if PLATFORM is None:
    raise ValueError(f"Unknown build sys.platform: {sys.platform}")

LY_ROOT = os.path.dirname(os.path.realpath(__file__))
PYTHON_LY_ROOT = os.path.join(LY_ROOT, "python-ly")
LY_BIN_DIR = os.path.join(PYTHON_LY_ROOT, "bin")
LY_BIN_PATH = os.path.join(LY_BIN_DIR, "ly")

PYTHON_LY_BIN_PATH = os.path.join(PYTHON_LY_ROOT, "python-ly")

BUILD_PATH = os.path.join(LY_ROOT, "build")
DIST_PATH = os.path.join(LY_ROOT, f"dist-{PLATFORM}")

if __name__ == "__main__":
    # Clean the build and dist paths if required
    if os.path.exists(BUILD_PATH):
        os.rmdir(BUILD_PATH)
    if os.path.exists(DIST_PATH):
        os.rmdir(DIST_PATH)

    # Make a copy of python-ly/bin/ly to python-ly/python-ly
    shutil.copyfile(LY_BIN_PATH, PYTHON_LY_BIN_PATH)

    # now we run PyInstaller
    subprocess.run([
        "pyinstaller",
        "python-ly",
        "--onefile",
        "--workpath",
        BUILD_PATH,
        "--distpath",
        DIST_PATH
    ], cwd=PYTHON_LY_ROOT)

    # Clean the created copy of python-ly/python-ly
    os.remove(PYTHON_LY_BIN_PATH)
    # Clean the spec file
    os.remove(os.path.join(PYTHON_LY_ROOT, "python-ly.spec"))

    print("BUILT PATH:")
    print(DIST_PATH)
    