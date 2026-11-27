export const guidePages = [
  { id: 'introduccion', title: 'Introducción', summary: 'Propósito, multimedia y encargo del curso' },
  { id: 'metodologia', title: 'Metodología', summary: 'Competencias, fases, tiempos y estudio autónomo' },
  { id: 'contenidos', title: 'Contenidos', summary: 'El dispositivo, el lenguaje y la herramienta' },
  { id: 'referencias', title: 'Referentes', summary: 'Bibliografía APA y documentación oficial' },
] as const

export const competencies = [
  {
    kind: 'Saber',
    description:
      'Reconocer los conceptos fundamentales del desarrollo móvil, las características del lenguaje Kotlin y la función de Android Studio en el desarrollo Android.',
  },
  {
    kind: 'Saber hacer',
    description:
      'Identificar y explorar las áreas y herramientas principales del entorno de desarrollo Android Studio para construir, probar y empaquetar una aplicación.',
  },
] as const

export const learningPhases = [
  {
    title: '1. Apropiación conceptual y multimedia',
    body: 'Recorre la contextualización, escucha el pódcast de bienvenida y estudia las tres lecciones sobre ecosistema móvil, Kotlin y Android Studio. Modifica mentalmente los ejemplos y anticipa su salida.',
  },
  {
    title: '2. Diagnóstico de presaberes',
    body: 'Al terminar el recorrido por Android Studio y antes de las prácticas, responde cinco preguntas en el emulador (hasta 10 minutos). No suma a tu calificación y te indica qué subtemas conviene reforzar.',
  },
  {
    title: '3. Verificación y autoevaluación práctica',
    body: 'Conecta conceptos clave del ecosistema Android, localiza seis zonas de trabajo en el mapa de Android Studio y asesora a Marta en el escenario de la Panadería La Espiga con retroalimentación inmediata.',
  },
  {
    title: '4. Evaluación final y cierre reflexivo',
    body: 'Resuelve cinco preguntas en un máximo de 15 minutos. Apruebas con 3 de 5 aciertos (nota 3.0 sobre 5.0), obtienes tu constancia simbólica y comparas tu avance frente al diagnóstico.',
  },
] as const

export const studyTimes = [
  { stage: 'Contextualización y cierre', minutes: '7 min', detail: 'Introducción, metodología, mapa y conclusiones' },
  { stage: 'Contenidos teóricos (Subtemas 1.1 a 1.4)', minutes: '23 min', detail: 'Desarrollo móvil, Kotlin y Android Studio' },
  { stage: 'Diagnóstico de presaberes (Actividad 1.1)', minutes: '5 min', detail: 'Cuestionario formativo (límite de 10 min)' },
  { stage: 'Actividades de autoevaluación (1.2 a 1.4)', minutes: '10 min', detail: 'Pareo, mapa del IDE y escenario con cliente' },
  { stage: 'Evaluación final (Actividad 1.5)', minutes: '5 min', detail: 'Quiz calificable (límite de 15 min)' },
] as const

export const studyRecommendations = [
  'No necesitas completar el OVA en una sola sesión: tu avance y puntajes quedan guardados en este navegador.',
  'Prueba y modifica los fragmentos de código en Kotlin Playground (play.kotlinlang.org) sin instalar programas adicionales.',
  'Usa la transcripción y el control de velocidad del pódcast para repasar las ideas principales a tu ritmo.',
  'En el mapa de Android Studio y en el pareo tienes intentos ilimitados: aprovecha las pistas para consolidar cada concepto.',
  'En el escenario con Marta, anota qué decisiones quedaron marcadas como «corregido» en la ficha del proyecto.',
  'Consulta los enlaces oficiales de Android Developers y JetBrains cuando quieras profundizar en algún término.',
  'Para el Quiz Final necesitas al menos 3 de 5 aciertos (3.0 / 5.0); revisa el panel de explicaciones al terminar.',
] as const

export const contentOverviewSteps = [
  {
    step: 'Pieza 01 · El dispositivo',
    question: '¿Dónde se ejecuta la aplicación?',
    lessonTitle: '¿Qué es el desarrollo móvil?',
    lessonPath: '/ruta/ecosistema-movil',
    summary:
      'Comprenderás por qué un teléfono no es un computador en miniatura: sensores físicos, batería, memoria, pantallas diversas y comparación entre desarrollo nativo, multiplataforma e híbrido.',
  },
  {
    step: 'Pieza 02 · El lenguaje',
    question: '¿En qué lenguaje se programa?',
    lessonTitle: 'Kotlin para Android',
    lessonPath: '/ruta/kotlin',
    summary:
      'Conocerás el origen de Kotlin en JetBrains, su adopción Kotlin-first por Google (2017–2019), sus cuatro ventajas principales, Null Safety y una comparación directa frente a Java.',
  },
  {
    step: 'Pieza 03 · La herramienta y la app',
    question: '¿Con qué se construye, prueba y empaqueta?',
    lessonTitle: 'Android Studio y sus herramientas',
    lessonPath: '/ruta/android-studio',
    summary:
      'Explorarás el IDE oficial, la diferencia entre XML y Jetpack Compose, el papel de Gradle, el emulador y Logcat, y las piezas clave de una app: Activity, interfaz, AndroidManifest.xml y paquete .apk.',
  },
] as const

export const contentOutcomes = [
  'Diferenciar las restricciones propias de un dispositivo móvil y justificar cuándo elegir un enfoque nativo.',
  'Leer una clase de datos en Kotlin, identificar tipos anulables (?) y explicar qué resuelve frente a Java.',
  'Reconocer las áreas de trabajo de Android Studio y relacionar Activity, AndroidManifest.xml, Gradle y archivo .apk.',
] as const

export type ReferenceEntry = {
  authors: string
  year: string
  title: string
  source: string
  url?: string
  consulted?: string
}

export const apaReferences: ReferenceEntry[] = [
  {
    authors: 'Ableson, W. F., Sen, R., King, C., & Ortiz, C. E.',
    year: '2020',
    title: 'Android in Action (4th ed.)',
    source: 'Manning Publications.',
  },
  {
    authors: 'Deitel, P., & Deitel, H.',
    year: '2018',
    title: 'Android 8 for Programmers: An App-Driven Approach (3rd ed.)',
    source: 'Pearson Education.',
  },
  {
    authors: 'Forrester, A., Boudjnah, E., Dumbravan, A., & Tigcal, J.',
    year: '2023',
    title: 'How to Build Android Apps with Kotlin: A practical guide to developing, testing, and publishing your first Android apps (2nd ed.)',
    source: 'Packt Publishing.',
  },
  {
    authors: 'Google.',
    year: '2025',
    title: 'Android Developers: Desarrolla aplicaciones de Android con Kotlin',
    source: 'Documentación oficial de Android.',
    url: 'https://developer.android.com/kotlin',
    consulted: 'Consultado en 2026',
  },
  {
    authors: 'Google.',
    year: '2025',
    title: 'Android Studio overview & IDE features',
    source: 'Documentación oficial de Android Studio.',
    url: 'https://developer.android.com/studio/intro',
    consulted: 'Consultado en 2026',
  },
  {
    authors: 'Jemerov, D., & Isakova, S.',
    year: '2017',
    title: 'Kotlin in Action',
    source: 'Manning Publications.',
  },
  {
    authors: 'JetBrains.',
    year: '2025',
    title: 'Documentación oficial del lenguaje de programación Kotlin',
    source: 'Kotlin Documentation.',
    url: 'https://kotlinlang.org/docs/home.html',
    consulted: 'Consultado en 2026',
  },
  {
    authors: 'Phillips, B., Stewart, C., Marsicano, K., & Gardner, B.',
    year: '2021',
    title: 'Android Programming: The Big Nerd Ranch Guide (5th ed.)',
    source: 'Big Nerd Ranch Guides.',
  },
  {
    authors: 'Smyth, N.',
    year: '2023',
    title: 'Android Studio Flamingo Essentials: Kotlin Edition',
    source: 'Payload Media.',
  },
  {
    authors: 'Sommerhoff, P.',
    year: '2018',
    title: 'Kotlin for Android App Development',
    source: 'Pearson Education.',
  },
  {
    authors: 'Spath, P.',
    year: '2019',
    title: 'Pro Android with Kotlin: Developing Modern Mobile Apps',
    source: 'Apress.',
  },
]
