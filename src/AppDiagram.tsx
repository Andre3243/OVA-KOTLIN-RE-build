import { useState } from 'react'
import { motion } from 'motion/react'

const parts = [
  [
    'Activity (Pantalla)',
    'Cada Activity (por ejemplo MainActivity.kt) representa una pantalla única con la que interactúa la persona usuaria, como el formulario de pedido.',
  ],
  [
    'Interfaz (UI)',
    'Reúne los controles visuales —textos, campos y botón de cámara— construidos con Jetpack Compose o archivos de diseño XML.',
  ],
  [
    'Lógica en Kotlin',
    'Valida los datos del pedido, controla valores nulos de forma segura y coordina cuándo guardar o enviar la fotografía.',
  ],
  [
    'AndroidManifest.xml',
    'Archivo central de configuración: registra las Activities, declara permisos (como cámara o internet) y define los requisitos de Android.',
  ],
  [
    'Paquete APK / AAB',
    'Resultado compilado por Gradle: el archivo .apk se instala directamente en el teléfono para pruebas y el formato .aab se publica en Google Play.',
  ],
] as const

export function AppDiagram() {
  const [selected, setSelected] = useState(0)
  return (
    <figure className="appDiagram">
      <figcaption>Subtema 1.4 · Explora los elementos básicos de una app Android</figcaption>
      <div className="diagramNodes" role="group" aria-label="Elementos básicos de la aplicación Android">
        {parts.map(([title], index) => (
          <motion.button
            type="button"
            key={title}
            aria-pressed={index === selected}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelected(index)}
          >
            {title}
          </motion.button>
        ))}
      </div>
      <div className="diagramActiveText" aria-live="polite">
        <motion.p key={selected} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          <strong>{parts[selected][0]}:</strong> {parts[selected][1]}
        </motion.p>
      </div>
      <details>
        <summary>Leer la descripción completa de los 5 elementos</summary>
        <dl>
          {parts.map(([title, detail]) => (
            <div key={title}>
              <dt>
                <strong>{title}</strong>
              </dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </details>
    </figure>
  )
}
