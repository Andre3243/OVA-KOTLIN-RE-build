export type ModuleStatus = 'available' | 'planned'
export type CourseModule = { id:string; index:string; title:string; shortTitle:string; description:string; minutes:number; status:ModuleStatus; topics:string[] }

export const courseModules: CourseModule[] = [
  { id:'bienvenida', index:'00', title:'Bienvenida y diagnóstico', shortTitle:'Inicio', description:'Conoce la ruta, los resultados de aprendizaje y descubre desde dónde empiezas.', minutes:8, status:'available', topics:['Propósito del OVA','Ruta de aprendizaje','Diagnóstico inicial'] },
  { id:'ecosistema-movil', index:'01', title:'El ecosistema móvil', shortTitle:'Ecosistema', description:'Comprende qué hace diferente a una app móvil y cómo elegir un enfoque de desarrollo.', minutes:7, status:'planned', topics:['Dispositivos móviles','Restricciones','Nativo, híbrido y multiplataforma'] },
  { id:'kotlin', index:'02', title:'Kotlin para Android', shortTitle:'Kotlin', description:'Explora el lenguaje recomendado para Android mediante ejemplos y comparaciones.', minutes:10, status:'planned', topics:['Historia','Null Safety','Kotlin frente a Java'] },
  { id:'android-studio', index:'03', title:'Android Studio', shortTitle:'Herramientas', description:'Reconoce las herramientas del IDE y el flujo básico de construcción de una app.', minutes:10, status:'planned', topics:['Editor','Emulador','Gradle y Logcat','Mapa interactivo'] },
  { id:'aplicar', index:'04', title:'Aplicar lo aprendido', shortTitle:'Práctica', description:'Relaciona conceptos y toma decisiones en un proyecto para una clienta realista.', minutes:10, status:'planned', topics:['Pareo de conceptos','Panadería La Espiga','Retroalimentación'] },
  { id:'evaluacion', index:'05', title:'Evaluación y cierre', shortTitle:'Cierre', description:'Comprueba tu avance, recibe una síntesis personalizada y define el siguiente paso.', minutes:5, status:'planned', topics:['Quiz final','Comparación de resultados','Reflexión'] },
]

export const projectPrinciples = ['Ruta guía siempre visible y mapeada','Audios optimizados con Adobe Podcast','Imágenes interactivas para estructuras extensas','Actividades React nativas, sin iframes']
