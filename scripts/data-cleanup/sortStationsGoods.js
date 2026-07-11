import { readFileSync } from "fs"
import fsp from "fs/promises"
import { goodsOrder } from "../../build/src/data/dictionary.js"
import { sortGoods } from "../../build/src/data/operations.js"

await sortStationsGoods()

async function sortStationsGoods() {
  const stationsPath = "temp/stations.json"
  const stations = JSON.parse(readFileSync(stationsPath, "utf-8"))

  const newStations = {}

  const stationsArr = Object.entries(stations)

  for (const [stationID, station] of stationsArr) {
    const sortedGoods = sortGoods(station.goods)
    newStations[stationID] = { ...station, goods: sortedGoods }
  }

  const newStationsPath = "temp/newStations.json"
  await fsp.writeFile(newStationsPath, JSON.stringify(newStations, null, 2))
}
