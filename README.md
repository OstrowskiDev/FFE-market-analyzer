# FFE Market Analyzer

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Windows 10](https://img.shields.io/badge/Windows-10-0078D6?logo=windows&logoColor=white)](#requirements)
[![Linux](https://img.shields.io/badge/Linux-x64-FCC624?logo=linux&logoColor=black)](#requirements)

A standalone CLI companion for _Frontier: First Encounters_ (1995).

Take screenshots of any station's stockmarket during your playthrough. FFE Market Analyzer reads the price data from those images, builds up a local database across your visited stations, and finds the best trade routes — showing you the most profitable buy/sell opportunities between two stations or two star systems.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Limitations](#limitations)
- [How It Works](#how-it-works)
- [Macro](#macro)
- [Reporting Issues](#reporting-issues)

## Requirements

- Windows 10 or Linux (64-bit)
- [DOSBox-X](https://dosbox-x.com/)
- Frontier: First Encounters
- Internet connection (required for station scanning)

## Installation

1. Download the archive for your platform from the [Releases page](https://github.com/OstrowskiDev/FFE-market-analyzer/releases):
   - **Windows 10 (64-bit):** [FFE-market-analyzer-win-x64.zip](PLACEHOLDER_WIN64)
   - **Linux (64-bit):** [FFE-market-analyzer-linux-x64.zip](PLACEHOLDER_LINUX64)

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

3. _(Optional)_ Assign the macro to a keyboard shortcut for faster screenshotting. See [Macro](#macro).
   - **Linux:** `miniMacro.sh`
   - **Windows:** _(coming soon)_

## Usage

### Scanning a station

1. In the game, navigate to any station and open the **Stockmarket**.
2. Take **exactly 3 screenshots** with DOSBox-X (`F12+p`), making sure they collectively cover the station's full commodity list.
   _(Tip: use the [macro](#macro) to automate this step.)_
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

Screenshots must be taken with DOSBox-X (`F12+p`) — this guarantees a consistent image format that the preprocessing pipeline is calibrated for.

### Trade route analysis

Using the data stored in `stations.json`, the tool compares buy and sell prices across two selected stations or star systems and returns the 4 most profitable buy/sell opportunities. Legal and illegal goods can be searched separately.

> Only **Stockmarket** data is used. Bulletin Board missions are not taken into account.

## Macro

_(Windows macro coming soon.)_

`miniMacro.sh` automates the DOSBox-X screenshot sequence: it releases the mouse capture (`Ctrl+F10`), fires the DOSBox-X screenshot shortcut (`F12+p`), then re-captures the mouse — all in a single keypress, without interrupting your session.

### Requirements

The macro uses [`ydotool`](https://github.com/ReimuNotMoe/ydotool). Install it via your package manager before proceeding.

### Setup

1. Make the script executable:
   ```bash
   chmod +x /path/to/FFE-market-analyzer/miniMacro.sh
   ```
2. Assign it to a keyboard shortcut in your desktop environment settings.

When triggered, the macro takes one screenshot. Run it 3 times per station visit to cover the full commodity list.

## Reporting Issues

Found a bug or unexpected behaviour? [Open an issue](https://github.com/OstrowskiDev/FFE-market-analyzer/issues) on GitHub.

## License

This project is licensed under the [MIT License](LICENSE).
