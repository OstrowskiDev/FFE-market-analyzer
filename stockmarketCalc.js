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
  const threshold = 200
  const value = brightness > threshold ? 255 : 0
  image.bitmap.data[idx] = value
  image.bitmap.data[idx + 1] = value
  image.bitmap.data[idx + 2] = value
})

// KROK 4b: auto-detect bounding box białych pikseli
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

// KROK 4c: znajdź granicę między kolumnami (pionowy pas z min. białych pikseli)
// szukamy w środkowej 60% szerokości żeby nie złapać krawędzi
const searchLeft = minX + Math.floor((maxX - minX) * 0.2)
const searchRight = minX + Math.floor((maxX - minX) * 0.8)

let splitX = searchLeft
let minWhiteInColumn = Infinity

for (let x = searchLeft; x <= searchRight; x++) {
  let whiteCount = 0
  for (let y = minY; y <= maxY; y++) {
    const idx = (y * width + x) * 4
    if (data[idx] === 255) whiteCount++
  }
  if (whiteCount < minWhiteInColumn) {
    minWhiteInColumn = whiteCount
    splitX = x
  }
}

// przesuń split 10% szerokości contentu w prawo
splitX = Math.min(maxX, splitX + Math.floor((maxX - minX) * 0.21))

console.log(
  `Split column at x=${splitX} (${Math.round(((splitX - minX) / (maxX - minX)) * 100)}% of content width)`,
)

// debug: zapisz threshold z zaznaczoną linią podziału
const debugImg = image.clone()
for (let y = 0; y < height; y++) {
  const idx = (y * width + splitX) * 4
  debugImg.bitmap.data[idx] = 128
  debugImg.bitmap.data[idx + 1] = 128
  debugImg.bitmap.data[idx + 2] = 128
}
await debugImg.write("debug_threshold.png")
console.log("Saved: debug_threshold.png")

// KROK 5: OCR - dwa przejścia
const { createWorker } = Tesseract

// przejście 1: lewa kolumna → nazwy towarów
const workerNames = await createWorker("eng", 1)
const {
  data: { text: namesText },
} = await workerNames.recognize("debug_threshold.png", {
  rectangle: {
    left: minX,
    top: minY,
    width: splitX - minX,
    height: maxY - minY,
  },
})
await workerNames.terminate()

// przejście 2: prawa kolumna → ceny
const workerPrices = await createWorker("eng", 2, {
  legacyCore: true,
  legacyLang: true,
})
await workerPrices.setParameters({ tessedit_char_whitelist: "0123456789." })
const {
  data: { text: pricesText },
} = await workerPrices.recognize("debug_threshold.png", {
  rectangle: {
    left: splitX,
    top: minY,
    width: maxX - splitX,
    height: maxY - minY,
  },
})
await workerPrices.terminate()

// połącz wyniki
const names = namesText
  .trim()
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
const prices = pricesText
  .trim()
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)

console.log("\nOCR names:\n", names)
console.log("\nOCR prices:\n", prices)

const result = names.map((name, i) => ({ name, price: prices[i] ?? "?" }))
console.log("\nFinal result:")
for (const row of result) {
  console.log(`  ${row.name.padEnd(20)} ${row.price}`)
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
