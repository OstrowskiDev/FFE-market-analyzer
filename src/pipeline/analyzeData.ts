import fs from "fs"
import { illegalGoods } from "../data/illegalGoods.js"
import { printTradeRoute } from "./printData.js"
import { generateRouteMsg } from "./printData.js"
import { loadSettings } from "../data/settingsIO.js"
import { stationsPath } from "../config/paths.js"
import type {
  BestRoute,
  DiffEntry,
  Goods,
  OcrParsedGoods,
  Station,
  Stations,
  SystemDiff,
} from "../types/index.js"

const settings = loadSettings()

function getStationStock(stationID: string): Goods {
  const rawStations = fs.readFileSync(stationsPath, "utf-8")
  const stations = JSON.parse(rawStations)
  const station = stations[stationID]
  if (!station) throw new Error(`Unknown station: ${stationID}`)
  return station.goods
}

export function getStationsBySystem(name: string): Station[] {
  const rawStations = fs.readFileSync(stationsPath, "utf-8")
  const stations: Stations = JSON.parse(rawStations)
  const filtered = Object.values(stations).filter(
    (station) => station.system === name,
  )
  return filtered
}

function getSystemDiffs(
  stationsA: Station[],
  stationsB: Station[],
): SystemDiff[] {
  const systemDiffs = []
  for (const stationA of stationsA) {
    for (const stationB of stationsB) {
      //!!!! add options.illegal logic to calc prices:
      const diffs = calcPrices(stationA.id, stationB.id)
      //!!!! check if filterDiffs also needs options.illegal
      const filteredDiffs = filterDiffs(diffs, settings.ignoredGoods)
      const highest = findHighestDiff(filteredDiffs)
      const lowest = findLowestDiff(filteredDiffs)
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

//!!!! decyzja: czy funkcja ma drukować legal/illegal czy both?
//!!!! ważne: obecnie logika dla liczenia illegal routes nie istnieje wewnątrz tego body:
export function compareSystems(
  nameA: string,
  nameB: string,
  options = { illegal: false },
) {
  const stationsA = getStationsBySystem(nameA)
  const stationsB = getStationsBySystem(nameB)

  // add logic for options.illegal here:

  const systemDiffs = getSystemDiffs(stationsA, stationsB)

  //pass systemDiffs from legal/illegal routes below:
  const bestRoute = findBestRoute(systemDiffs)
  printTradeRoute(bestRoute, options)
}

function findBestRoute(systemDiffs: SystemDiff[]): BestRoute {
  let bestRoute = null

  for (const route of systemDiffs) {
    const highest = route.diffsHighest
    const lowest = route.diffsLowest
    const profit = highest[0].priceDiff + Math.abs(lowest[0].priceDiff)

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
  if (!bestRoute) throw new Error("No routes found")
  return bestRoute
}

export function compareStations(
  stationAId: string,
  stationBId: string,
  options: { illegal: boolean } = { illegal: false },
): void {
  if (!options.illegal) {
    const diffs = calcPrices(stationAId, stationBId)
    const filteredDiffs = filterDiffs(diffs, settings.ignoredGoods)
    generateRouteMsg(filteredDiffs, stationAId, stationBId, options)
  } else {
    const illegalDiffs = calcPrices(stationAId, stationBId, options)
    const filteredIllDiffs = filterDiffs(illegalDiffs, settings.ignoredGoods)
    generateRouteMsg(filteredIllDiffs, stationAId, stationBId, options)
  }
}

function calcPrices(
  stationAId: string,
  stationBId: string,
  options: { illegal: boolean } = { illegal: false },
): DiffEntry[] {
  const diffs = []
  const currentGoods = getStationStock(stationAId)
  const targetGoods = getStationStock(stationBId)

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

export function findHighestDiff(diffs: DiffEntry[]): DiffEntry[] {
  return [...diffs].sort((a, b) => b.priceDiff - a.priceDiff).slice(0, 4)
}

export function findLowestDiff(diffs: DiffEntry[]): DiffEntry[] {
  return [...diffs].sort((a, b) => a.priceDiff - b.priceDiff).slice(0, 4)
}

export function formatGoodsList(diffs: DiffEntry[], reverse = false): void {
  for (const diff of diffs) {
    const value = reverse ? Math.abs(diff.priceDiff) : diff.priceDiff
    const formatted = value.toFixed(1)

    console.log(
      `  ${diff.item.padEnd(18)} +${formatted.toString().padStart(4)}¢`,
    )
  }
}

export function filterGoods(
  goods: OcrParsedGoods,
  blacklist: string[],
): OcrParsedGoods {
  return goods.filter(([name]) => !blacklist.includes(name))
}

// takes: {item:string, priceDiff: number}[] as first arg
function filterDiffs(diffs: DiffEntry[], blacklist: string[]) {
  return diffs.filter((diff) => !blacklist.includes(diff.item))
}
