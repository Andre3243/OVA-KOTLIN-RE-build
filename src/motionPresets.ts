import type { Transition, Variants } from 'motion/react'

export const silkEase = [0.16, 1, 0.3, 1] as const
export const easeOut = [0.22, 1, 0.36, 1] as const

export const springTransition = {
  type: 'spring',
  stiffness: 220,
  damping: 28,
  mass: 0.88,
} satisfies Transition

export const pillSpring = {
  type: 'spring',
  stiffness: 340,
  damping: 32,
  mass: 0.75,
} satisfies Transition

export const revealTransition = {
  duration: 0.68,
  ease: silkEase,
} satisfies Transition

export const gentleHover = { y: -2, scale: 1.008 }
export const gentleTap = { scale: 0.985 }

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.06,
    },
  },
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.64,
      ease: silkEase,
    },
  },
}
