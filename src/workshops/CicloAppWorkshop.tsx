import { useEffect, useRef, useState } from 'react'
import { ST } from '../content/activities'

export function CicloAppWorkshop({ onComplete }: { onComplete: () => void }) {
  const [cur, setCur] = useState(0)
  const [seen, setSeen] = useState<number[]>([0])
  const [playing, setPlaying] = useState(false)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  function visitStation(k: number) {
    setCur(k)
    setSeen((prev) => {
      const next = prev.includes(k) ? prev : [...prev, k]
      if (next.length === ST.length && !completedRef.current) {
        completedRef.current = true
        onCompleteRef.current()
      }
      return next
    })
  }

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setCur((prev) => {
        if (prev >= ST.length - 1) {
          setPlaying(false)
          return prev
        }
        const nextIdx = prev + 1
        setSeen((prevSeen) => {
          const updated = prevSeen.includes(nextIdx) ? prevSeen : [...prevSeen, nextIdx]
          if (updated.length === ST.length && !completedRef.current) {
            completedRef.current = true
            onCompleteRef.current()
          }
          return updated
        })
        return nextIdx
      })
    }, 3000)
    return () => window.clearInterval(id)
  }, [playing])

  function toggleAutoPlay() {
    if (playing) {
      setPlaying(false)
      return
    }
    const startIdx = cur >= ST.length - 1 ? 0 : cur + 1
    visitStation(startIdx)
    setPlaying(true)
  }

  const station = ST[cur]
  const progressPct = (cur / (ST.length - 1)) * 100

  return (
    <div
      className="kl-workshop"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' && cur < ST.length - 1) {
          setPlaying(false)
          visitStation(cur + 1)
        }
        if (e.key === 'ArrowLeft' && cur > 0) {
          setPlaying(false)
          visitStation(cur - 1)
        }
      }}
    >
      <div className="kl-crumbs" aria-label="Ruta simulada del archivo en Android Studio">
        <span>OVA_Kotlin</span>
        <span aria-hidden="true">›</span>
        <span>conclusiones</span>
        <span aria-hidden="true">›</span>
        <span className="kl-file">CicloApp.kt</span>
      </div>

      <section className="kl-cycle-line" aria-label="Estaciones del ciclo de vida de desarrollo de una aplicación Android">
        <div className="kl-cycle-ctrl">
          <button type="button" className="kl-btn" onClick={toggleAutoPlay}>
            {playing ? 'Pausar recorrido' : 'Reproducir el ciclo'}
          </button>
          <span className="kl-hud-step">
            {seen.length} de {ST.length} estaciones exploradas
          </span>
        </div>

        <div className="kl-cycle-track">
          <div className="kl-cycle-rail" aria-hidden="true">
            <i style={{ width: `${progressPct}%` }} />
          </div>
          {ST.map((s, k) => {
            const isCurrent = k === cur
            const isSeen = seen.includes(k) && !isCurrent
            return (
              <button
                key={s.t}
                type="button"
                className={`kl-cycle-st${isCurrent ? ' is-on' : ''}${isSeen ? ' is-done' : ''}`}
                aria-pressed={isCurrent}
                onClick={() => {
                  setPlaying(false)
                  visitStation(k)
                }}
              >
                <span className="kl-cycle-node">
                  {s.g}
                  {isCurrent && (
                    <span className="kl-cycle-packet" aria-hidden="true">
                      kt
                    </span>
                  )}
                </span>
                <span className="kl-cycle-tx">
                  <span className="kl-cycle-n">0{k + 1}</span>
                  <span className="kl-cycle-t">{s.t}</span>
                  <span className="kl-cycle-s">{s.s}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div className={`kl-cycle-loop${cur === ST.length - 1 ? ' is-pulse' : ''}`} aria-hidden="true">
          <span>¿falla algo en Logcat? corriges en Kotlin y vuelves a compilar</span>
        </div>
        <p className="kl-cycle-mobile-loop">
          Bucle de mejora continua: si algo falla en el emulador o Logcat, vuelves al código Kotlin, corriges y compilas de nuevo.
        </p>
      </section>

      <section className="kl-cycle-detail" aria-live="polite">
        <div>
          <p className="kl-eyebrow">
            Estación 0{cur + 1} de 0{ST.length} · <b>{station.t}</b>
          </p>
          <h2>{station.h}</h2>
          <p>{station.p}</p>
        </div>

        <dl className="kl-cycle-facts">
          <dt>interviene</dt>
          <dd>
            {station.fileCode && <code>{station.fileCode}</code>}
            {station.fileLabel}
          </dd>
          <dt>lo estudiaste en</dt>
          <dd>{station.tema}</dd>
          <dt>lo practicaste en</dt>
          <dd>{station.act}</dd>
        </dl>

        <div className="kl-cycle-nav">
          <button
            type="button"
            className="kl-btn kl-ghost"
            disabled={cur === 0}
            onClick={() => {
              setPlaying(false)
              visitStation(cur - 1)
            }}
          >
            Anterior
          </button>
          {seen.length === ST.length && <span className="kl-cycle-done">✓ Recorriste las 6 estaciones del ciclo</span>}
          <button
            type="button"
            className="kl-btn"
            onClick={() => {
              setPlaying(false)
              visitStation(cur === ST.length - 1 ? 0 : cur + 1)
            }}
          >
            {cur === ST.length - 1 ? 'Volver a la estación 01' : 'Siguiente estación'}
          </button>
        </div>
      </section>
    </div>
  )
}
