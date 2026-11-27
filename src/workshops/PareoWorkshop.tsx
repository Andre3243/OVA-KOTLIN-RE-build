import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFS, TERMS } from '../content/activities'
import { playClickTone, playFeedbackTone } from './sound'

const WIRE_COLORS = ['#f05a4a', '#e042e8', '#9a78ff', '#4fb6ff', '#f5b335'] as const

type DragState = {
  id: number
  x0: number
  y0: number
  x: number
  y: number
  moved: boolean
}

type WireSegment = {
  key: string
  d: string
  stroke: string
  stateClass: string
}

function cubicCurve(a: { x: number; y: number }, z: { x: number; y: number }) {
  const dx = Math.max(40, Math.abs(z.x - a.x) * 0.5)
  return `M${a.x},${a.y} C${a.x + dx},${a.y} ${z.x - dx},${z.y} ${z.x},${z.y}`
}

export function PareoWorkshop({ onComplete }: { onComplete: () => void }) {
  const [links, setLinks] = useState<Record<number, string>>({})
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null)
  const [hoverDef, setHoverDef] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [wires, setWires] = useState<WireSegment[]>([])
  const [dragWire, setDragWire] = useState<{ d: string; stroke: string } | null>(null)
  const [statusAnnouncement, setStatusAnnouncement] = useState('')

  const boardRef = useRef<HTMLDivElement>(null)
  const termPortRefs = useRef<Record<number, HTMLSpanElement | null>>({})
  const defPortRefs = useRef<Record<string, HTMLSpanElement | null>>({})
  const dragRef = useRef<DragState | null>(null)

  const recomputeWires = useCallback(() => {
    const board = boardRef.current
    if (!board) return
    const bRect = board.getBoundingClientRect()
    const nextWires: WireSegment[] = []

    TERMS.forEach((term, idx) => {
      const letter = links[term.id]
      if (!letter) return
      const aEl = termPortRefs.current[term.id]
      const zEl = defPortRefs.current[letter]
      if (!aEl || !zEl) return
      const aRect = aEl.getBoundingClientRect()
      const zRect = zEl.getBoundingClientRect()
      const a = { x: aRect.left + aRect.width / 2 - bRect.left, y: aRect.top + aRect.height / 2 - bRect.top }
      const z = { x: zRect.left + zRect.width / 2 - bRect.left, y: zRect.top + zRect.height / 2 - bRect.top }
      const stateClass = checked ? (term.match === letter ? 'is-ok' : 'is-bad') : ''
      nextWires.push({
        key: `${term.id}-${letter}`,
        d: cubicCurve(a, z),
        stroke: WIRE_COLORS[idx],
        stateClass,
      })
    })
    setWires(nextWires)

    const activeDrag = dragRef.current
    if (activeDrag && activeDrag.moved) {
      const idx = TERMS.findIndex((t) => t.id === activeDrag.id)
      const aEl = termPortRefs.current[activeDrag.id]
      if (aEl && idx >= 0) {
        const aRect = aEl.getBoundingClientRect()
        const a = { x: aRect.left + aRect.width / 2 - bRect.left, y: aRect.top + aRect.height / 2 - bRect.top }
        const z = { x: activeDrag.x - bRect.left, y: activeDrag.y - bRect.top }
        setDragWire({ d: cubicCurve(a, z), stroke: WIRE_COLORS[idx] })
      }
    } else {
      setDragWire(null)
    }
  }, [links, checked])

  useEffect(() => {
    recomputeWires()
    const board = boardRef.current
    if (!board) return
    const ro = new ResizeObserver(() => recomputeWires())
    ro.observe(board)
    window.addEventListener('resize', recomputeWires)
    if (document.fonts) {
      document.fonts.ready.then(() => recomputeWires())
    }
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', recomputeWires)
    }
  }, [recomputeWires])

  function connect(termId: number, letter: string) {
    setLinks((prev) => {
      const cleaned: Record<number, string> = {}
      for (const [k, v] of Object.entries(prev)) {
        if (v !== letter) cleaned[Number(k)] = v
      }
      cleaned[termId] = letter
      return cleaned
    })
    setSelectedTerm(null)
    playClickTone()
    const term = TERMS.find((t) => t.id === termId)
    setStatusAnnouncement(`Conectado ${term?.name ?? termId} con definición ${letter}.`)
  }

  function handleDefActivate(letter: string) {
    if (checked) return
    if (selectedTerm !== null) {
      connect(selectedTerm, letter)
      return
    }
    const ownerEntry = Object.entries(links).find(([, l]) => l === letter)
    if (ownerEntry) {
      const ownerId = Number(ownerEntry[0])
      setLinks((prev) => {
        const copy = { ...prev }
        delete copy[ownerId]
        return copy
      })
      playClickTone()
      setStatusAnnouncement(`Cable desconectado de la definición ${letter}.`)
    }
  }

  function handleCheckOrRelease() {
    if (checked) {
      setLinks((prev) => {
        const kept: Record<number, string> = {}
        for (const [k, letter] of Object.entries(prev)) {
          const term = TERMS.find((t) => t.id === Number(k))
          if (term && term.match === letter) kept[Number(k)] = letter
        }
        return kept
      })
      setChecked(false)
      setStatusAnnouncement('Se soltaron las conexiones incorrectas para que puedas volver a conectarlas.')
      return
    }
    setChecked(true)
    setSelectedTerm(null)
    const okCount = TERMS.filter((t) => links[t.id] === t.match).length
    const allCorrect = okCount === TERMS.length
    playFeedbackTone(allCorrect)
    if (allCorrect) onComplete()
  }

  function handleReset() {
    setLinks({})
    setSelectedTerm(null)
    setChecked(false)
    setStatusAnnouncement('Todas las conexiones fueron reiniciadas.')
  }

  const connectedCount = Object.keys(links).length
  const okCount = TERMS.filter((t) => links[t.id] === t.match).length
  const allCorrect = checked && okCount === TERMS.length

  return (
    <div className="kl-workshop">
      <div className="kl-crumbs" aria-label="Ruta simulada del archivo en Android Studio">
        <span>OVA_Kotlin</span>
        <span aria-hidden="true">›</span>
        <span>app</span>
        <span aria-hidden="true">›</span>
        <span>res</span>
        <span aria-hidden="true">›</span>
        <span>navigation</span>
        <span aria-hidden="true">›</span>
        <span className="kl-file">actividad1_2.xml</span>
      </div>

      <section className={`kl-pareo-ws${checked ? ' is-checked' : ''}`} aria-label="Tablero de conexiones de conceptos">
        <div className="kl-ws-bar">
          <span className="kl-ws-tab">Diseño</span>
          <span>nav_graph · actividad1_2</span>
          <span className="kl-ws-count">
            <b>{connectedCount}</b> / {TERMS.length} conexiones
          </span>
        </div>

        <div
          ref={boardRef}
          className={`kl-pareo-board${selectedTerm !== null ? ' is-picking' : ''}`}
          onPointerDown={(e) => {
            if (selectedTerm !== null && !(e.target as HTMLElement).closest('.kl-node')) {
              setSelectedTerm(null)
            }
          }}
        >
          <svg className="kl-wires" aria-hidden="true">
            {wires.map((w) => (
              <path
                key={w.key}
                className={`kl-wire ${w.stateClass}`}
                d={w.d}
                style={w.stateClass ? undefined : { stroke: w.stroke }}
              />
            ))}
            {dragWire && <path className="kl-wire is-temp" d={dragWire.d} style={{ stroke: dragWire.stroke }} />}
          </svg>

          <div className="kl-pareo-col">
            <span className="kl-col-h">Términos</span>
            {TERMS.map((term, idx) => {
              const linkedLetter = links[term.id]
              const isSelected = selectedTerm === term.id
              const color = WIRE_COLORS[idx]
              return (
                <button
                  key={term.id}
                  type="button"
                  className={`kl-node kl-term${linkedLetter ? ' is-linked' : ''}${isSelected ? ' is-sel' : ''}`}
                  style={{ '--cc': color } as React.CSSProperties}
                  aria-pressed={isSelected}
                  aria-label={`Término ${term.id}: ${term.name}${linkedLetter ? `, conectado con definición ${linkedLetter}` : ''}`}
                  onPointerDown={(e) => {
                    if (checked || e.button > 0) return
                    e.currentTarget.setPointerCapture(e.pointerId)
                    dragRef.current = {
                      id: term.id,
                      x0: e.clientX,
                      y0: e.clientY,
                      x: e.clientX,
                      y: e.clientY,
                      moved: false,
                    }
                  }}
                  onPointerMove={(e) => {
                    const d = dragRef.current
                    if (!d || d.id !== term.id) return
                    d.x = e.clientX
                    d.y = e.clientY
                    if (!d.moved && Math.hypot(d.x - d.x0, d.y - d.y0) > 6) {
                      d.moved = true
                    }
                    if (d.moved) {
                      const over = document.elementFromPoint(d.x, d.y)?.closest<HTMLElement>('[data-def-letter]')
                      setHoverDef(over?.dataset.defLetter ?? null)
                      recomputeWires()
                    }
                  }}
                  onPointerUp={(e) => {
                    const d = dragRef.current
                    if (!d || d.id !== term.id) return
                    dragRef.current = null
                    setHoverDef(null)
                    if (d.moved) {
                      const over = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-def-letter]')
                      setDragWire(null)
                      if (over?.dataset.defLetter) {
                        connect(term.id, over.dataset.defLetter)
                      } else {
                        recomputeWires()
                      }
                    } else {
                      setSelectedTerm((prev) => (prev === term.id ? null : term.id))
                    }
                  }}
                  onPointerCancel={() => {
                    dragRef.current = null
                    setHoverDef(null)
                    setDragWire(null)
                  }}
                  onKeyDown={(e) => {
                    if (checked) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedTerm((prev) => (prev === term.id ? null : term.id))
                    }
                  }}
                >
                  <span className="kl-term-num">{term.id}</span>
                  <span className="kl-term-name">{term.name}</span>
                  {linkedLetter && <span className="kl-term-badge">{linkedLetter}</span>}
                  <span
                    className="kl-port"
                    ref={(el) => {
                      termPortRefs.current[term.id] = el
                    }}
                    aria-hidden="true"
                  />
                </button>
              )
            })}
          </div>

          <div className="kl-pareo-col">
            <span className="kl-col-h">Definiciones</span>
            {DEFS.map((def) => {
              const ownerIdx = TERMS.findIndex((t) => links[t.id] === def.l)
              const owner = ownerIdx >= 0 ? TERMS[ownerIdx] : null
              const color = ownerIdx >= 0 ? WIRE_COLORS[ownerIdx] : undefined
              const stateClass =
                checked && owner ? (owner.match === def.l ? ' is-ok' : ' is-bad') : ''
              return (
                <button
                  key={def.l}
                  type="button"
                  data-def-letter={def.l}
                  className={`kl-node kl-def${owner ? ' is-linked' : ''}${hoverDef === def.l ? ' is-target' : ''}${stateClass}`}
                  style={color ? ({ '--cc': color } as React.CSSProperties) : undefined}
                  aria-label={`Definición ${def.l}: ${def.t}${owner ? `. Conectada con ${owner.name}` : ''}`}
                  onClick={() => handleDefActivate(def.l)}
                >
                  <span
                    className="kl-port"
                    ref={(el) => {
                      defPortRefs.current[def.l] = el
                    }}
                    aria-hidden="true"
                  />
                  <span className="kl-def-let">{def.l}</span>
                  <span className="kl-def-txt">{def.t}</span>
                </button>
              )
            })}
          </div>
        </div>

        <p className="visuallyHidden" aria-live="polite">
          {statusAnnouncement}
        </p>

        {checked && (
          <div className={`kl-sync ${allCorrect ? 'is-ok' : 'is-bad'}`} role="status">
            <span className="kl-sync-ic" aria-hidden="true">
              {allCorrect ? '✓' : '!'}
            </span>
            <div>
              <strong>
                {allCorrect ? 'Sincronización exitosa' : `${okCount} de ${TERMS.length} conexiones correctas`}
              </strong>
              <span>
                {allCorrect
                  ? 'Reconoces los conceptos base del ecosistema Android. Cada cable quedó en su lugar.'
                  : 'Los cables punteados en rojo apuntan a una definición equivocada. Pulsa «Soltar las incorrectas» y vuelve a conectarlos.'}
              </span>
            </div>
          </div>
        )}

        <div className="kl-dock">
          <p className="kl-hint">
            Arrastra desde un término hasta su definición, o selecciona primero el término y luego la definición (también funciona con <code>Tab</code> + <code>Enter</code>). Pulsa una definición conectada para soltar su cable.
          </p>
          <div className="kl-dock-actions">
            <button type="button" className="kl-btn kl-ghost" onClick={handleReset}>
              Desconectar todo
            </button>
            <button
              type="button"
              className="kl-btn"
              disabled={!checked && connectedCount < TERMS.length}
              onClick={handleCheckOrRelease}
            >
              {checked ? 'Soltar las incorrectas' : 'Comprobar'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
