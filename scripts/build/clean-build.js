import fs from "node:fs"

cleanDir("dist")
cleanDir("build")
console.log(`\nclean-build: done\n`)

function cleanDir(path) {
  fs.rmSync(path, {
    recursive: true,
    force: true,
  })

  fs.mkdirSync(path, {
    recursive: true,
  })
}
