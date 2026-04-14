import { stations } from "../data/stations.js"

import {
  calcPrices,
  findHighestDiff,
  findLowestDiff,
  formatGoodsList,
} from "./analyzeData.js"

export function printRoute(currentStationID, targetStationID) {
  const current = stations[currentStationID]
  const target = stations[targetStationID]

  const diffs = calcPrices(currentStationID, targetStationID)

  const buyAtCurrent = findHighestDiff(diffs)
  const buyAtTarget = findLowestDiff(diffs)

  console.log("\n======= COMPUTED TRADE ROUTE =========")
  console.log(
    `${current.name} (${current.system}) → ${target.name} (${target.system})\n`,
  )

  console.log(`BUY @ ${current.name} → SELL @ ${target.name}`)
  formatGoodsList(buyAtCurrent)

  console.log(`\nBUY @ ${target.name} → SELL @ ${current.name}`)
  formatGoodsList(buyAtTarget, true)

  console.log("\n=================================\n")
}
