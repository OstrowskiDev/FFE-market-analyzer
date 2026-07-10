import type { OcrParsedGoods, OcrRawGods } from "../types/index.js"

export function correctCharMissMatch(goods: OcrRawGods): OcrRawGods {
  return goods.map(([name, price]) => {
    let corrected = ""
    for (const char of price) {
      switch (char) {
        case "B":
          corrected = corrected + "8"
          break
        case "Б":
          corrected = corrected + "6"
          break
        default:
          corrected = corrected + char
      }
    }
    return [name, corrected]
  })
}

export function correctPriceRanges(goods: OcrRawGods): OcrRawGods {
  // 3-digit prices: position 0 fix (7 misread as 1)
  // prettier-ignore
  goods = correctGoodsPrices(goods, ["Robots", "Liquor", "Medicines"], 0, "1", "7")
  // 4-digit prices: position 1 fix (7 misread as 1)
  goods = correctGoodsPrices(goods, ["Precious Metals"], 1, "1", "7")
  return goods
}

function correctGoodsPrices(
  goods: OcrRawGods,
  goodsToCorrect: string[],
  position: number,
  a: string,
  b: string,
): OcrRawGods {
  return goods.map(([name, price]) => {
    if (!goodsToCorrect.includes(name)) return [name, price]
    return [name, correctDigit(position, a, b, price)]
  })
}

function correctDigit(n: number, a: string, b: string, str: string) {
  if (str[n] === a) return str.slice(0, n) + b + str.slice(n + 1)
  return str
}

export function changePriceToNum(goods: OcrRawGods): OcrParsedGoods {
  return goods.map(([name, price]) => {
    return [name, parseFloat(price)]
  })
}
