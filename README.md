# LilyPond Formatter

Provides `python-ly` formatting support for LilyPond files in VSCode.

## Requirements

- [VSCode](https://code.visualstudio.com/) 1.14.0 minimum
- (Optional but recommended): [VSLilyPond](https://marketplace.visualstudio.com/items?itemName=lhl2617.vslilypond) -- Provides advanced LilyPond language support
- Optional (for Linux, macOS and Windows users):
  - [`python-ly`](https://pypi.org/project/python-ly/)
    - Since `0.2.0`, `python-ly` is bundled in this extension.
    - If it doesn't work or if you wish to use your own installation, please install `python-ly` and change the [Settings](./docs/SETTINGS.md).
        - `python -m pip install python-ly`
        - If your standard Python 3 installation is not `python`, please change it in the [Settings](./docs/SETTINGS.md)

## Development

#### Requirements

- [VSCode](https://code.visualstudio.com/)
- `npm`
- Python (Tested on 3.8)
- `git` (>= 2.13)

#### Setup

- Clone repository with submodules
  ```bash
  git clone --recurse-submodules https://github.com/lhl2617/VSLilyPond-formatter
  ```
- Install `npm` dependencies
  ```bash
  npm i
  ```
- Install Python dependencies (Note that it is advisable to use a [Virtual Environment](https://docs.python.org/3/library/venv.html))
  ```bash
  python -m pip install -r ly/requirements.txt
  ```
- Build `python-ly` for your system
  ```bash
  python ly/build.py
  ```
- Hit `F5` to run an Extension Development Host.

  See [here](https://code.visualstudio.com/api/get-started/your-first-extension) for a detailed extension development guide.

#### Releasing

Releasing is done automatically via GitHub Actions.

## Issues

Please submit issues in the [GitHub repository](https://github.com/lhl2617/VSLilyPond-formatter).

## Contributing

- File bugs and/or feature requests in the [GitHub repository](https://github.com/lhl2617/VSLilyPond-formatter)
- Pull requests are welcome in the [GitHub repository](https://github.com/lhl2617/VSLilyPond-formatter)
- Buy me a Coffee ☕️ via [PayPal](https://paypal.me/lhl2617)
