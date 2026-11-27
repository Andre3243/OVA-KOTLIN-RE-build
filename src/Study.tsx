import { Check, Circle, ClipboardList, Quote, RotateCcw, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, NavLink } from 'react-router-dom'
import { activityPath, groups, sections, workshops } from './content/navigation'
import { closingKeyIdeas, closingMilestones } from './content/lessonsContent'
import { workshopGuide } from './content/workshopGuide'
import { AnimatedAccordion, ContentCard, RevealBlock, SectionStepper, StaggerGroup, StaggerItem, TextReveal } from './LearningUI'
import { easeOut, pillSpring, revealTransition, silkEase, springTransition } from './motionPresets'
import { CicloAppWorkshop } from './workshops/CicloAppWorkshop'
import { DiagnosticoWorkshop } from './workshops/DiagnosticoWorkshop'
import { EscenarioWorkshop } from './workshops/EscenarioWorkshop'
import { MapaStudioWorkshop } from './workshops/MapaStudioWorkshop'
import { PareoWorkshop } from './workshops/PareoWorkshop'
import { QuizFinalWorkshop } from './workshops/QuizFinalWorkshop'
import './workshops/workshops.css'

export function Sidebar({
  visited,
  hidden,
  activePath,
  navigate,
  onResetProgress,
}: {
  visited: string[]
  hidden: boolean
  activePath: string
  navigate: () => void
  onResetProgress: () => void
}) {
  const total = sections.length
  const count = sections.filter(({ path }) => visited.includes(path)).length
  const percentage = Math.round((count / total) * 100)

  return (
    <motion.aside
      className="studySidebar"
      id="study-sidebar"
      inert={hidden}
      aria-hidden={hidden}
      initial={false}
      animate={{ x: hidden ? '-101%' : '0%' }}
      transition={{ ...springTransition, damping: 29 }}
    >
      <div className="sidebarHeader">
        <Link className="brandK" to="/" onClick={navigate}>
          <i aria-hidden="true" /> Kotlin<span>Lab</span>
        </Link>
      </div>
      <div className="studyProgress">
        <div className="studyProgressLabel">
          <span>
            {count} de {total} secciones
          </span>
          <strong>{percentage}%</strong>
        </div>
        <div
          role="progressbar"
          aria-label="Secciones recorridas"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={count}
          aria-valuetext={`${percentage}% · ${count} de ${total}`}
        >
          <motion.span
            initial={false}
            animate={{ width: `${(count / total) * 100}%` }}
            transition={springTransition}
          />
        </div>
        {count > 0 && (
          <button
            type="button"
            className="resetProgressBtn"
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar tu progreso y calificaciones guardadas en este navegador?')) {
                onResetProgress()
              }
            }}
          >
            <RotateCcw size={13} aria-hidden="true" /> Reiniciar progreso
          </button>
        )}
      </div>
      <nav aria-label="Secciones del OVA">
        {groups.map(({ title, links }) => (
          <AnimatedAccordion title={title} initialOpen variant="sidebar" key={title}>
            {links.map(([path, label]) => {
              const isActive = activePath === path
              return (
                <NavLink end to={path} key={path} onClick={navigate}>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="sidebarActiveBg"
                      transition={pillSpring}
                    />
                  )}
                  <span className="studyNavLabel">{label}</span>
                  <motion.span
                    className={visited.includes(path) ? 'sectionStatus is-complete' : 'sectionStatus'}
                    key={visited.includes(path) ? 'done' : 'pending'}
                    initial={!visited.includes(path) ? false : { scale: 0.6, opacity: 0.4 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={springTransition}
                  >
                    {visited.includes(path) ? (
                      <>
                        <Check size={15} aria-hidden="true" />
                        <span className="visuallyHidden">Revisada</span>
                      </>
                    ) : (
                      <Circle size={11} aria-hidden="true" />
                    )}
                  </motion.span>
                </NavLink>
              )
            })}
          </AnimatedAccordion>
        ))}
      </nav>
    </motion.aside>
  )
}

export function WorkshopPage({
  slug,
  done,
  onComplete,
  scores,
}: {
  slug: string
  done: boolean
  onComplete: (score?: number) => void
  scores: (number | string)[]
}) {
  const workshop = workshops.find((entry) => entry.slug === slug)
  const guide = workshopGuide[slug]

  if (!workshop || !guide) {
    return (
      <p>
        Actividad no disponible. <Link to="/">Volver al inicio</Link>
      </p>
    )
  }

  const isClosing = slug === 'conclusiones-ciclo'

  return (
    <article className="workshopPage">
      <header className="studyBanner">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: silkEase }}
        >
          <p className="meta">{isClosing ? 'Cierre del OVA' : 'Actividad de aprendizaje'}</p>
          <TextReveal>{workshop.title}</TextReveal>
          <TextReveal as="p">{workshop.intro}</TextReveal>
        </motion.div>
      </header>

      <motion.section
        className="workshopInstructions"
        aria-labelledby="instructions-title"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.16, margin: '0px 0px -60px 0px' }}
        transition={revealTransition}
      >
        <p className="workshopObjective">
          <strong>Objetivo</strong> {guide.objective}
        </p>
        <h2 id="instructions-title">
          <ClipboardList size={21} aria-hidden="true" /> Instrucciones
        </h2>
        <StaggerGroup>
          <ol>
            {guide.instructions.map((instruction) => (
              <StaggerItem key={instruction}>
                <li>{instruction}</li>
              </StaggerItem>
            ))}
          </ol>
        </StaggerGroup>
      </motion.section>

      <AnimatePresence initial={false}>
        {done && (
          <motion.p
            className="completedWorkshop"
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ease: easeOut, duration: 0.28 }}
          >
            ✓ Actividad completada
          </motion.p>
        )}
      </AnimatePresence>

      <RevealBlock delay={0.06}>
        {slug === 'actividad-1-1-diagnostico' && <DiagnosticoWorkshop onComplete={(score) => onComplete(score)} />}
        {slug === 'actividad-1-2-pareo' && <PareoWorkshop onComplete={() => onComplete()} />}
        {slug === 'actividad-1-3-mapa' && <MapaStudioWorkshop onComplete={() => onComplete()} />}
        {slug === 'actividad-1-4-escenario' && <EscenarioWorkshop onComplete={() => onComplete()} />}
        {slug === 'actividad-1-5-quiz-final' && <QuizFinalWorkshop onComplete={(score) => onComplete(score)} />}
        {isClosing && <CicloAppWorkshop onComplete={() => onComplete()} />}
      </RevealBlock>

      <motion.aside
        className="workshopTakeaway"
        aria-labelledby="takeaway-title"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: '0px 0px -70px 0px' }}
        transition={revealTransition}
      >
        <Quote size={25} aria-hidden="true" />
        <div>
          <h2 id="takeaway-title">Para recordar</h2>
          <p>{guide.takeaway}</p>
        </div>
      </motion.aside>

      {isClosing && (
        <>
          <div className="wideCardGrid twoCols">
            <section className="lab">
              <small>SÍNTESIS DEL CURSO</small>
              <h2>Cinco ideas clave</h2>
              <ol className="phases">
                {closingKeyIdeas.map((idea) => (
                  <li key={idea}>
                    <p>{idea}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="lab">
              <small>TU PROGRESO</small>
              <h2>Compara tus resultados y reflexiona</h2>
              <div className="scoreComparison">
                <div className="scoreBox">
                  <span>Diagnóstico inicial</span>
                  <strong>{typeof scores[0] === 'number' ? `${scores[0]} / 5` : scores[0]}</strong>
                </div>
                <div className="scoreBox">
                  <span>Evaluación final</span>
                  <strong>
                    {typeof scores[1] === 'number'
                      ? `${scores[1]} / 5 (${((scores[1] / 5) * 5).toFixed(1)})`
                      : scores[1]}
                  </strong>
                </div>
              </div>
              <h3>Preguntas de reflexión</h3>
              <ul className="cardBulletList">
                <li>¿Qué concepto te costó más al inicio y en cuál avanzaste con mayor claridad?</li>
                <li>Piensa en un negocio cercano: ¿qué sensor del teléfono usarías para resolverle una necesidad real?</li>
              </ul>
            </section>
          </div>

          <ContentCard title="¡Lo que lograste! · Tu siguiente paso" icon={Sparkles}>
            <div className="pillarGrid threeCols">
              {closingMilestones.map((item) => (
                <div key={item.stage} className="pillarCard">
                  <span className="moduleBadge">{item.stage}</span>
                  <p>{item.summary}</p>
                </div>
              ))}
            </div>
            <p className="farewellInline">
              <strong>Invitación del Equipo SJD:</strong> instala Android Studio en tu computador, crea tu primer proyecto con la plantilla <code>Empty Activity</code>, cambia el saludo en Kotlin y ejecútalo en el emulador observando Logcat.
            </p>
          </ContentCard>
        </>
      )}

      <SectionStepper path={activityPath(slug)} onReview={() => onComplete()} />
    </article>
  )
}
