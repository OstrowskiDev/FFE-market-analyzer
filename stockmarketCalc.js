import fs from "fs"
import path from "path"
import { Jimp } from "jimp"
import Tesseract from "tesseract.js" // uninstall if OCR SPACE API gets better results
import { ocrSpace } from "ocr-space-api-wrapper"

// Reading .png and .jpg files in current dir:

const files = fs.readdirSync(".")

const images = files.filter(
  (file) =>
    (file.endsWith(".png") || file.endsWith(".jpg")) &&
    !file.startsWith("debug"),
)

if (images.length === 0) {
  console.log("No images found")
  process.exit(0)
}

let newestFile = null
let newestTime = 0

for (const file of images) {
  const stats = fs.statSync(file)

  if (stats.mtimeMs > newestTime) {
    newestTime = stats.mtimeMs
    newestFile = file
  }
}

console.log("Newest image:", newestFile)

// Krok 2: wczytaj obraz
const image = await Jimp.read(newestFile)

// weryfikacja danych poprzez sprawdzenie szerokości i wysokości.
console.log("Width:", image.bitmap.width)
console.log("Height:", image.bitmap.height)

// KROK EXTRA - poprawienie jakości dla OCR
// image.scale(3)

// KROK 3
image.greyscale()
await image.write("debug_grayscale.png")
console.log("After grayscale")
console.log("Saved: debug_grayscale.png")

// KROK 4: threshold - usunięcie szumu informacyjnego
image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
  const brightness = image.bitmap.data[idx]
  const threshold = 200
  const value = brightness > threshold ? 255 : 0
  image.bitmap.data[idx] = value
  image.bitmap.data[idx + 1] = value
  image.bitmap.data[idx + 2] = value
})

// KROK 4b: znajdź zasięg białych pikseli (bounding box contentu)
const { width, height, data } = image.bitmap
let minX = width,
  maxX = 0,
  minY = height,
  maxY = 0

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4
    if (data[idx] === 255) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
}

const padding = 10
minX = Math.max(0, minX - padding)
maxX = Math.min(width - 1, maxX + padding)
minY = Math.max(0, minY - padding)
maxY = Math.min(height - 1, maxY + padding)

console.log(`Bounding box: x=${minX}-${maxX}, y=${minY}-${maxY}`)
console.log(`Content size: ${maxX - minX} x ${maxY - minY} px`)

// KROK 4c: crop do bounding box
image.crop({ x: minX, y: minY, w: maxX - minX, h: maxY - minY })

// DEBUG: dwie pionowe kreski na 0.65 i 0.71 szerokości cropped obrazu
// const cropW = image.bitmap.width
// const cropH = image.bitmap.height
// const line1X = Math.floor(cropW * 0.69)
// const line2X = Math.floor(cropW * 0.75)
// for (let y = 0; y < cropH; y++) {
//   for (const lineX of [line1X, line2X]) {
//     const idx = (y * cropW + lineX) * 4
//     image.bitmap.data[idx] = 128
//     image.bitmap.data[idx + 1] = 128
//     image.bitmap.data[idx + 2] = 128
//   }
// }
// console.log(`Debug lines at x=${line1X} (65%) and x=${line2X} (71%)`)

// wyzeruj znak Credits
const cropW = image.bitmap.width
const cropH = image.bitmap.height
const CREDITS_START = 0.69
const CREDITS_END = 0.75
const creditsX1 = Math.floor(cropW * CREDITS_START)
const creditsX2 = Math.floor(cropW * CREDITS_END)
for (let y = 0; y < cropH; y++) {
  for (let x = creditsX1; x <= creditsX2; x++) {
    const idx = (y * cropW + x) * 4
    image.bitmap.data[idx] = 0
    image.bitmap.data[idx + 1] = 0
    image.bitmap.data[idx + 2] = 0
  }
}
console.log(
  `Blacked out Credits sign: ${CREDITS_START}-${CREDITS_END} (x=${creditsX1}-${creditsX2})`,
)

await image.write("debug_threshold.png")
console.log("Saved: debug_threshold.png")

// KROK 5: OCR SPACER API WRAPPER:

try {
  // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
  const result = await ocrSpace("debug_threshold.png", {
    apiKey: "helloworld",
    OCREngine: "2",
    isTable: true, // wymusza zwrot tekstu linia po linii - ważne dla tabelki
  })

  // Using your personal API key + local file
  // const res2 = await ocrSpace('/path/to/file.pdf', { apiKey: '<API_KEY_HERE>' });
  console.log(result)
  //console.log(result.ParsedResults[0].ParsedText)
} catch (error) {
  console.error(error)
}

// stations data:

const stations = {
  SolLondon: {
    system: "Sol",
    name: "London",
    goods: {
      "grain": 37,
      "fruit and veg": 99,
      "animal meat": 105,
      "liquor": 379,
      "medicines": 473,
      "animal skins": 614,
      "luxury goods": 1304,
      "precious metals": 1753,
      "gem stones": 2955,
      "hand weapons": 532,
      "battle weapons": 616,
      "nerve gas": 800,
      "industrial parts": 133,
      "computers": 442,
      "air processors": 204,
      "farm machinery": 87,
      "robots": 945,
      "alien artefacts": 1662,
      "chaff": 96,
      "live animals": "illegal",
      "slaves": "illegal",
      "narcotics": "illegal",
    },
  },
  SolToronto: {
    system: "Sol",
    name: "Toronto",
    goods: {
      "grain": 37,
      "fruit and veg": 149,
      "animal meat": 185,
      "liquor": 429,
      "medicines": 623,
      "animal skins": "illegal",
      "luxury goods": 1304,
      "precious metals": 1453,
      "gem stones": 2855,
      "hand weapons": 532,
      "battle weapons": 616,
      "nerve gas": "illegal",
      "industrial parts": 113,
      "computers": 442,
      "air processors": 204,
      "farm machinery": 87,
      "robots": 545,
      "alien artefacts": 1652,
      "chaff": 116,
      "live animals": 701,
      "slaves": "illegal",
      "narcotics": "illegal",
    },
  },
}

function getStationStock(stationID) {
  const station = stations[stationID]
  if (!station) throw new Error(`Unknown station: ${stationID}`)
  return station.goods
}

function calcPrices(currentStationID, targetStationID) {
  const diffs = []
  const currentGoods = getStationStock(currentStationID)
  const targetGoods = getStationStock(targetStationID)

  for (const item of Object.keys(currentGoods)) {
    const currentPrice = currentGoods[item]
    const targetPrice = targetGoods[item]

    if (typeof currentPrice !== "number" || typeof targetPrice !== "number")
      continue

    diffs.push({
      item,
      priceDiff: targetPrice - currentPrice,
    })
  }

  return diffs
}

function findHighestDiff(diffs) {
  return [...diffs].sort((a, b) => b.priceDiff - a.priceDiff).slice(0, 4)
}

function findLowestDiff(diffs) {
  return [...diffs].sort((a, b) => a.priceDiff - b.priceDiff).slice(0, 4)
}

function formatGoodsList(goodsArray, reverse = false) {
  for (const goods of goodsArray) {
    const value = reverse ? Math.abs(goods.priceDiff) : goods.priceDiff

    console.log(`  ${goods.item.padEnd(18)} +${value.toString().padStart(4)}¢`)
  }
}

function printRoute(currentStationID, targetStationID) {
  const current = stations[currentStationID]
  const target = stations[targetStationID]

  const diffs = calcPrices(currentStationID, targetStationID)

  const buyAtCurrent = findHighestDiff(diffs)
  const buyAtTarget = findLowestDiff(diffs)

  console.log("\n======= COMPUTED TRADE ROUTE =========")
  console.log(
    `${current.name} (${current.system}) → ${target.name} (${target.system})\n`,
  )

  console.log(`BUY @ ${current.name} → SELL @ ${target.name}`)
  formatGoodsList(buyAtCurrent)

  console.log(`\nBUY @ ${target.name} → SELL @ ${current.name}`)
  formatGoodsList(buyAtTarget, true)

  console.log("\n=================================\n")
}

//test skryptu:

// printRoute("SolLondon", "SolToronto")
