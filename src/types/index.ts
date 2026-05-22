export type Stations = Record<string, Station>

export interface Station {
  goods: Goods
  system: string
  name: string
  id: string
}

export type Goods = Record<string, number>

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

export interface BestRoute {
  bestBuy: DiffEntry[]
  bestSell: DiffEntry[]
  profit: number
  stationNameA: string
  stationNameB: string
  systemA: string
  systemB: string
}

export type ParsedOCRGoods = Array<[string, string]> // [name, 'number'][]
