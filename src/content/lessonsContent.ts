export const desktopVsMobile = [
  {
    title: 'Hardware y sensores integrados',
    detail:
      'Los teléfonos incorporan cámara, GPS, acelerómetro, giroscopio y sensores biométricos. En el caso de la panadería, la cámara permite capturar el pedido escrito sin digitarlo.',
  },
  {
    title: 'Batería, memoria y red limitadas',
    detail:
      'El sistema operativo restringe procesos pesados para cuidar la batería y la memoria RAM, y la conexión móvil puede cortarse en cualquier momento sin perder los datos del usuario.',
  },
  {
    title: 'Pantallas diversas e interacción táctil',
    detail:
      'Una app debe adaptarse a distintos tamaños, resoluciones y orientaciones de pantalla con controles pensados para el toque directo y gestos sencillos.',
  },
] as const

export const developmentApproaches = [
  {
    id: 'nativo',
    name: 'Desarrollo nativo',
    badge: 'Recomendado en este OVA',
    stack: 'Kotlin (o Java) + Android SDK + Android Studio',
    performance: 'Óptimo: ejecuta directamente sobre el sistema Android sin capas intermedias.',
    hardware: 'Acceso directo y completo a cámara, GPS, sensores, notificaciones y APIs recientes.',
    codebase: 'Una base de código específica para Android.',
    whenToChoose:
      'Cuando la prioridad es la fluidez, la experiencia propia de Android y el uso confiable de hardware como la cámara (caso Panadería La Espiga).',
  },
  {
    id: 'multiplataforma',
    name: 'Desarrollo multiplataforma',
    badge: 'Código compartido',
    stack: 'Kotlin Multiplatform, Flutter o React Native',
    performance: 'Alto a medio, según cuánta interfaz o lógica se comparta.',
    hardware: 'Accede a sensores mediante módulos o código específico por plataforma cuando hace falta.',
    codebase: 'Comparte gran parte de la lógica entre Android e iOS.',
    whenToChoose:
      'Cuando un equipo debe publicar en Android e iOS al mismo tiempo y puede asumir integraciones específicas para funciones del dispositivo.',
  },
  {
    id: 'hibrido',
    name: 'Desarrollo híbrido',
    badge: 'Contenedor web',
    stack: 'HTML, CSS y JavaScript dentro de un WebView (Ionic / Capacitor)',
    performance: 'Menor en animaciones intensivas o procesamiento pesado, al correr sobre un contenedor web.',
    hardware: 'Limitado a los puentes o complementos disponibles para comunicarse con el teléfono.',
    codebase: 'Reutiliza tecnologías web en un único proyecto empaquetado.',
    whenToChoose:
      'Prototipos informativos o catálogos sencillos con baja dependencia del hardware del dispositivo.',
  },
] as const

export const kotlinTimeline = [
  {
    year: '2011',
    label: 'Origen en JetBrains',
    detail:
      'JetBrains —la empresa creadora de IntelliJ IDEA, base de Android Studio— presenta el proyecto Kotlin buscando un lenguaje más conciso y seguro que Java sobre la JVM.',
  },
  {
    year: '2016',
    label: 'Kotlin 1.0 estable',
    detail:
      'Se publica la primera versión estable de código abierto con garantía de compatibilidad e interoperabilidad directa con bibliotecas Java existentes.',
  },
  {
    year: '2017',
    label: 'Lenguaje oficial en Android',
    detail:
      'Durante Google I/O 2017, Google anuncia soporte oficial de primera clase para Kotlin dentro de Android Studio.',
  },
  {
    year: '2019 – hoy',
    label: 'Enfoque Kotlin-first',
    detail:
      'Google declara que el desarrollo en Android es Kotlin-first: las nuevas bibliotecas de Jetpack, guías oficiales y Jetpack Compose se diseñan primero en Kotlin (Google, 2025).',
  },
] as const

export const kotlinAdvantages = [
  {
    title: 'Conciso',
    detail:
      'Reduce drásticamente el código repetitivo (boilerplate): menos líneas significan menos lugares donde cometer errores y una lectura mucho más clara.',
  },
  {
    title: 'Seguridad contra nulos (Null Safety)',
    detail:
      'El sistema de tipos distingue variables que nunca pueden ser nulas (String) de las anulables (String?), evitando en compilación la temida NullPointerException.',
  },
  {
    title: 'Interoperable con Java',
    detail:
      'Kotlin y Java pueden convivir en el mismo proyecto Android, permitiendo aprovechar millones de bibliotecas probadas y migrar aplicaciones gradualmente.',
  },
  {
    title: 'Expresivo y moderno',
    detail:
      'Incorpora funciones de extensión, inferencia de tipos y corrutinas para ejecutar tareas de red o cámara sin congelar la pantalla del usuario.',
  },
] as const

export const javaCodeComparison = `public class Usuario {
    private final String nombre;
    private final int edad;

    public Usuario(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    public String getNombre() {
        return nombre;
    }

    public int getEdad() {
        return edad;
    }
}`

export const kotlinCodeComparison = `data class Usuario(
    val nombre: String,
    val edad: Int
)`

export const studioFunctions = [
  {
    name: 'Editor de código inteligente',
    detail: 'Autocompletado contextual para Kotlin y XML, resaltado de sintaxis, refactorización y detección de errores mientras escribes.',
  },
  {
    name: 'Diseñador de interfaz y @Preview',
    detail: 'Permite previsualizar pantallas en tiempo real sin necesidad de compilar ni instalar toda la aplicación en un teléfono.',
  },
  {
    name: 'Sistema de construcción Gradle',
    detail: 'Gestiona dependencias externas, reúne el código Kotlin y los recursos gráficos, y empaqueta el archivo instalable (.apk o .aab).',
  },
  {
    name: 'Emulador de Android (AVD)',
    detail: 'Simula distintos modelos de teléfonos, tabletas y versiones de Android en tu computador para probar sensores, rotación y red.',
  },
  {
    name: 'Depuración y consola Logcat',
    detail: 'Muestra en vivo los mensajes del sistema y de tu app (niveles I, D, W, E) para rastrear eventos y corregir fallos rápidamente.',
  },
] as const

export const uiApproaches = [
  {
    name: 'Jetpack Compose (Moderno · Declarativo)',
    badge: 'Estándar actual',
    description:
      'Defines la interfaz directamente en archivos Kotlin mediante funciones anotadas con @Composable y ves el resultado con @Preview. Menos archivos separados y mayor integración con el estado de la app.',
  },
  {
    name: 'Vistas con XML (Tradicional)',
    badge: 'Proyectos existentes',
    description:
      'Separas la estructura visual en archivos XML dentro de res/layout/ (usando el Layout Editor visual) y conectas su comportamiento desde tus clases Kotlin.',
  },
] as const

export const closingKeyIdeas = [
  'Un dispositivo móvil tiene reglas propias (sensores, batería, memoria y pantallas táctiles variables) que guían cada decisión técnica.',
  'El desarrollo nativo en Android brinda el mejor rendimiento y acceso completo al hardware del teléfono, como la cámara.',
  'Kotlin es el lenguaje oficial y preferido por Google desde 2019 (Kotlin-first) gracias a su concisión, interoperabilidad con Java y Null Safety.',
  'Android Studio integra en un solo taller gratuito el editor de código, la vista previa, Gradle, el emulador (AVD) y Logcat.',
  'Toda app Android articula pantallas (Activities), interfaz de usuario, permisos declarados en AndroidManifest.xml y un paquete instalable (.apk / .aab).',
] as const

export const closingMilestones = [
  {
    stage: '01 · Del bolsillo al proyecto',
    summary: 'Identificaste qué distingue a una aplicación móvil y cuándo recomendar un enfoque nativo frente a alternativas híbridas o multiplataforma.',
  },
  {
    stage: '02 · Código seguro con Kotlin',
    summary: 'Reconociste cómo las data classes y el manejo explícito de nulos (? y ?:) previenen fallos frecuentes en tiempo de ejecución.',
  },
  {
    stage: '03 · Dominio del taller Android Studio',
    summary: 'Ubicaste las seis zonas principales del IDE y comprendiste el ciclo editar → compilar con Gradle → probar en emulador → revisar Logcat.',
  },
] as const
