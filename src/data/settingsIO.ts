import fs from "fs"
import { settingsPath } from "../config/paths.js"
import type { Settings } from "../types/index.js"

export function loadSettings(): Settings {
  return JSON.parse(fs.readFileSync(settingsPath, "utf-8"))
}

export function saveSettings(settings: Settings): void {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
}
