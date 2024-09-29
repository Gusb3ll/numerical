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
  fxm: number
  error: number
}

export type BisectionResponse = BisectionResult[]

export type FalsePositionArgs = {
  func: string
  xl: number
  xr: number
  error: number
}

export type FalsePositionResult = {
  i: number
  xl: number
  xr: number
  xm: number
  fxm: number
  error: number
}

export type FalsePositionResponse = FalsePositionResult[]
