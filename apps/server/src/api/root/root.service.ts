import { BadRequestException, Injectable } from '@nestjs/common'
import { evaluate, simplify } from 'mathjs'

import {
  BisectionResult,
  FalsePositionResult,
  GraphicalResult,
  OnePointIterationResult,
} from './dto'
import {
  BisectionArgs,
  FalsePositionArgs,
  GraphicalArgs,
  OnePointIterationArgs,
} from './root.dto'

const MAX_ITERATION = 5000

@Injectable()
export class RootService {
  graphical(args: GraphicalArgs) {
    const { func, xl: initXL, xr: initXR, error: initError } = args

    const equation = (x: number) => {
      try {
        const f = simplify(func).toString()

        return evaluate(f, { x })
      } catch {
        throw new BadRequestException('Invalid function')
      }
    }

    const result: GraphicalResult[] = []

    let xl = +initXL
    let xr = +initXR
    let i = 0

    // TODO: Fix
    while (i < MAX_ITERATION) {
      const x = +((xl + xr) / 2)
      const fx = equation(x)
      const error = +Math.abs((x - xl) / x)

      result.push({ i, x, fx, error })

      if (fx === 0 || error < initError) {
        break
      }

      if (equation(xl) * fx < 0) {
        xr = x
      } else {
        xl = x
      }

      i++
    }

    return result
  }

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

  onePointIteration(args: OnePointIterationArgs) {
    const { func, x0, error: initError } = args

    const equation = (x: number) => {
      try {
        const f = simplify(func).toString()

        return evaluate(f, { x })
      } catch {
        throw new BadRequestException('Invalid function')
      }
    }

    const result: OnePointIterationResult[] = []

    let x = x0
    let i = 0

    while (i < MAX_ITERATION) {
      const fx = equation(x)
      const error = +Math.abs((fx - x) / fx)

      result.push({ i, x, fx, error })

      if (error < initError) {
        break
      }

      x = fx
      i++
    }

    return result
  }
}
