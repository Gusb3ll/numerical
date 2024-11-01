import { Injectable } from '@nestjs/common'
import { PrismaService } from '@numer/db'

@Injectable()
export class LinearServie {
  constructor(private readonly db: PrismaService) {}

  async randomMatrix(dim: number) {
    const matrix: number[][] = []

    for (let i = 0; i < dim; i++) {
      const row: number[] = []

      for (let j = 0; j < dim; j++) {
        row.push(Math.floor(Math.random() * 10))
      }

      matrix.push(row)
    }

    const matrixEqual: number[] = []
    for (let i = 0; i < dim; i++) {
      matrixEqual.push(Math.floor(Math.random() * 10))
    }
    const frontEqual: number[] = []
    for (let i = 0; i < dim; i++) {
      frontEqual.push(Math.floor(Math.random() * 10))
    }

    return {
      matrix,
      matrixEqual,
      frontEqual,
    }
  }
}
