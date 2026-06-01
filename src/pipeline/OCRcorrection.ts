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
  return goods.map(([name, price]) => {
    if (!goodsPricesToCorrect.includes(name)) return [name, price]
    if (/^\D/.test(price)) {
      console.log(
        `correctPriceRanges: expected leading digit but got "${price[0]}", name: ${name}, price: ${price}`,
      )
      return [name, price]
    }
    return [name, correctLeadingDigit("1", "7", price)]
  })
}

// a, b has to be string type
function correctLeadingDigit(a: string, b: string, string: string) {
  if (string[0] === a) return string.replace(a, b)
  return string
}

// lista goods w których cenach OCR często błędnie identyfikuje 7 -> 1, bezpieczne do nadpisania przy pierwszej cyfrze bo nigdy nie mogą mieć wartości 1:
const goodsPricesToCorrect = ["Robots", "Liquor", "Medicines"]

export function changePriceToNum(goods: OcrRawGods): OcrParsedGoods {
  return goods.map(([name, price]) => {
    return [name, parseFloat(price)]
  })
}
