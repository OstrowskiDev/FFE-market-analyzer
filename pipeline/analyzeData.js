import fs from "fs"
import { blacklist } from "../data/dictionary.js"
import { illegalGoods } from "../data/illegalGoods.js"
import { printTradeRoute } from "../pipeline/printData.js"

function getStationStock(stationID) {
  const rawStations = fs.readFileSync("./data/stations.json", "utf-8")
  const stations = JSON.parse(rawStations)
  const station = stations[stationID]
  if (!station) throw new Error(`Unknown station: ${stationID}`)
  return station.goods
}

function getStationsBySystem(name) {
  const rawStations = fs.readFileSync("./data/stations.json", "utf-8")
  const stations = JSON.parse(rawStations)
  const filtered = Object.values(stations).filter(
    (station) => station.system === name,
  )
  if (!filtered.length) throw new Error(`Unknown system name: ${name}`)
  return filtered
}

function getSystemDiffs(stationsA, stationsB) {
  const systemDiffs = []
  for (const stationA of stationsA) {
    for (const stationB of stationsB) {
      const diffs = calcPrices(stationA.id, stationB.id)
      const highest = findHighestDiff(diffs)
      const lowest = findLowestDiff(diffs)
      const labeledDiffs = {
        diffsHighest: highest,
        diffsLowest: lowest,
        stationNameA: stationA.name,
        stationNameB: stationB.name,
        systemA: stationA.system,
        systemB: stationB.system,
      }
      systemDiffs.push(labeledDiffs)
    }
  }
  return systemDiffs
}
/*
RETURNS:
SystemDiff[]

SystemDiff:
[
  {
    diffsHighest: DiffEntry[], //sorted desc (top N) A->B
    diffsLowest:  DiffEntry[], //sorted asc (top N) B->A (negative num)
    stationNameA: string,
    stationNameB: string,
    systemA: string,
    systemB: string
  }
]

DiffEntry:
  { 
    [goodsName]: number,  // dynamic key: price
    priceDiff: number     // profit
  }
*/

export function compareSystems(nameA, nameB, options) {
  const stationsA = getStationsBySystem(nameA)
  const stationsB = getStationsBySystem(nameB)

  const systemDiffs = getSystemDiffs(stationsA, stationsB)
  const bestRoute = findBestRoute(systemDiffs)
  printTradeRoute(bestRoute, options)
  //add CLI logger function
}

function findBestRoute(systemDiffs) {
  let bestRoute = null

  for (const route of systemDiffs) {
    const highest = route.diffsHighest
    const lowest = route.diffsLowest
    const profit = highest.priceDiff + Math.abs(lowest.priceDiff)

    if (!bestRoute || profit > bestRoute.profit) {
      bestRoute = {
        bestBuy: highest,
        bestSell: lowest,
        profit: profit,
        stationNameA: route.stationNameA,
        stationNameB: route.stationNameB,
        systemA: route.systemA,
        systemB: route.systemB,
      }
    }
  }

  return bestRoute
}

//!!!! zostawiam tą funkcję bo jest dobra i może się przydać później
// ale obecnie wyszukiwana będzie para stacji, nie zestaw 2 routes w 2 niezależnych parach
function findBestRoutes(systemDiffs) {
  let bestHighest = null
  let bestLowest = null

  for (const route of systemDiffs) {
    const highest = route.diffsHighest[0]
    const lowest = route.diffsLowest[0]

    if (!bestHighest || highest.priceDiff > bestHighest.priceDiff) {
      bestHighest = {
        ...highest,
        stationNameA: route.stationNameA,
        stationNameB: route.stationNameB,
      }
    }

    if (!bestLowest || lowest.priceDiff < bestLowest.priceDiff) {
      bestLowest = {
        ...lowest,
        stationNameA: route.stationNameA,
        stationNameB: route.stationNameB,
      }
    }
  }

  return { bestHighest, bestLowest }
}

function compareStations(nameA, nameB) {
  // podmień za istniejącą funkcję calcPrices
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
