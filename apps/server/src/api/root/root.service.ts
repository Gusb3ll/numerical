import { BadRequestException, Injectable } from '@nestjs/common'
import { evaluate, simplify } from 'mathjs'

import { BisectionResult, FalsePositionResult } from './dto'
import { BisectionArgs, FalsePositionArgs } from './root.dto'

const MAX_ITERATION = 5000

@Injectable()
export class RootService {
  bisection(args: BisectionArgs) {
    const { func, xl: initXL, xr: initXR, error: initError } = args

    const equation = (x: number) => {
      try {
        const f = simplify(func).toString()

        return evaluate(f, { x })
      } catch {
        throw new BadRequestException('Invalid function')
      }
    }
    const result: BisectionResult[] = []

    let xl = +initXL
    let xr = +initXR
    let xm = 0
    let fxm = 0
    let prevXm = 0

    let i = 0
    while (i < MAX_ITERATION) {
      xm = +((xl + xr) / 2)
      const error = +Math.abs((xm - prevXm) / xm)
      fxm = equation(xm)

      result.push({ i, xl, xr, xm, fxm, error })

      if (equation(xm) === 0 || error < initError) {
        break
      }

      if (equation(xm) * equation(xl) < 0) {
        xr = xm
      } else {
        xl = xm
      }

      prevXm = xm
      i++
    }

    return result
  }

  falsePosition(args: FalsePositionArgs) {
    const { func, xl: initXL, xr: initXR, error: initError } = args

    const equation = (x: number) => {
      try {
        const f = simplify(func).toString()

        return evaluate(f, { x })
      } catch {
        throw new BadRequestException('Invalid function')
      }
    }
    const result: FalsePositionResult[] = []

    let xl = +initXL
    let xr = +initXR
    let xm = 0
    let fxm = 0
    let prevXm = 0

    let i = 0
    while (i < MAX_ITERATION) {
      if (equation(xl) * equation(xr) >= 0) {
        throw new BadRequestException('Invalid range')
      }

      xm = +(
        (xl * equation(xr) - xr * equation(xl)) /
        (equation(xr) - equation(xl))
      )
      fxm = equation(xm)
      const error = +Math.abs((xm - prevXm) / xm)

      result.push({ i, xl, xr, xm, fxm, error })

      if (equation(xm) === 0 || error < initError) {
        break
      }

      if (equation(xm) * equation(xl) < 0) {
        xr = xm
      } else {
        xl = xm
      }

      prevXm = xm
      i++
    }

    return result
  }
}
