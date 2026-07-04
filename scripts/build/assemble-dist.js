import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { clearDir, copyDir, copyFile } from "./helpers.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "../../")
const distDir = path.join(projectRoot, "dist")

assembleDist("FFE-market-analyzer-win-x64")
assembleDist("FFE-market-analyzer-linux-x64")

export function assembleDist(subDir) {
  const finalDir = path.join(distDir, subDir)

  console.log(`\nassemble-dist/${subDir}: copying assets to dist/${subDir}\n`)

  // settings.json — default config, always overwrite
  copyFile(
    path.join(projectRoot, "settings.json"),
    path.join(finalDir, "settings.json"),
  )

  // localdb/stations.json — default data, always overwrite
  copyFile(
    path.join(projectRoot, "localdb", "stations.json"),
    path.join(finalDir, "localdb", "stations.json"),
  )

  // img/placeholder/ — static assets, always overwrite
  copyDir(
    path.join(projectRoot, "img", "placeholder"),
    path.join(finalDir, "img", "placeholder"),
  )

  // img/pipeline/ — must exist and be empty
  clearDir(path.join(finalDir, "img", "pipeline"))

  console.log(`\nassemble-dist/${subDir}: done\n`)
}
