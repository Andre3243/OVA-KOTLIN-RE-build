import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useParams, type Location } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  ExternalLink,
  Globe2,
  House,
  Layers3,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Smartphone,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { AppDiagram } from './AppDiagram'
import { courseModules as modules } from './content/course'
import {
  desktopVsMobile,
  developmentApproaches,
  javaCodeComparison,
  kotlinAdvantages,
  kotlinCodeComparison,
  kotlinTimeline,
  studioFunctions,
  uiApproaches,
} from './content/lessonsContent'
import { COURSE_CREDITS } from './content/media'
import { activityPath, sections, workshops } from './content/navigation'
import { Guide } from './Guide'
import { Landing } from './Landing'
import {
  AnimatedAccordion,
  AnimatedPage,
  CalloutBox,
  ContentCard,
  ReadingProgress,
  RevealBlock,
  SectionStepper,
  StaggerGroup,
  StaggerItem,
  TextReveal,
} from './LearningUI'
import { easeOut, gentleHover, gentleTap, silkEase, springTransition } from './motionPresets'
import { Sidebar, WorkshopPage } from './Study'
import { ThemeToggle } from './themeContext'
import './course.css'
import './study.css'
import './theme.css'
import './learning.css'

function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* El recorrido sigue disponible aunque el navegador restrinja almacenamiento. */
  }
}

function getSavedResume(): string {
  const saved = read<unknown>('ruta.retomar', '')
  return typeof saved === 'string' && sections.some((section) => section.path === saved) ? saved : ''
}

export function CreditsFooter({ className }: { className?: string }) {
  return (
    <footer className={className}>
      <div>
        <b>{COURSE_CREDITS.brand}</b>
        <p>
          {COURSE_CREDITS.team} · Autores: {COURSE_CREDITS.authors.join(', ')}
        </p>
        <p className="creditsSecondary">
          Experto temático: {COURSE_CREDITS.subjectExpert} · Diseñador instruccional y asesor pedagógico:{' '}
          {COURSE_CREDITS.instructionalAdvisor}
        </p>
      </div>
      <Link to="/guia/referencias">Referentes APA del OVA</Link>
    </footer>
  )
}

const approachIcons = [Smartphone, Layers3, Globe2] as const

function Lesson() {
  const { id } = useParams()
  const i = modules.findIndex((m) => m.id === id)
  const m = modules[i]
  const [timelineIdx, setTimelineIdx] = useState(3)
  const [sampleNote, setSampleNote] = useState<'null' | 'custom'>('null')

  if (!m) return <Navigate to="/ruta/ecosistema-movil" replace />

  const selectedYear = kotlinTimeline[timelineIdx]

  return (
    <article key={id} className="lessonBody">
      <p className="moduleBadge">
        Lección {i + 1} de {modules.length} · ~{m.minutes} min
      </p>
      <TextReveal>{m.title}</TextReveal>
      <TextReveal as="p">{m.description}</TextReveal>

      {m.id === 'ecosistema-movil' && (
        <>
          <div className="wideCardGrid twoCols">
            <ContentCard title="Un celular no es un computador en miniatura" icon={Smartphone} delay={0.04}>
              <p>
                El <strong>desarrollo móvil</strong> abarca el diseño, la programación, las pruebas y el despliegue de aplicaciones creadas para teléfonos inteligentes y tabletas. Conocer sus reglas propias de pantalla, energía y sensores es el primer paso antes de programar.
              </p>
            </ContentCard>

            <ContentCard title="Diseñar para la Panadería La Espiga" icon={Cpu} delay={0.12}>
              <p>
                Marta quiere recibir pedidos con una fotografía tomada desde el teléfono. La cámara resuelve la captura, pero una conexión móvil intermitente podría interrumpir el envío: una buena app conserva el pedido y confirma si la foto llegó.
              </p>
            </ContentCard>
          </div>

          <RevealBlock delay={0.08}>
            <section className="lab">
              <small>SUBTEMA 1.1 · PARTICULARIDADES DEL DISPOSITIVO</small>
              <h2>¿En qué se diferencia del software de escritorio?</h2>
              <StaggerGroup className="pillarGrid threeCols">
                {desktopVsMobile.map((item) => (
                  <StaggerItem key={item.title} className="pillarCard">
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </section>
          </RevealBlock>

          <RevealBlock delay={0.08}>
            <section className="approachSection">
              <h2>Elige y compara un enfoque de desarrollo</h2>
              {developmentApproaches.map((app, idx) => (
                <AnimatedAccordion
                  key={app.id}
                  title={`${app.name} — ${app.badge}`}
                  icon={approachIcons[idx]}
                  initialOpen={idx === 0}
                >
                  <div className="accordionSpecsGrid">
                    <div>
                      <strong>Tecnologías:</strong> {app.stack}
                    </div>
                    <div>
                      <strong>Rendimiento:</strong> {app.performance}
                    </div>
                    <div>
                      <strong>Cámara y sensores:</strong> {app.hardware}
                    </div>
                    <div>
                      <strong>Cuándo elegirlo:</strong> {app.whenToChoose}
                    </div>
                  </div>
                </AnimatedAccordion>
              ))}
            </section>
          </RevealBlock>

          <CalloutBox title="Antes de elegir en tu proyecto">
            <p>
              Piensa en el tamaño de pantalla, la memoria y la batería. Como casi todos los clientes de Marta usan Android y la cámara es clave, nos enfocaremos en el <strong>desarrollo nativo para Android</strong>.
            </p>
          </CalloutBox>
        </>
      )}

      {m.id === 'kotlin' && (
        <>
          <div className="wideCardGrid twoCols">
            <ContentCard title="Un lenguaje moderno, estático y pragmático" icon={Code2} delay={0.04}>
              <p>
                <strong>Kotlin</strong> es un lenguaje de código abierto desarrollado por <strong>JetBrains</strong> (la empresa detrás de IntelliJ IDEA). Combina <strong>tipado estático</strong> —para detectar errores de tipos antes de ejecutar la app— con un diseño <strong>pragmático</strong> que evita el código repetitivo y convive con bibliotecas Java.
              </p>
            </ContentCard>

            <RevealBlock delay={0.12}>
              <section className="lab timelineCard" aria-labelledby="historia-kotlin-titulo">
                <small>LÍNEA DE TIEMPO INTERACTIVA</small>
                <h2 id="historia-kotlin-titulo">Así llegó Kotlin a Android</h2>
                <div className="klPills" role="group" aria-label="Hitos históricos de Kotlin">
                  {kotlinTimeline.map((item, idx) => (
                    <button
                      key={item.year}
                      type="button"
                      aria-pressed={timelineIdx === idx}
                      onClick={() => setTimelineIdx(idx)}
                    >
                      <Clock size={14} aria-hidden="true" /> {item.year}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={selectedYear.year}
                    className="timelineStage"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: silkEase }}
                  >
                    <h3>
                      <span>{selectedYear.year}</span> · {selectedYear.label}
                    </h3>
                    <p>{selectedYear.detail}</p>
                  </motion.div>
                </AnimatePresence>
              </section>
            </RevealBlock>
          </div>

          <ContentCard title="¿Por qué aprender Kotlin para Android?" icon={Sparkles} delay={0.06}>
            <StaggerGroup className="pillarGrid fourCols">
              {kotlinAdvantages.map((adv) => (
                <StaggerItem key={adv.title} className="pillarCard">
                  <h3>{adv.title}</h3>
                  <p>{adv.detail}</p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </ContentCard>

          <RevealBlock delay={0.08}>
            <section className="lab" aria-labelledby="java-vs-kotlin-titulo">
              <small>COMPARACIÓN DE SINTAXIS</small>
              <h2 id="java-vs-kotlin-titulo">Kotlin frente a Java: la misma clase</h2>
              <p className="cardLeadText">
                Una clase Java convencional declara campos privados, constructor y métodos de lectura; una <code>data class</code> de Kotlin reúne todo eso en una sola expresión:
              </p>
              <StaggerGroup className="codeCompareGrid">
                <StaggerItem className="codePane">
                  <div className="codePaneBar">
                    <span>Usuario.java</span>
                    <small>Java tradicional · 17 líneas</small>
                  </div>
                  <pre>{javaCodeComparison}</pre>
                </StaggerItem>
                <StaggerItem className="codePane is-kotlin">
                  <div className="codePaneBar">
                    <span>Usuario.kt</span>
                    <small>Kotlin · 1 declaración concisa</small>
                  </div>
                  <pre>{kotlinCodeComparison}</pre>
                  <p className="codeCompareNote">
                    Kotlin genera automáticamente el constructor, las propiedades inmutables (<code>val</code>), <code>equals()</code>, <code>hashCode()</code> y <code>toString()</code>.
                  </p>
                </StaggerItem>
              </StaggerGroup>
            </section>
          </RevealBlock>

          <ContentCard title="Un pedido en tres líneas con Null Safety" icon={Terminal} delay={0.06}>
            <div className="wideSplitInsideCard">
              <div>
                <p>
                  El signo <code>?</code> permite que <code>nota</code> sea nula (<code>null</code>), y el operador Elvis <code>?:</code> elige un texto alternativo seguro cuando falta la nota. Prueba cambiar el valor y observa la salida:
                </p>
                <div className="klPills" role="group" aria-label="Probar valor de la nota del pedido">
                  <button
                    type="button"
                    aria-pressed={sampleNote === 'null'}
                    onClick={() => setSampleNote('null')}
                  >
                    Con nota = null
                  </button>
                  <button
                    type="button"
                    aria-pressed={sampleNote === 'custom'}
                    onClick={() => setSampleNote('custom')}
                  >
                    Con nota = &quot;Sin sal&quot;
                  </button>
                </div>
                <p>
                  <a href="https://play.kotlinlang.org/" target="_blank" rel="noopener noreferrer" className="inlineLessonLink">
                    Probar el ejemplo en Kotlin Playground <ExternalLink size={15} aria-hidden="true" />
                    <span className="visuallyHidden"> (se abre en una nueva pestaña)</span>
                  </a>
                </p>
              </div>

              <div className="codePane is-kotlin">
                <div className="codePaneBar">
                  <span>Pedido.kt</span>
                  <small>Ejecución simulada</small>
                </div>
                <pre>{`data class Pedido(val producto: String, val nota: String?)

fun main() {
    val pedido = Pedido("Pan integral", ${sampleNote === 'null' ? 'null' : '"Sin sal"'})
    println(pedido.nota ?: "Sin indicaciones")
}`}</pre>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={sampleNote}
                    className="liveCodeOutput"
                    role="status"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: silkEase }}
                  >
                    <Terminal size={16} aria-hidden="true" /> Salida:{' '}
                    <strong>{sampleNote === 'null' ? 'Sin indicaciones' : 'Sin sal'}</strong>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </ContentCard>

          <CalloutBox title="Reflexiona antes de avanzar">
            <p>
              ¿Qué ocurriría en la app de la panadería si un cliente envía la foto sin escribir ninguna nota y el lenguaje no nos obligara a contemplar el caso <code>null</code>?
            </p>
          </CalloutBox>
        </>
      )}

      {m.id === 'android-studio' && (
        <>
          <ContentCard title="Del editor a la pantalla: Android Studio" icon={Monitor} delay={0.04}>
            <p>
              <strong>Android Studio</strong> es el Entorno de Desarrollo Integrado (IDE) oficial de Google basado en IntelliJ IDEA de JetBrains. Es gratuito para Windows, macOS y Linux, y reúne el proyecto, el editor inteligente, el sistema de construcción <strong>Gradle</strong>, el emulador y <strong>Logcat</strong>.
            </p>
            <StaggerGroup className="pillarGrid twoCols">
              {uiApproaches.map((ui) => (
                <StaggerItem key={ui.name} className="pillarCard">
                  <span className="moduleBadge">{ui.badge}</span>
                  <h3>{ui.name}</h3>
                  <p>{ui.description}</p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </ContentCard>

          <RevealBlock delay={0.08}>
            <section className="approachSection">
              <h2>Cinco funciones esenciales del entorno</h2>
              <StaggerGroup className="wideCardGrid twoCols">
                {studioFunctions.map((fn, idx) => (
                  <StaggerItem key={fn.name}>
                    <AnimatedAccordion title={`${idx + 1}. ${fn.name}`} icon={Layers3} initialOpen={idx < 2}>
                      <p>{fn.detail}</p>
                    </AnimatedAccordion>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </section>
          </RevealBlock>

          <RevealBlock delay={0.08}>
            <AppDiagram />
          </RevealBlock>

          <CalloutBox title="¿Listo para comprobar tus bases?">
            <p>
              Ya conoces el dispositivo, Kotlin, Android Studio y las piezas esenciales de una app (<code>Activity</code>, interfaz, <code>AndroidManifest.xml</code> y <code>.apk</code>). Continúa ahora con el <strong>Diagnóstico</strong> en el emulador.
            </p>
          </CalloutBox>
        </>
      )}
    </article>
  )
}

function ActivityRoute({
  done,
  finish,
  scores,
}: {
  done: string[]
  finish: (path: string, score?: number) => void
  scores: (number | string)[]
}) {
  const { slug = '' } = useParams()
  const path = activityPath(slug)
  return (
    <WorkshopPage
      key={slug}
      slug={slug}
      done={done.includes(path)}
      onComplete={(score) => finish(path, score)}
      scores={scores}
    />
  )
}

/**
 * Congela el objeto `location` de cada ruta mientras ejecuta su animación de salida,
 * evitando que el contenido cambie bruscamente en el fotograma 1 antes de desvanecerse.
 */
function FrozenRouteStage({
  routeLocation,
  visited,
  finish,
  scores,
}: {
  routeLocation: Location
  visited: string[]
  finish: (path: string, score?: number) => void
  scores: (number | string)[]
}) {
  const [frozenLocation] = useState(routeLocation)
  const frozenPath = frozenLocation.pathname

  return (
    <AnimatedPage>
      <Routes location={frozenLocation}>
        <Route
          path="/guia/:section"
          element={
            <>
              <Guide />
              <SectionStepper path={frozenPath} onReview={() => finish(frozenPath)} />
            </>
          }
        />
        <Route
          path="/ruta/:id"
          element={
            <>
              <Lesson />
              <SectionStepper path={frozenPath} onReview={() => finish(frozenPath)} />
            </>
          }
        />
        <Route
          path="/actividad/:slug"
          element={<ActivityRoute done={visited} finish={finish} scores={scores} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatedPage>
  )
}

function readValidScore(key: string): number | 'Pendiente' {
  const saved = read<unknown>(key, 'Pendiente')
  if (typeof saved === 'number' && Number.isInteger(saved) && saved >= 0 && saved <= 5) {
    return saved
  }
  return 'Pendiente'
}

export default function Course() {
  const [visited, setVisited] = useState<string[]>(() => {
    const saved = read<unknown>('ruta.vista', [])
    if (!Array.isArray(saved)) return []
    const validPaths = new Set(sections.map((s) => s.path))
    return Array.from(new Set(saved.filter((item): item is string => typeof item === 'string' && validPaths.has(item))))
  })
  const [desktopMenu, setDesktopMenu] = useState<boolean>(() => {
    const saved = read<unknown>('ruta.panel', true)
    return typeof saved === 'boolean' ? saved : true
  })
  const [mobileMenu, setMobileMenu] = useState(false)
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width:920px)').matches,
  )
  const [diagnosis, setDiagnosis] = useState<number | string>(() => readValidScore('ruta.diag'))
  const [examScore, setExamScore] = useState<number | string>(() => readValidScore('ruta.final'))

  const menu = compact ? mobileMenu : desktopMenu
  const toggle = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const { pathname } = location
  const sectionIndex = sections.findIndex((item) => item.path === pathname)
  const section = sections[sectionIndex]

  useEffect(() => {
    const media = window.matchMedia('(max-width:920px)')
    const sync = () => {
      setCompact(media.matches)
      setMobileMenu(false)
    }
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (pathname === '/') window.scrollTo(0, 0)
    if (/^\/(guia|ruta|actividad)\/[^/]+$/.test(pathname)) {
      save('ruta.retomar', pathname)
    }
  }, [pathname])

  useEffect(() => {
    if (!menu || !compact) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenu(false)
        requestAnimationFrame(() => toggle.current?.focus())
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menu, compact])

  function updateMenu(open: boolean) {
    if (compact) {
      setMobileMenu(open)
      return
    }
    setDesktopMenu(open)
    save('ruta.panel', open)
  }

  function dismiss() {
    updateMenu(false)
    requestAnimationFrame(() => toggle.current?.focus())
  }

  function finish(path: string, score?: number) {
    setVisited((previous) => {
      if (previous.includes(path)) return previous
      const next = [...previous, path]
      save('ruta.vista', next)
      return next
    })
    if (score === undefined) return
    if (path === activityPath(workshops[0].slug)) {
      save('ruta.diag', score)
      setDiagnosis(score)
    }
    if (path === activityPath(workshops[4].slug)) {
      save('ruta.final', score)
      setExamScore(score)
    }
  }

  function handleResetProgress() {
    setVisited([])
    setDiagnosis('Pendiente')
    setExamScore('Pendiente')
    save('ruta.vista', [])
    save('ruta.diag', 'Pendiente')
    save('ruta.final', 'Pendiente')
    save('ruta.retomar', '')
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {pathname === '/' ? (
        <motion.div
          key="landing-shell"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.48, ease: silkEase } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.24, ease: [0.4, 0, 1, 1] } }}
        >
          <Landing resume={getSavedResume()} />
        </motion.div>
      ) : (
        <motion.div
          key="study-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.36, ease: silkEase } }}
          exit={{ opacity: 0, transition: { duration: 0.22, ease: easeOut } }}
        >
          <a className="skipLink" href="#contenido-principal">
            Saltar al contenido principal
          </a>
          <div className={'studyShell' + (menu ? ' menuOpen' : '')}>
            <Sidebar
              visited={visited}
              hidden={!menu}
              activePath={pathname}
              navigate={() => {
                if (compact) setMobileMenu(false)
              }}
              onResetProgress={handleResetProgress}
            />

            <AnimatePresence>
              {compact && menu && (
                <motion.div
                  className="studyScrim"
                  aria-hidden="true"
                  onClick={dismiss}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: easeOut }}
                />
              )}
            </AnimatePresence>

            <div className="studyContent">
              <header className="studyTop">
                <motion.button
                  type="button"
                  ref={toggle}
                  aria-controls="study-sidebar"
                  aria-expanded={menu}
                  onClick={() => updateMenu(!menu)}
                  transition={springTransition}
                  whileHover={gentleHover}
                  whileTap={gentleTap}
                >
                  {menu ? <PanelLeftClose size={19} aria-hidden="true" /> : <PanelLeftOpen size={19} aria-hidden="true" />}
                  {menu ? 'Ocultar secciones' : 'Mostrar secciones'}
                </motion.button>
                <nav className="studyBreadcrumbs" aria-label="Ubicación en el curso" inert={compact && menu}>
                  <Link
                    to="/"
                    className="studyHome"
                    onClick={() => {
                      if (compact) setMobileMenu(false)
                    }}
                  >
                    <House size={16} aria-hidden="true" /> Inicio
                  </Link>
                  {section && (
                    <>
                      <ChevronRight size={15} aria-hidden="true" />
                      {section.groupPath !== pathname ? (
                        <Link
                          to={section.groupPath}
                          onClick={() => {
                            if (compact) setMobileMenu(false)
                          }}
                        >
                          {section.group}
                        </Link>
                      ) : (
                        <span>{section.group}</span>
                      )}
                      <ChevronRight size={15} aria-hidden="true" />
                      <motion.span
                        key={section.path}
                        aria-current="page"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.28, ease: silkEase }}
                      >
                        {section.label}
                      </motion.span>
                    </>
                  )}
                </nav>
                <div className="topRightActions" inert={compact && menu}>
                  {section && (
                    <span className="moduleBadge headerBadge">
                      Sección {sectionIndex + 1} de {sections.length}
                    </span>
                  )}
                  <ThemeToggle compactLabel />
                </div>
                <ReadingProgress />
              </header>

              <main id="contenido-principal" className="container" tabIndex={-1} inert={compact && menu}>
                <AnimatePresence
                  mode="wait"
                  initial={false}
                  onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                >
                  <FrozenRouteStage
                    key={pathname}
                    routeLocation={location}
                    visited={visited}
                    finish={finish}
                    scores={[diagnosis, examScore]}
                  />
                </AnimatePresence>
                <CreditsFooter />
              </main>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
