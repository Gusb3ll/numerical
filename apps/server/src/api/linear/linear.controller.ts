import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { LinearServie } from './linear.service'

@ApiTags('Linear Algebra')
@Controller('/linear')
export class LinearController {
  constructor(private readonly service: LinearServie) {}

  @Get('/random-matrix')
  async getRandomMatrix(@Query('dim') dim: number) {
    const res = await this.service.randomMatrix(dim)

    return { statusCode: HttpStatus.OK, data: res }
  }
}
