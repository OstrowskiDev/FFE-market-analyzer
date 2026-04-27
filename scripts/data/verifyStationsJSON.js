import { readFileSync } from "fs"

export function verifyKeyIdConsistency() {
  const stations = JSON.parse(readFileSync("./data/stations.json", "utf-8"))

  const mismatches = []

  for (const [key, station] of Object.entries(stations)) {
    if (key !== station.id) {
      mismatches.push({ key, id: station.id, name: station.name })
    }
  }

  if (mismatches.length === 0) {
    console.log("OK: wszystkie klucze zgodne z polem id")
  } else {
    console.error(`BŁĄD: znaleziono ${mismatches.length} niezgodność(i)`)
    for (const { key, id, name } of mismatches) {
      console.error(`  klucz: "${key}"  id: "${id}"  name: "${name}"`)
    }
    process.exit(1)
  }
}

verifyKeyIdConsistency()
