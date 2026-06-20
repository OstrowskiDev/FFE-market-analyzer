import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { clearDir, copyDir, copyFile } from "./helpers.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "../../")
const buildDir = path.join(projectRoot, "build")

console.log("\npostbuild: copying assets to build/\n")

// settings.json — default config, always overwrite
copyFile(
  path.join(projectRoot, "settings.json"),
  path.join(buildDir, "settings.json"),
)

// localdb/stations.json — default data, always overwrite
copyFile(
  path.join(projectRoot, "localdb", "stations.json"),
  path.join(buildDir, "localdb", "stations.json"),
)

// img/placeholder/ — static assets, always overwrite
copyDir(
  path.join(projectRoot, "img", "placeholder"),
  path.join(buildDir, "img", "placeholder"),
)

// img/pipeline/ — must exist and be empty
clearDir(path.join(buildDir, "img", "pipeline"))

console.log("\npostbuild: done\n")
