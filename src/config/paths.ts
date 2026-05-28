import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot =
  process.env.FFE_MARKET_NAVIGATOR_ROOT_PATH ||
  path.resolve(__dirname, "../../")

const localDbDir = path.join(projectRoot, "localdb")
const imagesDir = path.join(projectRoot, "img")

const settingsPath = path.join(projectRoot, "settings.json")
const stationsPath = path.join(localDbDir, "stations.json")
const stationsTempPath = path.join(localDbDir, "stations.tmp.json")

export {
  projectRoot,
  localDbDir,
  imagesDir,
  settingsPath,
  stationsPath,
  stationsTempPath,
}

export function inImg(fileName) {
  return path.join(paths.imagesDir, fileName)
}
