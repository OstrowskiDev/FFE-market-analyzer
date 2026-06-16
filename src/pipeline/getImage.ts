import fs from "fs"
import path from "path"
import { imagesPipelineDir } from "../config/paths.js"

export function getImages(): string[] {
  const imagesNum = 3
  const fileNames = fs.readdirSync(imagesPipelineDir)

  const images = fileNames.filter(
    (file) =>
      (file.endsWith(".png") || file.endsWith(".jpg")) &&
      !file.startsWith("debug"),
  )

  if (images.length < imagesNum) {
    console.log(`Less than ${imagesNum} images found`)
    process.exit(0)
  }

  images.sort(
    (a, b) =>
      fs.statSync(path.join(imagesPipelineDir, b)).mtimeMs -
      fs.statSync(path.join(imagesPipelineDir, a)).mtimeMs,
  )

  const latest = images.slice(0, imagesNum).reverse()
  return latest.map((file) => path.join(imagesPipelineDir, file))
}
