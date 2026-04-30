import { ocrSpace } from "ocr-space-api-wrapper"
import { settings } from "../settings.js"
import { logger } from "../cli/helpers.js"

export async function runOcr() {
  const API_KEY = process.env.API_KEY || settings.publicFreeApiKey
  let result
  try {
    // Using the OCR.space default free API key (max 10requests in 10mins) + remote file
    result = await ocrSpace("debug_threshold.png", {
      apiKey: API_KEY,
      OCREngine: "2",
      isTable: true, // wymusza zwrot tekstu linia po linii - ważne dla tabelki
      language: "eng",
    })

    logger(result)
  } catch (error) {
    console.error(error)
    throw error
  }

  if (result.IsErroredOnProcessing) {
    throw new Error(
      `OCR API error (code ${result.OCRExitCode}): ${result.ErrorMessage?.join(", ")}`,
    )
  }

  return result.ParsedResults[0].ParsedText
}

// Scrapes https://status.ocr.space and returns true/false for Free OCR API Engine 2
// Returns null if the status page is unreachable or the page structure changed
export async function checkOcrEngineStatus() {
  try {
    const res = await fetch("https://status.ocr.space", {
      signal: AbortSignal.timeout(5000),
    })
    const html = await res.text()
    // The status page has a table row: "Free OCR API ..." | UP/DOWN | UP/DOWN
    // Second capture group is Engine 2
    const match = html.match(
      /Free OCR API[\s\S]*?<td[^>]*>(UP|DOWN)<\/td>[\s\S]*?<td[^>]*>(UP|DOWN)<\/td>/i,
    )
    if (!match) return null
    return match[2] === "UP"
  } catch {
    return null
  }
}
