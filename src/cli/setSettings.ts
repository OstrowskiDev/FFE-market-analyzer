import os from "os"
import path from "path"
import fs from "fs"
import { typeTextWrapper } from "./ui.js"
import { ask } from "./helpers.js"
import { loadSettings, saveSettings } from "../data/settingsIO.js"
import { screenshotDir } from "../config/paths.js"

export async function checkCommanderName(): Promise<void> {
  const settings = loadSettings()
  if (!settings.commanderName) {
    await typeTextWrapper("\nFirst start-up detected.")
    const name = await ask("\nCommander, please enter your name:")
    saveSettings({ ...settings, commanderName: name })
  }
}

export async function assertCaptureDir(): Promise<void> {
  if (!fs.existsSync(screenshotDir)) {
    console.log(`Warning: dosbox-x/capture/ dir not found.`)
    console.log(`Make sure the app folder is placed inside dosbox-x/,`)
    console.log(`next to the capture/ folder:`)
    console.log(``)
    console.log(`  dosbox-x/`)
    console.log(`  ├── capture/         ← dosbox-x screenshots go here`)
    console.log(`  └── FFE-market-analyzer/   ← app goes here`)
    console.log(``)
    await ask(`Press any key to exit.`)
    process.exit(1)
  }
}
