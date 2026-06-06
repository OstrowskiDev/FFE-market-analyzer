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

export function generateRouteMsg(
  diffs: DiffEntry[],
  currentStationID: string,
  targetStationID: string,
  options: RouteOptions = { illegal: false },
): void {
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

  printTradeRoute(route, options)
}

export function printTradeRoute(
  route: TradeRoute,
  options: RouteOptions = { illegal: false },
): void {
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

export function printStationData(station: Station): void {
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
