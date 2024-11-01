import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { PrismaModule } from '@numer/db'
import { ZodValidationPipe } from 'nestjs-zod'

import { LinearModule } from './api/linear/linear.module'
import { RootModule } from './api/root/root.module'

@Module({
  imports: [RootModule, LinearModule, PrismaModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
