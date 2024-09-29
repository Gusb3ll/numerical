import { ENDPOINT, HttpStatus, fetchers } from '@/utils'

import {
  BisectionArgs,
  BisectionResponse,
  FalsePositionArgs,
  FalsePositionResponse,
  GraphicalArgs,
  GraphicalResponse,
} from './types'

export const graphical = async (args: GraphicalArgs) => {
  const res = await fetchers.Post<GraphicalResponse>(
    `${ENDPOINT}/root/graphical`,
    {
      data: { func: args.func, xl: +args.xl, xr: +args.xr, error: +args.error },
    },
  )

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as GraphicalResponse
}

export const bisection = async (args: BisectionArgs) => {
  const res = await fetchers.Post<BisectionResponse>(
    `${ENDPOINT}/root/bisection`,
    {
      data: { func: args.func, xl: +args.xl, xr: +args.xr, error: +args.error },
    },
  )

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as BisectionResponse
}

export const falsePosition = async (args: FalsePositionArgs) => {
  const res = await fetchers.Post<FalsePositionResponse>(
    `${ENDPOINT}/root/false-position`,
    {
      data: { func: args.func, xl: +args.xl, xr: +args.xr, error: +args.error },
    },
  )

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as FalsePositionResponse
}

export * from './types'
