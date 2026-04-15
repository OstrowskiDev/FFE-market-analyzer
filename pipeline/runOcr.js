import { ocrSpace } from "ocr-space-api-wrapper"

export async function runOcr() {
  let result
  try {
    // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
    result = await ocrSpace("debug_threshold.png", {
      apiKey: "helloworld",
      OCREngine: "2",
      isTable: true, // wymusza zwrot tekstu linia po linii - ważne dla tabelki
    })

    // Using your personal API key + local file
    // const res2 = await ocrSpace('/path/to/file.pdf', { apiKey: '<API_KEY_HERE>' });

    console.log(result)
    //console.log(result.ParsedResults[0].ParsedText)
  } catch (error) {
    console.error(error)
  }
  return result.ParsedResults[0].ParsedText
}
