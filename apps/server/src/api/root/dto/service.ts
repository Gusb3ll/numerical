export type GraphicalResult = {
  i: number
  x: number
  fx: number
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

export type FalsePositionResult = {
  i: number
  xl: number
  xr: number
  xm: number
  fxm: number
  error: number
}

export type OnePointIterationResult = {
  i: number
  x: number
  fx: number
  error: number
}

export type NewtonResult = {
  i: number
  x: number
  fx: number
  fxP: number
  error: number
}

export type SecantResult = {
  i: number
  x: number
  fx: number
  error: number
}
