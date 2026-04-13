const stations = {
  ExLondon: {
    system: "Example",
    station: "London",
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
  ExToronto: {
    system: "Example",
    station: "Toronto",
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
  return diffs.sort((a, b) => b.priceDiff - a.priceDiff).slice(0, 4)
}

function findLowestDiff(diffs) {
  return diffs.sort((a, b) => a.priceDiff - b.priceDiff).slice(0, 4)
}

function printRoute(currentStationID, targetStationID) {
  const diffs = calcPrices(currentStationID, targetStationID)
  const buyAtCurrent = findHighestDiff(diffs)
  const buyAtTarget = findLowestDiff(diffs)
  console.log(
    `Best goods to buy at ${currentStationID} and sell at ${targetStationID}:`,
  )
  console.log(buyAtCurrent)
  console.log(
    `Best goods to buy at ${targetStationID} and sell at ${currentStationID}:`,
  )
  console.log(buyAtTarget)
}

//test skryptu:

printRoute("ExLondon", "ExToronto")
