import { useCallback, useEffect, useRef, useState } from 'react'
import { diagnostic } from '../content/activities'
import { playFeedbackTone } from './sound'

type LogLevel = 'V' | 'D' | 'I' | 'W' | 'E'
type LogEntry = { id: number; ts: string; level: LogLevel; tag: string; msg: string }

const LETTERS = ['a', 'b', 'c', 'd'] as const

function pad(v: number, w = 2) {
  return String(v).padStart(w, '0')
}

function nowStamp() {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
}

function clockTime() {
  const d = new Date()
  return `${d.getHours()}:${pad(d.getMinutes())}`
}

export function DiagnosticoWorkshop({ onComplete }: { onComplete: (score: number) => void }) {
  const n = diagnostic.questions.length
  const [phase, setPhase] = useState<'intro' | 'running' | 'result'>('intro')
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(n).fill(null))
  const [timeLeft, setTimeLeft] = useState(diagnostic.minutes * 60)
  const [phoneClock, setPhoneClock] = useState(clockTime)
  const nextLogId = useRef(4)
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const ts = nowStamp()
    return [
      { id: 1, ts, level: 'I', tag: 'ActivityManager', msg: 'Start proc ova.kotlin.diagnostico' },
      { id: 2, ts, level: 'D', tag: 'Diagnostico', msg: `onCreate(): ${n} preguntas cargadas` },
      { id: 3, ts, level: 'V', tag: 'Diagnostico', msg: 'Esperando a que pulses Comenzar…' },
    ]
  })
  const logContainerRef = useRef<HTMLDivElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)
  const answersRef = useRef(answers)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    answersRef.current = answers
    onCompleteRef.current = onComplete
  }, [answers, onComplete])

  const pushLog = useCallback((level: LogLevel, tag: string, msg: string) => {
    const id = nextLogId.current++
    setLogs((prev) => [...prev, { id, ts: nowStamp(), level, tag, msg }])
  }, [])

  useEffect(() => {
    const el = logContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  useEffect(() => {
    const id = window.setInterval(() => setPhoneClock(clockTime()), 15000)
    return () => window.clearInterval(id)
  }, [])

  const finalizeQuiz = useCallback(
    (currentAnswers: (number | null)[]) => {
      const finalScore = diagnostic.questions.reduce(
        (sum, q, k) => sum + (currentAnswers[k] === q.correct ? 1 : 0),
        0,
      )
      setPhase('result')
      pushLog('I', 'Diagnostico', `Resultado: ${finalScore}/${n} correctas`)
      diagnostic.questions.forEach((q, k) => {
        if (currentAnswers[k] !== q.correct) {
          pushLog('W', 'Repaso', q.topic)
        }
      })
      pushLog('D', 'Diagnostico', 'Esta actividad formativa no suma a la calificación final')
      onCompleteRef.current(finalScore)
    },
    [n, pushLog],
  )

  useEffect(() => {
    if (phase !== 'running') return
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1
        if (next === 60) {
          pushLog('W', 'Timer', 'Queda 1 minuto')
        }
        if (next <= 0) {
          window.clearInterval(timer)
          pushLog('W', 'Timer', 'Tiempo agotado')
          finalizeQuiz(answersRef.current)
          return 0
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [phase, finalizeQuiz, pushLog])

  function handleStart() {
    const blank = Array<number | null>(n).fill(null)
    setAnswers(blank)
    setIdx(0)
    setTimeLeft(diagnostic.minutes * 60)
    setPhase('running')
    pushLog('D', 'Timer', `Cuenta regresiva de ${diagnostic.minutes}:00 iniciada`)
    pushLog('I', 'Diagnostico', 'startActivity(PreguntaActivity)')
  }

  function handleChoose(optionIdx: number) {
    if (phase !== 'running' || answers[idx] !== null) return
    const q = diagnostic.questions[idx]
    const ok = optionIdx === q.correct
    const updated = [...answers]
    updated[idx] = optionIdx
    setAnswers(updated)
    playFeedbackTone(ok)
    pushLog(
      ok ? 'I' : 'W',
      `Pregunta${idx + 1}`,
      ok
        ? `Opción ${LETTERS[optionIdx]} → correcta`
        : `Opción ${LETTERS[optionIdx]} → incorrecta (era ${LETTERS[q.correct]})`,
    )
    requestAnimationFrame(() => nextBtnRef.current?.focus())
  }

  function handleNext() {
    if (idx < n - 1) {
      setIdx(idx + 1)
    } else {
      finalizeQuiz(answers)
    }
  }

  function handleRestart() {
    pushLog('I', 'Diagnostico', 'onRestart()')
    setAnswers(Array<number | null>(n).fill(null))
    setIdx(0)
    setTimeLeft(diagnostic.minutes * 60)
    setPhase('intro')
  }

  const answeredCount = answers.filter((a) => a !== null).length
  const progressPct = phase === 'intro' ? 0 : phase === 'result' ? 100 : (answeredCount / n) * 100
  const score = diagnostic.questions.reduce((sum, q, k) => sum + (answers[k] === q.correct ? 1 : 0), 0)
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - score / n)
  const summaryMessage =
    score === n
      ? ['Base sólida', 'Dominas los conceptos clave; afianza los detalles prácticos en los siguientes talleres.']
      : score >= 3
        ? ['Vas bien encaminado', 'Presta especial atención a los subtemas marcados para repasar antes del quiz final.']
        : ['Puntos clave detectados', 'Revisa las explicaciones de los subtemas marcados para reforzar tus bases antes de practicar.']

  const currentQuestion = diagnostic.questions[idx]
  const currentAnswer = answers[idx]
  const isCurrentAnswered = currentAnswer !== null
  const isCurrentOk = currentAnswer === currentQuestion?.correct

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
        <span className="kl-file">Actividad1_1.kt</span>
      </div>

      <div className="kl-diag-stage">
        <div className="kl-device">
          <div className="kl-phone">
            <div className="kl-screen">
              <div className="kl-sb" aria-hidden="true">
                <span>{phoneClock}</span>
                <span className="kl-cam" />
                <span className="kl-sb-icons">
                  <span className="kl-sig">
                    <i style={{ height: 4 }} />
                    <i style={{ height: 6 }} />
                    <i style={{ height: 8 }} />
                    <i style={{ height: 10 }} />
                  </span>
                  <span className="kl-bat">
                    <i />
                  </span>
                </span>
              </div>

              <div className="kl-appbar">
                <h2>Presaberes</h2>
                <span className={`kl-ptimer${timeLeft <= 60 && phase === 'running' ? ' is-low' : ''}`} aria-label="Tiempo restante">
                  {Math.floor(timeLeft / 60)}:{pad(timeLeft % 60)}
                </span>
              </div>

              <div className="kl-pbar" aria-hidden="true">
                <i style={{ width: `${progressPct}%` }} />
              </div>

              <div className="kl-phone-view">
                {phase === 'intro' && (
                  <>
                    <div className="kl-splash">
                      <div className="kl-appicon" aria-hidden="true">
                        ?:
                      </div>
                      <h3>Diagnóstico</h3>
                      <p>Iniciación en el desarrollo móvil con Kotlin</p>
                    </div>
                    <ul className="kl-phone-rules">
                      <li>
                        <span>01</span>Una sola respuesta correcta por pregunta.
                      </li>
                      <li>
                        <span>02</span>Al elegir una opción verás de inmediato si acertaste y por qué.
                      </li>
                      <li>
                        <span>03</span>Tienes {diagnostic.minutes} minutos en total. No suma a la calificación.
                      </li>
                    </ul>
                    <div className="kl-spacer" />
                    <button type="button" className="kl-btn kl-full" onClick={handleStart}>
                      Comenzar
                    </button>
                  </>
                )}

                {phase === 'running' && currentQuestion && (
                  <>
                    <span className="kl-qtag">
                      Pregunta {idx + 1}/{n}
                    </span>
                    <h3 className="kl-qtext">{currentQuestion.q}</h3>
                    <div className="kl-opts">
                      {currentQuestion.opts.map((opt, k) => {
                        let stateClass = ''
                        if (isCurrentAnswered) {
                          stateClass = k === currentQuestion.correct ? ' is-ok' : k === currentAnswer ? ' is-bad' : ' is-fade'
                        }
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`kl-opt${stateClass}`}
                            disabled={isCurrentAnswered}
                            onClick={() => handleChoose(k)}
                          >
                            <span className="kl-opt-k">{LETTERS[k]}</span>
                            <span>{opt}</span>
                          </button>
                        )
                      })}
                    </div>
                    {isCurrentAnswered && (
                      <div className={`kl-snack ${isCurrentOk ? 'is-ok' : 'is-bad'}`} role="status">
                        <strong>{isCurrentOk ? '¡Correcto!' : `La respuesta correcta es la opción ${LETTERS[currentQuestion.correct]}`}</strong>
                        <span>{currentQuestion.why}</span>
                      </div>
                    )}
                    <div className="kl-spacer" />
                    <button
                      ref={nextBtnRef}
                      type="button"
                      className="kl-btn kl-full"
                      disabled={!isCurrentAnswered}
                      onClick={handleNext}
                    >
                      {idx === n - 1 ? 'Ver resultado' : 'Siguiente'}
                    </button>
                  </>
                )}

                {phase === 'result' && (
                  <>
                    <div className="kl-ring" role="img" aria-label={`${score} de ${n} respuestas correctas`}>
                      <svg width="148" height="148" viewBox="0 0 148 148" aria-hidden="true">
                        <defs>
                          <linearGradient id="kl-diag-grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#f05a4a" />
                            <stop offset="0.5" stopColor="#c711e1" />
                            <stop offset="1" stopColor="#7f52ff" />
                          </linearGradient>
                        </defs>
                        <circle cx="74" cy="74" r={radius} fill="none" stroke="#dcd7ef" strokeWidth="12" />
                        <circle
                          cx="74"
                          cy="74"
                          r={radius}
                          fill="none"
                          stroke="url(#kl-diag-grad)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={dashOffset}
                          transform="rotate(-90 74 74)"
                          style={{ transition: 'stroke-dashoffset 0.9s ease' }}
                        />
                      </svg>
                      <div className="kl-ring-val">
                        <div>
                          <b>
                            {score}/{n}
                          </b>
                          <span>correctas</span>
                        </div>
                      </div>
                    </div>
                    <p className="kl-res-msg">
                      <strong>{summaryMessage[0]}</strong>
                      {summaryMessage[1]}
                    </p>
                    <ul className="kl-tlist">
                      {diagnostic.questions.map((q, k) => {
                        const ok = answers[k] === q.correct
                        return (
                          <li key={q.q}>
                            <span className={`kl-tmark ${ok ? 'is-ok' : 'is-bad'}`} aria-hidden="true">
                              {ok ? '✓' : '✗'}
                            </span>
                            <span>
                              {q.topic}
                              <small>
                                P{k + 1} · {ok ? 'dominado' : answers[k] === null ? 'sin responder' : 'repasar'}
                              </small>
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                    <button type="button" className="kl-btn kl-ghost kl-full" onClick={handleRestart}>
                      Volver a intentar
                    </button>
                  </>
                )}
              </div>

              <div className="kl-gesture" aria-hidden="true">
                <i />
              </div>
            </div>
          </div>
          <span className="kl-device-cap">Pixel_8_API_35 · Emulador Android</span>
        </div>

        <aside className="kl-diag-side" aria-label="Consola Logcat en vivo">
          <div className="kl-logcat">
            <div className="kl-lc-head">
              <span className="kl-lc-rec" aria-hidden="true" />
              <span className="kl-lc-tab">Logcat</span>
              <span className="kl-lc-filter">package:ova.kotlin.diagnostico</span>
            </div>
            <div className="kl-lc-body" ref={logContainerRef} role="log" aria-label="Registro de actividad en Logcat">
              {logs.map((entry) => (
                <div key={entry.id} className={`kl-ll kl-lv-${entry.level}`}>
                  <span className="kl-ll-ts">{entry.ts}</span>
                  <span className="kl-ll-lv">{entry.level}</span>
                  <span className="kl-ll-tag">{entry.tag}</span>
                  <span className="kl-ll-msg">{entry.msg}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="kl-note">
            <strong>¿Qué estás viendo aquí?</strong> Logcat es la consola donde Android Studio muestra en vivo los eventos de tu aplicación. La letra indica el nivel del mensaje: <code>I</code> (información), <code>D</code> (depuración) y <code>W</code> (advertencia).
          </p>
        </aside>
      </div>
    </div>
  )
}
