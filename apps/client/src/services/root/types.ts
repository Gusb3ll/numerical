export type BisectionArgs = {
  func: string
  xl: number
  xr: number
  error: number
}

export type BisectionResult = {
  i: number
  xl: number
  xr: number
  xm: number
  error: number
}

export type BisectionResponse = BisectionResult[]
