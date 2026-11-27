export type ModuleStatus = 'available' | 'planned'
export type CourseModule = {
  id: string
  index: string
  title: string
  shortTitle: string
  description: string
  minutes: number
  status: ModuleStatus
  topics: string[]
}

export const courseModules: CourseModule[] = [
  {
    id: 'ecosistema-movil',
    index: '01',
    title: '¿Qué es el desarrollo móvil?',
    shortTitle: 'Ecosistema móvil',
    description: 'Descubre por qué un teléfono no es un computador en miniatura y compara los enfoques de desarrollo.',
    minutes: 7,
    status: 'available',
    topics: ['Dispositivos y sensores', 'Restricciones móviles', 'Nativo, multiplataforma e híbrido'],
  },
  {
    id: 'kotlin',
    index: '02',
    title: '¿Qué es Kotlin y su uso en Android?',
    shortTitle: 'Kotlin',
    description: 'Conoce la evolución Kotlin-first, sus cuatro ventajas clave, Null Safety y su diferencia frente a Java.',
    minutes: 8,
    status: 'available',
    topics: ['Historia 2011–2019', 'Null Safety y concisión', 'Kotlin frente a Java'],
  },
  {
    id: 'android-studio',
    index: '03',
    title: 'Android Studio y elementos de una app',
    shortTitle: 'Android Studio',
    description: 'Recorre las funciones del IDE oficial y las piezas esenciales de una app Android antes de practicar.',
    minutes: 8,
    status: 'available',
    topics: ['Editor, Gradle, Emulador y Logcat', 'Compose y XML', 'Activity, Manifest y APK'],
  },
]

export const projectPrinciples = [
  'Ruta guía siempre visible con guardado real de progreso',
  'Pódcast con control de velocidad y transcripción accesible',
  'Esquemas e imágenes interactivas accesibles por teclado y móvil',
  'Actividades integradas nativamente en React sin iframes',
]
