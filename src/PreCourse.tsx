import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Camera, CheckCircle2, ClipboardCheck, Code2, Cpu, Sparkles } from 'lucide-react'
import {
  gentleHover,
  gentleTap,
  pillSpring,
  revealTransition,
  silkEase,
  springTransition,
  staggerContainerVariants,
  staggerItemVariants,
} from './motionPresets'

const scenes = [
  {
    tab: 'El encargo',
    title: 'Un pedido escrito a mano',
    body: 'Marta quiere que sus clientes puedan tomarle una foto a su pedido y enviarlo desde el celular sin digitarlo. ¿Qué necesita su app para lograrlo sin perder pedidos?',
    icon: Camera,
    flow: ['Foto del pedido', 'Permiso de cámara', 'Envío seguro a Marta'],
  },
  {
    tab: 'Las herramientas',
    title: 'De la idea al código real',
    body: 'Aprenderás qué diferencia a un teléfono móvil, cómo Kotlin evita errores por valores nulos y cómo Android Studio convierte tu código en un instalable.',
    icon: Code2,
    flow: ['Pedido.kt', 'Gradle Build', 'Emulador Pixel 8'],
  },
  {
    tab: 'La práctica',
    title: 'Tus decisiones cuentan',
    body: 'Medirás tus presaberes sin nota, conectarás cables conceptuales, explorarás el IDE, asesorarás a Marta en vivo y firmarás tu propia APK simbólica.',
    icon: ClipboardCheck,
    flow: ['Diagnóstico', 'Retos interactivos', 'APK firmada 5.0'],
  },
] as const

export function PreCourse({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0)
  const scene = scenes[index]
  const Icon = scene.icon

  return (
    <section className="preCourse" id="antes-del-ova" aria-labelledby="pre-title">
      <motion.div
        className="preCourseCopy"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.22, margin: '0px 0px -70px 0px' }}
        transition={revealTransition}
      >
        <p className="landingKicker">
          <span /> ANTES DEL OVA
        </p>
        <h2 id="pre-title">
          <span>Una idea real.</span>
          <span>Una app Android.</span>
        </h2>
        <p>Conoce el proyecto práctico que guiará tus decisiones durante todo el recorrido y explora sus tres momentos.</p>
        {children}
      </motion.div>

      <motion.div
        className="preCourseStory"
        initial={{ opacity: 0, y: 28, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.22, margin: '0px 0px -70px 0px' }}
        transition={{ ...revealTransition, delay: 0.1 }}
      >
        <div className="preCourseChoices" role="group" aria-label="Escenas de la introducción">
          {scenes.map((item, i) => {
            const active = index === i
            return (
              <motion.button
                type="button"
                key={item.tab}
                aria-pressed={active}
                onClick={() => setIndex(i)}
                whileHover={gentleHover}
                whileTap={gentleTap}
                transition={springTransition}
              >
                {active && <motion.span layoutId="precourse-tab-pill" className="preCourseTabBg" transition={pillSpring} />}
                <span className="preCourseTabLabel">{item.tab}</span>
              </motion.button>
            )
          })}
        </div>

        <div className="preCourseStage" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: silkEase }}
            >
              <div className="preCourseStageHead">
                <motion.span
                  className="preCourseIcon"
                  initial={{ scale: 0.85, rotate: -6 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={springTransition}
                >
                  <Icon size={26} aria-hidden="true" />
                </motion.span>
                <div>
                  <span className="preCourseStepTag">PASO 0{index + 1} DE 03</span>
                  <h3>{scene.title}</h3>
                </div>
              </div>
              <p>{scene.body}</p>

              <motion.div
                className="preCourseFlow"
                variants={staggerContainerVariants}
                initial="hidden"
                animate="show"
              >
                {scene.flow.map((chip, chipIdx) => (
                  <motion.span key={chip} className="preCourseFlowChip" variants={staggerItemVariants}>
                    {chipIdx === 0 && <Sparkles size={13} aria-hidden="true" />}
                    {chipIdx === 1 && <Cpu size={13} aria-hidden="true" />}
                    {chipIdx === 2 && <CheckCircle2 size={13} aria-hidden="true" />}
                    {chip}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}
