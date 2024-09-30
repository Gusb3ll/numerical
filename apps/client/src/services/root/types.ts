export type GraphicalArgs = {
  func: string
  xl: number
  xr: number
  error: number
}
export type GraphicalResponse = {
  i: number
  x: number
  fx: number
  error: number
}[]

export type BisectionArgs = {
  func: string
  xl: number
  xr: number
  error: number
}
export type BisectionResponse = {
  i: number
  xl: number
  xr: number
  xm: number
  fxm: number
  error: number
}[]

export type FalsePositionArgs = {
  func: string
  xl: number
  xr: number
  error: number
}
export type FalsePositionResponse = {
  i: number
  xl: number
  xr: number
  xm: number
  fxm: number
  error: number
}[]

export type OnePointArgs = {
  func: string
  x0: number
  error: number
}
export type OnePointResponse = {
  i: number
  x: number
  fx: number
  error: number
}[]

export type NewtonArgs = {
  func: string
  x0: number
  error: number
}
export type NewtonResponse = {
  i: number
  x: number
  fx: number
  fxP: number
  error: number
}[]

export type SecantArgs = {
  func: string
  x0: number
  x1: number
  error: number
}
export type SecantResponse = {
  i: number
  x: number
  fx: number
  error: number
}[]
