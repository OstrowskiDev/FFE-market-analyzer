import { execSync } from "node:child_process"

const commands = [
  "npm run clean:build",
  "npm run build",
  "npm run bundle",
  "npm run package:win",
  "npm run package:linux",
  "npm run assemble:dist",
  "npm run assemble:demo",
  "npm run clean:bundle",
  "npm run archive",
]

for (const command of commands) {
  execSync(command, { stdio: "inherit" })
}
