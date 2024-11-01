import { ENDPOINT, HttpStatus, fetchers } from '@/utils'

import { GetRandomMatrixResponse } from './types'

export const randomMatrix = async (dim: number) => {
  const res = await fetchers.Get<GetRandomMatrixResponse>(
    `${ENDPOINT}/linear/random-matrix?dim=${dim}`,
  )

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as GetRandomMatrixResponse
}

export * from './types'
