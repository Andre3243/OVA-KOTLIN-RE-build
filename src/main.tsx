import { Component, StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './Course'

class StartupBoundary extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false}

  static getDerivedStateFromError(){
    return {failed:true}
  }

  render(){
    if(!this.state.failed)return this.props.children
    return <main style={{maxWidth:'40rem',margin:'4rem auto',padding:'1rem'}}>
      <h1>Kotlin Lab</h1>
      <p role="alert">No pudimos cargar esta vista.</p>
      <button onClick={()=>window.location.reload()}>Recargar esta vista</button>
      {' '}<a href={window.location.pathname} onClick={event=>{
        event.preventDefault()
        window.location.hash='/'
        window.location.reload()
      }}>Volver a la portada</a>
    </main>
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><StartupBoundary><HashRouter><App /></HashRouter></StartupBoundary></StrictMode>,
)
