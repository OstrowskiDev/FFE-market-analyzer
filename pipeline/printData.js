import fs from "fs"
import {
  calcPrices,
  findHighestDiff,
  findLowestDiff,
  formatGoodsList,
} from "./analyzeData.js"

export function printRoute(currentStationID, targetStationID) {
  const diffs = calcPrices(currentStationID, targetStationID)
  const illegalDiffs = calcPrices(currentStationID, targetStationID, {
    illegal: true,
  })

  generateRouteMsg(diffs, currentStationID, targetStationID, { illegal: false })
  generateRouteMsg(illegalDiffs, currentStationID, targetStationID, {
    illegal: true,
  })
}

function generateRouteMsg(
  diffs,
  currentStationID,
  targetStationID,
  options = {},
) {
  const isIllegal = options.illegal

  const rawStations = fs.readFileSync("./data/stations.json", "utf-8")
  const stations = JSON.parse(rawStations)

  const current = stations[currentStationID]
  const target = stations[targetStationID]

  const buyAtCurrent = findHighestDiff(diffs)
  const buyAtTarget = findLowestDiff(diffs)

  console.log(
    `\n======= COMPUTED ${isIllegal ? "ILLEGAL" : ""} TRADE ROUTE =========`,
  )
  console.log(
    `${current.name} (${current.system}) → ${target.name} (${target.system})\n`,
  )

  console.log(`BUY @ ${current.name} → SELL @ ${target.name}`)
  formatGoodsList(buyAtCurrent)

  console.log(`\nBUY @ ${target.name} → SELL @ ${current.name}`)
  formatGoodsList(buyAtTarget, true)

  console.log(
    `\n=======================================${isIllegal ? "=======" : ""}\n`,
  )
}
