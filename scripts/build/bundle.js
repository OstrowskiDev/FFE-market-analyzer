import { build } from "esbuild"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "../../")

await build({
  entryPoints: [path.join(projectRoot, "build/src/main.js")],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: path.join(projectRoot, "dist/bundle.cjs"),
})

console.log("esbuild: bundle created → dist/bundle.cjs")
