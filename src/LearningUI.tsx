import { useEffect, useId, useLayoutEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue } from 'motion/react'
import { ArrowLeft, ArrowRight, ChevronDown, CircleHelp, type LucideIcon } from 'lucide-react'
import { sections } from './content/navigation'
import {
  gentleHover,
  gentleTap,
  revealTransition,
  silkEase,
  springTransition,
  staggerContainerVariants,
  staggerItemVariants,
} from './motionPresets'

const MotionLink = motion.create(Link)

export function AnimatedPage({ children }: { children: ReactNode }) {
  // Reinicia el scroll de forma instantánea ANTES del primer pintado y del IntersectionObserver
  // de la nueva sección, evitando que las animaciones de scroll se disparen antes de verlas.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.52, ease: silkEase } }}
      exit={{ opacity: 0, y: -14, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
    >
      {children}
    </motion.div>
  )
}

export function ReadingProgress() {
  const progress = useMotionValue(0)
  useEffect(() => {
    function update() {
      const page = document.scrollingElement
      if (!page) return
      const distance = page.scrollHeight - page.clientHeight
      progress.set(distance > 0 ? Math.min(1, Math.max(0, page.scrollTop / distance)) : 0)
    }
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [progress])
  return <motion.div className="readingProgress" aria-hidden="true" style={{ scaleX: progress }} />
}

export function TextReveal({ children, as = 'h1' }: { children: string; as?: 'h1' | 'p' }) {
  if (as === 'p') {
    return (
      <motion.p
        className="lead"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, ease: silkEase, delay: 0.2 }}
      >
        {children}
      </motion.p>
    )
  }

  return (
    <motion.h1
      initial="hidden"
      animate="shown"
      aria-label={children}
      variants={{ shown: { transition: { staggerChildren: 0.048, delayChildren: 0.06 } } }}
    >
      {children.split(' ').map((word, index) => (
        <span key={index} className="revealWordClip" aria-hidden="true">
          <motion.span
            className="revealWord"
            variants={{
              hidden: { opacity: 0, y: '65%' },
              shown: { opacity: 1, y: '0%' },
            }}
            transition={{ duration: 0.58, ease: silkEase }}
          >
            {word}
          </motion.span>
          {' '}
        </span>
      ))}
    </motion.h1>
  )
}

export function RevealBlock({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.988 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -75px 0px' }}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.16, margin: '0px 0px -70px 0px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  )
}

export function ContentCard({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
  delay?: number
}) {
  return (
    <RevealBlock delay={delay}>
      <section className="learningCard">
        <h2>
          <span className="learningIcon">
            <Icon size={20} aria-hidden="true" />
          </span>
          {title}
        </h2>
        {children}
      </section>
    </RevealBlock>
  )
}

export function CalloutBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <RevealBlock delay={0.05}>
      <aside className="learningCallout">
        <CircleHelp size={22} aria-hidden="true" />
        <div>
          <h2>{title}</h2>
          {children}
        </div>
      </aside>
    </RevealBlock>
  )
}

export function AnimatedAccordion({
  title,
  children,
  icon: Icon,
  initialOpen = false,
  variant = 'content',
}: {
  title: string
  children: ReactNode
  icon?: LucideIcon
  initialOpen?: boolean
  variant?: 'content' | 'sidebar'
}) {
  const [open, setOpen] = useState(initialOpen)
  const id = useId()
  return (
    <div className={'learningAccordion ' + variant} data-open={open}>
      <motion.button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        whileTap={gentleTap}
        transition={springTransition}
      >
        {Icon && <Icon size={19} aria-hidden="true" />}
        <span>{title}</span>
        <motion.span
          className="accordionChevron"
          initial={false}
          animate={{ rotate: open ? 180 : 0 }}
          transition={springTransition}
        >
          <ChevronDown size={17} aria-hidden="true" />
        </motion.span>
      </motion.button>
      <div id={id} inert={!open}>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className="accordionClip"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.36, ease: silkEase }}
            >
              <div className="accordionBody">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function SectionStepper({ path, onReview }: { path: string; onReview?: () => void }) {
  const index = sections.findIndex((item) => item.path === path)
  if (index < 0) return null
  const previous = sections[index - 1]
  const next = sections[index + 1]
  return (
    <RevealBlock delay={0.04}>
      <nav className="sectionStepper" aria-label="Continuar el recorrido">
        {previous && (
          <MotionLink
            className="stepPrevious"
            to={previous.path}
            transition={springTransition}
            whileHover={gentleHover}
            whileTap={gentleTap}
          >
            <ArrowLeft aria-hidden="true" size={19} />
            <div>
              <small>Sección anterior</small>
              <strong>{previous.label}</strong>
            </div>
          </MotionLink>
        )}
        <MotionLink
          className="stepNext"
          to={next?.path ?? '/'}
          onClick={(event) => {
            if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) onReview?.()
          }}
          transition={springTransition}
          whileHover={gentleHover}
          whileTap={gentleTap}
        >
          <div>
            <small>
              {onReview ? 'Marcar como revisado y continuar' : next ? 'Sección siguiente' : 'Final del recorrido'}
            </small>
            <strong>{next?.label ?? 'Volver al inicio'}</strong>
          </div>
          <ArrowRight aria-hidden="true" size={19} />
        </MotionLink>
      </nav>
    </RevealBlock>
  )
}
