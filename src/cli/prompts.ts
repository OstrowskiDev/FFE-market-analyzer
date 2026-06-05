import { rl } from "./rl.js"
import {
  compareStations,
  compareSystems,
  getStationsBySystem,
} from "../pipeline/analyzeData.js"
import { scanStation } from "../pipeline/pipeline.js"
import { typeTextWrapper, clearScreen, renderHeader } from "./ui.js"
import { loadSettings } from "../data/settingsIO.js"
import { ask } from "./helpers.js"
import { getStation } from "../data/operations.js"

export async function welcomeScreen() {
  const { commanderName } = loadSettings()
  await typeTextWrapper(
    `\nWelcome aboard Commander ${commanderName ?? ""}!`,
    20,
  )
  await ask("\nPress enter to load available commands: ")
  await printOptions()
}

async function printOptions() {
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
      const msgA = "\nID of first station: "
      const msgB = "ID of second station: "
      const msgRepeat =
        "station ID does not exist, please enter station ID again: "
      const stationAId = await promptForValidStationId(msgA, msgRepeat)
      const stationBId = await promptForValidStationId(msgB, msgRepeat)
      compareStations(stationAId, stationBId)
      await ask("Press enter to continue: ")
      break
    }

    case "3": {
      clearScreen()
      renderHeader()
      const msgA = "\nName of first system: "
      const msgB = "Name of second system: "
      const msgRepeat =
        "system does not exist, please enter system name again: "
      const systemA = await promptForValidSystemName(msgA, msgRepeat)
      const systemB = await promptForValidSystemName(msgB, msgRepeat)
      compareSystems(systemA, systemB)
      await ask("Press enter to continue: ")
      break
    }

    case "4": {
      clearScreen()
      renderHeader()
      const msgA = "\nID of first station: "
      const msgB = "ID of second station: "
      const msgRepeat =
        "station ID does not exist, please enter station ID again: "
      const stationAId = await promptForValidStationId(msgA, msgRepeat)
      const stationBId = await promptForValidStationId(msgB, msgRepeat)
      compareStations(stationAId, stationBId, { illegal: true })
      await ask("Press enter to continue: ")
      break
    }

    case "5": {
      clearScreen()
      renderHeader()
      const msgA = "\nName of first system: "
      const msgB = "Name of second system: "
      const msgRepeat =
        "system does not exist, please enter system name again: "
      const systemA = await promptForValidSystemName(msgA, msgRepeat)
      const systemB = await promptForValidSystemName(msgB, msgRepeat)
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

async function promptForValidStationId(
  firstMsg: string,
  repeatMsg: string,
): Promise<string> {
  let stationID = await ask(firstMsg)
  while (!getStation(stationID)) {
    stationID = await ask(repeatMsg)
  }
  return stationID
}

async function promptForValidSystemName(
  firstMsg: string,
  repeatMsg: string,
): Promise<string> {
  let systemName = await ask(firstMsg)
  while (getStationsBySystem(systemName).length === 0) {
    systemName = await ask(repeatMsg)
  }
  return systemName
}
