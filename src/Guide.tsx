import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RevealBlock, TextReveal } from './LearningUI'

const pages = [
  {id:'introduccion', title:'Introducción', summary:'El encargo que da sentido al curso'},
  {id:'metodologia', title:'Metodología', summary:'Cómo estudiar y comprobar tu avance'},
  {id:'contenidos', title:'Contenidos', summary:'Del dispositivo al proyecto Android'},
  {id:'referencias', title:'Referentes', summary:'Documentación y lecturas del OVA'},
]

export function GuideNav(){
  return <section className="guideNav"><small>ANTES DE EMPEZAR</small><h2>Guía del estudiante</h2><div>{pages.map(p=><Link key={p.id} to={'/guia/'+p.id}><strong>{p.title}</strong><span>{p.summary}</span></Link>)}</div></section>
}

const phases=[
 ['Apropiación conceptual','Lee las tres lecciones, escucha el pódcast y modifica el ejemplo de Kotlin. Anticipa la salida del programa antes de ejecutarlo.'],
 ['Diagnóstico','Al terminar la lección de Android Studio, responde cinco preguntas. El resultado te orienta sobre los temas que conviene reforzar.'],
 ['Verificación y autoevaluación','Relaciona términos, localiza herramientas en el IDE y explica a Marta cómo construirías su app. Usa las pistas y repite las decisiones que necesites.'],
 ['Evaluación final','Responde cinco preguntas en un máximo de quince minutos. Se aprueba con tres aciertos. Compara tu resultado con el diagnóstico y revisa las explicaciones.']
]
function WelcomeAudio(){
  const [unavailable,setUnavailable]=useState(false)
  if(unavailable)return <p>El audio no está disponible. Puedes leer el resumen de la bienvenida.</p>
  return <audio controls preload="none" onError={()=>setUnavailable(true)} src={import.meta.env.BASE_URL+'media/conversacion.mp3'}/>
}

export function Guide(){
  const {section}=useParams()
  const index=Math.max(0,pages.findIndex(p=>p.id===section))
  return <article className="lessonBody"><p className="meta">Guía del estudiante</p><TextReveal>{pages[index].title}</TextReveal><nav className="guideTabs" aria-label="Guía del estudiante">{pages.map((p,k)=><Link key={p.id} aria-current={k===index?'page':undefined} to={'/guia/'+p.id}>{p.title}</Link>)}</nav>
  <RevealBlock>
  {index===0&&<><h2>¿Cómo pasa una idea a la pantalla del teléfono?</h2><p className="lead">Marta recibe pedidos escritos a mano en su panadería. Quiere que sus clientes puedan fotografiar un pedido y enviarlo desde el celular. Ese encargo nos acompañará durante el curso.</p><p>Desarrollar una aplicación móvil implica decidir cómo interactúa una persona con una pantalla pequeña, qué recursos del dispositivo necesita y cómo comprobar que funciona. Aquí trabajarás con Android, el lenguaje Kotlin y el entorno Android Studio.</p><h2>Qué sabrás hacer al terminar</h2><ul><li>Distinguir las restricciones de una app móvil y justificar un enfoque de desarrollo.</li><li>Leer una clase de datos sencilla en Kotlin y reconocer qué ocurre si falta un valor.</li><li>Ubicar las herramientas de edición, ejecución y depuración y explicar cómo se entrega una app.</li></ul><h3>Una conversación para empezar</h3><details><summary>Resumen de la bienvenida</summary><p>El curso conecta tres decisiones: dónde funcionará una app móvil, qué papel tiene Kotlin y qué herramientas de Android Studio sirven para construirla y probarla.</p></details><WelcomeAudio/></>}
  {index===1&&<><p className="lead">Este OVA está pensado para estudiar de forma autónoma. Puedes dividir el recorrido en varias sesiones y retomar los módulos que hayas marcado como revisados en este navegador.</p><h2>Cuatro fases de aprendizaje</h2><ol className="phases">{phases.map(([title,body])=><li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol><h2>Tiempo y recomendaciones</h2><p>Reserva unos 50 minutos como referencia. El diagnóstico admite hasta 10 minutos y la evaluación hasta 15. La práctica y la revisión pueden llevar más tiempo.</p><p>Ten a mano un cuaderno. Tras cada práctica, anota una decisión que cambiarías y el motivo. Puedes probar el código en Kotlin Playground desde el navegador.</p></>}
  {index===2&&<><p className="lead">Tres preguntas organizan el contenido. Cada respuesta te prepara para una decisión en el encargo de la panadería.</p>{[['ecosistema-movil','¿Dónde funciona la aplicación?','Dispositivos, sensores, batería, memoria y enfoques de desarrollo.'],['kotlin','¿Con qué lenguaje se escribe?','Tipos, seguridad ante nulos, interoperabilidad con Java y clases de datos.'],['android-studio','¿Cómo se construye y se prueba?','Editor, vista previa, Gradle, emulador y Logcat.']].map(([id,t,p])=><section className="lab" key={id}><h2>{t}</h2><p>{p}</p><Link to={'/ruta/'+id}>Abrir lección ↗</Link></section>)}</>}
  {index===3&&<><h2>Fuentes para profundizar</h2><p><a href="https://developer.android.com/kotlin">Android Developers · Kotlin para Android</a><br/>Guías para conectar el lenguaje con un proyecto Android.</p><p><a href="https://developer.android.com/studio/intro">Android Studio · Introducción al entorno</a><br/>Referencia para reconocer el editor y sus herramientas.</p><p><a href="https://kotlinlang.org/docs/home.html">JetBrains · Documentación de Kotlin</a><br/>Consulta los ejemplos de clases de datos y tipos anulables.</p><h2>Lecturas del curso original</h2><ul><li>Jemerov e Isakova, <i>Kotlin in Action</i>.</li><li>Forrester, Boudjnah, Dumbravan y Tigcal, <i>How to Build Android Apps with Kotlin</i>.</li><li>Phillips, Stewart, Marsicano y Gardner, <i>Android Programming: The Big Nerd Ranch Guide</i>.</li></ul></>}
  </RevealBlock></article>
}
