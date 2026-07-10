import fs from "fs"
import {
  findHighestDiff,
  findLowestDiff,
  formatGoodsList,
} from "./analyzeData.js"
import { stationsPath } from "../config/paths.js"
import type {
  DiffEntry,
  RouteOptions,
  Station,
  TradeRoute,
} from "../types/index.js"
import { getStations } from "../data/operations.js"
import { clearScreen, progressBarWrapper } from "../cli/ui.js"

export async function generateRouteMsg(
  diffs: DiffEntry[],
  currentStationID: string,
  targetStationID: string,
  options: RouteOptions = { illegal: false },
): Promise<void> {
  const rawStations = fs.readFileSync(stationsPath, "utf-8")
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

  await printTradeRoute(route, options)
}

export async function printTradeRoute(
  route: TradeRoute,
  options: RouteOptions = { illegal: false },
): Promise<void> {
  const isIllegal = options.illegal
  const { stationNameA, stationNameB, systemA, systemB, bestBuy, bestSell } =
    route

  const header = `\n======= COMPUTED ${isIllegal ? "ILLEGAL" : ""} TRADE ROUTE =========`
  const footer = `n=======================================${isIllegal ? "=======" : ""}\n`

  clearScreen()
  console.log(header)
  await progressBarWrapper(400)

  clearScreen()
  console.log(header)
  console.log(`${stationNameA} (${systemA}) → ${stationNameB} (${systemB})\n`)
  console.log(`BUY @ ${stationNameA} → SELL @ ${stationNameB}`)
  formatGoodsList(bestBuy)
  console.log(`\nBUY @ ${stationNameB} → SELL @ ${stationNameA}`)
  formatGoodsList(bestSell, true)
  console.log(footer)
}

export function printStationData(station: Station): void {
  clearScreen()
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
    console.log(`  ${name.padEnd(18)} ${price.padStart(maxPriceLen)}¢`)
  }

  console.log(`\n${footer}\n`)
}

export function printAllStationsIds(): void {
  const stations = getStations()
  const stationsIds = Object.keys(stations)
  if (stationsIds.length === 0) {
    console.log(
      "No stations found in database. You need to add stations first to use this function.",
    )
    return
  }
  console.log("Printing all station IDs found in database: \n")
  while (stationsIds.length > 0) {
    console.log(
      stationsIds
        .splice(0, 4)
        .map((id) => id.padEnd(20))
        .join(""),
    )
  }
}

export function printAllSystemsNames(): void {
  const stations = getStations()
  const rawSystemNames = Object.values(stations).map(
    (station) => station.system,
  )
  const systemNames = [...new Set(rawSystemNames)]
  if (systemNames.length === 0) {
    console.log(
      "No systems found in database. You need to add stations first to use this function.",
    )
    return
  }
  console.log("Printing all system names found in database: \n")
  while (systemNames.length > 0) {
    console.log(
      systemNames
        .splice(0, 4)
        .map((systemName) => systemName.padEnd(20))
        .join(""),
    )
  }
}
