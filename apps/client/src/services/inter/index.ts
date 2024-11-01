import { ENDPOINT, HttpStatus, fetchers } from '@/utils'

import { InterpolationResponse } from './types'

export const randomInterpolation = async () => {
  const res = await fetchers.Get<InterpolationResponse>(
    `${ENDPOINT}/interpolation/random`,
  )

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as InterpolationResponse
}
