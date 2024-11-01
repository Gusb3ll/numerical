import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { InterService } from './inter.service'

@ApiTags('Interpolation')
@Controller('/interpolation')
export class InterController {
  constructor(private readonly service: InterService) {}

  @Get('/random')
  async random() {
    const res = await this.service.random()

    return { statsCode: HttpStatus.OK, data: res }
  }
}
