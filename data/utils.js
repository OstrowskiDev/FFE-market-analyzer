export function getSystemName(input) {
  return toTitleCase(input)
}

export function getStationName(input) {
  return toTitleCase(input)
}

function toTitleCase(str) {
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

function sanitize(str) {
  return str.replace(/[^a-zA-Z0-9]/g, "")
}

export function getStationID(system, stationName) {
  const systemPart = sanitize(system).slice(0, 3)
  const stationPart = sanitize(stationName)

  if (!systemPart || !stationPart) {
    throw new Error("Invalid system or station name for ID generation")
  }

  return systemPart + stationPart
}
