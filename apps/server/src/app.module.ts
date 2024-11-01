import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { PrismaModule } from '@numer/db'
import { ZodValidationPipe } from 'nestjs-zod'

import { RootModule } from './api/root/root.module'

@Module({
  imports: [RootModule, PrismaModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
