import fs from "fs"
import { settingsPath } from "../config/paths.js"

export function loadSettings() {
  return JSON.parse(fs.readFileSync(settingsPath, "utf-8"))
}

export function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
}
