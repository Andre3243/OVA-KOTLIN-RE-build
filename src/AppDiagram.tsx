import {useState} from 'react'
import {motion} from 'motion/react'

const parts=[
  ['Interfaz','La pantalla de pedidos recibe el texto y permite adjuntar una fotografía.'],
  ['Lógica en Kotlin','Valida el pedido, conserva los datos y decide cuándo intentar el envío.'],
  ['Manifiesto','Declara los componentes de Android y los permisos que la aplicación necesita.'],
  ['Paquete APK','Contiene el código compilado y los recursos que Android instala en el teléfono.'],
]
export function AppDiagram(){
  const [selected,setSelected]=useState(0)
  return <figure className="appDiagram">
    <figcaption>Explora las piezas de una app Android</figcaption>
    <div className="diagramNodes" aria-label="Partes de la aplicación">
      {parts.map(([title],index)=><motion.button key={title} aria-pressed={index===selected} whileTap={{scale:.96}} onClick={()=>setSelected(index)}>{title}</motion.button>)}
    </div>
    <div aria-live="polite"><motion.p key={selected} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}}>{parts[selected][1]}</motion.p></div>
    <details><summary>Leer la descripción completa</summary><dl>{parts.map(([title,detail])=><div key={title}><dt><strong>{title}</strong></dt><dd>{detail}</dd></div>)}</dl></details>
  </figure>
}
