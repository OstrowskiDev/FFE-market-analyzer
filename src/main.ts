import "dotenv/config"
import { clearScreen, progressBarWrapper, renderHeader } from "./cli/ui.js"
import { welcomeScreen } from "./cli/prompts.js"
import {
  checkCommanderName,
  checkDosboxXCapturePath,
} from "./cli/setSettings.js"

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
