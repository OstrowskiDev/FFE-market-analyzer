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
