// import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { Method } from './constants'

export const methodAtom = atomWithStorage<Method | null>('selectedMethod', null)
