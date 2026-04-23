import fs from "fs"
import { blacklist } from "../data/dictionary.js"
import { illegalGoods } from "../data/illegalGoods.js"

function getStationStock(stationID) {
  const rawStations = fs.readFileSync("./data/stations.json", "utf-8")
  const stations = JSON.parse(rawStations)
  const station = stations[stationID]
  if (!station) throw new Error(`Unknown station: ${stationID}`)
  return station.goods
}

// returns [{<goodsName>: number (price), priceDiff: number (profit)}, ...]
export function calcPrices(currentStationID, targetStationID, options = {}) {
  const diffs = []
  const currentGoods = getStationStock(currentStationID)
  const targetGoods = getStationStock(targetStationID)

  if (options.illegal) {
    for (const [key, price] of Object.entries(illegalGoods)) {
      if (!(key in currentGoods)) currentGoods[key] = price
      if (!(key in targetGoods)) targetGoods[key] = price
    }
  }

  for (const item of Object.keys(currentGoods)) {
    const currentPrice = currentGoods[item]
    const targetPrice = targetGoods[item]

    if (typeof currentPrice !== "number" || typeof targetPrice !== "number")
      continue

    diffs.push({
      item,
      priceDiff: targetPrice - currentPrice,
    })
  }

  return diffs
}

export function findHighestDiff(diffs) {
  return [...diffs].sort((a, b) => b.priceDiff - a.priceDiff).slice(0, 4)
}

export function findLowestDiff(diffs) {
  return [...diffs].sort((a, b) => a.priceDiff - b.priceDiff).slice(0, 4)
}

export function formatGoodsList(goodsArray, reverse = false) {
  for (const goods of goodsArray) {
    const value = reverse ? Math.abs(goods.priceDiff) : goods.priceDiff
    const formatted = value.toFixed(1)

    console.log(
      `  ${goods.item.padEnd(18)} +${formatted.toString().padStart(4)}¢`,
    )
  }
}

export function filterGoods(goods) {
  return goods.filter(([name]) => !blacklist.includes(name))
}
