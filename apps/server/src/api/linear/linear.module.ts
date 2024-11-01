import { Module } from '@nestjs/common'

import { LinearController } from './linear.controller'
import { LinearServie } from './linear.service'

@Module({
  controllers: [LinearController],
  providers: [LinearServie],
})
export class LinearModule {}
