import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "../../")

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

export function copyFile(src, dest) {
  ensureDir(path.dirname(dest))
  fs.copyFileSync(src, dest)
  console.log(
    `  copied  ${path.relative(projectRoot, src)} → ${path.relative(projectRoot, dest)}`,
  )
}

export function copyDir(src, dest) {
  ensureDir(dest)
  fs.cpSync(src, dest, {
    recursive: true,
    force: true,
    preserveTimestamps: true,
  })
  console.log(
    `  copied  ${path.relative(projectRoot, src)}/ → ${path.relative(projectRoot, dest)}/`,
  )
}

export function clearDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true })
  }
  fs.mkdirSync(dirPath, { recursive: true })
  console.log(`  cleared ${path.relative(projectRoot, dirPath)}/`)
}
