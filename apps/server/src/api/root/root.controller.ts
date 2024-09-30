import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  BisectionArgs,
  FalsePositionArgs,
  GraphicalArgs,
  NewtonArgs,
  OnePointIterationArgs,
  SecantArgs,
} from './root.dto'
import { RootService } from './root.service'

@ApiTags('Root')
@Controller('/root')
export class RootController {
  constructor(private readonly service: RootService) {}

  @Post('/graphical')
  graphical(@Body() args: GraphicalArgs) {
    const res = this.service.graphical(args)

    return { statusCode: HttpStatus.OK, data: res }
  }

  @Post('/bisection')
  bisection(@Body() args: BisectionArgs) {
    const res = this.service.bisection(args)

    return { statusCode: HttpStatus.OK, data: res }
  }

  @Post('/false-position')
  falsePosition(@Body() args: FalsePositionArgs) {
    const res = this.service.falsePosition(args)

    return { statusCode: HttpStatus.OK, data: res }
  }

  @Post('/one-point-iteration')
  onePointIteration(@Body() args: OnePointIterationArgs) {
    const res = this.service.onePointIteration(args)

    return { statusCode: HttpStatus.OK, data: res }
  }

  @Post('/newton')
  newton(@Body() args: NewtonArgs) {
    const res = this.service.newton(args)

    return { statusCode: HttpStatus.OK, data: res }
  }

  @Post('/secant')
  secant(@Body() args: SecantArgs) {
    const res = this.service.secant(args)

    return { statusCode: HttpStatus.OK, data: res }
  }
}
