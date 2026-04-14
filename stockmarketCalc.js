import fs from "fs"
import path from "path"
import { Jimp } from "jimp"
import Tesseract from "tesseract.js"

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

// KROK 4: threshold
image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
  const brightness = image.bitmap.data[idx]
  // po grayscale R = G = B, więc bierzemy R
  const threshold = 200

  const value = brightness > threshold ? 255 : 0

  image.bitmap.data[idx] = value // R
  image.bitmap.data[idx + 1] = value // G
  image.bitmap.data[idx + 2] = value // B
})

// image.threshold({ max: 60, replace: 255, autoGreyscale: true })

await image.write("debug_threshold.png")
console.log("After debug_threshold")

// KROK 5: OCR
const {
  data: { text },
} = await Tesseract.recognize("debug_threshold.png")
console.log("OCR result:\n", text)

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

printRoute("SolLondon", "SolToronto")
