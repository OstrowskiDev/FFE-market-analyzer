import { rl } from "./rl.js"
import { compareStations } from "../pipeline/analyzeData.js"
import { scanStation } from "../pipeline/pipeline.js"
import { typeText, clearScreen, renderHeader, progressBar } from "./ui.js"
import { ask } from "./helpers.js"

export async function welcomeScreen() {
  await progressBar(1500)
  await typeText("\nWelcome aboard Commander!", 20)
  await ask("\nPress enter to load available commands: ")
  await printOptions()
}

export async function printOptions() {
  clearScreen()
  renderHeader()

  await typeText("\n1. Add stations data (OCR pipeline)", 10)
  await typeText("2. Analyze trade route", 10)
  await typeText("3. Exit", 10)

  const choice = await ask("\nChoose option: ")

  switch (choice) {
    case "1":
      console.log("\nTaking three images of station data to analyze..")
      const system = await ask("Enter stations star system name:")
      const name = await ask("Enter station name:")
      console.log("\nAnalyzing data... please wait...")
      await scanStation(system, name)
      console.log("Scan complete, data added successfully.")
      await ask("Press enter to continue: ")
      break

    case "2":
      clearScreen()
      renderHeader()
      const stationA = await ask("\nID of first station: ")
      const stationB = await ask("ID of second station: ")
      compareStations(stationA, stationB)
      await ask("Press enter to continue: ")
      break

    case "3":
      clearScreen()
      renderHeader()
      await typeText("\nSystem: Offline\n")
      rl.close()
      process.exit(0)

    default:
      console.log("Invalid option")
  }

  printOptions()
}
