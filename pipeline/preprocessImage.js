import { Jimp } from "jimp"

export async function preprocessImage(file) {
  const image = await Jimp.read(file)

  // FAZA 2 - poprawienie rozdzielczości dla lepszego rezultatu OCR readera
  image.scale(3)

  // FAZA 3 grayscale
  image.greyscale()
  await image.write("debug_grayscale.png")
  console.log("After grayscale")
  console.log("Saved: debug_grayscale.png")

  // FAZA 3.5 - pre-crop, tylko jeśli screenshoty są pobierane z F12+p dosbox-x:
  {
    const minX = Math.floor(image.bitmap.width * 0.46)
    const maxX = Math.floor(image.bitmap.width * 0.77)
    const minY = Math.floor(image.bitmap.height * 0.055)
    const maxY = Math.floor(image.bitmap.height * 0.73)

    image.crop({
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY,
    })
  }

  // FAZA 4: threshold - usunięcie szumu informacyjnego
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    function (x, y, idx) {
      const brightness = image.bitmap.data[idx]
      const threshold = 200
      const value = brightness > threshold ? 255 : 0
      image.bitmap.data[idx] = value
      image.bitmap.data[idx + 1] = value
      image.bitmap.data[idx + 2] = value
    },
  )

  // FAZA 4b: znajdź zasięg białych pikseli (bounding box contentu)
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

  // FAZA 4c: crop do bounding box
  image.crop({ x: minX, y: minY, w: maxX - minX, h: maxY - minY })

  // skasowanie znaku Credits
  const cropW = image.bitmap.width
  const cropH = image.bitmap.height
  const CREDITS_START = 0.69
  const CREDITS_END = 0.74
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
}
