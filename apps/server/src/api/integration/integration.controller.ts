import { Controller, Get, HttpStatus } from '@nestjs/common'

import { IntegrationService } from './integration.service'

@Controller('/integration')
export class IntegrationController {
  constructor(private readonly service: IntegrationService) {}

  @Get('/random')
  async random() {
    const res = await this.service.random()

    return { statusCode: HttpStatus.OK, data: res }
  }
}
