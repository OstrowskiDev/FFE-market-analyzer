import fs from "fs"
import fsp from "fs/promises"
import { getSystemName, getStationName, getStationID } from "./utils.js"
import { stationsPath, stationsTempPath } from "../config/paths.js"
import type { Station, Stations } from "../types/index.js"

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
  const goods = Object.fromEntries(goodsArr)
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
