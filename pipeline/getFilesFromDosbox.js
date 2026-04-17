import fs from "fs"
import path from "path"

const srcDir = "/home/marcin/.config/dosbox-x/capture"
const dstDir = "/home/marcin/dev/project-47-FFE-market-analyzer"

export function getFilesFromDosbox() {
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
