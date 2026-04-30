import "dotenv/config"
import { clearScreen, renderHeader } from "./cli/ui.js"
import { welcomeScreen } from "./cli/prompts.js"

async function main() {
  clearScreen()
  renderHeader()
  welcomeScreen()
}

main()
