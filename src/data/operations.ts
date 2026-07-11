import fs from "fs"
import fsp from "fs/promises"
import { getSystemName, getStationName, getStationID } from "./utils.js"
import { stationsPath, stationsTempPath } from "../config/paths.js"
import type { Goods, Station, Stations } from "../types/index.js"
import { goodsOrder } from "./dictionary.js"

export function getStations(): Stations {
  const raw = fs.readFileSync(stationsPath, "utf-8")
  const data = raw.trim() ? JSON.parse(raw) : {}
  return data
}

export function getStation(id: string): Station | null {
  const stations = getStations()
  return stations[id] ?? null
}

export function hasStations(num: number = 1): boolean {
  const stations = getStations()
  return Object.keys(stations).length > num - 1
}

export function hasSystems(num: number = 1): boolean {
  const stations = getStations()
  const rawSystemNames = Object.values(stations).map(
    (station) => station.system,
  )
  const systemNames = [...new Set(rawSystemNames)]
  return systemNames.length > num - 1
}

export function createStation(
  goodsArr: [string, number][],
  inputSystem: string,
  inputStName: string,
): Station {
  const unsortedGoods = Object.fromEntries(goodsArr)
  const goods = sortGoods(unsortedGoods)
  const system = getSystemName(inputSystem)
  const name = getStationName(inputStName)
  const id = getStationID(system, name)
  return { goods, system, name, id }
}

export async function saveStation(station: Station): Promise<void> {
  try {
    const stations = getStations()
    const newStations = {
      ...stations,
      [station.id]: station,
    }
    //atomic write pattern - to prevent data loss when write fails
    await fsp.writeFile(stationsTempPath, JSON.stringify(newStations, null, 2))
    await fsp.rename(stationsTempPath, stationsPath)
    console.log("Station saved successfully!")
  } catch (err) {
    console.log("Error while saving station.JSON data:", err)
    throw err
  }
}

export function sortGoods(goods: Goods) {
  let sortedGoods: Goods = {}
  for (const name of goodsOrder) {
    if (name in goods) {
      const price = goods[name]
      sortedGoods[name] = price
    }
  }
  return sortedGoods
}

export function countSystems(): number {
  const stationsDb = getStations()
  const stationsArr = Object.values(stationsDb)
  const systems = new Set()

  for (const station of stationsArr) {
    systems.add(station.system)
  }

  const systemsNo = systems.size
  return systemsNo
}

export function countStations(): number {
  const stationsDb = getStations()
  const stationsArr = Object.entries(stationsDb)
  const stationsNum = stationsArr.length
  return stationsNum
}
