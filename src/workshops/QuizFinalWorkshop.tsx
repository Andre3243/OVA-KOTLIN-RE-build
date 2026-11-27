import { useCallback, useEffect, useRef, useState } from 'react'
import { exam } from '../content/activities'
import { playFeedbackTone } from './sound'

const LETTERS = ['a', 'b', 'c', 'd'] as const
const GUTTER_LINES = Array.from({ length: 28 }, (_, i) => i + 1)

type ConsoleLine = { id: number; text: string; cls: string }

function pad(v: number) {
  return String(v).padStart(2, '0')
}

export function QuizFinalWorkshop({ onComplete }: { onComplete: (score: number) => void }) {
  const n = exam.questions.length
  const [state, setState] = useState<'idle' | 'running' | 'building' | 'graded'>('idle')
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(n).fill(null))
  const [timeLeft, setTimeLeft] = useState(exam.minutes * 60)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [signerName, setSignerName] = useState('')
  const [elapsedSecs, setElapsedSecs] = useState(0)
  const [todayFormatted] = useState(() =>
    new Date().toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  )
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([
    { id: 1, text: 'Esperando ejecución. Pulsa «Ejecutar quiz» para iniciar la compilación evaluativa.', cls: 'is-dim' },
  ])

  const nextLineId = useRef(2)
  const startedAtRef = useRef(0)
  const outRef = useRef<HTMLPreElement>(null)
  const resultRef = useRef<HTMLElement>(null)
  const answersRef = useRef(answers)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    answersRef.current = answers
    onCompleteRef.current = onComplete
  }, [answers, onComplete])

  const pushOut = useCallback((text: string, cls = '') => {
    const id = nextLineId.current++
    setConsoleLines((prev) => [...prev, { id, text, cls }])
  }, [])

  useEffect(() => {
    const el = outRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [consoleLines])

  const runGradeSequence = useCallback(
    (currentAnswers: (number | null)[]) => {
      setState('building')
      setConfirmOpen(false)
      const secs = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
      setElapsedSecs(secs)
      const score = exam.questions.reduce((sum, q, k) => sum + (currentAnswers[k] === q.correct ? 1 : 0), 0)
      const passed = score / n >= exam.pass

      const buildScript: [string, string][] = [
        ['> Task :app:preBuild', 'is-hi'],
        ['> Task :app:compileRespuestasKotlin', 'is-hi'],
      ]
      exam.questions.forEach((q, k) => {
        const ok = currentAnswers[k] === q.correct
        buildScript.push([`> Task :app:verificarPregunta${k + 1}  ${ok ? 'CORRECTA' : 'FALLÓ'}`, ok ? 'is-ok' : 'is-bad'])
        if (!ok) {
          buildScript.push([
            `e: QuizFinal.kt:(${k + 1}, 1): ${currentAnswers[k] === null ? 'pregunta sin responder' : 'respuesta incorrecta'}. Repasa ${q.topic}`,
            'is-bad',
          ])
        }
      })
      if (passed) {
        buildScript.push(
          ['> Task :app:assembleRelease', 'is-hi'],
          ['> Task :app:signRelease  ova1-kotlin-release.apk', 'is-hi'],
        )
      }
      buildScript.push(
        [
          `COMPILACIÓN ${passed ? 'EXITOSA' : 'CON ERRORES'} en ${Math.floor(secs / 60)}m ${secs % 60}s`,
          passed ? 'is-ok is-big' : 'is-bad is-big',
        ],
        [`${n} tareas verificadas: ${score} correctas, ${n - score} por corregir`, 'is-dim'],
      )

      let stepIdx = 0
      const stepTimer = window.setInterval(() => {
        if (stepIdx < buildScript.length) {
          const [line, cls] = buildScript[stepIdx]
          pushOut(line, cls)
          stepIdx++
        } else {
          window.clearInterval(stepTimer)
          setState('graded')
          playFeedbackTone(passed)
          onCompleteRef.current(score)
          requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
        }
      }, 180)
    },
    [n, pushOut],
  )

  useEffect(() => {
    if (state !== 'running') return
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1
        if (next === 60) pushOut('w: Queda 1 minuto para entregar.', 'is-wa')
        if (next <= 0) {
          window.clearInterval(timer)
          pushOut('w: Tiempo agotado. Compilando respuestas registradas…', 'is-wa')
          runGradeSequence(answersRef.current)
          return 0
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [state, pushOut, runGradeSequence])

  function handleStart() {
    if (state === 'running' || state === 'building') return
    const blank = Array<number | null>(n).fill(null)
    setAnswers(blank)
    setIdx(0)
    setConfirmOpen(false)
    setTimeLeft(exam.minutes * 60)
    startedAtRef.current = Date.now()
    setConsoleLines([
      { id: nextLineId.current++, text: '> Configure project :app', cls: 'is-hi' },
      { id: nextLineId.current++, text: `Quiz iniciado. Tienes ${exam.minutes} minutos para resolver ${n} tareas.`, cls: 'is-dim' },
    ])
    setState('running')
  }

  function handleSelectOption(optIdx: number) {
    if (state !== 'running') return
    setAnswers((prev) => {
      const copy = [...prev]
      copy[idx] = optIdx
      return copy
    })
    setConfirmOpen(false)
    pushOut(`> Task :app:pregunta${idx + 1}  opción ${LETTERS[optIdx]} guardada`, 'is-dim')
  }

  const score = exam.questions.reduce((sum, q, k) => sum + (answers[k] === q.correct ? 1 : 0), 0)
  const passed = score / n >= exam.pass
  const nota = ((score / n) * 5).toFixed(1)
  const missingCount = answers.filter((a) => a === null).length
  const currentQuestion = exam.questions[idx]

  return (
    <div className="kl-workshop">
      <div className="kl-crumbs" aria-label="Ruta simulada del archivo en Android Studio">
        <span>OVA_Kotlin</span>
        <span aria-hidden="true">›</span>
        <span>app</span>
        <span aria-hidden="true">›</span>
        <span>src</span>
        <span aria-hidden="true">›</span>
        <span>main</span>
        <span aria-hidden="true">›</span>
        <span className="kl-file">QuizFinal.kt</span>
      </div>

      <section className="kl-quiz-ide" aria-label="Entorno de evaluación final">
        <div className="kl-quiz-toolbar">
          <span className="kl-quiz-proj">OVA_Kotlin</span>
          <span className="kl-quiz-cfg">app · release</span>
          <span className="kl-spacer" />
          <span
            className={`kl-quiz-clock${timeLeft <= 60 && state === 'running' ? ' is-low' : ''}`}
            title="Tiempo restante"
          >
            {Math.floor(timeLeft / 60)}:{pad(timeLeft % 60)}
          </span>
          <button
            type="button"
            className="kl-runbtn"
            disabled={state === 'running' || state === 'building'}
            onClick={handleStart}
          >
            {state === 'graded' ? 'Ejecutar de nuevo' : 'Ejecutar'}
          </button>
        </div>

        <div className="kl-quiz-main">
          <nav className="kl-quiz-tasks" aria-label="Lista de preguntas del quiz">
            <span className="kl-col-h">Gradle · tareas</span>
            {exam.questions.map((q, k) => {
              const statusCls =
                state === 'graded'
                  ? answers[k] === q.correct
                    ? ' is-ok'
                    : ' is-bad'
                  : answers[k] !== null
                    ? ' is-done'
                    : ''
              const hereCls = state === 'running' && k === idx ? ' is-here' : ''
              return (
                <button
                  key={q.q}
                  type="button"
                  className={`kl-task-btn${statusCls}${hereCls}`}
                  disabled={state !== 'running'}
                  onClick={() => {
                    setIdx(k)
                    setConfirmOpen(false)
                  }}
                >
                  <span className="kl-task-dot" aria-hidden="true" />
                  <span>
                    <span className="kl-task-name">:pregunta{k + 1}</span>
                    <small>{q.topic}</small>
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="kl-quiz-editor">
            <div className="kl-etabs" aria-hidden="true">
              <span className="is-on">QuizFinal.kt</span>
              <span>build.gradle.kts</span>
            </div>
            <div className="kl-editor-code">
              <div className="kl-gutter" aria-hidden="true">
                {GUTTER_LINES.map((ln) => (
                  <div key={ln}>{ln}</div>
                ))}
              </div>

              <div className="kl-src">
                {state === 'idle' && (
                  <>
                    <div className="kl-cm">
                      {'/**\n * Quiz de verificación final · OVA Kotlin\n * Nota sobre 5.0 · Se aprueba con 3.0 (3 de 5 aciertos)\n */'}
                    </div>
                    <div className="kl-cm">
                      {exam.steps.map((s) => `// ${s}`).join('\n')}
                    </div>
                    <div className="kl-kw">
                      <span className="kl-syn-k">fun</span> <span className="kl-syn-f">main</span>() {'{\n'}
                      {'    '}
                      <span className="kl-syn-k">val</span> nota: <span className="kl-syn-p">Double</span> ={' '}
                      <span className="kl-syn-f">evaluar</span>(preguntas = <span className="kl-syn-p">{n}</span>, minutos ={' '}
                      <span className="kl-syn-p">{exam.minutes}</span>){'\n}'}
                    </div>
                    <div className="kl-quiz-nav">
                      <button type="button" className="kl-btn" onClick={handleStart}>
                        Ejecutar quiz
                      </button>
                    </div>
                  </>
                )}

                {state === 'running' && currentQuestion && (
                  <>
                    <div className="kl-cm">
                      {`// Pregunta ${idx + 1} de ${n} · ${currentQuestion.topic}`}
                    </div>
                    <div className="kl-kw">
                      <span className="kl-syn-k">fun</span> <span className="kl-syn-f">pregunta{idx + 1}</span>():{' '}
                      <span className="kl-syn-p">Respuesta</span> {'{'}
                    </div>
                    <h3 className="kl-qq">{currentQuestion.q}</h3>
                    <div className="kl-kw">
                      {'    '}
                      <span className="kl-syn-k">return when</span> (tuEleccion) {'{'}
                    </div>
                    <div className="kl-branches">
                      {currentQuestion.opts.map((opt, k) => (
                        <button
                          key={opt}
                          type="button"
                          className="kl-branch"
                          aria-pressed={answers[idx] === k}
                          onClick={() => handleSelectOption(k)}
                        >
                          <span className="kl-branch-k">{LETTERS[k]} -&gt;</span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                    <div className="kl-kw">{'    }\n}'}</div>

                    {confirmOpen && (
                      <div className="kl-confirm" role="alertdialog" aria-label="Confirmar entrega de evaluación">
                        <p>
                          {missingCount > 0
                            ? `Te ${missingCount === 1 ? 'falta 1 pregunta' : `faltan ${missingCount} preguntas`} por responder (contarán como incorrectas). ¿Deseas compilar y entregar de todos modos?`
                            : 'Todas las preguntas tienen respuesta registrada. Al compilar ya no podrás modificarlas.'}
                        </p>
                        <div className="kl-dock-actions">
                          <button type="button" className="kl-btn kl-ghost" onClick={() => setConfirmOpen(false)}>
                            Seguir revisando
                          </button>
                          <button type="button" className="kl-btn" onClick={() => runGradeSequence(answers)}>
                            Compilar ahora
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="kl-quiz-nav">
                      <button
                        type="button"
                        className="kl-btn kl-ghost"
                        disabled={idx === 0}
                        onClick={() => {
                          setIdx(idx - 1)
                          setConfirmOpen(false)
                        }}
                      >
                        Anterior
                      </button>
                      <div className="kl-dock-actions">
                        {idx < n - 1 && (
                          <button
                            type="button"
                            className="kl-btn kl-ghost"
                            onClick={() => {
                              setIdx(idx + 1)
                              setConfirmOpen(false)
                            }}
                          >
                            Siguiente
                          </button>
                        )}
                        <button type="button" className="kl-btn" onClick={() => setConfirmOpen(true)}>
                          Compilar y entregar
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {state === 'building' && <div className="kl-cm">// Compilando y verificando QuizFinal.kt…</div>}

                {state === 'graded' && (
                  <div className="kl-cm">
                    {`// Compilación ${passed ? 'exitosa' : 'con observaciones'} en ${elapsedSecs}s. Consulta tu calificación y la revisión detallada aquí debajo.`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="kl-quiz-console">
          <div className="kl-etabs" aria-hidden="true">
            <span className="is-on">Consola Build</span>
            <span>Logcat</span>
          </div>
          <pre className="kl-console-out" ref={outRef} role="log" aria-label="Salida de compilación de Gradle">
            {consoleLines.map((ln) => (
              <span key={ln.id} className={`kl-out-ln ${ln.cls}`}>
                {ln.text}
              </span>
            ))}
          </pre>
        </div>
      </section>

      {state === 'graded' && (
        <section className="kl-quiz-result" ref={resultRef} aria-label="Resultado de la evaluación final">
          <div className="kl-verdict">
            <div className="kl-nota" aria-label={`Nota ${nota} sobre 5.0`}>
              {nota}
            </div>
            <div className="kl-verdict-side">
              <span className={`kl-badge ${passed ? 'is-ok' : 'is-bad'}`}>
                {passed ? 'APROBADO · COMPILACIÓN EXITOSA' : 'POR REFORZAR · COMPILACIÓN FALLIDA'} · {score}/{n}
              </span>
              <h2>{passed ? '¡Completaste la evaluación del OVA!' : 'Aún puedes mejorar tu resultado'}</h2>
              <p>
                {passed
                  ? 'Tu calificación sobre 5.0 confirma que asimilaste las bases del desarrollo móvil con Kotlin y Android Studio.'
                  : 'Se aprueba con 3.0 (3 de 5 aciertos). Revisa las explicaciones detalladas aquí debajo y vuelve a ejecutar el quiz.'}
              </p>
            </div>
          </div>

          {passed && (
            <div className="kl-apk">
              <div className="kl-apk-home" aria-hidden="true">
                <div className="kl-apk-grid">
                  <i />
                  <i />
                  <i />
                  <i />
                  <span className="kl-apk-me">?:</span>
                  <i />
                </div>
                <span className="kl-apk-lbl">OVA 1 Kotlin</span>
                <span className="kl-apk-toast">App instalada</span>
              </div>
              <div className="kl-apk-sheet">
                <span className="kl-eyebrow">Constancia simbólica de logro</span>
                <h3>Tu APK está firmada</h3>
                <dl className="kl-apk-props">
                  <dt>archivo</dt>
                  <dd>ova1-kotlin-release.apk</dd>
                  <dt>firmado por</dt>
                  <dd className="kl-signer">{signerName.trim() || 'Escribe tu nombre debajo'}</dd>
                  <dt>curso</dt>
                  <dd>Primeros pasos en la programación móvil con Kotlin</dd>
                  <dt>nota</dt>
                  <dd>{nota} / 5.0</dd>
                  <dt>fecha</dt>
                  <dd>{todayFormatted}</dd>
                </dl>
                <div className="kl-field">
                  <label htmlFor="apk-signer-name">Firma simbólicamente la APK con tu nombre</label>
                  <input
                    id="apk-signer-name"
                    type="text"
                    maxLength={60}
                    placeholder="Nombre y apellido"
                    autoComplete="name"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="kl-problems">
            <div className="kl-etabs">
              <span className="is-on">Revisión por pregunta</span>
              <span>
                {n - score} {n - score === 1 ? 'observación' : 'observaciones'}
              </span>
            </div>
            <ul className="kl-plist">
              {exam.questions.map((q, k) => {
                const ok = answers[k] === q.correct
                const chosen = answers[k]
                const yourAnswer =
                  chosen === null ? 'Sin responder' : `Tu respuesta: ${LETTERS[chosen]}) ${q.opts[chosen]}`
                return (
                  <li key={q.q}>
                    <span className={`kl-plist-ic ${ok ? 'is-ok' : 'is-bad'}`} aria-hidden="true">
                      {ok ? '✓' : '✗'}
                    </span>
                    <div className="kl-plist-body">
                      <span className="kl-plist-loc">
                        QuizFinal.kt · pregunta{k + 1} ({q.topic})
                      </span>
                      <strong>{q.q}</strong>
                      <span className="kl-plist-m">{yourAnswer}</span>
                      {!ok && (
                        <span className="kl-plist-m">
                          Respuesta correcta: {LETTERS[q.correct]}) {q.opts[q.correct]}
                        </span>
                      )}
                      <span className="kl-plist-m">{q.why}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="kl-again-row">
            <button type="button" className="kl-btn" onClick={handleStart}>
              Ejecutar de nuevo
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
