import { rl } from "./rl.js"
import { compareStations, compareSystems } from "../pipeline/analyzeData.js"
import { scanStation } from "../pipeline/pipeline.js"
import {
  typeTextWrapper,
  clearScreen,
  renderHeader,
  progressBarWrapper,
} from "./ui.js"
import { ask } from "./helpers.js"

export async function welcomeScreen() {
  await progressBarWrapper(1500)
  await typeTextWrapper("\nWelcome aboard Commander!", 20)
  await ask("\nPress enter to load available commands: ")
  await printOptions()
}

export async function printOptions() {
  clearScreen()
  renderHeader()

  await typeTextWrapper("\n1. Add stations data (OCR pipeline)", 10)
  await typeTextWrapper("\nFind best:", 10)
  await typeTextWrapper("  2. legal trade between stations", 10)
  await typeTextWrapper("  3. legal trade between systems", 10)
  await typeTextWrapper("  4. illegal trade between stations", 10)
  await typeTextWrapper("  5. illegal trade between systems", 10)
  await typeTextWrapper("\n6. Exit", 10)

  const choice = await ask("\nChoose option: ")

  switch (choice) {
    case "1": {
      console.log("\nTaking three images of station data to analyze..")
      const system = await ask("Enter stations star system name:")
      const name = await ask("Enter station name:")
      console.log("\nAnalyzing data... please wait...")
      await scanStation(system, name)
      console.log("Scan complete, data added successfully.")
      await ask("Press enter to continue: ")
      break
    }

    case "2": {
      clearScreen()
      renderHeader()
      const stationA = await ask("\nID of first station: ")
      const stationB = await ask("ID of second station: ")
      compareStations(stationA, stationB)
      await ask("Press enter to continue: ")
      break
    }

    case "3": {
      clearScreen()
      renderHeader()
      const systemA = await ask("\nName of first system: ")
      const systemB = await ask("Name of second system: ")
      compareSystems(systemA, systemB)
      await ask("Press enter to continue: ")
      break
    }

    case "4": {
      clearScreen()
      renderHeader()
      const stationA = await ask("\nID of first station: ")
      const stationB = await ask("ID of second station: ")
      compareStations(stationA, stationB, { illegal: true })
      await ask("Press enter to continue: ")
      break
    }

    case "5": {
      clearScreen()
      renderHeader()
      const systemA = await ask("\nName of first system: ")
      const systemB = await ask("Name of second system: ")
      compareSystems(systemA, systemB, { illegal: true })
      await ask("Press enter to continue: ")
      break
    }

    case "6": {
      clearScreen()
      renderHeader()
      await typeTextWrapper("\nSystem: Offline\n")
      rl.close()
      process.exit(0)
    }

    default:
      console.log("Invalid option")
  }

  printOptions()
}
