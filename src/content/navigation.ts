export const workshops = [
  {slug:'actividad-1-1-diagnostico', title:'Diagnóstico', intro:'Responde en el emulador y consulta en Logcat la explicación de cada respuesta.'},
  {slug:'actividad-1-2-pareo', title:'¡Conectados!', intro:'Conecta los términos con sus definiciones y comprueba tus respuestas.'},
  {slug:'actividad-1-3-mapa', title:'Mapa de Android Studio', intro:'Localiza las herramientas del IDE. Usa las pistas para explorar la interfaz.'},
  {slug:'actividad-1-4-escenario', title:'Escenario', intro:'Ayuda a Marta a decidir cómo construir y entregar la app de su panadería.'},
  {slug:'actividad-1-5-quiz-final', title:'Quiz final', intro:'Resuelve las cinco preguntas y consulta el resultado de la compilación.'},
  {slug:'conclusiones-ciclo', title:'Conclusiones', intro:'Explora el ciclo completo, desde la idea hasta la primera prueba en el emulador.'},
]
export const activityPath = (slug:string) => '/actividad/'+slug

export const groups = [
  {title:'Contextualización', links:[
    ['/guia/introduccion','Introducción'], ['/guia/metodologia','Metodología'], ['/guia/contenidos','Contenidos'], ['/guia/referencias','Referentes']]},
  {title:'Lecciones', links:[
    ['/ruta/ecosistema-movil','¿Qué es el desarrollo móvil?'], ['/ruta/kotlin','Kotlin para Android'], ['/ruta/android-studio','Android Studio y sus herramientas']]},
  {title:'Actividades de aprendizaje', links:workshops.slice(0,5).map(w=>[activityPath(w.slug),w.title])},
  {title:'Cierre', links:[[activityPath('conclusiones-ciclo'),'Conclusiones']]},
]

export const sections = groups.flatMap(({title,links}) =>
  links.map(([path,label])=>({path,label,group:title,groupPath:links[0][0]})),
)
