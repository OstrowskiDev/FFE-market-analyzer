import fs from "fs"
import { stationsPath } from "../../src/config/paths.js"

export function checkGoodsRange(name) {
  const raw = fs.readFileSync(stationsPath, "utf-8")
  const stationsData = raw.trim() ? JSON.parse(raw) : {}
  const stations = Object.values(stationsData)

  let goodsPrices = []
  for (const station of stations) {
    goodsPrices.push(station.goods[name])
  }
  const min = Math.min(...goodsPrices)
  const max = Math.max(...goodsPrices)

  console.log(`Price range for ${name}: ${min}-${max}`)
}

checkGoodsRange("Precious Metals")
