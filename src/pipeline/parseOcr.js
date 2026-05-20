import { dictionary } from "../data/dictionary.js"
import { logger } from "../cli/helpers.js"

export function parseOcr(ocrOutput) {
  const raw = ocrOutput

  const result = raw
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, price] = line.split("\t")
      return [name, price]
    })

  logger("parseOCR result:", result)
  return result
}

// arg [[name, price], ... ]
export function fuzzyMatchGoods(parsedData) {
  let normalizedData = []
  for (const item of parsedData) {
    let highestPts = 0
    let bestMatch = null
    for (const word of dictionary) {
      let points = 0
      const wordArr = word.split("")
      const nameArr = item[0].split("")
      for (let i = 0; i < nameArr.length; i++) {
        if (wordArr[i] === nameArr[i]) {
          points = points + 1
        }
      }
      if (points > highestPts) {
        highestPts = points
        bestMatch = [word, item[1]]
      }
    }
    normalizedData.push(bestMatch)
    if (highestPts < item[0].length * 0.5) {
      console.warn(
        `fuzzyMatchGoods func poor match detected, ORC output goods name: ${item[0]}`,
      )
    }
  }
  return normalizedData
}
