import {useEffect,useRef,useState} from 'react'
import {Link,Routes,Route,useParams,Navigate,useLocation} from 'react-router-dom'
import {courseModules as modules} from './content/course'
import { Sidebar, WorkshopPage } from './Study'
import { workshops, activityPath, sections } from './content/navigation'
import { AnimatedAccordion, AnimatedPage, CalloutBox, ContentCard, ReadingProgress, SectionStepper, TextReveal } from './LearningUI'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react'
import { Guide } from './Guide'
import { Landing } from './Landing'
import { ChevronRight, Code2, Globe2, House, Layers3, Monitor, PanelLeftClose, PanelLeftOpen, Smartphone } from 'lucide-react'
import './course.css'
import './study.css'
import './theme.css'
import './learning.css'
import { AppDiagram } from './AppDiagram'
import { easeOut, gentleHover, gentleTap, springTransition } from './motionPresets'

function read<T,>(key:string,fallback:T):T {try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
function save(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value))}catch{/* El recorrido sigue disponible sin almacenamiento. */}}
const descriptions=[
 'Reconoce qué sabes antes de comenzar.',
 'Descubre qué cambia cuando una app cabe en tu bolsillo.',
 'Lee y modifica tus primeras líneas de Kotlin.',
 'Recorre las herramientas que convierten código en una app.',
 'Resuelve el encargo de la Panadería La Espiga.',
 'Pon a prueba tus decisiones y compara tus resultados.'
]
const approaches=[
  {title:'Nativo',icon:Smartphone,body:'Usas las herramientas de Android para trabajar directamente con sus API. Es una buena elección cuando el equipo se concentra en Android y necesita integrar la cámara.'},
  {title:'Multiplataforma',icon:Layers3,body:'Compartes parte del código entre Android e iOS. Investiga qué funciones del teléfono requieren integración específica en cada plataforma.'},
  {title:'Híbrido',icon:Globe2,body:'Una aplicación instalada presenta contenido web dentro de un contenedor. Puede acceder a funciones del teléfono mediante integraciones.'},
]

function Lesson(){
 const {id}=useParams(),i=modules.findIndex(m=>m.id===id),m=modules[i]
 if(!m)return <Navigate to="/" replace/>
 if(i===0||i>=4)return <Navigate to={activityPath(workshops[i===0?0:i===4?1:4].slug)} replace/>
 return <article key={id} className="lessonBody">
 <p className="moduleBadge">Módulo {i+1} de {modules.length}</p>
 <TextReveal>{m.title}</TextReveal>
 <TextReveal as="p">{descriptions[i]}</TextReveal>
 {i===1&&<>
  <ContentCard title="Diseñar para un teléfono" icon={Smartphone}>
    <p>Marta quiere recibir pedidos con una foto. La cámara resuelve la captura, pero una conexión intermitente podría interrumpir el envío. Una buena app conserva el pedido y muestra si la foto llegó.</p>
  </ContentCard>
  <section className="approachSection">
    <h2>Elige un enfoque</h2>
    {approaches.map(({title,icon,body})=><AnimatedAccordion key={title} title={title} icon={icon}><p>{body}</p></AnimatedAccordion>)}
  </section>
  <CalloutBox title="Antes de elegir"><p>Piensa en el tamaño de pantalla, la memoria y la batería. ¿Qué debería ver Marta si pierde la conexión mientras envía una foto?</p></CalloutBox>
 </>}
 {i===2&&<><ContentCard title="Un pedido en tres líneas" icon={Code2}><p>Kotlin, creado por JetBrains, permite expresar los datos de una app con poco código. Sus tipos ayudan a detectar errores antes de ejecutarla y puedes usar bibliotecas Java en el mismo proyecto.</p><pre>{'data class Pedido(val producto: String, val nota: String?)\n\nfun main() {\n    val pedido = Pedido("Pan integral", null)\n    println(pedido.nota ?: "Sin indicaciones")\n}'}</pre><p>El signo <code>?</code> permite que la nota sea nula. El operador <code>?:</code> elige un texto alternativo cuando falta la nota. Cambia <code>null</code> por <code>"Sin sal"</code> y predice la salida.</p><a href="https://play.kotlinlang.org/" target="_blank" rel="noreferrer">Probar el ejemplo en Kotlin Playground ↗</a></ContentCard><CalloutBox title="Compáralo con Java"><p>Una clase Java convencional declara sus campos, constructor y métodos de acceso. ¿Qué partes reúne la clase de datos de Kotlin en una línea?</p></CalloutBox></>}
 {i===3&&<><ContentCard title="Del editor a la pantalla" icon={Monitor}><p>Android Studio reúne el proyecto, el editor y las herramientas de prueba. Puedes describir una interfaz con Kotlin y Jetpack Compose o definir vistas con XML. Gradle compila y empaqueta el proyecto. El emulador permite probarlo y Logcat muestra lo que ocurre durante la ejecución.</p></ContentCard><AppDiagram/></>}
 </article>
}

function ActivityRoute({done,finish,scores}:{done:string[];finish:(path:string,score?:number)=>void;scores:(number|string)[]}){
  const {slug=''}=useParams()
  const path=activityPath(slug)
  return <WorkshopPage key={slug} slug={slug} done={done.includes(path)} onComplete={score=>finish(path,score)} scores={scores}/>
}

export default function Course(){
  const [visited,setVisited]=useState<string[]>(()=>{
    const saved=read<unknown>('ruta.vista',[])
    return Array.isArray(saved)?saved.filter((item):item is string=>typeof item==='string'):[]
  })
  const [desktopMenu,setDesktopMenu]=useState(()=>read('ruta.panel',true))
  const [mobileMenu,setMobileMenu]=useState(false)
  const [compact,setCompact]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(max-width:920px)').matches)
  const [resume,setResume]=useState<string>(()=>{
    const saved=read<unknown>('ruta.retomar','')
    return typeof saved==='string'&&sections.some(section=>section.path===saved)?saved:''
  })
  const menu=compact?mobileMenu:desktopMenu
  const toggle=useRef<HTMLButtonElement>(null)
  useEffect(()=>{
    const media=window.matchMedia('(max-width:920px)')
    const sync=()=>{setCompact(media.matches);setMobileMenu(false)}
    media.addEventListener('change',sync)
    return ()=>media.removeEventListener('change',sync)
  },[])
  function updateMenu(open:boolean){
    if(compact){setMobileMenu(open);return}
    setDesktopMenu(open)
    save('ruta.panel',open)
  }
  function dismiss(){
    updateMenu(false)
    requestAnimationFrame(()=>toggle.current?.focus())
  }
  const [diagnosis,setDiagnosis]=useState<number|string>(()=>read('ruta.diag','Pendiente'))
  const [exam,setExam]=useState<number|string>(()=>read('ruta.final','Pendiente'))
  const location=useLocation()
  const {pathname}=location
  const reducedMotion=useReducedMotion()
  const sectionIndex=sections.findIndex(item=>item.path===pathname)
  const section=sections[sectionIndex]
  useEffect(()=>{
    if(pathname==='/')window.scrollTo(0,0)
    setMobileMenu(false)
    if(/^\/(guia|ruta|actividad)\/[^/]+$/.test(pathname)){
      setResume(pathname)
      save('ruta.retomar',pathname)
    }
  },[pathname])
  useEffect(()=>{
    if(!menu||!compact)return
    const closeOnEscape=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){
        setMobileMenu(false)
        requestAnimationFrame(()=>toggle.current?.focus())
      }
    }
    window.addEventListener('keydown',closeOnEscape)
    return ()=>window.removeEventListener('keydown',closeOnEscape)
  },[menu,compact])

  function finish(path:string,score?:number){
    setVisited(previous=>{
      if(previous.includes(path))return previous
      const next=[...previous,path]
      save('ruta.vista',next)
      return next
    })
    if(score===undefined)return
    if(path===activityPath(workshops[0].slug)){save('ruta.diag',score);setDiagnosis(score)}
    if(path===activityPath(workshops[4].slug)){save('ruta.final',score);setExam(score)}
  }
  if(pathname==='/')return <MotionConfig reducedMotion="user"><Landing resume={resume}/></MotionConfig>

  return <MotionConfig reducedMotion="user">
    <div className={'studyShell'+(menu?' menuOpen':'')}>
      <Sidebar visited={visited} hidden={!menu} navigate={()=>{if(compact)setMobileMenu(false)}}/>
      
      <AnimatePresence>
        {compact&&menu&&<motion.div className="studyScrim" aria-hidden="true" onClick={dismiss} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reducedMotion?0:.2,ease:easeOut}}/>}
      </AnimatePresence>
      <div className="studyContent">
        <header className="studyTop">
          <motion.button ref={toggle} aria-controls="study-sidebar" aria-expanded={menu} onClick={()=>updateMenu(!menu)} transition={springTransition} whileHover={reducedMotion?undefined:gentleHover} whileTap={reducedMotion?undefined:gentleTap}>
            {menu?<PanelLeftClose size={19} aria-hidden="true"/>:<PanelLeftOpen size={19} aria-hidden="true"/>}
            {menu?'Ocultar secciones':'Mostrar secciones'}
          </motion.button>
          <nav className="studyBreadcrumbs" aria-label="Ubicación en el curso">
            <Link to="/" className="studyHome"><House size={16} aria-hidden="true"/> Inicio</Link>
            {section&&<><ChevronRight size={15} aria-hidden="true"/>
              {section.groupPath!==pathname?<Link to={section.groupPath}>{section.group}</Link>:<span>{section.group}</span>}
              <ChevronRight size={15} aria-hidden="true"/><span aria-current="page">{section.label}</span>
            </>}
          </nav>
          {section&&<span className="moduleBadge headerBadge">Sección {sectionIndex+1} de {sections.length}</span>}
          <ReadingProgress/>
        </header>
        <main className="container" inert={compact&&menu}>
          <AnimatePresence mode="wait" initial={false}>
            <AnimatedPage key={pathname}>
            <Routes location={location}>
              <Route path="/guia/:section" element={<><Guide/><SectionStepper path={pathname} onReview={()=>finish(pathname)}/></>}/>
              <Route path="/ruta/:id" element={<><Lesson/><SectionStepper path={pathname} onReview={()=>finish(pathname)}/></>}/>
              <Route path="/actividad/:slug" element={<ActivityRoute done={visited} finish={finish} scores={[diagnosis,exam]}/>}/>
              <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
            </AnimatedPage>
          </AnimatePresence>
          <footer><b>Kotlin Lab</b><p>Equipo SJD · Sebastian Cufi, Deimy Vanegas y Jhonny Acosta</p></footer>
        </main>
      </div>
    </div>
  </MotionConfig>
}
