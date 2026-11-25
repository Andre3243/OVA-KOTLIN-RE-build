import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Camera, ClipboardCheck, Code2 } from 'lucide-react'
import { easeOut, gentleHover, gentleTap, revealTransition, springTransition } from './motionPresets'

const scenes = [
  { tab:'El encargo', title:'Un pedido escrito a mano', body:'Marta quiere que sus clientes puedan tomarle una foto a su pedido y enviarlo desde el celular. ¿Qué necesita su app para hacerlo?', icon:Camera },
  { tab:'Las herramientas', title:'De la idea al código', body:'Aprenderás en qué se diferencia una app móvil, qué aporta Kotlin y cómo se usa Android Studio para construir y probar una aplicación.', icon:Code2 },
  { tab:'La práctica', title:'Tus decisiones cuentan', body:'Después de las lecciones harás un diagnóstico sin nota. Luego conectarás conceptos, explorarás el IDE y ayudarás a Marta a decidir cómo construir su app.', icon:ClipboardCheck },
]

export function PreCourse({children}:{children:React.ReactNode}){
  const [index,setIndex]=useState(0)
  const reduced=useReducedMotion()
  const scene=scenes[index]
  const Icon=scene.icon
  return <section className="preCourse" id="antes-del-ova" aria-labelledby="pre-title">
    <motion.div className="preCourseCopy"
      initial={reduced?false:{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.22}} transition={revealTransition}>
      <p className="landingKicker"><span/> ANTES DEL OVA</p>
      <h2 id="pre-title"><span>Una idea.</span><span>Una app Android.</span></h2>
      <motion.p initial={reduced?false:{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{...revealTransition,delay:reduced?0:.14}}>
        Conoce el proyecto que te acompañará en el curso y lo que harás para resolverlo.
      </motion.p>
      {children}
    </motion.div>
    <motion.div className="preCourseStory"
      initial={reduced?false:{opacity:0,x:19}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.24}} transition={{...revealTransition,delay:reduced?0:.1}}>
      <div className="preCourseChoices" aria-label="Escenas de la introducción">
        {scenes.map((item,i)=><motion.button type="button" key={item.tab} aria-pressed={index===i} onClick={()=>setIndex(i)}
          whileHover={reduced?undefined:gentleHover} whileTap={reduced?undefined:gentleTap} transition={springTransition}>{item.tab}</motion.button>)}
      </div>
      <div className="preCourseStage" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={index} initial={reduced?false:{opacity:0,y:11}} animate={{opacity:1,y:0}} exit={reduced?undefined:{opacity:0,y:-7}}
            transition={{duration:reduced?0:.25,ease:easeOut}}>
            <span className="preCourseIcon"><Icon size={28} aria-hidden="true"/></span>
            <h3>{scene.title}</h3>
            <p>{scene.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  </section>
}
