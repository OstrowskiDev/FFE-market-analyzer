import { ZipArchive } from "archiver"
import fs from "fs"

function zipDir(srcDir, outFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outFile)
    const archive = new ZipArchive("zip", { zlib: { level: 9 } })

    output.on("close", () => {
      console.log(`  zipped  ${outFile} (${archive.pointer()} bytes)`)
      resolve()
    })
    archive.on("error", reject)

    archive.pipe(output)
    archive.directory(srcDir, false)
    archive.finalize()
  })
}

await zipDir(
  "dist/FFE-market-analyzer-win-x64",
  "dist/FFE-market-analyzer-win-x64.zip",
)

await zipDir(
  "dist/FFE-market-analyzer-linux-x64",
  "dist/FFE-market-analyzer-linux-x64.zip",
)

await zipDir(
  "dist/FFE-market-analyzer-win-x64-demo",
  "dist/FFE-market-analyzer-win-x64-demo.zip",
)

await zipDir(
  "dist/FFE-market-analyzer-linux-x64-demo",
  "dist/FFE-market-analyzer-linux-x64-demo.zip",
)
