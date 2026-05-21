export type Stations = Record<string, Station>

export interface Station {
  goods: Goods
  system: string
  name: string
  id: string
}

export type Goods = Record<string, number>

export type SystemDiffs = Array<SystemDiff>

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

/*
RETURNS:
SystemDiff[]

SystemDiff:
[
  {
    diffsHighest: DiffEntry[], //sorted desc (top N) A->B
    diffsLowest:  DiffEntry[], //sorted asc (top N) B->A (negative num)
    stationNameA: string,
    stationNameB: string,
    systemA: string,
    systemB: string
  }
]

DiffEntry:
  { 
    item: string,         // goods name
    priceDiff: number     // profit
  }
*/
