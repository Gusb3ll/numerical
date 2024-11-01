import { ENDPOINT, HttpStatus, fetchers } from '@/utils'

import { IntegrationResponse } from './types'

export const randomIntegration = async () => {
  const res = await fetchers.Get<IntegrationResponse>(
    `${ENDPOINT}/integration/random`,
  )

  if (
    res.statusCode >= HttpStatus.BAD_REQUEST ||
    res.statusCode === HttpStatus.FAILED_TO_FETCH
  ) {
    throw new Error(res.message)
  }

  return res.data as IntegrationResponse
}
