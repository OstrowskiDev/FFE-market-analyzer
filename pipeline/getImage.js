import fs from "fs"
import path from "path"

export function getImages() {
  const files = fs.readdirSync(".")

  const images = files.filter(
    (file) =>
      (file.endsWith(".png") || file.endsWith(".jpg")) &&
      !file.startsWith("debug"),
  )

  if (images.length === 0) {
    console.log("No images found")
    process.exit(0)
  }

  let newestFile = null
  let newestTime = 0

  for (const file of images) {
    const stats = fs.statSync(file)

    if (stats.mtimeMs > newestTime) {
      newestTime = stats.mtimeMs
      newestFile = file
    }
  }

  console.log("Newest image:", newestFile)
  return newestFile
}
