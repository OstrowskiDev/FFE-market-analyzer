import "dotenv/config"
import os from "os"
import path from "path"
import { clearScreen, progressBarWrapper, renderHeader } from "./src/cli/ui.js"
import { welcomeScreen } from "./src/cli/prompts.js"
import {
  checkCommanderName,
  checkDosboxXCapturePath,
} from "./src/cli/setSettings.js"

async function main() {
  clearScreen()
  renderHeader()
  await progressBarWrapper(1500)
  await checkCommanderName()

  clearScreen()
  renderHeader()
  await checkDosboxXCapturePath()

  clearScreen()
  renderHeader()
  welcomeScreen()
}

main()
