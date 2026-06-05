import fs from "fs/promises"
import { getSystemName, getStationName, getStationID } from "./utils.js"
import { stationsPath, stationsTempPath } from "../config/paths.js"
import type { Station, Stations } from "../types/index.js"

async function getStations(): Promise<Stations> {
  const raw = await fs.readFile(stationsPath, "utf-8")
  const data = raw.trim() ? JSON.parse(raw) : {}
  return data
}

export async function getStation(id: string): Promise<Station | null> {
  const stations = await getStations()
  return stations[id] ?? null
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
    const stations = await getStations()
    const newStations = {
      ...stations,
      [station.id]: station,
    }
    //atomic write pattern - to prevent data loss when write fails
    await fs.writeFile(stationsTempPath, JSON.stringify(newStations, null, 2))
    await fs.rename(stationsTempPath, stationsPath)
    console.log("Station saved successfully!")
  } catch (err) {
    console.log("Error while saving station.JSON data:", err)
    throw err
  }
}
