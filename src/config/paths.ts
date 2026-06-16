import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, "../../")

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
