export type Stations = Record<string, Station>

export interface Station {
  goods: Goods
  system: string
  name: string
  id: string
}

export type Goods = Record<string, number>

export type OcrRawGods = [string, string][] // [string, 'number'][]

export type OcrParsedGoods = [string, number][]

export interface SystemDiff {
  diffsHighest: DiffEntry[] //sorted desc (top N) A->B
  diffsLowest: DiffEntry[] //sorted asc (top N) B->A (negative num)
  stationNameA: string
  stationNameB: string
  systemA: string
  systemB: string
}

export interface DiffEntry {
  item: string //goods name
  priceDiff: number //profit
}

export interface TradeRoute {
  bestBuy: DiffEntry[]
  bestSell: DiffEntry[]
  stationNameA: string
  stationNameB: string
  systemA: string
  systemB: string
}

export interface BestRoute {
  bestBuy: DiffEntry[]
  bestSell: DiffEntry[]
  profit: number
  stationNameA: string
  stationNameB: string
  systemA: string
  systemB: string
}

export interface RouteOptions {
  illegal: boolean
}

export type Settings = {
  commanderName: string
  screenshotDir: string
  publicFreeApiKey: string
  noFluff: boolean
  ignoredGoods: string[]
}
