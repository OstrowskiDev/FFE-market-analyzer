import fs from "fs/promises"
import { getSystemName, getStationName, getStationID } from "./utils.js"

export async function getStations() {
  const raw = await fs.readFile("data/stations.json", "utf-8")
  const data = raw.trim() ? JSON.parse(raw) : {}
  return data
}

export function createStation(stationArr, inputSystem, inputStName) {
  const station = {}
  const goods = Object.fromEntries(stationArr)
  station.goods = goods
  const system = getSystemName(inputSystem)
  const stationName = getStationName(inputStName)
  const stationID = getStationID(system, stationName)
  station.system = system
  station.name = stationName
  station.id = stationID
  return station
}

export async function saveStation(station) {
  try {
    const stations = await getStations()
    const newStations = {
      ...stations,
      [station.id]: station,
    }
    //atomic write pattern - to prevent data loss when write fails
    const tempPath = "data/stations.tmp.json"
    await fs.writeFile(tempPath, JSON.stringify(newStations, null, 2))
    await fs.rename(tempPath, "data/stations.json")
    console.log("Station saved successfully!")
  } catch (err) {
    console.log("Error while saving station.JSON data:", err)
    throw err
  }
}
