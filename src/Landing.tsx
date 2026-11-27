import { useEffect, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  BookOpen,
  CheckCircle2,
  Code2,
  Compass,
  Layers3,
  Monitor,
  Play,
  Route,
  Smartphone,
  Sparkles,
  Target,
  Terminal,
} from 'lucide-react'
import { ReadingProgress, StaggerGroup, StaggerItem } from './LearningUI'
import {
  gentleHover,
  gentleTap,
  pillSpring,
  revealTransition,
  silkEase,
  springTransition,
} from './motionPresets'
import { PreCourse } from './PreCourse'
import { ThemeToggle } from './themeContext'

const notePresets = [
  { label: 'null', codeLiteral: 'null', result: 'Sin indicaciones' },
  { label: '"Sin sal"', codeLiteral: '"Sin sal"', result: 'Sin sal' },
  { label: '"Pan caliente"', codeLiteral: '"Pan caliente"', result: 'Pan caliente' },
] as const

const demos = [
  {
    label: 'Kotlin',
    file: 'Pedido.kt',
    icon: Code2,
    lines: [
      ['data class ', 'Pedido', '(val producto: String,'],
      ['', '', '               val nota: String?)'],
      ['fun ', 'main', '() {'],
      ['  val ', 'pedido', ' = Pedido("Pan integral", __NOTA__)'],
      ['', '  println', '(pedido.nota ?: "Sin indicaciones")'],
      ['', '', '}'],
    ],
    output: 'Sin indicaciones',
  },
  {
    label: 'Android Studio',
    file: 'Flujo de trabajo',
    icon: Monitor,
    lines: [
      ['', '01  Proyecto', '   Organiza código, recursos y Manifest'],
      ['', '02  Editor', '     Escribe Kotlin con autocompletado'],
      ['', '03  Gradle', '     Compila y empaqueta tu aplicación'],
      ['', '04  Emulador', '   Prueba en un Pixel virtual (AVD)'],
      ['', '05  Logcat', '     Inspecciona mensajes en tiempo real'],
    ],
    output: 'Del código al dispositivo Android',
  },
  {
    label: 'Reto práctico',
    file: 'Panadería La Espiga',
    icon: Smartphone,
    lines: [
      ['', 'Marta', ' necesita recibir pedidos con foto en Android.'],
      ['', '01', '  Recomienda el enfoque técnico adecuado.'],
      ['', '02', '  Configura el permiso de cámara en el Manifest.'],
      ['', '03', '  Prueba en el emulador y entrega el paquete .apk.'],
    ],
    output: '6 decisiones reales con retroalimentación',
  },
] as const

const steps = [
  {
    title: 'Prepárate',
    copy: 'Conoce el encargo, mira el video y escucha el pódcast de bienvenida.',
    icon: Compass,
    to: '/guia/introduccion',
    meta: 'Contextualización',
  },
  {
    title: 'Aprende',
    copy: 'Domina el ecosistema móvil, Kotlin frente a Java y Android Studio.',
    icon: BookOpen,
    to: '/ruta/ecosistema-movil',
    meta: '3 lecciones clave',
  },
  {
    title: 'Practica',
    copy: 'Mide tus bases en el emulador, conecta cables, explora el IDE y asesora a Marta.',
    icon: Layers3,
    to: '/actividad/actividad-1-1-diagnostico',
    meta: '4 talleres guiados',
  },
  {
    title: 'Evalúate',
    copy: 'Compila el quiz final en Gradle, firma tu APK simbólica y compara tu avance.',
    icon: Target,
    to: '/actividad/actividad-1-5-quiz-final',
    meta: 'Quiz + cierre',
  },
] as const

const tickerItems = [
  'Kotlin-first',
  'Null Safety (?:)',
  'data class',
  'Android Studio',
  'Jetpack Compose',
  'AndroidManifest.xml',
  'Gradle Build',
  'Emulador Pixel 8',
  'Consola Logcat',
  'Paquete .apk',
] as const

const heroStats = [
  ['3', 'Lecciones interactivas'],
  ['6', 'Talleres tipo IDE'],
  ['50 min', 'A tu propio ritmo'],
] as const

const MotionLink = motion.create(Link)

export function CourseCTA({ to, children }: { to: string; children: ReactNode }) {
  return (
    <MotionLink
      to={to}
      className="courseCta"
      transition={springTransition}
      whileHover={gentleHover}
      whileTap={gentleTap}
    >
      {children}
      <ArrowRight aria-hidden="true" size={20} />
    </MotionLink>
  )
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, scale: 0.988 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -75px 0px' }}
      transition={{ ...revealTransition, delay, ease: silkEase }}
    >
      {children}
    </motion.div>
  )
}

export function Landing({ resume }: { resume?: string }) {
  const [demo, setDemo] = useState(0)
  const [pausedAuto, setPausedAuto] = useState(false)
  const [noteIdx, setNoteIdx] = useState(0)
  const [runPulse, setRunPulse] = useState(0)

  const mouseX = useMotionValue(520)
  const mouseY = useMotionValue(260)
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 28 })
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 28 })
  const spotlightBg = useMotionTemplate`radial-gradient(560px circle at ${smoothX}px ${smoothY}px, rgba(149, 98, 255, 0.15), transparent 70%)`

  useEffect(() => {
    if (pausedAuto) return
    const timer = window.setInterval(() => {
      setDemo((prev) => (prev + 1) % demos.length)
    }, 6800)
    return () => window.clearInterval(timer)
  }, [pausedAuto])

  function handleHeroMouseMove(e: ReactMouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const current = demos[demo]
  const activeNote = notePresets[noteIdx]
  const entry = resume || '/guia/introduccion'
  const label = resume ? 'Continuar el OVA' : 'Entrar al OVA'
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const activeOutput = demo === 0 ? activeNote.result : current.output

  return (
    <div className="landing">
      <a className="skipLink" href="#contenido-portada">
        Saltar al contenido principal
      </a>
      <div className="landingScroll">
        <ReadingProgress />
      </div>

      <header className="landingHeader">
        <Link className="brandK" to="/" aria-label="Kotlin Lab, inicio">
          <i aria-hidden="true" /> Kotlin<span>Lab</span>
        </Link>
        <nav aria-label="Portada">
          <button className="landingTextButton" onClick={() => scrollTo('explora-kotlin')}>
            Qué aprenderás
          </button>
          <button className="landingTextButton" onClick={() => scrollTo('ruta-guia')}>
            Ruta de aprendizaje
          </button>
          <ThemeToggle compactLabel />
          <CourseCTA to={entry}>{label}</CourseCTA>
        </nav>
      </header>

      <main id="contenido-portada" tabIndex={-1}>
        <section className="landingHero" onMouseMove={handleHeroMouseMove}>
          <motion.div className="heroSpotlight" aria-hidden="true" style={{ background: spotlightBg }} />
          <div className="heroRibbons" aria-hidden="true">
            <motion.span
              animate={{ y: [0, -14, 0], rotate: [-39, -37.5, -39] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
              animate={{ y: [0, 12, 0], opacity: [0.48, 0.68, 0.48] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            />
            <motion.span
              animate={{ y: [0, -10, 0], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />
          </div>

          <div className="landingIntro">
            <motion.p
              className="landingKicker"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: silkEase }}
            >
              <span /> DESARROLLO MÓVIL PARA ANDROID
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease: silkEase, delay: 0.08 }}
            >
              Tu primera app
              <br /> con <em className="shimmerEm">Kotlin.</em>
            </motion.h1>

            <motion.p
              className="landingLead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: silkEase, delay: 0.16 }}
            >
              Escribe y prueba tus primeras líneas de Kotlin, recorre Android Studio por dentro y toma decisiones reales en un encargo para Android.
            </motion.p>

            <motion.div
              className="landingActions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: silkEase, delay: 0.24 }}
            >
              <CourseCTA to={entry}>{label}</CourseCTA>
              <motion.button
                className="landingSecondary"
                onClick={() => scrollTo('antes-del-ova')}
                transition={springTransition}
                whileHover={gentleHover}
                whileTap={gentleTap}
              >
                Explorar recorrido <ArrowDown size={17} aria-hidden="true" />
              </motion.button>
            </motion.div>

            <motion.dl
              className="heroQuickStats"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: silkEase, delay: 0.32 }}
            >
              {heroStats.map(([num, text]) => (
                <div key={text}>
                  <dt>{num}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div
            className="landingDemo"
            initial={{ opacity: 0, y: 24, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.68, ease: silkEase, delay: 0.14 }}
            onMouseEnter={() => setPausedAuto(true)}
            onMouseLeave={() => setPausedAuto(false)}
          >
            <motion.div
              className="floatingChip chipTop"
              aria-hidden="true"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={13} /> Null Safety integrado
            </motion.div>

            <div className="demoWindow">
              <div className="demoChrome">
                <span aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span>{current.file}</span>
                {demo === 0 ? (
                  <button
                    type="button"
                    className="heroRunChip"
                    onClick={() => {
                      setPausedAuto(true)
                      setNoteIdx((prev) => (prev + 1) % notePresets.length)
                      setRunPulse((p) => p + 1)
                    }}
                    title="Probar otro valor en Pedido.kt"
                  >
                    <Play size={11} aria-hidden="true" /> Probar valor
                  </button>
                ) : (
                  <Terminal aria-hidden="true" size={16} />
                )}
              </div>

              <div className="demoChoices" role="group" aria-label="Explorar una muestra interactiva del curso">
                {demos.map(({ label: topic, icon: Icon }, index) => {
                  const isActive = demo === index
                  return (
                    <motion.button
                      type="button"
                      key={topic}
                      aria-pressed={isActive}
                      onClick={() => {
                        setPausedAuto(true)
                        setDemo(index)
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isActive && <motion.span layoutId="hero-demo-pill" className="demoChoiceBg" transition={pillSpring} />}
                      <span className="demoChoiceContent">
                        <Icon aria-hidden="true" size={15} />
                        {topic}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              <div className="demoStage" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${demo}-${demo === 0 ? noteIdx : 0}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.24, ease: silkEase }}
                  >
                    <div className="demoCode">
                      {current.lines.map(([keyword, highlight, rest], lineIdx) => {
                        const formattedRest =
                          demo === 0 ? rest.replace('__NOTA__', activeNote.codeLiteral) : rest
                        return (
                          <motion.div
                            key={lineIdx}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.26, delay: lineIdx * 0.03, ease: silkEase }}
                          >
                            <span className="demoLine" aria-hidden="true">
                              {lineIdx + 1}
                            </span>
                            <code>
                              <b>{keyword}</b>
                              <strong>{highlight}</strong>
                              {formattedRest}
                            </code>
                          </motion.div>
                        )
                      })}

                      {demo === 0 && (
                        <div className="heroInlineParams" role="group" aria-label="Cambiar valor de nota en vivo">
                          <span>nota =</span>
                          {notePresets.map((preset, idx) => (
                            <button
                              key={preset.label}
                              type="button"
                              aria-pressed={noteIdx === idx}
                              onClick={() => {
                                setPausedAuto(true)
                                setNoteIdx(idx)
                                setRunPulse((p) => p + 1)
                              }}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <motion.p
                      key={`out-${demo}-${noteIdx}-${runPulse}`}
                      className="demoOutput"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Terminal size={16} aria-hidden="true" />
                      <span>Salida: {activeOutput}</span>
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {!pausedAuto && (
                <motion.div
                  key={demo}
                  className="demoAutoBar"
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 6.8, ease: 'linear' }}
                />
              )}
            </div>

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                className="demoLabel"
                key={current.label}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.22, ease: silkEase }}
              >
                <span aria-hidden="true" /> {current.label} · Interactivo en vivo
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Cinta continua de conceptos del ecosistema Android + Kotlin */}
        <div className="conceptTicker" aria-hidden="true">
          <div className="conceptTickerTrack">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <span key={`${item}-${idx}`} className="tickerPill">
                <i />
                {item}
              </span>
            ))}
          </div>
        </div>

        <PreCourse>
          <CourseCTA to="/guia/introduccion">Empezar la introducción</CourseCTA>
        </PreCourse>

        <section className="landingFeatures" id="explora-kotlin" aria-labelledby="explora-titulo">
          <Reveal className="landingSectionHeading">
            <p className="landingKicker">
              <Sparkles size={16} aria-hidden="true" /> EXPERIENCIA PRÁCTICA
            </p>
            <h2 id="explora-titulo">Del código a tu primera app</h2>
          </Reveal>

          <StaggerGroup className="landingFeatureGrid">
            <StaggerItem>
              <motion.article
                className="landingFeature featureCode"
                whileHover={{ y: -5 }}
                transition={springTransition}
              >
                <span className="stepIcon">
                  <Code2 size={26} aria-hidden="true" />
                </span>
                <h3>Escribe código seguro en Kotlin</h3>
                <p>Compara Java frente a Kotlin y experimenta cómo las clases de datos y los tipos anulables protegen tu app.</p>
                <div className="featureMiniPreview" aria-hidden="true">
                  <code>data class Pedido(val nota: String?)</code>
                  <span className="miniPreviewBadge">
                    <CheckCircle2 size={13} /> Sin NullPointerException
                  </span>
                </div>
                <MotionLink to="/ruta/kotlin" transition={springTransition} whileHover={gentleHover} whileTap={gentleTap}>
                  Explorar la lección <ArrowRight size={16} aria-hidden="true" />
                </MotionLink>
                <div className="featureGlyph" aria-hidden="true">
                  {'{ }'}
                </div>
              </motion.article>
            </StaggerItem>

            <StaggerItem>
              <motion.article
                className="landingFeature featureStudio"
                whileHover={{ y: -5 }}
                transition={springTransition}
              >
                <span className="stepIcon">
                  <Monitor size={26} aria-hidden="true" />
                </span>
                <h3>Domina Android Studio por dentro</h3>
                <p>Ubica el explorador, la vista previa, Gradle, el emulador Pixel y Logcat en un taller gráfico interactivo.</p>
                <div className="featureMiniPills" aria-hidden="true">
                  <span>▶ Run App</span>
                  <span>● Gradle OK</span>
                  <span>Logcat en vivo</span>
                </div>
                <MotionLink
                  to="/ruta/android-studio"
                  transition={springTransition}
                  whileHover={gentleHover}
                  whileTap={gentleTap}
                >
                  Ver Android Studio y sus funciones <ArrowRight size={16} aria-hidden="true" />
                </MotionLink>
                <div className="featureGlyph" aria-hidden="true">
                  <Layers3 size={88} strokeWidth={1.4} />
                </div>
              </motion.article>
            </StaggerItem>
          </StaggerGroup>
        </section>

        <section className="landingRoute" id="ruta-guia" aria-labelledby="ruta-titulo">
          <Reveal className="landingSectionHeading">
            <p className="landingKicker">
              <Route size={17} aria-hidden="true" /> MAPA DEL OVA
            </p>
            <h2 id="ruta-titulo">Tu ruta de aprendizaje</h2>
            <p>Estudia a tu ritmo. Cada etapa desbloquea herramientas para resolver la siguiente.</p>
          </Reveal>

          <StaggerGroup className="landingStepsWrap">
            <ol className="landingSteps">
              {steps.map(({ title, copy, icon: Icon, to, meta }, index) => (
                <li key={title}>
                  <StaggerItem className="stepItemFull">
                    <MotionLink
                      to={to}
                      className="stepCard"
                      transition={springTransition}
                      whileHover={{ y: -5, scale: 1.01 }}
                      whileTap={gentleTap}
                    >
                      <div className="stepCardTop">
                        <span className="stepIcon">
                          <Icon size={24} aria-hidden="true" />
                        </span>
                        <span className="stepMetaChip">{meta}</span>
                      </div>
                      <p className="stepOrder">ETAPA 0{index + 1}</p>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                      <ArrowRight className="stepArrow" size={18} aria-hidden="true" />
                    </MotionLink>
                  </StaggerItem>
                </li>
              ))}
            </ol>
          </StaggerGroup>
        </section>

        <section className="landingProject">
          <Reveal className="landingProjectInner">
            <span className="stepIcon">
              <Smartphone size={25} aria-hidden="true" />
            </span>
            <div>
              <p className="landingKicker">SIMULACIÓN CON CLIENTE REAL</p>
              <h2>Tu primer encargo: Panadería La Espiga</h2>
              <p>
                Marta quiere que sus clientes puedan fotografiar un pedido y enviarlo desde el celular. Toma seis decisiones técnicas mientras su nivel de confianza responde en tiempo real.
              </p>
            </div>
            <CourseCTA to="/actividad/actividad-1-4-escenario">Probar el escenario</CourseCTA>
          </Reveal>
        </section>

        <section className="landingEnd">
          <Reveal>
            <motion.div
              className="endWaveIcon"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AudioLines aria-hidden="true" size={30} />
            </motion.div>
            <h2>Empieza por la introducción</h2>
            <p>Mira el video de presentación, escucha la conversación de bienvenida y traza tu ruta.</p>
            <CourseCTA to="/guia/introduccion">Abrir la introducción</CourseCTA>
          </Reveal>
        </section>
      </main>

      <footer className="landingFooter">
        <div>
          <b>Kotlin Lab</b>
          <p>Equipo SJD · Autores: Sebastian Cufi, Deimy Vanegas y Jhonny Acosta</p>
          <p className="creditsSecondary">
            Experto temático: Franklin Albeiro Gomez Mendoza · Asesor pedagógico y diseñador instruccional: Raul Rodriguez
          </p>
        </div>
        <Link to="/guia/referencias">Referentes APA del OVA</Link>
      </footer>
    </div>
  )
}
