import { Controller, Get, HttpStatus, Query } from '@nestjs/common'

import { LinearServie } from './linear.service'

@Controller('/linear')
export class LinearController {
  constructor(private readonly service: LinearServie) {}

  @Get('/random-matrix')
  async getRandomMatrix(@Query('dim') dim: number) {
    const res = await this.service.randomMatrix(dim)

    return { statusCode: HttpStatus.OK, data: res }
  }
}
