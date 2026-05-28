import os from "os"
import path from "path"
import { typeTextWrapper } from "./ui.js"
import { ask } from "./helpers.js"
import { loadSettings, saveSettings } from "../data/settingsIO.js"

export async function checkCommanderName() {
  const settings = loadSettings()
  if (!settings.commanderName) {
    await typeTextWrapper("\nFirst start-up detected.")
    const name = await ask("\nCommander, please enter your name:")
    saveSettings({ ...settings, commanderName: name })
  }
}

export async function checkDosboxXCapturePath() {
  const settings = loadSettings()
  if (!settings.screenshotDir) {
    const defaultPath = path.join(
      os.homedir(),
      ".config",
      "dosbox-x",
      "capture",
    )
    await typeTextWrapper(
      `\nCommander, please enter path to your dosbox-x screenshot folder`,
    )
    await typeTextWrapper(`\nDefault /dosbox-x/capture location:`)
    await typeTextWrapper(`${defaultPath}`)
    await typeTextWrapper(`\nIf above path is correct press enter`)
    await typeTextWrapper(
      `If its not, type full path to screenshot (capture) folder`,
    )
    await typeTextWrapper(
      `You can always change the path in settings.json file`,
    )
    const inputPath = await ask("\nDosbox-x screenshot folder path:")
    const finalPath = inputPath || defaultPath
    saveSettings({ ...settings, screenshotDir: finalPath })
  }
}
