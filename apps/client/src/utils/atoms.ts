// import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { Method, Problem } from './constants'

export const methodAtom = atomWithStorage<Method | null>('selectedMethod', null)
export const currentProblemAtom = atomWithStorage<Problem | null>(
  'currentProblem',
  null,
)
