import fs from "fs"
import path from "path"
import { loadSettings } from "../data/settingsIO.js"
import { projectRoot, imagesDir } from "../config/paths.js"

export function getFilesFromDosbox(): void {
  const settings = loadSettings()
  const srcDir = process.env.DOSBOX_X_SCREENSHOTS_PATH || settings.screenshotDir
  //!!!! implement imagesDir instead of projectRoot
  const dstDir = projectRoot

  const count = 3
  const files = fs.readdirSync(srcDir)

  const images = files
    .filter((f) => f.endsWith(".png") || f.endsWith(".jpg"))
    .map((file) => {
      const fullPath = path.join(srcDir, file)
      const stat = fs.statSync(fullPath)

      return {
        file,
        fullPath,
        mtime: stat.mtimeMs,
      }
    })
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, count)

  for (const img of images) {
    const targetPath = path.join(dstDir, img.file)
    fs.copyFileSync(img.fullPath, targetPath)
  }
}
