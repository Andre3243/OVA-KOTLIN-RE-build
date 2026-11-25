import { useEffect, useId, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, ChevronDown, CircleHelp, type LucideIcon } from 'lucide-react'
import { sections } from './content/navigation'
import { easeOut, gentleHover, gentleTap, revealTransition, springTransition } from './motionPresets'

const MotionLink = motion.create(Link)

export function AnimatedPage({children}:{children:ReactNode}){
  const reduced=useReducedMotion()
  useEffect(()=>{
    window.scrollTo({top:0, behavior:reduced?'instant':'smooth'})
  },[reduced])
  return <motion.div
    initial={reduced?false:{opacity:.8,y:11,filter:'blur(3px)'}}
    animate={{opacity:1,y:0,filter:'blur(0px)'}}
    exit={reduced?undefined:{opacity:0,y:-5,filter:'blur(2px)'}}
    transition={{duration:reduced?0:.32,ease:easeOut}}>
    {children}
  </motion.div>
}

export function ReadingProgress(){
  const progress=useMotionValue(0)
  useEffect(()=>{
    function update(){
      const page=document.scrollingElement
      if(!page)return
      const distance=page.scrollHeight-page.clientHeight
      progress.set(distance>0?Math.min(1,Math.max(0,page.scrollTop/distance)):0)
    }
    const observer=new ResizeObserver(update)
    observer.observe(document.body)
    window.addEventListener('scroll',update,{passive:true})
    window.addEventListener('resize',update)
    update()
    return ()=>{
      observer.disconnect()
      window.removeEventListener('scroll',update)
      window.removeEventListener('resize',update)
    }
  },[progress])
  return <motion.div className="readingProgress" aria-hidden="true" style={{scaleX:progress}}/>
}

export function TextReveal({children,as='h1'}:{children:string;as?:'h1'|'p'}){
  const reduced=useReducedMotion()
  const Tag=as==='h1'?motion.h1:motion.p
  if(reduced)return <Tag className={as==='p'?'lead':undefined}>{children}</Tag>

  if(as==='p')return <motion.p className="lead"
    initial={{opacity:0,y:14,filter:'blur(6px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}}
    transition={{...revealTransition,duration:.4,delay:.1}}>{children}</motion.p>

  return <motion.h1 initial="hidden" animate="shown" aria-label={children}
    variants={{shown:{transition:{staggerChildren:.045}}}}>
    {children.split(' ').map((word,index)=><span key={index} aria-hidden="true"><motion.span className="revealWord"
      variants={{hidden:{opacity:.72,y:14,filter:'blur(6px)'},shown:{opacity:1,y:0,filter:'blur(0px)'}}}
      transition={{...revealTransition,duration:.34}}>{word}</motion.span>{' '}</span>)}
  </motion.h1>
}

export function RevealBlock({children,delay=0}:{children:ReactNode;delay?:number}){
  const reduced=useReducedMotion()
  return <motion.div initial={reduced?false:{opacity:0,y:15}} whileInView={{opacity:1,y:0}}
    viewport={{once:true,amount:.15}} transition={{...revealTransition,duration:reduced?0:.42,delay:reduced?0:delay}}>{children}</motion.div>
}

export function ContentCard({icon:Icon,title,children}:{icon:LucideIcon;title:string;children:ReactNode}){
  return <RevealBlock><section className="learningCard">
    <h2><span className="learningIcon"><Icon size={20} aria-hidden="true"/></span>{title}</h2>
    {children}
  </section></RevealBlock>
}

export function CalloutBox({title,children}:{title:string;children:ReactNode}){
  return <RevealBlock delay={.08}><aside className="learningCallout">
    <CircleHelp size={22} aria-hidden="true"/>
    <div><h2>{title}</h2>{children}</div>
  </aside></RevealBlock>
}

export function AnimatedAccordion({title,children,icon:Icon,initialOpen=false,variant='content'}:{
  title:string;children:ReactNode;icon?:LucideIcon;initialOpen?:boolean;variant?:'content'|'sidebar'
}){
  const reduced=useReducedMotion()
  const [open,setOpen]=useState(initialOpen)
  const id=useId()
  return <div className={'learningAccordion '+variant} data-open={open}>
    <motion.button type="button" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}
      whileTap={reduced?undefined:gentleTap} transition={springTransition}>
      {Icon&&<Icon size={19} aria-hidden="true"/>}<span>{title}</span>
      <motion.span className="accordionChevron" initial={false} animate={{rotate:open?180:0}} transition={reduced?{duration:0}:springTransition}><ChevronDown size={17} aria-hidden="true"/></motion.span>
    </motion.button>
    <div id={id} inert={!open}>
      <AnimatePresence initial={false}>
        {open&&<motion.div className="accordionClip" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
          transition={{duration:reduced?0:.28,ease:easeOut}}>
          <div className="accordionBody">{children}</div>
        </motion.div>}
      </AnimatePresence>
    </div>
  </div>
}

export function SectionStepper({path,onReview}:{path:string;onReview?:()=>void}){
  const index=sections.findIndex(item=>item.path===path)
  const reduced=useReducedMotion()
  if(index<0)return null
  const previous=sections[index-1]
  const next=sections[index+1]
  return <nav className="sectionStepper" aria-label="Continuar el recorrido">
    {previous&&<MotionLink className="stepPrevious" to={previous.path} transition={springTransition}
      whileHover={reduced?undefined:gentleHover} whileTap={reduced?undefined:gentleTap}>
      <ArrowLeft aria-hidden="true" size={19}/><div><small>Sección anterior</small><strong>{previous.label}</strong></div>
    </MotionLink>}
    <MotionLink className="stepNext" to={next?.path??'/'} onClick={event=>{if(!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey)onReview?.()}} transition={springTransition}
      whileHover={reduced?undefined:gentleHover} whileTap={reduced?undefined:gentleTap}>
      <div><small>{onReview?'Marcar como revisado y continuar':next?'Sección siguiente':'Final del recorrido'}</small><strong>{next?.label??'Volver al inicio'}</strong></div><ArrowRight aria-hidden="true" size={19}/>
    </MotionLink>
  </nav>
}
