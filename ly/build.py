#!/usr/bin/env python3
import os
import subprocess
import shutil
import sys

# maps from sys.platform to GH-Actions friendly folder
# https://docs.python.org/3/library/sys.html#sys.platform
PLATFORM_DICT = {"linux": "linux", "darwin": "macos", "win32": "windows"}

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

def cmd(x: str):
    ret = os.system(x)
    if ret != 0:
        raise Exception(f"Command '{x}' exited with code {ret}")

if __name__ == "__main__":
    # Clean the build and dist paths if required
    if os.path.exists(BUILD_PATH):
        shutil.rmtree(BUILD_PATH)
    if os.path.exists(DIST_PATH):
        shutil.rmtree(DIST_PATH)

    # Make a copy of python-ly/bin/ly to python-ly/python-ly
    shutil.copyfile(LY_BIN_PATH, PYTHON_LY_BIN_PATH)

    # now we run PyInstaller
    subprocess.run(
        [
            "pyinstaller",
            "python-ly",
            "--onefile",
            "--workpath",
            BUILD_PATH,
            "--distpath",
            DIST_PATH,
        ],
        cwd=PYTHON_LY_ROOT,
    )
    bin_path = (
        os.path.join(DIST_PATH, "python-ly")
        if PLATFORM != "windows"
        else os.path.join(DIST_PATH, "python-ly.exe")
    )

    # For linux, build a static binary for maximum compatibility
    # https://gist.github.com/0xhexmex/bbfdb6da7fe560f4aabcc271f4951e43
    if PLATFORM == "linux":
        cmd("sudo apt update")
        cmd("sudo apt install binutils patchelf")
        cmd("pip install staticx")
        cmd(f"staticx {bin_path} {bin_path}.static")
        # Now replace the original binary
        cmd(f"mv -f {bin_path}.static {bin_path}")
        # Check static status
        cmd(f"ldd {bin_path}")

    # Clean the created copy of python-ly/python-ly
    os.remove(PYTHON_LY_BIN_PATH)
    # Clean the spec file
    os.remove(os.path.join(PYTHON_LY_ROOT, "python-ly.spec"))

    # Set 0755 permissions to built file
    os.chmod(bin_path, 0o755)

    print("BUILT PATH:")
    print(DIST_PATH)
    print("BIN PATH:")
    print(bin_path)
