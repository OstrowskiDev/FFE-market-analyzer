import fs from "fs"

const SETTINGS_PATH = "./settings.json"

export function loadSettings() {
  return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"))
}

export function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2))
}
