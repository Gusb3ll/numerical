import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { BisectionArgs, FalsePositionArgs, GraphicalArgs } from './root.dto'
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
}
