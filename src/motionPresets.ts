import type { Transition } from 'motion/react'

export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
  mass: 0.85,
} satisfies Transition

export const easeOut = [0.22, 1, 0.36, 1] as const
export const revealTransition = { duration: 0.55, ease: easeOut } satisfies Transition
export const gentleHover = { y: -3, scale: 1.015 }
export const gentleTap = { scale: 0.975 }
