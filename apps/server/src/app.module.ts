import { Module } from '@nestjs/common'

import { RootModule } from './api/root/root.module'

@Module({
  imports: [RootModule],
})
export class AppModule {}
