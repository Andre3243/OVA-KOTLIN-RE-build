import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { BookOpen, Compass, ExternalLink, FileAudio, Gauge, Layers3, Sparkles, Video } from 'lucide-react'
import {
  AnimatedAccordion,
  CalloutBox,
  ContentCard,
  RevealBlock,
  StaggerGroup,
  StaggerItem,
  TextReveal,
} from './LearningUI'
import { pillSpring } from './motionPresets'
import {
  apaReferences,
  competencies,
  contentOutcomes,
  contentOverviewSteps,
  guidePages,
  learningPhases,
  studyRecommendations,
  studyTimes,
} from './content/guideContent'
import { INTRO_VIDEO_URL, PODCAST_META, PODCAST_TRANSCRIPT } from './content/media'

function toEmbedUrl(rawUrl: string): { kind: 'iframe' | 'video'; src: string } | null {
  const trimmed = rawUrl.trim()
  if (!trimmed) return null
  try {
    const parsed = new URL(trimmed, window.location.href)
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v')
      if (v) return { kind: 'iframe', src: `https://www.youtube.com/embed/${v}?rel=0` }
      if (parsed.pathname.startsWith('/embed/')) return { kind: 'iframe', src: trimmed }
    }
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.replace(/^\//, '')
      if (id) return { kind: 'iframe', src: `https://www.youtube.com/embed/${id}?rel=0` }
    }
    if (parsed.hostname.includes('vimeo.com') && !parsed.hostname.includes('player.vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop()
      if (id && /^\d+$/.test(id)) return { kind: 'iframe', src: `https://player.vimeo.com/video/${id}` }
    }
    if (parsed.hostname.includes('drive.google.com')) {
      const match = parsed.pathname.match(/\/file\/d\/([^/]+)/)
      if (match) return { kind: 'iframe', src: `https://drive.google.com/file/d/${match[1]}/preview` }
    }
  } catch {
    // Ruta local relativa reproducida con <video>.
  }
  return { kind: 'video', src: trimmed }
}

function IntroVideo() {
  const media = toEmbedUrl(INTRO_VIDEO_URL)
  if (!media) return null
  return (
    <ContentCard title="Video de bienvenida · ¿De qué trata este OVA?" icon={Video}>
      <p className="mediaSub">
        Presentación audiovisual de los primeros pasos en el desarrollo móvil con Kotlin y Android Studio.
      </p>
      <div className="videoFrameWrap">
        {media.kind === 'iframe' ? (
          <iframe
            className="courseVideoFrame"
            src={media.src}
            title="Video introductorio del OVA: Primeros pasos en la programación móvil con Kotlin"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video className="courseVideoNative" controls preload="metadata" src={media.src}>
            Tu navegador no admite reproducción de video integrada.
          </video>
        )}
      </div>
      <p className="videoExternalFallback">
        <a href={INTRO_VIDEO_URL} target="_blank" rel="noreferrer" className="inlineLessonLink">
          Ver directamente en YouTube <ExternalLink size={14} aria-hidden="true" />
          <span className="visuallyHidden"> (se abre en una nueva pestaña)</span>
        </a>
      </p>
    </ContentCard>
  )
}

function WelcomeAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [speed, setSpeed] = useState<number>(1)

  function handleSpeedChange(nextSpeed: number) {
    setSpeed(nextSpeed)
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed
    }
  }

  return (
    <ContentCard title={PODCAST_META.title} icon={FileAudio}>
      <p className="mediaSub">
        {PODCAST_META.speakers} · Duración aproximada: <strong>{PODCAST_META.durationLabel}</strong>
      </p>

      {unavailable ? (
        <p className="audioFallback" role="status">
          El archivo de audio local no está disponible en este momento. Puedes continuar leyendo la transcripción completa aquí debajo sin bloquear tu avance.
        </p>
      ) : (
        <div className="audioControlsRow">
          <audio
            ref={audioRef}
            controls
            preload="metadata"
            onLoadedMetadata={() => {
              if (audioRef.current) audioRef.current.playbackRate = speed
            }}
            onError={() => setUnavailable(true)}
            src={import.meta.env.BASE_URL + PODCAST_META.srcPath}
          />
          <div className="speedControls" role="group" aria-label="Velocidad de reproducción del pódcast">
            <span className="speedLabel">
              <Gauge size={15} aria-hidden="true" /> Velocidad:
            </span>
            {PODCAST_META.speeds.map((rate) => (
              <button
                key={rate}
                type="button"
                className="speedBtn"
                aria-pressed={speed === rate}
                onClick={() => handleSpeedChange(rate)}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      )}

      <details className="transcriptBox">
        <summary>Leer transcripción y momentos clave de la conversación</summary>
        <ol className="transcriptList">
          {PODCAST_TRANSCRIPT.map((entry) => (
            <li key={entry.time}>
              <span className="transcriptTime">{entry.time}</span>
              <div>
                <strong>{entry.speaker}</strong>
                <p>{entry.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </details>
    </ContentCard>
  )
}

export function Guide() {
  const { section } = useParams()
  const index = Math.max(0, guidePages.findIndex((p) => p.id === section))
  const [activePiece, setActivePiece] = useState(0)

  return (
    <article className="lessonBody">
      <p className="meta">Guía del estudiante</p>
      <TextReveal>{guidePages[index].title}</TextReveal>
      <nav className="guideTabs" aria-label="Guía del estudiante">
        {guidePages.map((p, k) => {
          const isCurrent = k === index
          return (
            <Link key={p.id} aria-current={isCurrent ? 'page' : undefined} to={'/guia/' + p.id}>
              {isCurrent && <motion.span layoutId="guide-tab-pill" className="guideTabActiveBg" transition={pillSpring} />}
              <span className="guideTabLabel">{p.title}</span>
            </Link>
          )
        })}
      </nav>

      <div>
        {index === 0 && (
          <>
            <div className="wideCardGrid twoCols">
              <ContentCard title="¿Cómo pasa una idea a la pantalla del teléfono?" icon={Compass} delay={0.04}>
                <p>
                  Android impulsa miles de millones de dispositivos móviles en el mundo. Este OVA te introduce paso a paso en los conceptos, el lenguaje <strong>Kotlin</strong> y el entorno profesional <strong>Android Studio</strong>.
                </p>
                <p>
                  Durante el recorrido acompañaremos a <strong>Marta</strong>, dueña de la <em>Panadería La Espiga</em>, quien recibe pedidos escritos a mano y quiere que sus clientes puedan fotografiarlos y enviarlos desde el celular.
                </p>
              </ContentCard>

              <ContentCard title="Qué sabrás hacer al terminar" icon={Sparkles} delay={0.12}>
                <ul className="cardBulletList">
                  <li>Distinguir las restricciones propias de un dispositivo móvil y justificar cuándo elegir desarrollo nativo.</li>
                  <li>Leer una clase de datos en Kotlin, aprovechar <code>Null Safety</code> y reconocer sus ventajas frente a Java.</li>
                  <li>Ubicar las herramientas de Android Studio y explicar cómo intervienen <code>Activity</code>, <code>AndroidManifest.xml</code>, Gradle y el archivo <code>.apk</code>.</li>
                </ul>
              </ContentCard>
            </div>

            <IntroVideo />
            <WelcomeAudio />
          </>
        )}

        {index === 1 && (
          <>
            <RevealBlock delay={0.03}>
              <p className="lead">
                Este OVA está diseñado para estudiar de forma autónoma y a tu propio ritmo. Puedes dividir el recorrido en varias sesiones: tu progreso y tus puntajes quedan guardados en este navegador.
              </p>
            </RevealBlock>

            <RevealBlock delay={0.08}>
              <section className="approachSection">
                <h2>Competencias del curso</h2>
                <div className="wideCardGrid twoCols">
                  {competencies.map((comp) => (
                    <AnimatedAccordion key={comp.kind} title={`Competencia · ${comp.kind}`} icon={BookOpen} initialOpen>
                      <p>{comp.description}</p>
                    </AnimatedAccordion>
                  ))}
                </div>
              </section>
            </RevealBlock>

            <RevealBlock delay={0.12}>
              <section className="lab">
                <small>RUTA METODOLÓGICA</small>
                <h2>Cuatro fases de aprendizaje</h2>
                <StaggerGroup className="phases phasesGrid">
                  {learningPhases.map((phase) => (
                    <StaggerItem key={phase.title}>
                      <div className="phaseStepInner">
                        <h3>{phase.title}</h3>
                        <p>{phase.body}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </section>
            </RevealBlock>

            <div className="wideCardGrid twoCols">
              <RevealBlock delay={0.06}>
                <section className="lab">
                  <small>PLANIFICACIÓN · 50 MINUTOS</small>
                  <h2>Tiempos estimados de referencia</h2>
                  <div className="timeTableWrap">
                    <table className="studyTable">
                      <thead>
                        <tr>
                          <th scope="col">Etapa</th>
                          <th scope="col">Tiempo</th>
                          <th scope="col">Detalle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studyTimes.map((row) => (
                          <tr key={row.stage}>
                            <td><strong>{row.stage}</strong></td>
                            <td className="monoCell">{row.minutes}</td>
                            <td>{row.detail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </RevealBlock>

              <RevealBlock delay={0.14}>
                <section className="lab">
                  <small>ESTUDIO AUTÓNOMO</small>
                  <h2>Recomendaciones prácticas</h2>
                  <ul className="cardBulletList">
                    {studyRecommendations.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </section>
              </RevealBlock>
            </div>

            <CalloutBox title="¿Tengo que hacerlo en una sola sesión?">
              <p>
                No es necesario: los tiempos son orientativos. Puedes pausar cuando quieras y retomar exactamente en la última sección visitada desde la portada.
              </p>
            </CalloutBox>
          </>
        )}

        {index === 2 && (
          <>
            <RevealBlock delay={0.03}>
              <p className="lead">
                Una aplicación Android se construye articulando tres piezas: <strong>el dispositivo</strong>, <strong>el lenguaje</strong> y <strong>la herramienta</strong>. Cada respuesta te prepara para una decisión en el encargo de la panadería.
              </p>
            </RevealBlock>

            <StaggerGroup className="wideCardGrid threeCols">
              {contentOverviewSteps.map((item, idx) => (
                <StaggerItem key={item.step}>
                  <section
                    className={`lab pieceCard${activePiece === idx ? ' is-highlighted' : ''}`}
                    onMouseEnter={() => setActivePiece(idx)}
                  >
                    <small>{item.step}</small>
                    <h2>{item.question}</h2>
                    <p className="pieceSubtitle">{item.lessonTitle}</p>
                    <p>{item.summary}</p>
                    <Link className="inlineLessonLink" to={item.lessonPath}>
                      Abrir lección ↗
                    </Link>
                  </section>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <ContentCard title="Al terminar los contenidos podrás" icon={Layers3}>
              <ul className="cardBulletList">
                {contentOutcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </ContentCard>

            <CalloutBox title="Después de las lecciones">
              <p>
                Al finalizar Android Studio realizarás el <strong>Diagnóstico de presaberes</strong> y pasarás a los talleres interactivos: pareo de conceptos, mapa del IDE, escenario con Marta y evaluación final.
              </p>
            </CalloutBox>
          </>
        )}

        {index === 3 && (
          <>
            <RevealBlock delay={0.03}>
              <p className="lead">
                Documentación técnica oficial y bibliografía académica empleadas en el curso (formato APA). Los enlaces se abren en una nueva pestaña.
              </p>
            </RevealBlock>
            <RevealBlock delay={0.08}>
              <section className="lab">
                <small>REFERENTES DEL OVA · FORMATO APA</small>
                <h2>Fuentes oficiales y lecturas recomendadas</h2>
                <StaggerGroup className="apaGridCards">
                  {apaReferences.map((ref) => (
                    <StaggerItem key={ref.authors + ref.title} className="apaCardItem">
                      <span>
                        {ref.authors} ({ref.year}). <i>{ref.title}</i>. {ref.source}{' '}
                      </span>
                      {ref.url && (
                        <span className="apaLinkRow">
                          <a href={ref.url} target="_blank" rel="noreferrer">
                            {ref.url} <ExternalLink size={14} aria-hidden="true" />
                            <span className="visuallyHidden"> (se abre en una nueva pestaña)</span>
                          </a>
                          {ref.consulted && <small className="refDate"> · {ref.consulted}</small>}
                        </span>
                      )}
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </section>
            </RevealBlock>
          </>
        )}
      </div>
    </article>
  )
}
