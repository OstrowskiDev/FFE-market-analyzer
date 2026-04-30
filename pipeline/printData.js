import fs from "fs"
import {
  findHighestDiff,
  findLowestDiff,
  formatGoodsList,
} from "./analyzeData.js"

export function generateRouteMsg(
  diffs,
  currentStationID,
  targetStationID,
  options = {},
) {
  const rawStations = fs.readFileSync("./data/stations.json", "utf-8")
  const stations = JSON.parse(rawStations)

  const stationA = stations[currentStationID]
  const stationB = stations[targetStationID]

  const bestBuy = findHighestDiff(diffs)
  const bestSell = findLowestDiff(diffs)

  const route = {
    stationNameA: stationA.name,
    stationNameB: stationB.name,
    systemA: stationA.system,
    systemB: stationB.system,
    bestBuy,
    bestSell,
  }

  printTradeRoute(route, options)
}

export function printTradeRoute(route, options = {}) {
  const isIllegal = options.illegal
  const { stationNameA, stationNameB, systemA, systemB, bestBuy, bestSell } =
    route

  console.log(
    `\n======= COMPUTED ${isIllegal ? "ILLEGAL" : ""} TRADE ROUTE =========`,
  )

  console.log(`${stationNameA} (${systemA}) → ${stationNameB} (${systemB})\n`)

  console.log(`BUY @ ${stationNameA} → SELL @ ${stationNameB}`)
  formatGoodsList(bestBuy)

  console.log(`\nBUY @ ${stationNameB} → SELL @ ${stationNameA}`)
  formatGoodsList(bestSell, true)

  console.log(
    `\n=======================================${isIllegal ? "=======" : ""}\n`,
  )
}

export function printStationData(station) {
  const header = `========= ${station.name.toUpperCase()} (${station.system}) ===========`
  const footer = "=".repeat(header.length - 1)

  console.log(`\n${header}`)
  console.log(`ID: ${station.id}\n`)
  console.log(`  ${"goods".padEnd(22)} price`)
  console.log(`  ${"-".repeat(28)}`)

  const goods = Object.entries(station.goods)
  const formatted = goods.map(([name, price]) => [name, price.toFixed(1)])
  const maxPriceLen = Math.max(...formatted.map(([, p]) => p.length))

  for (const [name, price] of formatted) {
    console.log(`  ${name.padEnd(18)} +${price.padStart(maxPriceLen)}¢`)
  }

  console.log(`\n${footer}\n`)
}
