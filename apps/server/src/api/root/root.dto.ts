import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export class BisectionArgs extends createZodDto(
  z.object({
    func: z.string(),
    xl: z.number(),
    xr: z.number(),
    error: z.number(),
  }),
) {}

export class FalsePositionArgs extends createZodDto(
  z.object({
    func: z.string(),
    xl: z.number(),
    xr: z.number(),
  }),
) {}

export class NewtonArgs extends createZodDto(
  z.object({
    func: z.string(),
    x0: z.number(),
  }),
) {}

export class SecantArgs extends createZodDto(
  z.object({
    func: z.string(),
    x0: z.number(),
    x1: z.number(),
  }),
) {}

export class OnePointIterationArgs extends createZodDto(
  z.object({
    func: z.string(),
    x0: z.number(),
  }),
) {}
