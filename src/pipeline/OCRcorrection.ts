export function correctCharMissMatch(goods) {
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

export function correctPriceRanges(goods) {
  return goods.map(([name, price]) => {
    if (!goodsPricesToCorrect.includes(name)) return [name, price]
    if (isNaN(price[0])) {
      console.log(
        `correctPriceRanges: expected leading digit but got "${price[0]}", name: ${name}, price: ${price}`,
      )
      return [name, price]
    }
    return [name, correctLeadingDigit("1", "7", price)]
  })
}

// a, b has to be string type
function correctLeadingDigit(a, b, string) {
  if (string[0] === a) return string.replace(a, b)
  return string
}

// lista goods w których cenach OCR często błędnie identyfikuje 7 -> 1, bezpieczne do nadpisania przy pierwszej cyfrze bo nigdy nie mogą mieć wartości 1:
export const goodsPricesToCorrect = ["Robots", "Liquor", "Medicines"]

export function changePriceToNum(goods) {
  return goods.map(([name, price]) => {
    return [name, parseFloat(price)]
  })
}
