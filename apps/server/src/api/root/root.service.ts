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

    let i = 0
    while (i < MAX_ITERATION) {
      const xm = +((xl + xr) / 2)
      const error = +Math.abs(xr - xl)

      if (equation(xm) === 0 || error < initError) {
        result.push({ i, xl, xr, xm, error })
        break
      }

      if (equation(xm) * equation(xl) < 0) {
        xr = xm
      } else {
        xl = xm
      }

      result.push({ i, xl, xr, xm, error })

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

    let i = 0
    while (i < MAX_ITERATION) {
      const xm = +(
        (xl * equation(xr) - xr * equation(xl)) /
        (equation(xr) - equation(xl))
      )

      const error = +Math.abs(xr - xl)

      if (equation(xm) === 0 || error < initError) {
        result.push({ i, xl, xr, xm, error })
        break
      }

      if (equation(xm) * equation(xl) < 0) {
        xr = xm
      } else {
        xl = xm
      }

      result.push({ i, xl, xr, xm, error })

      i++
    }

    return result
  }
}
