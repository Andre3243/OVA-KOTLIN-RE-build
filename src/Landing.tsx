import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PreCourse } from './PreCourse'
import { ReadingProgress } from './LearningUI'
import { easeOut, gentleHover, gentleTap, revealTransition, springTransition } from './motionPresets'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowDown, ArrowRight, AudioLines, BookOpen, Code2, Compass, Layers3, Monitor, Route, Smartphone, Target, Terminal } from 'lucide-react'

const demos = [
  { label: 'Kotlin', file: 'Pedido.kt', icon: Code2, lines: [
    ['data class ', 'Pedido', '(val producto: String,'],
    ['', '', '               val nota: String?)'],
    ['fun ', 'main', '() {'],
    ['  val ', 'pedido', ' = Pedido("Pan integral", null)'],
    ['', '  println', '(pedido.nota ?: "Sin indicaciones")'],
    ['', '', '}'],
  ], output: 'Sin indicaciones' },
  { label: 'Android Studio', file: 'Flujo de trabajo', icon: Monitor, lines: [
    ['', '01  Proyecto', '   Organiza el código y los recursos'],
    ['', '02  Editor', '     Escribe y revisa el código'],
    ['', '03  Gradle', '     Compila la aplicación'],
    ['', '04  Emulador', '   Ejecuta y prueba tu app'],
    ['', '05  Logcat', '     Lee mensajes de ejecución'],
  ], output: 'Del código al dispositivo' },
  { label: 'Reto práctico', file: 'Panadería La Espiga', icon: Smartphone, lines: [
    ['', 'Marta', ' necesita recibir pedidos desde Android.'],
    ['', '01', '  Elige el enfoque de desarrollo.'],
    ['', '02', '  Decide cómo usar la cámara.'],
    ['', '03', '  Define cómo probar y entregar la app.'],
  ], output: 'Pon tus decisiones a prueba en el escenario' },
]

const steps = [
  { title:'Prepárate', copy:'Conoce el encargo y la metodología del curso.', icon: Compass, to:'/guia/introduccion' },
  { title:'Aprende', copy:'Explora el desarrollo móvil, Kotlin y Android Studio.', icon: BookOpen, to:'/ruta/ecosistema-movil' },
  { title:'Practica', copy:'Empieza con el diagnóstico. Luego conecta conceptos, explora el IDE y ayuda a Marta.', icon: Layers3, to:'/actividad/actividad-1-1-diagnostico' },
  { title:'Evalúate', copy:'Resuelve el quiz y compara el resultado con tu diagnóstico.', icon: Target, to:'/actividad/actividad-1-5-quiz-final' },
]

const MotionLink = motion.create(Link)

export function CourseCTA({to,children}:{to:string;children:ReactNode}){
  const reduced=useReducedMotion()
  return <MotionLink to={to} className="courseCta" transition={springTransition} whileHover={reduced?undefined:gentleHover} whileTap={reduced?undefined:gentleTap}>
    {children}<ArrowRight aria-hidden="true" size={20}/>
  </MotionLink>
}

function Reveal({children,className,delay=0}:{children:ReactNode;className?:string;delay?:number}){
  const reduced=useReducedMotion()
  return <motion.div className={className} initial={reduced?false:{opacity:.8,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{...revealTransition,duration:reduced?0:revealTransition.duration,delay:reduced?0:delay}}>
    {children}
  </motion.div>
}

export function Landing({resume}:{resume?:string}){
  const [demo,setDemo]=useState(0)
  const reduce=useReducedMotion()
  const current=demos[demo]
  const entry=resume||'/guia/introduccion'
  const label=resume?'Continuar el OVA':'Entrar al OVA'
  const scrollTo=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:reduce?'auto':'smooth'})

  return <div className="landing">
    {!reduce&&<div className="landingScroll"><ReadingProgress/></div>}
    <header className="landingHeader">
      <Link className="brandK" to="/" aria-label="Kotlin Lab, inicio"><i aria-hidden="true"/> Kotlin<span>Lab</span></Link>
      <nav aria-label="Portada">
        <button className="landingTextButton" onClick={()=>scrollTo('explora-kotlin')}>Qué aprenderás</button>
        <button className="landingTextButton" onClick={()=>scrollTo('ruta-guia')}>Ruta de aprendizaje</button>
        <CourseCTA to={entry}>{label}</CourseCTA>
      </nav>
    </header>
    <main>
      <section className="landingHero">
        <div className="heroRibbons" aria-hidden="true"><span/><span/><span/></div>
        <div className="landingIntro">
          <Reveal>
            <p className="landingKicker"><span/> DESARROLLO MÓVIL PARA ANDROID</p>
            <h1>Tu primera app<br/> con <em>Kotlin.</em></h1>
            <p className="landingLead">Escribe tus primeras líneas de Kotlin, familiarízate con Android Studio y pon lo aprendido a prueba en un proyecto de pedidos.</p>
            <div className="landingActions">
              <CourseCTA to={entry}>{label}</CourseCTA>
              <motion.button className="landingSecondary" onClick={()=>scrollTo('antes-del-ova')} transition={springTransition} whileHover={reduce?undefined:gentleHover} whileTap={reduce?undefined:gentleTap}>Ver curso <ArrowDown size={17} aria-hidden="true"/></motion.button>
            </div>
          </Reveal>
        </div>
        <Reveal className="landingDemo" delay={.12}>
          
          <motion.div className="demoWindow" initial={reduce?false:{scale:.975,y:18}} whileInView={{scale:1,y:0}} viewport={{once:true}} transition={springTransition}>
            <div className="demoChrome"><span aria-hidden="true"><i/><i/><i/></span><span>{current.file}</span><Terminal aria-hidden="true" size={16}/></div>
            <div className="demoChoices" aria-label="Explorar una muestra del curso">{demos.map(({label:topic,icon:Icon},index)=>
              <motion.button key={topic} aria-pressed={demo===index} onClick={()=>setDemo(index)} whileTap={reduce?undefined:{scale:.96}}>
                <Icon aria-hidden="true" size={15}/>{topic}
              </motion.button>)}</div>
            <div className="demoStage" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={demo} initial={reduce?false:{opacity:0,y:7}} animate={{opacity:1,y:0}} exit={reduce?undefined:{opacity:0,y:-5}} transition={{duration:reduce?0:.24,ease:easeOut}}>
                  <div className="demoCode">{current.lines.map(([keyword,highlight,rest],index)=>
                    <div key={index}><span className="demoLine" aria-hidden="true">{index+1}</span><code><b>{keyword}</b><strong>{highlight}</strong>{rest}</code></div>)}</div>
                  <p className="demoOutput"><Terminal size={16} aria-hidden="true"/>{current.output}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          <AnimatePresence initial={false} mode="wait">
            <motion.div className="demoLabel" key={current.label} initial={reduce?false:{opacity:0,y:7}} animate={{opacity:1,y:0}} exit={reduce?undefined:{opacity:0,y:-5}} transition={{duration:reduce?0:.2,ease:easeOut}}>
              <span aria-hidden="true"/> {current.label} · Vista previa del OVA
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </section>
      <PreCourse><CourseCTA to="/guia/introduccion">Empezar la introducción</CourseCTA></PreCourse>
      <section className="landingFeatures" id="explora-kotlin" aria-labelledby="explora-titulo">
        <Reveal className="landingSectionHeading"><h2 id="explora-titulo">Del código a tu primera app</h2></Reveal>
        <div className="landingFeatureGrid">
          <Reveal>
            <motion.article className="landingFeature featureCode" whileHover={reduce?undefined:{y:-4}} transition={springTransition}>
              <span className="stepIcon"><Code2 size={26} aria-hidden="true"/></span>
              <h3>Escribe código en Kotlin</h3>
              <p>Explora cómo los tipos, las clases de datos y los valores nulos dan forma a un pedido.</p>
              <MotionLink to="/ruta/kotlin" transition={springTransition} whileHover={reduce?undefined:gentleHover} whileTap={reduce?undefined:gentleTap}>Explorar la lección <ArrowRight size={16} aria-hidden="true"/></MotionLink>
              <div className="featureGlyph" aria-hidden="true">{'{ }'}</div>
            </motion.article>
          </Reveal>
          <Reveal delay={.1}>
            <motion.article className="landingFeature featureStudio" whileHover={reduce?undefined:{y:-4}} transition={springTransition}>
              <span className="stepIcon"><Monitor size={26} aria-hidden="true"/></span>
              <h3>Recorre Android Studio</h3>
              <p>Descubre para qué sirven el editor, el emulador y Logcat antes de explorarlos en el taller.</p>
              <MotionLink to="/ruta/android-studio" whileTap={reduce?undefined:{scale:.97}}>Ver Android Studio y sus funciones <ArrowRight size={16} aria-hidden="true"/></MotionLink>
              <div className="featureGlyph" aria-hidden="true"><Layers3 size={88} strokeWidth={1.4}/></div>
            </motion.article>
          </Reveal>
        </div>
      </section>
      <section className="landingRoute" id="ruta-guia" aria-labelledby="ruta-titulo">
        <Reveal className="landingSectionHeading"><p className="landingKicker"><Route size={17} aria-hidden="true"/> MAPA DEL OVA</p><h2 id="ruta-titulo">Tu ruta de aprendizaje</h2><p>Estudia a tu ritmo. Cada etapa te prepara para la siguiente.</p></Reveal>
        <ol className="landingSteps">{steps.map(({title,copy,icon:Icon,to},index)=><li key={title}><Reveal delay={index*.07}>
          <MotionLink to={to} className="stepCard" transition={springTransition} whileHover={reduce?undefined:gentleHover} whileTap={reduce?undefined:gentleTap}><span className="stepIcon"><Icon size={24} aria-hidden="true"/></span><p className="stepOrder">ETAPA 0{index+1}</p><h3>{title}</h3><p>{copy}</p><ArrowRight className="stepArrow" size={18} aria-hidden="true"/></MotionLink>
        </Reveal></li>)}</ol>
      </section>
      <section className="landingProject"><Reveal className="landingProjectInner"><span className="stepIcon"><Smartphone size={25} aria-hidden="true"/></span><div><h2>Tu primer encargo</h2><p>Marta quiere que sus clientes puedan fotografiar un pedido y enviarlo desde el celular. En el OVA elegirás cómo diseñar, probar y entregar esa aplicación.</p></div><CourseCTA to="/actividad/actividad-1-4-escenario">Ver el escenario</CourseCTA></Reveal></section>
      <section className="landingEnd">
        <Reveal><AudioLines aria-hidden="true" size={28}/><h2>Empieza por la introducción</h2><p>Conoce el encargo y escucha la conversación de bienvenida.</p><CourseCTA to="/guia/introduccion">Abrir la introducción</CourseCTA></Reveal>
      </section>
    </main>
    <footer className="landingFooter"><div><b>Kotlin Lab</b><p>Equipo SJD · Sebastian Cufi, Deimy Vanegas y Jhonny Acosta</p></div><Link to="/guia/referencias">Referentes del OVA</Link></footer>
  </div>
}
