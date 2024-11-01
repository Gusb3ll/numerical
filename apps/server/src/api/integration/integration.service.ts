import { Injectable } from '@nestjs/common'
import { PrismaService } from '@numer/db'

@Injectable()
export class IntegrationService {
  constructor(private readonly db: PrismaService) {}

  async random() {
    const integrations = await this.db.integration.findMany()

    const data = integrations[Math.floor(Math.random() * integrations.length)]

    return data
  }
}
