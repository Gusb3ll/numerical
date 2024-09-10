import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { BisectionArgs, FalsePositionArgs } from './root.dto'
import { RootService } from './root.service'

@ApiTags('Root')
@Controller('/root')
export class RootController {
  constructor(private readonly service: RootService) {}

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
