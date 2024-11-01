import { Controller, Get, HttpStatus } from '@nestjs/common'

import { InterService } from './inter.service'

@Controller('/interpolation')
export class InterController {
  constructor(private readonly service: InterService) {}

  @Get('/random')
  async random() {
    const res = await this.service.random()

    return { statsCode: HttpStatus.OK, data: res }
  }
}
