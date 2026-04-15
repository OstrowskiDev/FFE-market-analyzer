import { rl } from "./rl.js"
import { printRoute } from "../pipeline/printData.js"
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
      console.log("\nOCR pipeline not implemented yet")
      await ask("Press enter to continue: ")
      break

    case "2":
      clearScreen()
      renderHeader()
      const stationA = await ask("\nID of first station: ")
      const stationB = await ask("ID of second station: ")
      printRoute(stationA, stationB)
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
