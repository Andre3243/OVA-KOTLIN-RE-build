import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { INTRO, STEPS, type ScenarioOption } from '../content/activities'
import { playFeedbackTone } from './sound'

type NewChatItem =
  | { kind: 'sys'; text: string }
  | { kind: 'them'; text: string; time: string }
  | { kind: 'me'; text: string; time: string }
  | { kind: 'mentor'; grade: ScenarioOption['g']; topic: string; text: string }

type ChatItem = NewChatItem & { id: number }

const DELTA = { ok: 10, meh: -5, bad: -10 } as const

function currentTime() {
  const d = new Date()
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

function EscenarioSession({
  onComplete,
  onRestart,
}: {
  onComplete: () => void
  onRestart: () => void
}) {
  const reducedMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const [trust, setTrust] = useState(50)
  const [deltaInfo, setDeltaInfo] = useState<{ val: number; text: string } | null>(null)
  const [tries, setTries] = useState<number[][]>(() => STEPS.map(() => []))
  const [firstChoice, setFirstChoice] = useState<(ScenarioOption['g'] | null)[]>(() => STEPS.map(() => null))
  const [messages, setMessages] = useState<ChatItem[]>(() => [
    { id: 1, kind: 'sys', text: `Nuevo chat · ${currentTime()}` },
  ])
  const [typing, setTyping] = useState(true)
  const [replyMode, setReplyMode] = useState<'loading' | 'options' | 'continue' | 'retry' | 'done'>('loading')

  const nextMsgId = useRef(2)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const actionBtnRef = useRef<HTMLButtonElement>(null)
  const mountedRef = useRef(true)

  const pause = (ms: number) =>
    new Promise<void>((resolve) => window.setTimeout(resolve, reducedMotion ? Math.min(ms, 80) : ms))

  function appendMsg(item: NewChatItem) {
    const id = nextMsgId.current++
    setMessages((prev) => [...prev, { ...item, id }])
  }

  useEffect(() => {
    const el = chatScrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  useEffect(() => {
    mountedRef.current = true
    let cancelled = false
    const waitMs = (ms: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, reducedMotion ? Math.min(ms, 80) : ms))

    void (async () => {
      for (const line of INTRO) {
        await waitMs(420)
        if (cancelled) return
        const id = nextMsgId.current++
        setMessages((prev) => [...prev, { id, kind: 'them', text: line, time: currentTime() }])
      }
      await waitMs(420)
      if (cancelled) return
      const id = nextMsgId.current++
      setTyping(false)
      setMessages((prev) => [...prev, { id, kind: 'them', text: STEPS[0].ask, time: currentTime() }])
      setReplyMode('options')
    })()

    return () => {
      cancelled = true
      mountedRef.current = false
    }
  }, [reducedMotion])

  async function martaSays(text: string) {
    setTyping(true)
    await pause(380 + Math.min(text.length * 8, 520))
    if (!mountedRef.current) return false
    setTyping(false)
    appendMsg({ kind: 'them', text, time: currentTime() })
    return true
  }

  async function handlePick(optionIdx: number) {
    if (replyMode !== 'options') return
    const currentStep = STEPS[step]
    const option = currentStep.options[optionIdx]
    setReplyMode('loading')

    appendMsg({ kind: 'me', text: option.t, time: currentTime() })

    const isFirst = tries[step].length === 0
    setTries((prev) => {
      const copy = prev.map((arr) => [...arr])
      copy[step].push(optionIdx)
      return copy
    })
    if (isFirst) {
      setFirstChoice((prev) => {
        const copy = [...prev]
        copy[step] = option.g
        return copy
      })
    }

    if (option.g !== 'ok' || isFirst) {
      const d = DELTA[option.g]
      setTrust((prev) => Math.max(0, Math.min(100, prev + d)))
      setDeltaInfo({
        val: d,
        text: d > 0 ? `+${d} · a Marta le dio confianza tu respuesta` : `${d} · Marta quedó con dudas`,
      })
    }

    const ok = await martaSays(option.reply)
    if (!ok) return
    await pause(180)
    if (!mountedRef.current) return

    appendMsg({ kind: 'mentor', grade: option.g, topic: currentStep.topic, text: option.mentor })
    playFeedbackTone(option.g === 'ok')

    setReplyMode(option.g === 'ok' ? 'continue' : 'retry')
    requestAnimationFrame(() => actionBtnRef.current?.focus({ preventScroll: true }))
  }

  async function handleAdvance() {
    const nextStep = step + 1
    setReplyMode('loading')
    if (nextStep < STEPS.length) {
      setStep(nextStep)
      const ok = await martaSays(STEPS[nextStep].ask)
      if (!ok) return
      setReplyMode('options')
    } else {
      setStep(STEPS.length)
      const goodCount = firstChoice.filter((g) => g === 'ok').length
      const closingMsg =
        goodCount >= 5
          ? '¡Mis clientes ya están haciendo pedidos con la app! Te voy a recomendar con todos los negocios del barrio.'
          : goodCount >= 3
            ? 'Quedó muy bien la app, aunque nos tocó ajustar varias decisiones en el camino. ¡Gracias por el acompañamiento!'
            : 'Fue un proceso con varios tropiezos, pero logramos entender qué necesitaba la app. Conviene repasar antes del siguiente encargo.'
      const ok = await martaSays(closingMsg)
      if (!ok) return
      appendMsg({
        kind: 'sys',
        text: `Proyecto cerrado · ${goodCount} de ${STEPS.length} decisiones acertadas al primer intento`,
      })
      setReplyMode('done')
      onComplete()
    }
  }

  const goodFirstCount = firstChoice.filter((g) => g === 'ok').length
  const endingMeta =
    goodFirstCount >= 5
      ? { cls: 'is-good', tag: 'App entregada', title: 'Marta te va a recomendar' }
      : goodFirstCount >= 3
        ? { cls: 'is-mid', tag: 'Entregada con ajustes', title: 'Proyecto terminado' }
        : { cls: 'is-low', tag: 'Proyecto con tropiezos', title: 'La entrega requirió correcciones' }

  return (
    <div className="kl-workshop">
      <div className="kl-crumbs" aria-label="Ruta simulada del archivo en Android Studio">
        <span>OVA_Kotlin</span>
        <span aria-hidden="true">›</span>
        <span>clientes</span>
        <span aria-hidden="true">›</span>
        <span className="kl-file">Actividad1_4.kt</span>
      </div>

      <div className="kl-esc-stage">
        <section className="kl-chat" aria-label="Conversación con Marta, clienta de la panadería">
          <div className="kl-chat-head">
            <div className="kl-avatar" aria-hidden="true">
              M
            </div>
            <div className="kl-who">
              <b>Marta · Panadería La Espiga</b>
              <span className={typing ? 'is-typing' : undefined}>{typing ? 'escribiendo…' : 'en línea'}</span>
            </div>
            <div className="kl-mini-trust" aria-hidden="true">
              <span>confianza</span>
              <span className="kl-mini-bar">
                <i style={{ width: `${trust}%` }} />
              </span>
            </div>
          </div>

          <div className="kl-msgs" ref={chatScrollRef} role="log" aria-live="polite">
            {messages.map((m) => {
              if (m.kind === 'sys') {
                return (
                  <div key={m.id} className="kl-msg-sys">
                    {m.text}
                  </div>
                )
              }
              if (m.kind === 'mentor') {
                const label =
                  m.grade === 'ok'
                    ? 'Buena decisión'
                    : m.grade === 'meh'
                      ? 'Funciona, pero hay una mejor alternativa'
                      : 'Decisión equivocada'
                return (
                  <div key={m.id} className={`kl-mentor is-${m.grade}`}>
                    <span className="kl-mentor-ic" aria-hidden="true">
                      ?:
                    </span>
                    <div className="kl-mentor-tx">
                      <span className="kl-mentor-lb">
                        {label} · {m.topic}
                      </span>
                      <span>{m.text}</span>
                    </div>
                  </div>
                )
              }
              return (
                <div key={m.id} className={`kl-msg ${m.kind === 'them' ? 'is-them' : 'is-me'}`}>
                  {m.text}
                  <time>{m.time}</time>
                </div>
              )
            })}
            {typing && (
              <div className="kl-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            )}
          </div>

          <div className="kl-replies">
            {replyMode === 'options' && step < STEPS.length && (
              <>
                <span className="kl-replies-h">Tu respuesta profesional</span>
                {STEPS[step].options.map((opt, k) => (
                  <button
                    key={opt.t}
                    type="button"
                    className="kl-reply-btn"
                    disabled={tries[step]?.includes(k)}
                    onClick={() => void handlePick(k)}
                  >
                    {opt.t}
                  </button>
                ))}
              </>
            )}

            {replyMode === 'continue' && (
              <button ref={actionBtnRef} type="button" className="kl-btn" onClick={() => void handleAdvance()}>
                {step < STEPS.length - 1 ? 'Continuar' : 'Ver cierre del proyecto'}
              </button>
            )}

            {replyMode === 'retry' && (
              <button ref={actionBtnRef} type="button" className="kl-btn" onClick={() => setReplyMode('options')}>
                Elegir otra opción
              </button>
            )}

            {replyMode === 'done' && <span className="kl-replies-h">Conversación finalizada</span>}
          </div>
        </section>

        <aside className="kl-esc-board" aria-label="Estado del encargo y confianza de la clienta">
          <div className="kl-card">
            <h2>Confianza de Marta</h2>
            <div className="kl-trust">
              <b>{trust}</b>
              <span>/ 100</span>
            </div>
            <div className="kl-gauge" aria-hidden="true">
              <i style={{ width: `${trust}%` }} />
            </div>
            {deltaInfo && (
              <div className={`kl-delta ${deltaInfo.val > 0 ? 'is-up' : 'is-down'}`} role="status">
                {deltaInfo.text}
              </div>
            )}
          </div>

          <div className="kl-card">
            <div className="kl-card-row">
              <h2>Ficha del proyecto</h2>
              <span className="kl-hud-step">
                {step < STEPS.length ? `Decisión ${step + 1} de ${STEPS.length}` : 'Proyecto cerrado'}
              </span>
            </div>
            <dl className="kl-spec">
              <dt>Cliente</dt>
              <dd>Panadería La Espiga</dd>
              <span />
              {STEPS.map((s, k) => {
                const okIdx = s.options.findIndex((o) => o.g === 'ok')
                const solved = tries[k]?.includes(okIdx)
                if (!solved) {
                  return (
                    <div key={s.spec} className="kl-spec-row">
                      <dt>{s.spec}</dt>
                      <dd className={k === step ? 'is-now' : 'is-empty'}>{k === step ? 'decidiendo…' : '—'}</dd>
                      <span />
                    </div>
                  )
                }
                const wasFirst = firstChoice[k] === 'ok'
                return (
                  <div key={s.spec} className="kl-spec-row">
                    <dt>{s.spec}</dt>
                    <dd>{s.options[okIdx].v}</dd>
                    <span className={`kl-mk ${wasFirst ? 'is-first' : 'is-fixed'}`}>
                      {wasFirst ? '1.er intento' : 'corregido'}
                    </span>
                  </div>
                )
              })}
            </dl>
          </div>

          {replyMode === 'done' && (
            <div className={`kl-ending ${endingMeta.cls}`} role="status">
              <span className="kl-ending-tag">{endingMeta.tag}</span>
              <h2>{endingMeta.title}</h2>
              <p>
                Acertaste {goodFirstCount} de {STEPS.length} decisiones al primer intento y la confianza de Marta terminó en{' '}
                <strong>{trust} / 100</strong>.{' '}
                {goodFirstCount < STEPS.length
                  ? 'Revisa en la ficha las filas marcadas como «corregido» antes de presentar el Quiz Final.'
                  : 'Tomaste todas las decisiones técnicas con criterio profesional.'}
              </p>
              <button type="button" className="kl-btn" onClick={onRestart}>
                Atender otro proyecto
              </button>
            </div>
          )}

          <p className="kl-note">
            Las respuestas acertadas al primer intento suben la confianza. Si eliges otra alternativa, el mentor explica la razón técnica para que puedas corregirla.
          </p>
        </aside>
      </div>
    </div>
  )
}

export function EscenarioWorkshop({ onComplete }: { onComplete: () => void }) {
  const [session, setSession] = useState(0)
  return <EscenarioSession key={session} onComplete={onComplete} onRestart={() => setSession((s) => s + 1)} />
}
