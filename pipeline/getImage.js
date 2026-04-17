import fs from "fs"
import path from "path"

export function getImages() {
  const imagesNum = 3
  const files = fs.readdirSync(".")

  const images = files.filter(
    (file) =>
      (file.endsWith(".png") || file.endsWith(".jpg")) &&
      !file.startsWith("debug"),
  )

  if (images.length < imagesNum) {
    console.log(`Less than ${imagesNum} images found`)
    process.exit(0)
  }

  images.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)
  const latest = images.slice(0, imagesNum).reverse()
  return latest
}
