export function getSystemName(input: string): string {
  return toTitleCase(input)
}

export function getStationName(input: string): string {
  return toTitleCase(input)
}

function toTitleCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

function sanitize(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "")
}

export function getStationID(system: string, stationName: string): string {
  const systemPart = sanitize(system).slice(0, 3)
  const stationPart = sanitize(stationName)

  if (!systemPart || !stationPart) {
    throw new Error("Invalid system or station name for ID generation")
  }

  return systemPart + stationPart
}
