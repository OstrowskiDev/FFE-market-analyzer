import { getImages } from "./pipeline/getImage.js"
import { preprocessImage } from "./pipeline/preprocessImage.js"
import { runOcr } from "./pipeline/runOcr.js"
import { printRoute } from "./pipeline/printData.js"

const newestFile = getImages()
await preprocessImage(newestFile)
await runOcr()

//test skryptu:

printRoute("SolLondon", "SolToronto")
