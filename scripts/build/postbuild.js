import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "../../")
const buildDir = path.join(projectRoot, "build")

// ─── helpers ────────────────────────────────────────────────────────────────

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest))
  fs.copyFileSync(src, dest)
  console.log(
    `  copied  ${path.relative(projectRoot, src)} → ${path.relative(projectRoot, dest)}`,
  )
}

function copyDir(src, dest) {
  ensureDir(dest)
  fs.cpSync(src, dest, { recursive: true, force: true })
  console.log(
    `  copied  ${path.relative(projectRoot, src)}/ → ${path.relative(projectRoot, dest)}/`,
  )
}

function clearDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true })
  }
  fs.mkdirSync(dirPath, { recursive: true })
  console.log(`  cleared ${path.relative(projectRoot, dirPath)}/`)
}

// ─── tasks ───────────────────────────────────────────────────────────────────

console.log("\npostbuild: copying assets to build/\n")

// settings.json — default config, always overwrite
copyFile(
  path.join(projectRoot, "settings.json"),
  path.join(buildDir, "settings.json"),
)

// localdb/stations.json — default data, always overwrite
copyFile(
  path.join(projectRoot, "localdb", "stations.json"),
  path.join(buildDir, "localdb", "stations.json"),
)

// img/placeholder/ — static assets, always overwrite
copyDir(
  path.join(projectRoot, "img", "placeholder"),
  path.join(buildDir, "img", "placeholder"),
)

// img/pipeline/ — must exist and be empty
clearDir(path.join(buildDir, "img", "pipeline"))

console.log("\npostbuild: done\n")
