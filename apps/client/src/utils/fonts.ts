import { Noto_Sans_Math, Inter as _Inter } from 'next/font/google'

export const Inter = _Inter({
  weight: ['400', '500', '700'],
  display: 'swap',
  subsets: ['latin'],
  preload: true,
})

export const NotoSansMath = Noto_Sans_Math({
  weight: ['400'],
  display: 'swap',
  subsets: ['math'],
  preload: true,
})
