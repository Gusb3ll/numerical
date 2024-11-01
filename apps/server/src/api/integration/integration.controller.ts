import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { IntegrationService } from './integration.service'

@ApiTags('Integration')
@Controller('/integration')
export class IntegrationController {
  constructor(private readonly service: IntegrationService) {}

  @Get('/random')
  async random() {
    const res = await this.service.random()

    return { statusCode: HttpStatus.OK, data: res }
  }
}
