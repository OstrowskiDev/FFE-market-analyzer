import { rl } from "./rl.js"
import {
  compareStations,
  compareSystems,
  getStationsBySystem,
} from "../pipeline/analyzeData.js"
import { scanStation } from "../pipeline/pipeline.js"
import {
  typeTextWrapper,
  clearScreen,
  renderHeader,
  printDbStats,
} from "./ui.js"
import { loadSettings } from "../data/settingsIO.js"
import { ask } from "./helpers.js"
import { getStation, hasStations, hasSystems } from "../data/operations.js"
import {
  printAllStationsIds,
  printAllSystemsNames,
} from "../pipeline/printData.js"

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
  await printDbStats()

  await typeTextWrapper("\n1. Add stations data (OCR pipeline)", 10)

  await typeTextWrapper("\nFind best:", 10)
  await typeTextWrapper("  2. legal trade between stations", 10)
  await typeTextWrapper("  3. legal trade between systems", 10)
  await typeTextWrapper("  4. illegal trade between stations", 10)
  await typeTextWrapper("  5. illegal trade between systems", 10)

  await typeTextWrapper("\n6. Exit", 10)

  await typeTextWrapper(
    "\n\x1b[90m(Type 'back' to return to this menu)\x1b[0m",
    5,
  )

  const choice = await ask("\nChoose option: ")

  switch (choice) {
    case "1": {
      console.log("\nTaking three images of station data to analyze..")
      const system = await ask("Enter stations star system name:")
      if (system === "back") break
      const name = await ask("Enter station name:")
      if (name === "back") break
      console.log("\nAnalyzing data... please wait...")
      await scanStation(system, name)
      console.log("Scan complete, data added successfully.")
      await ask("Press enter to continue: ")
      break
    }

    case "2": {
      clearScreen()
      renderHeader()

      if (!hasStations(2)) {
        console.log(
          "No stations found in database. Add stations before using this function.",
        )
        break
      }
      printAllStationsIds()
      const msgA = "\nID of first station: "
      const msgB = "ID of second station: "
      const msgRepeat =
        "Station ID does not exist, please enter station ID again: "
      const stationAId = await promptForValidStationId(msgA, msgRepeat)
      if (stationAId === "back") break
      const stationBId = await promptForValidStationId(msgB, msgRepeat)
      if (stationBId === "back") break
      await compareStations(stationAId, stationBId)
      await ask("Press enter to continue: ")
      break
    }

    case "3": {
      clearScreen()
      renderHeader()

      if (!hasSystems(2)) {
        console.log(
          "No systems found in database. Add stations before using this function.",
        )
        break
      }
      printAllSystemsNames()

      const msgA = "\nName of first system: "
      const msgB = "Name of second system: "
      const msgRepeat =
        "System does not exist, please enter system name again: "
      const systemA = await promptForValidSystemName(msgA, msgRepeat)
      if (systemA === "back") break
      const systemB = await promptForValidSystemName(msgB, msgRepeat)
      if (systemB === "back") break
      await compareSystems(systemA, systemB)
      await ask("Press enter to continue: ")
      break
    }

    case "4": {
      clearScreen()
      renderHeader()

      if (!hasStations(2)) {
        console.log(
          "No stations found in database. Add stations before using this function.",
        )
        break
      }
      printAllStationsIds()

      const msgA = "\nID of first station: "
      const msgB = "ID of second station: "
      const msgRepeat =
        "Station ID does not exist, please enter station ID again: "
      const stationAId = await promptForValidStationId(msgA, msgRepeat)
      if (stationAId === "back") break
      const stationBId = await promptForValidStationId(msgB, msgRepeat)
      if (stationBId === "back") break
      await compareStations(stationAId, stationBId, { illegal: true })
      await ask("Press enter to continue: ")
      break
    }

    case "5": {
      clearScreen()
      renderHeader()

      if (!hasSystems(2)) {
        console.log(
          "No systems found in database. Add stations before using this function.",
        )
        break
      }
      printAllSystemsNames()

      const msgA = "\nName of first system: "
      const msgB = "Name of second system: "
      const msgRepeat =
        "System does not exist, please enter system name again: "
      const systemA = await promptForValidSystemName(msgA, msgRepeat)
      if (systemA === "back") break
      const systemB = await promptForValidSystemName(msgB, msgRepeat)
      if (systemB === "back") break
      await compareSystems(systemA, systemB, { illegal: true })
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
  while (stationID !== "back" && !getStation(stationID)) {
    stationID = await ask(repeatMsg)
  }
  return stationID
}

async function promptForValidSystemName(
  firstMsg: string,
  repeatMsg: string,
): Promise<string> {
  let systemName = await ask(firstMsg)
  while (
    systemName !== "back" &&
    getStationsBySystem(systemName).length === 0
  ) {
    systemName = await ask(repeatMsg)
  }
  return systemName
}
