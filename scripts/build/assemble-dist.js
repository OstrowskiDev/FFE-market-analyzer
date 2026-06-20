import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { clearDir, copyDir, copyFile } from "./helpers.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "../../")
const distDir = path.join(projectRoot, "dist")

console.log("\nassemble-dist: copying assets to dist/\n")

// settings.json — default config, always overwrite
copyFile(
  path.join(projectRoot, "settings.json"),
  path.join(distDir, "settings.json"),
)

// localdb/stations.json — default data, always overwrite
copyFile(
  path.join(projectRoot, "localdb", "stations.json"),
  path.join(distDir, "localdb", "stations.json"),
)

// img/placeholder/ — static assets, always overwrite
copyDir(
  path.join(projectRoot, "img", "placeholder"),
  path.join(distDir, "img", "placeholder"),
)

// img/pipeline/ — must exist and be empty
clearDir(path.join(distDir, "img", "pipeline"))

console.log("\nassemble-dist: done\n")
