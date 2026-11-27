import { useEffect, useRef, useState } from 'react'
import { ZONAS, type IdeZone } from '../content/activities'
import { playFeedbackTone } from './sound'

const IDE_LOGS = [
  ['I', 'ActivityManager', 'Start proc com.ejemplo.miprimeraapp'],
  ['D', 'MainActivity', 'onCreate()'],
  ['I', 'Choreographer', 'Primer frame dibujado'],
  ['D', 'MainActivity', 'setContent → Saludo("Android")'],
  ['W', 'OpenGLRenderer', 'Configuración predeterminada aplicada'],
  ['D', 'ProfileInstaller', 'Perfil de instalación escrito'],
  ['I', 'MainActivity', 'onResume()'],
] as const

export function MapaStudioWorkshop({ onComplete }: { onComplete: () => void }) {
  const [mode, setMode] = useState<'intro' | 'ask' | 'right' | 'end' | 'explore'>('intro')
  const [cur, setCur] = useState(0)
  const [fails, setFails] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [feedback, setFeedback] = useState<{ kind: 'bad' | 'hint'; text: string } | null>(null)
  const [flashZone, setFlashZone] = useState<IdeZone | null>(null)
  const [exploreIdx, setExploreIdx] = useState<number | null>(null)
  const [scale, setScale] = useState(1)
  const [emuReady, setEmuReady] = useState(false)

  const frameRef = useRef<HTMLDivElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setEmuReady(true), 1200)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const syncScale = () => {
      const width = frame.clientWidth
      if (width > 0) setScale(width / 1200)
    }
    syncScale()
    const ro = new ResizeObserver(syncScale)
    ro.observe(frame)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && mode === 'right' && document.activeElement !== nextBtnRef.current) {
        e.preventDefault()
        advanceStep()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function startTour() {
    setCur(0)
    setFails(0)
    setResults([])
    setFeedback(null)
    setExploreIdx(null)
    setMode('ask')
  }

  function showHint() {
    setFeedback({ kind: 'hint', text: `Pista: ${ZONAS[cur].pista}` })
  }

  function selectZone(k: number) {
    if (mode === 'explore') {
      setExploreIdx(k)
      return
    }
    if (mode !== 'ask') return

    if (k === cur) {
      playFeedbackTone(true)
      setResults((prev) => {
        const copy = [...prev]
        copy[cur] = fails === 0
        return copy
      })
      setFeedback(null)
      setFlashZone(null)
      setMode('right')
      requestAnimationFrame(() => nextBtnRef.current?.focus({ preventScroll: true }))
    } else {
      const nextFails = fails + 1
      setFails(nextFails)
      const wrongZone = ZONAS[k]
      setFlashZone(wrongZone)
      window.setTimeout(() => setFlashZone((current) => (current?.id === wrongZone.id ? null : current)), 1600)
      playFeedbackTone(false)
      if (nextFails >= 2) {
        setFeedback({
          kind: 'hint',
          text: `Elegiste «${wrongZone.nombre}». Pista: ${ZONAS[cur].pista}`,
        })
      } else {
        setFeedback({
          kind: 'bad',
          text: `Esa zona corresponde a «${wrongZone.nombre}». Revisa la consigna e inténtalo de nuevo.`,
        })
      }
    }
  }

  function advanceStep() {
    if (cur < ZONAS.length - 1) {
      setCur(cur + 1)
      setFails(0)
      setFeedback(null)
      setMode('ask')
    } else {
      setMode('end')
      onComplete()
    }
  }

  const activeSpotZone =
    mode === 'right' ? ZONAS[cur] : mode === 'explore' && exploreIdx !== null ? ZONAS[exploreIdx] : null
  const firstTryCount = results.filter(Boolean).length

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
        <span className="kl-file">Actividad1_3.kt</span>
      </div>

      <section className="kl-mapa-hud" aria-live="polite">
        <div className="kl-hud-top">
          <span className="kl-hud-step">
            {mode === 'intro' && 'Recorrido guiado por Android Studio'}
            {mode === 'ask' && `Consigna ${cur + 1} de ${ZONAS.length}`}
            {mode === 'right' &&
              `Consigna ${cur + 1} de ${ZONAS.length} · ${fails === 0 ? 'al primer intento' : `con ${fails} ${fails === 1 ? 'error' : 'errores'}`}`}
            {mode === 'end' && 'Resultado del recorrido'}
            {mode === 'explore' && 'Modo exploración libre'}
          </span>
          <div className="kl-pips" aria-hidden="true">
            {ZONAS.map((z, k) => {
              const cls =
                results[k] === true
                  ? ' is-first'
                  : results[k] === false
                    ? ' is-retry'
                    : (mode === 'ask' || mode === 'right') && k === cur
                      ? ' is-now'
                      : ''
              return <span key={z.id} className={`kl-pip${cls}`} />
            })}
          </div>
        </div>

        <div className="kl-hud-body">
          {mode === 'intro' && (
            <>
              <p className="kl-hud-ask">
                Recorrerás las 6 zonas esenciales del entorno Android Studio. Lee cada consigna y selecciona la región correspondiente en la interfaz o en el panel táctil adaptable.
              </p>
              <div className="kl-hud-acts">
                <button type="button" className="kl-btn" onClick={startTour}>
                  Comenzar recorrido
                </button>
              </div>
            </>
          )}

          {mode === 'ask' && (
            <>
              <p className="kl-hud-ask">{ZONAS[cur].consigna}</p>
              <div className="kl-hud-acts">
                <button type="button" className="kl-btn kl-ghost kl-sm" onClick={showHint}>
                  Ver pista
                </button>
              </div>
              {feedback && (
                <p className={`kl-hud-msg ${feedback.kind === 'hint' ? 'is-hint' : 'is-bad'}`} role="status">
                  {feedback.text}
                </p>
              )}
            </>
          )}

          {mode === 'right' && (
            <>
              <div className="kl-okblock">
                <span className="kl-okname">
                  <i aria-hidden="true">✓</i>
                  {ZONAS[cur].nombre}
                </span>
                <span className="kl-expl">{ZONAS[cur].explicacion}</span>
              </div>
              <div className="kl-hud-acts">
                <button ref={nextBtnRef} type="button" className="kl-btn" onClick={advanceStep}>
                  {cur === ZONAS.length - 1 ? 'Ver resultado' : 'Siguiente'}
                  <kbd>Enter</kbd>
                </button>
              </div>
            </>
          )}

          {mode === 'end' && (
            <>
              <span className="kl-mapa-score">
                {firstTryCount}/{ZONAS.length}
              </span>
              <div className="kl-okblock">
                <span className="kl-okname">
                  {firstTryCount === ZONAS.length ? 'Conoces el mapa del IDE' : 'Recorrido completado'}
                </span>
                <span className="kl-expl">
                  {firstTryCount === ZONAS.length
                    ? 'Ubicaste todas las zonas de Android Studio al primer intento.'
                    : `Acertaste ${firstTryCount} zonas al primer intento. Las barras amarillas indican las que requirieron apoyo: repásalas en el modo exploración.`}
                </span>
              </div>
              <div className="kl-hud-acts">
                <button
                  type="button"
                  className="kl-btn"
                  onClick={() => {
                    setExploreIdx(0)
                    setMode('explore')
                  }}
                >
                  Explorar la interfaz
                </button>
                <button type="button" className="kl-btn kl-ghost" onClick={startTour}>
                  Repetir
                </button>
              </div>
            </>
          )}

          {mode === 'explore' && (
            <>
              {exploreIdx !== null ? (
                <div className="kl-okblock">
                  <span className="kl-okname">
                    {exploreIdx + 1} · {ZONAS[exploreIdx].nombre}
                  </span>
                  <span className="kl-expl">{ZONAS[exploreIdx].explicacion}</span>
                </div>
              ) : (
                <p className="kl-hud-ask">Selecciona cualquiera de las 6 zonas numeradas para consultar su función.</p>
              )}
              <div className="kl-hud-acts">
                <button type="button" className="kl-btn kl-ghost" onClick={startTour}>
                  Repetir recorrido
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Vista gráfica escalable sin desbordamiento horizontal */}
      <div
        ref={frameRef}
        className={`kl-ide-frame${mode === 'intro' ? ' is-idle' : ''}${mode === 'explore' ? ' is-explore' : ''}`}
      >
        <div className="kl-ide-canvas" style={{ transform: `scale(${scale})` }} aria-hidden="true">
          <div className="kl-as-tb">
            <span className="kl-as-ham" />
            <span className="kl-as-pchip">
              <span className="kl-as-av">MP</span>MiPrimeraApp
            </span>
            <span className="kl-as-vc">main</span>
            <div className="kl-as-runbar">
              <span className="kl-as-dev">Pixel 8 API 35</span>
              <span className="kl-as-run" />
              <span className="kl-as-dbg" />
            </div>
          </div>

          <div className="kl-as-proj">
            <div className="kl-as-ph">
              <b>Android</b>
              <span>▾</span>
            </div>
            <div className="kl-as-tree">
              <div>▾ app</div>
              <div className="kl-i1">▾ manifests</div>
              <div className="kl-i2">AndroidManifest.xml</div>
              <div className="kl-i1">▾ kotlin+java</div>
              <div className="kl-i2">▾ com.ejemplo.miprimeraapp</div>
              <div className="kl-i3 kl-sel">MainActivity.kt</div>
              <div className="kl-i1">▾ res</div>
              <div className="kl-i2">▸ drawable · layout · values</div>
              <div>▾ Gradle Scripts</div>
              <div className="kl-i1">build.gradle.kts (Module :app)</div>
            </div>
          </div>

          <div className="kl-as-ed">
            <div className="kl-as-tabs">
              <span className="is-on">MainActivity.kt</span>
              <span>AndroidManifest.xml</span>
            </div>
            <pre className="kl-as-code">{`1  package com.ejemplo.miprimeraapp
2
3  class MainActivity : ComponentActivity() {
4      override fun onCreate(saved: Bundle?) {
5          super.onCreate(saved)
6          setContent { Saludo("Android") }
7      }
8  }
9
10 @Preview
11 @Composable
12 fun SaludoPreview() {
13     Text("¡Hola, Android!")
14 }`}</pre>
          </div>

          <div className="kl-as-pv">
            <div className="kl-as-ph">
              <b>Preview</b>
              <span className="kl-as-seg">Split</span>
            </div>
            <div className="kl-as-pvsurface">
              <span className="kl-as-pvlabel">SaludoPreview</span>
              <div className="kl-as-pvcard">¡Hola, Android!</div>
            </div>
          </div>

          <div className="kl-as-rd">
            <div className="kl-as-ph">
              <b>Running Devices</b>
            </div>
            <div className={`kl-as-emu${emuReady ? ' is-ready' : ''}`}>
              <div className="kl-as-emuscr">
                <div className="kl-as-emusbar">
                  <span>9:41</span>
                  <span>▮▮</span>
                </div>
                <div className="kl-as-emuhello">¡Hola, Android!</div>
              </div>
            </div>
            <span className="kl-as-rdcap">Pixel 8 API 35</span>
          </div>

          <div className="kl-as-lc">
            <div className="kl-as-lctabs">
              <span className="is-on">Logcat</span>
              <span>Build</span>
              <span>Terminal</span>
            </div>
            <div className="kl-as-logs">
              {IDE_LOGS.slice(0, 5).map(([lv, tag, msg]) => (
                <div key={tag + msg}>
                  <span className="kl-as-ts">10:44:12</span>
                  <span className={`kl-as-lv-${lv}`}>{lv}</span>
                  <span>{tag}</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {activeSpotZone && (
          <div
            className={`kl-spot is-on${mode === 'explore' ? ' is-explore' : ''}${activeSpotZone.y < 10 && activeSpotZone.h < 12 ? ' is-below' : ''}`}
            style={{
              left: `${activeSpotZone.x}%`,
              top: `${activeSpotZone.y}%`,
              width: `${activeSpotZone.w}%`,
              height: `${activeSpotZone.h}%`,
            }}
            aria-hidden="true"
          >
            <span className="kl-spot-lab">
              {mode === 'explore' && exploreIdx !== null
                ? `${exploreIdx + 1} · ${activeSpotZone.nombre}`
                : `✓ ${activeSpotZone.nombre}`}
            </span>
          </div>
        )}

        {flashZone && (
          <div
            className={`kl-flash${flashZone.y < 10 && flashZone.h < 12 ? ' is-below' : ''}`}
            style={{
              left: `${flashZone.x}%`,
              top: `${flashZone.y}%`,
              width: `${flashZone.w}%`,
              height: `${flashZone.h}%`,
            }}
            aria-hidden="true"
          >
            <span className="kl-spot-lab">{flashZone.nombre}</span>
          </div>
        )}

        {mode === 'explore' &&
          ZONAS.map((z, k) => (
            <span
              key={z.id}
              className="kl-pin"
              style={{
                left: `${z.x}%`,
                top: `${z.y}%`,
                width: z.h < 12 ? 20 : 24,
                height: z.h < 12 ? 20 : 24,
              }}
              aria-hidden="true"
            >
              {k + 1}
            </span>
          ))}

        <div className="kl-zones" role="group" aria-label="Áreas seleccionables de la ventana de Android Studio">
          {ZONAS.map((z, k) => (
            <button
              key={z.id}
              type="button"
              className="kl-zone-btn"
              style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
              disabled={mode === 'intro' || mode === 'right' || mode === 'end'}
              aria-label={mode === 'explore' ? `${k + 1}. ${z.nombre}` : z.spatialLabel}
              onClick={() => selectZone(k)}
            />
          ))}
        </div>
      </div>

      {/* Selector accesible adaptable para pantallas táctiles pequeñas y navegación rápida por teclado */}
      {(mode === 'ask' || mode === 'explore') && (
        <div className="kl-mobile-zones" role="group" aria-label="Selector rápido de paneles de la ventana">
          <span className="kl-col-h">
            {mode === 'explore' ? 'Explorar zona directamente:' : 'Selección táctil / por teclado de la región visual:'}
          </span>
          <div className="kl-mobile-zone-grid">
            {ZONAS.map((z, k) => (
              <button
                key={z.id}
                type="button"
                className={`kl-mzone-btn${mode === 'explore' && exploreIdx === k ? ' is-active' : ''}`}
                onClick={() => selectZone(k)}
              >
                <span className="kl-mzone-num">0{k + 1}</span>
                <span>{mode === 'explore' ? z.nombre : z.spatialLabel}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <details className="kl-alt-details">
        <summary>Alternativa textual completa de la estructura de Android Studio</summary>
        <dl className="kl-alt-dl">
          {ZONAS.map((z, k) => (
            <div key={z.id}>
              <dt>
                <strong>
                  {k + 1}. {z.nombre}
                </strong>{' '}
                <span>({z.spatialLabel})</span>
              </dt>
              <dd>{z.explicacion}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  )
}
