import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { PrismaModule } from '@numer/db'
import { ZodValidationPipe } from 'nestjs-zod'

import { IntegrationModule } from './api/integration/integration.module'
import { InterModule } from './api/interpolation/inter.module'
import { LinearModule } from './api/linear/linear.module'
import { RootModule } from './api/root/root.module'

@Module({
  imports: [
    IntegrationModule,
    InterModule,
    LinearModule,
    RootModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
