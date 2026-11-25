import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Check, Circle, ClipboardList, Quote } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { easeOut, revealTransition, springTransition } from './motionPresets'
import { workshopGuide } from './content/workshopGuide'

import { activityPath, groups, sections, workshops } from './content/navigation'
import { AnimatedAccordion, SectionStepper, TextReveal } from './LearningUI'

export function Sidebar({visited,hidden,navigate}:{visited:string[];hidden:boolean;navigate:()=>void}){
  const total=sections.length
  const count=sections.filter(({path})=>visited.includes(path)).length
  const percentage=Math.round(count/total*100)
  const reduce=useReducedMotion()
  return <motion.aside className="studySidebar" id="study-sidebar" inert={hidden} aria-hidden={hidden}
    initial={false} animate={{x:hidden?'-101%':'0%'}}
    transition={reduce?{duration:0}:{...springTransition,damping:29}}>
    <div className="sidebarHeader"><Link className="brandK" to="/"><i aria-hidden="true"/> Kotlin<span>Lab</span></Link></div>
    <div className="studyProgress">
      <div className="studyProgressLabel"><span>{count} de {total} secciones</span><strong>{percentage}%</strong></div>
      <div role="progressbar" aria-label="Secciones recorridas" aria-valuemin={0} aria-valuemax={total} aria-valuenow={count} aria-valuetext={percentage+'% · '+count+' de '+total}>
        <motion.span initial={false} animate={{width:(count/total*100)+'%'}} transition={reduce?{duration:0}:springTransition} />
      </div>
    </div>
    <nav aria-label="Secciones del OVA">
      {groups.map(({title,links})=><AnimatedAccordion title={title} initialOpen variant="sidebar" key={title}>
        {links.map(([path,label])=><NavLink end to={path} key={path} onClick={navigate}>
          <span className="studyNavLabel">{label}</span>
          <motion.span className={visited.includes(path)?'sectionStatus is-complete':'sectionStatus'} key={visited.includes(path)?'done':'pending'}
            initial={reduce||!visited.includes(path)?false:{scale:.6,opacity:.4}} animate={{scale:1,opacity:1}} transition={springTransition}>
            {visited.includes(path)?<><Check size={15} aria-hidden="true"/><span className="visuallyHidden">Revisada</span></>:<Circle size={11} aria-hidden="true"/>}
          </motion.span>
        </NavLink>)}
      </AnimatedAccordion>)}
    </nav>
  </motion.aside>
}

export function WorkshopPage({slug,done,onComplete,scores}:{slug:string;done:boolean;onComplete:(score?:number)=>void;scores:(number|string)[]}){
  const frame=useRef<HTMLIFrameElement>(null)
  const observer=useRef<ResizeObserver|null>(null)
  const [height,setHeight]=useState(750)
  const reduce=useReducedMotion()
  const workshop=workshops.find(entry=>entry.slug===slug)

  useEffect(()=>{
    function receive(event:MessageEvent){
      if(event.origin!==window.location.origin || event.source!==frame.current?.contentWindow || event.data?.type!=='complete') return
      const score=event.data.score
      onComplete(Number.isInteger(score)&&score>=0&&score<=5?score:undefined)
    }
    window.addEventListener('message',receive)
    return ()=>window.removeEventListener('message',receive)
  },[onComplete])
  useEffect(()=>()=>observer.current?.disconnect(),[])

  function fit(){
    observer.current?.disconnect()
    const body=frame.current?.contentDocument?.body
    if(!body) return
    function resize(){
      if(body) setHeight(Math.max(460,Math.ceil(body.getBoundingClientRect().height+24)))
    }
    observer.current=new ResizeObserver(resize)
    observer.current.observe(body)
    resize()
  }
  const guide=workshopGuide[slug]
  if(!workshop||!guide) return <p>Actividad no disponible. <Link to="/">Volver al mapa</Link></p>

  return <article className="workshopPage">
    <header className="studyBanner">
      <motion.div initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}}>
        <p className="meta">{slug==='conclusiones-ciclo'?'Cierre del OVA':'Actividad de aprendizaje'}</p>
        <TextReveal>{workshop.title}</TextReveal>
        <TextReveal as="p">{workshop.intro}</TextReveal>
      </motion.div>
    </header>
    <motion.section className="workshopInstructions" aria-labelledby="instructions-title"
      initial={reduce?false:{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={revealTransition}>
      <p className="workshopObjective"><strong>Objetivo</strong> {guide.objective}</p>
      <h2 id="instructions-title"><ClipboardList size={21} aria-hidden="true"/> Instrucciones</h2>
      <motion.ol initial={reduce?false:'hidden'} whileInView="show" viewport={{once:true,amount:.15}}
        variants={{show:{transition:{staggerChildren:reduce?0:.045}}}}>
        {guide.instructions.map(instruction=><motion.li key={instruction}
          variants={{hidden:{opacity:0,y:8},show:{opacity:1,y:0}}}
          transition={{...revealTransition,duration:reduce?0:.3}}>
          {instruction}
        </motion.li>)}
      </motion.ol>
    </motion.section>
    <AnimatePresence initial={false}>
      {done&&<motion.p className="completedWorkshop" role="status" initial={reduce?false:{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{ease:easeOut,duration:reduce?0:.28}}>✓ Actividad completada</motion.p>}
    </AnimatePresence>
    <iframe ref={frame} title={workshop.title} onLoad={fit} style={{height}} src={import.meta.env.BASE_URL+'talleres/'+workshop.slug+'/index.html'} />
    <motion.aside className="workshopTakeaway" aria-labelledby="takeaway-title"
      initial={reduce?false:{opacity:0,y:17}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={revealTransition}>
      <Quote size={25} aria-hidden="true"/>
      <div><h2 id="takeaway-title">Para recordar</h2><p>{guide.takeaway}</p></div>
    </motion.aside>
    {slug==='conclusiones-ciclo'&&<section className="lab"><h2>Compara tus resultados</h2><p>Diagnóstico: {scores[0]} · Evaluación final: {scores[1]}</p><h3>Reflexiona</h3><p>¿Qué concepto te costó más? ¿En qué tema avanzaste? Piensa en un negocio de tu entorno y explica qué función del teléfono usarías para resolverle una necesidad.</p></section>}
    <SectionStepper path={activityPath(slug)}/>
  </article>
}
