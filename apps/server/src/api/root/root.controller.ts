import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { BisectionArgs } from './root.dto'
import { RootService } from './root.service'

@ApiTags('Root')
@Controller('/root')
export class RootController {
  constructor(private readonly service: RootService) {}

  @Post('/bisection')
  async bisection(@Body() args: BisectionArgs) {
    const res = await this.service.bisection(args)

    return { statusCode: HttpStatus.OK, data: res }
  }
}
