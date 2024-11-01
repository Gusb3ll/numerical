import { Injectable } from '@nestjs/common'
import { PrismaService } from '@numer/db'

@Injectable()
export class InterService {
  constructor(private readonly db: PrismaService) {}

  async random() {
    const interpolations = await this.db.interpolation.findMany()

    const data =
      interpolations[Math.floor(Math.random() * interpolations.length)]

    return data
  }
}
