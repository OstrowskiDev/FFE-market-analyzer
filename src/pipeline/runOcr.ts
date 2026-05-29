import { ocrSpace } from "ocr-space-api-wrapper"
import { logger } from "../cli/helpers.js"
import { loadSettings } from "../data/settingsIO.js"

export async function runOcr(): Promise<string> {
  const settings = loadSettings()
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
