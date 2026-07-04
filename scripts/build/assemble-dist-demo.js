import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { clearDir, copyDir, copyFile } from "./helpers.js"
import { assembleDist } from "./assemble-dist.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "../../")
const distDir = path.join(projectRoot, "dist")

assembleDemo("FFE-market-analyzer-win-x64-demo")
assembleDemo("FFE-market-analyzer-linux-x64-demo")

copyWinBinary("FFE-market-analyzer-win-x64-demo")
copyLinuxBinary("FFE-market-analyzer-linux-x64-demo")

function assembleDemo(subDir) {
  // add dosbox-x/ ass root dir, demo version needs to be inside it to work
  const demoSubDir = path.join(subDir, "dosbox-x", "FFE-market-analyzer")
  const finalDir = path.join(distDir, demoSubDir)
  const dosboxDir = path.join(distDir, subDir, "dosbox-x")

  console.log(`\nassemble-demo/${subDir}: copying assets to demo/${subDir}\n`)

  // assemble base dist structure - must exist and be empty
  assembleDist(demoSubDir)

  // add dosbox-x/capture/
  copyDir(
    path.join(projectRoot, "demo-data", "capture"),
    path.join(dosboxDir, "capture"),
  )

  // overwrite stations.json
  copyFile(
    path.join(projectRoot, "demo-data", "localdb", "stations.json"),
    path.join(finalDir, "localdb", "stations.json"),
  )

  // img/pipeline/ — must exist and be empty
  clearDir(path.join(finalDir, "img", "pipeline"))

  console.log(`\nassemble-demo/${subDir}: done\n`)
}

export function copyLinuxBinary(subDir) {
  const finalDir = path.join(distDir, subDir, "dosbox-x", "FFE-market-analyzer")

  console.log(`\ncopy linux binary ${subDir}/FFE-market-analyzer:\n`)

  copyFile(
    path.join(
      projectRoot,
      "dist",
      "FFE-market-analyzer-linux-x64",
      "FFE-market-analyzer",
    ),
    path.join(finalDir, "FFE-market-analyzer"),
  )
  console.log(`\ncopy linux binary ${subDir}/FFE-market-analyzer: done\n`)
}

export function copyWinBinary(subDir) {
  const finalDir = path.join(distDir, subDir, "dosbox-x", "FFE-market-analyzer")

  console.log(`\ncopy windows binary ${subDir}/FFE-market-analyzer.exe\n`)

  copyFile(
    path.join(
      projectRoot,
      "dist",
      "FFE-market-analyzer-win-x64",
      "FFE-market-analyzer.exe",
    ),
    path.join(finalDir, "FFE-market-analyzer.exe"),
  )
  console.log(`\ncopy windows binary/${subDir}/FFE-market-analyzer.exe: done\n`)
}
