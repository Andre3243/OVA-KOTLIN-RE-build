// URL del video introductorio del OVA en la sección de Introducción.
export const INTRO_VIDEO_URL = 'https://www.youtube.com/watch?v=hjEWXXPENKU'

export const COURSE_CREDITS = {
  brand: 'Kotlin Lab',
  team: 'Equipo SJD',
  authors: ['Sebastian Cufi', 'Deimy Vanegas', 'Jhonny Acosta'],
  subjectExpert: 'Franklin Albeiro Gomez Mendoza',
  instructionalAdvisor: 'Raul Rodriguez',
} as const

export const PODCAST_META = {
  title: 'Una pequeña conversación · Bienvenida al OVA',
  speakers: 'Deimy Vanegas, Sebastian Cufi y Jhonny Acosta (Equipo SJD)',
  durationLabel: '6:28',
  srcPath: 'media/conversacion.mp3',
  speeds: [0.75, 1, 1.25, 1.5] as const,
}

export const PODCAST_TRANSCRIPT: { speaker: string; time: string; text: string }[] = [
  {
    time: '00:00',
    speaker: 'Apertura · Equipo SJD',
    text: 'Bienvenida al OVA “Primeros pasos en la programación móvil con Kotlin”. Conversamos sobre cómo pasamos de usar aplicaciones todos los días en el teléfono a comprender cómo se diseñan, escriben y prueban por dentro.',
  },
  {
    time: '01:15',
    speaker: 'El ecosistema móvil y Android',
    text: 'Un teléfono móvil no funciona igual que un computador de escritorio: tiene sensores como cámara y GPS, pantalla táctil de tamaño variable, batería limitada y cambios constantes de conexión. Por eso, cuando buscamos máximo rendimiento e integración directa con el hardware en Android, elegimos el desarrollo nativo.',
  },
  {
    time: '02:45',
    speaker: '¿Por qué Kotlin?',
    text: 'Kotlin, creado por JetBrains y adoptado oficialmente por Google como lenguaje preferido para Android, reduce el código repetitivo frente a Java, convive con librerías existentes e incorpora seguridad ante valores nulos (Null Safety) para evitar cierres inesperados en tiempo de ejecución.',
  },
  {
    time: '04:20',
    speaker: 'Android Studio como taller de trabajo',
    text: 'Para transformar ese código en una aplicación instalable (.apk) usamos Android Studio: allí organizamos carpetas y permisos en AndroidManifest.xml, diseñamos pantallas con vista previa, compilamos con Gradle, probamos en el emulador y leemos los mensajes de ejecución en Logcat.',
  },
  {
    time: '05:35',
    speaker: 'Cómo recorrer este OVA',
    text: 'Te invitamos a avanzar a tu propio ritmo: explora las lecciones, comprueba tus presaberes en el diagnóstico, conecta conceptos, recorre el mapa del IDE, asesora a tu primera clienta y valida todo lo aprendido compilando tu conocimiento en el quiz final.',
  },
]
