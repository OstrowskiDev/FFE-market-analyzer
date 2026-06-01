import { loadSettings } from "../data/settingsIO.js"

const settings = loadSettings()

export function renderHeader() {
  console.log("====== FFE MARKET NAVIGATOR ======")
}

export function clearScreen() {
  console.clear()
}

function progressBar(duration = 2000): Promise<void> {
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

export function progressBarWrapper(duration: number): Promise<void> {
  if (settings.noFluff) {
    return Promise.resolve()
  }
  return progressBar(duration)
}

function typeText(text: string, speed = 20): Promise<void> {
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

export function typeTextWrapper(text: string, speed = 20): Promise<void> {
  if (settings.noFluff) {
    console.log(text)
    return Promise.resolve()
  }
  return typeText(text, speed)
}
