import { Module } from '@nestjs/common'

import { InterController } from './inter.controller'
import { InterService } from './inter.service'

@Module({
  controllers: [InterController],
  providers: [InterService],
})
export class InterModule {}
