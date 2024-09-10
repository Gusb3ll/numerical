import { atom } from 'jotai'

import { Method } from './constants'

export const methodAtom = atom<Method | null>(null)
