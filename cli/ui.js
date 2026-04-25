import { settings } from "../settings.js"

export function renderHeader() {
  console.log("====== FFE MARKET NAVIGATOR ======")
}

export function clearScreen() {
  console.clear()
}

export function progressBar(duration = 2000) {
  return new Promise((resolve) => {
    const total = 30
    let current = 0

    const interval = setInterval(() => {
      current++

      const bar = "[" + "#".repeat(current) + "-".repeat(total - current) + "]"

      process.stdout.write(
        "\r" + bar + ` ${Math.floor((current / total) * 100)}%`,
      )

      if (current >= total) {
        clearInterval(interval)
        process.stdout.write("\n")
        resolve()
      }
    }, duration / total)
  })
}

export function progressBarWrapper(duration) {
  if (settings.noFluff) {
    return Promise.resolve()
  }
  return progressBar(duration)
}

export function typeText(text, speed = 20) {
  return new Promise((resolve) => {
    let i = 0

    const interval = setInterval(() => {
      process.stdout.write(text[i])
      i++

      if (i >= text.length) {
        clearInterval(interval)
        process.stdout.write("\n")
        resolve()
      }
    }, speed)
  })
}

export function typeTextWrapper(text, speed) {
  if (settings.noFluff) {
    console.log(text)
    return Promise.resolve()
  }
  return typeText(text, speed)
}
