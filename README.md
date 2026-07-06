# FFE Market Analyzer

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Windows 10](https://img.shields.io/badge/Windows-10-0078D6?logo=windows&logoColor=white)](#requirements)
[![Linux](https://img.shields.io/badge/Linux-x64-FCC624?logo=linux&logoColor=black)](#requirements)

A standalone CLI companion for _Frontier: First Encounters_ (1995).

Take screenshots of any station's stockmarket during your playthrough. FFE Market Analyzer reads the price data from those images, builds up a local database across your visited stations, and finds the best trade routes — showing you the most profitable buy/sell opportunities between two stations or two star systems.

## Demo version

A prebuilt Demo version is available for quick evaluation and portfolio/recruiter review.

It allows you to test the application without installing DOSBox-X or _Frontier: First Encounters_.

More information on how to use and download [demo version here](#demo)

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Limitations](#limitations)
- [How It Works](#how-it-works)
- [Macro](#macro)
- [Demo](#demo)
- [Taking Your Own Screenshots](#taking-your-own-screenshots)
- [Reporting Issues](#reporting-issues)

## Requirements

- Windows 10 or Linux (64-bit)
- [DOSBox-X](https://dosbox-x.com/)
- [Frontier: First Encounters](https://www.frontierastro.co.uk/getting/getting.html)
- Internet connection (required for station scanning)

## Installation

1. Download the archive for your platform from the Releases page:
   - **Windows 10 (64-bit):** [FFE-market-analyzer-win-x64.zip](https://github.com/OstrowskiDev/FFE-market-analyzer/releases/latest/download/FFE-market-analyzer-win-x64.zip)
   - **Linux (64-bit):** [FFE-market-analyzer-linux-x64.zip](https://github.com/OstrowskiDev/FFE-market-analyzer/releases/latest/download/FFE-market-analyzer-linux-x64.zip)

2. Extract the archive into the **root folder of your DOSBox-X installation** — the same directory level as `capture/`:

   ```
   dosbox-x/                     ← extract here
   ├── capture/
   ├── FFE-market-analyzer/      ← all files of this tool go here
   │   ├── FFE-market-analyzer   (FFE-market-analyzer.exe on Windows)
   │   ├── settings.json
   │   ├── localdb/
   │   └── img/
   └── ...
   ```

   > **Windows:** Avoid installing DOSBox-X in system directories (e.g. `C:\Program Files`). This can cause permission issues when the tool reads from `capture/`.

3. _(Linux only, optional)_ `linuxMacro.sh` is a convenience script that automates the in-game screenshot sequence. See [Macro](#macro) for setup and usage.

## Usage

### Scanning a station

1. In the game, navigate to any station and open the **Stockmarket**.
2. Take **3 screenshots** using DOSBox-X (`F12+p`) that collectively cover the station's full commodity list. Scroll through the stockmarket between shots — overlapping entries are handled automatically. Some versions of DOSBox-X use a different shortcut; check your key bindings if `F12+p` doesn't work.

   _(Linux users: `linuxMacro.sh` automates the full sequence. See [Macro](#macro).)_
   _(Prefer your own screenshot tool? See [Taking Your Own Screenshots](#taking-your-own-screenshots).)_

3. Launch `FFE-market-analyzer` and select **Add stations data** (option 1).
4. Enter the station's **star system name** and **station name** when prompted.

The tool reads the 3 most recent screenshots from `dosbox-x/capture/`, extracts the price data via OCR, and saves it to your local database.

> **Note:** Scanning uses the [OCR.space](https://ocr.space/) free public API. The hourly request limit is sufficient for normal gameplay, but avoid sending scans in rapid succession. If the limit is reached, wait for the hourly reset before scanning again.

### Finding trade routes

Once you have data for at least **2 stations**, use the following options to find trade opportunities:

| Option | Description                                                |
| ------ | ---------------------------------------------------------- |
| 2      | Best **legal** trade routes between two **stations**       |
| 3      | Best **legal** trade routes between two **star systems**   |
| 4      | Best **illegal** trade routes between two **stations**     |
| 5      | Best **illegal** trade routes between two **star systems** |

The tool returns the 4 most profitable buy/sell pairs for the selected route.

## Configuration

The application is configured by editing `settings.json` in the application folder. The file ships with sensible defaults — no changes are required to get started.

```json
{
  "commanderName": "",
  "publicFreeApiKey": "helloworld",
  "noFluff": false,
  "ignoredGoods": ["Alien Artefacts"]
}
```

| Key                | Description                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `commanderName`    | Your commander name, shown on the welcome screen.                                                                          |
| `publicFreeApiKey` | OCR.space public API key. **Do not change.**                                                                               |
| `noFluff`          | Set to `true` to disable text animations in the CLI.                                                                       |
| `ignoredGoods`     | Goods to exclude from trade route analysis. `Alien Artefacts` is excluded by default as they cannot be purchased anywhere. |

## Limitations

- **Supported platforms:** Windows 10 and Linux (64-bit). macOS is not supported.
- **Emulator:** The tool only works with DOSBox-X. Other DOSBox variants or emulators are not supported.
- **Bulletin Board missions:** Only Stockmarket data is analyzed. Prices from Bulletin Board missions — including event-based trade opportunities like Soholia Medicine Relief — are not taken into account.
- **Illegal goods pricing:** Stations do not display buy prices for illegal goods they only purchase (not sell). Profit estimates for illegal trade routes are therefore approximate.
- **OCR accuracy:** FFE uses an old font that OCR engines struggle with — particularly the digits `1` and `7` (`7` is often read as `1`). The tool corrects this using known price ranges for each commodity, but small discrepancies in the last digits are possible (e.g. `518` instead of `571`). This is generally negligible when comparing trade routes. If needed, prices can be manually corrected in `localdb/stations.json`.

## How It Works

FFE Market Analyzer is a TypeScript application compiled to JavaScript and bundled into a self-contained binary — no separate Node.js installation required.

It has two core functions: **data collection** and **trade route analysis**.

### Data collection

1. Copies the 3 most recent screenshots from `dosbox-x/capture/`.
2. Preprocesses the images to reduce noise and improve OCR accuracy.
3. Sends each image to the [OCR.space](https://ocr.space/) API (public free tier), which converts the image to text.
4. Parses and cleans the API response, including correction of common OCR misreads caused by FFE's font (e.g. `7` read as `1`).
5. Saves the commodity data to `localdb/stations.json`.

Screenshots must contain only the game output — no window frames or system taskbar. DOSBox-X's built-in screen capture (`F12+p`) ensures this automatically.

### Trade route analysis

Using the data stored in `stations.json`, the tool compares buy and sell prices across two selected stations or star systems and returns the 4 most profitable buy/sell opportunities. Legal and illegal goods can be searched separately.

> Only **Stockmarket** data is used. Bulletin Board missions are not taken into account.

## Macro

> **Linux only.** `linuxMacro.sh` is an optional convenience script included as a bonus for Linux users. There is no Windows equivalent.

`linuxMacro.sh` automates the full 3-screenshot sequence for a station visit. It releases the mouse capture (`Ctrl+F10`), takes a screenshot, clicks the stockmarket down arrow a set number of times to scroll the list, then repeats — covering the full commodity list in a single run, without interrupting your session.

### Requirements

The macro uses [`ydotool`](https://github.com/ReimuNotMoe/ydotool). Install it via your package manager before proceeding.

### Setup

1. Make the script executable:
   ```bash
   chmod +x /path/to/FFE-market-analyzer/linuxMacro.sh
   ```
2. Assign it to a keyboard shortcut in your desktop environment. How to do this depends on your desktop environment — refer to its documentation.

### Usage

1. In the game, navigate to the station's **Stockmarket**.
2. Hover the in-game mouse cursor over the stockmarket's **down arrow**. Do not click.
3. Trigger the macro using your assigned keyboard shortcut.
4. Wait for DOSBox-X to take all 3 screenshots. **Do not move the mouse while the macro is running** — it clicks the down arrow at the cursor's position to scroll the list, so any movement will cause it to miss.

## Taking Your Own Screenshots

If you prefer not to use DOSBox-X's screen capture, you can provide your own screenshots instead. Place them directly in `dosbox-x/capture/` before running the scan.

- The screenshots must contain **only the game output** — no DOSBox-X window frame, title bar, or system taskbar. Crop to the game area only; any surrounding content will cause the preprocessing pipeline to fail or produce incorrect results.
- You still need 3 screenshots per station that collectively cover the full stockmarket list. Overlapping entries are fine.

## Demo

The Demo version is intended for quick testing, presentations, and portfolio/recruiter review.

It does not require DOSBox-X or _Frontier: First Encounters_ to run.

### Installation

- Download demo release for your platform:
  - **Windows 10 (64-bit):** [FFE-market-analyzer-win-x64-demo.zip](https://github.com/OstrowskiDev/FFE-market-analyzer/releases/latest/download/FFE-market-analyzer-win-x64-demo.zip)
  - **Linux (64-bit):** [FFE-market-analyzer-linux-x64-demo.zip](https://github.com/OstrowskiDev/FFE-market-analyzer/releases/latest/download/FFE-market-analyzer-linux-x64-demo.zip)

- Extract the `.zip` file anywhere on your system
  - On Windows: avoid protected system directories (e.g. `Program Files`)
- Run:
  - Windows: `FFE-Market-Analyzer.exe`
  - Linux: executable binary from terminal or file manager

### Included demo data

The Demo version includes preconfigured sample data:

- Two sets of screenshots located in `capture/`
  - These allow immediate use of the "add stations data (OCR pipeline)" feature without taking in-game screenshots
  - After scanning the first station, manually delete the first three `.png` files in `capture/` to allow scanning of the next station set

- Built-in dataset of multiple in-game stations
  - Enables "find best trade route" functionality without the need to collect station data first

### Purpose of the Demo version

The Demo build is designed to:

- Allow recruiters and gamers to quickly experience and test the application
- Demonstrate application without the need of setting up DOSBox-X + FFE

For normal gaming use download standard version and follow installation instructions provided in this readme.

## Reporting Issues

Found a bug or unexpected behaviour? [Open an issue](https://github.com/OstrowskiDev/FFE-market-analyzer/issues) on GitHub.

## License

This project is licensed under the [MIT License](LICENSE).
