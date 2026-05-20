import { getImages } from "./getImage.js"
import { preprocessImage } from "./preprocessImage.js"
import { runOcr } from "./runOcr.js"
import { parseOcr, fuzzyMatchGoods } from "./parseOcr.js"
import { createStation, saveStation } from "../data/operations.js"
import { filterGoods } from "./analyzeData.js"
import { blacklist } from "../data/dictionary.js"
import { getFilesFromDosbox } from "./getFilesFromDosbox.js"
import { printStationData } from "./printData.js"
import {
  correctPriceRanges,
  correctCharMissMatch,
  changePriceToNum,
} from "./OCRcorrection.js"

export async function scanStation(system, name) {
  getFilesFromDosbox()
  const newestImages = getImages()
  const ocrDataArr = []
  for (let i = 0; i < 3; i++) {
    // for (const image of newestImages) {
    await preprocessImage(newestImages[i])
    const ocrOutput = await runOcr()
    let goods = parseOcr(ocrOutput) // out [String, "number"]
    goods = fuzzyMatchGoods(goods)
    goods = correctCharMissMatch(goods)
    goods = correctPriceRanges(goods)
    goods = changePriceToNum(goods)
    goods = filterGoods(goods, blacklist) // remove low value goods eg water
    ocrDataArr.push(goods)
    console.log(`Scan (${i + 1}/3) analyzed successfully`)
  }

  const allGoods = ocrDataArr.flat()
  const stationObj = createStation(allGoods, system, name)
  await saveStation(stationObj)
  printStationData(stationObj)
}
