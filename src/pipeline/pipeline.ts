import { getImages } from "./getImage.js"
import { preprocessImage } from "./preprocessImage.js"
import { runOcr } from "./runOcr.js"
import { parseOcr, fuzzyMatchGoods } from "./parseOcr.js"
import { createStation, saveStation } from "../data/operations.js"
import { filterGoods } from "./analyzeData.js"
import { blacklist } from "../data/dictionary.js"
import { getFilesFromDosbox } from "./getFilesFromDosbox.js"
import { printStationData } from "./printData.js"
import { wait } from "../cli/ui.js"
import {
  correctPriceRanges,
  correctCharMissMatch,
  changePriceToNum,
} from "./OCRcorrection.js"
import type { OcrParsedGoods, OcrRawGods } from "../types/index.js"

export async function scanStation(system: string, name: string): Promise<void> {
  getFilesFromDosbox()
  const newestImages = getImages()
  const ocrDataArr = []
  for (let i = 0; i < 3; i++) {
    await preprocessImage(newestImages[i])
    const ocrOutput = await runOcr()
    let goods: OcrRawGods | OcrParsedGoods = parseOcr(ocrOutput)
    goods = fuzzyMatchGoods(goods)
    goods = correctCharMissMatch(goods)
    goods = correctPriceRanges(goods)
    goods = changePriceToNum(goods) // change from [String, "number"] to out [String, Number]
    goods = filterGoods(goods, blacklist) // remove low value goods eg water
    ocrDataArr.push(goods)
    console.log(`Scan (${i + 1}/3) analyzed successfully`)
  }

  const allGoods = ocrDataArr.flat()
  const stationObj = createStation(allGoods, system, name)
  await saveStation(stationObj)
  await wait(500)
  printStationData(stationObj)
}
