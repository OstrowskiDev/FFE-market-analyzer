import path from "path"
import { fileURLToPath } from "url"

const projectRoot = (process as any).pkg
  ? path.dirname(process.execPath) // prod
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../") // dev

const localDbDir = path.join(projectRoot, "localdb")
const imagesPlaceholderDir = path.join(projectRoot, "img/placeholder")
const imagesPipelineDir = path.join(projectRoot, "img/pipeline")

const settingsPath = path.join(projectRoot, "settings.json")
const stationsPath = path.join(localDbDir, "stations.json")
const stationsTempPath = path.join(localDbDir, "stations.tmp.json")

export {
  projectRoot,
  localDbDir,
  imagesPlaceholderDir,
  imagesPipelineDir,
  settingsPath,
  stationsPath,
  stationsTempPath,
}
