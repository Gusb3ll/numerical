import { ENDPOINT, HttpStatus, fetchers } from '@/utils'

import {
  BisectionArgs,
  BisectionResponse,
  FalsePositionArgs,
  FalsePositionResponse,
  GraphicalArgs,
  GraphicalResponse,
  NewtonArgs,
  NewtonResponse,
  OnePointArgs,
  OnePointResponse,
  SecantArgs,
  SecantResponse,
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

export const onePoint = async (args: OnePointArgs) => {
  const res = await fetchers.Post<OnePointResponse>(
    `${ENDPOINT}/root/one-point-iteration`,
    {
      data: { func: args.func, x0: +args.x0, error: +args.error },
    },
  )

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as OnePointResponse
}

export const newton = async (args: NewtonArgs) => {
  const res = await fetchers.Post<NewtonResponse>(`${ENDPOINT}/root/newton`, {
    data: { func: args.func, x0: +args.x0, error: +args.error },
  })

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as NewtonResponse
}

export const secant = async (args: SecantArgs) => {
  const res = await fetchers.Post<SecantResponse>(`${ENDPOINT}/root/secant`, {
    data: { func: args.func, x0: +args.x0, x1: +args.x1, error: +args.error },
  })

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as SecantResponse
}

export * from './types'
