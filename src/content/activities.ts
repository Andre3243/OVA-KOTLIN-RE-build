export type QuizQuestion = {
  q: string
  opts: string[]
  correct: number
  why: string
  topic: string
}

export type QuizBank = {
  act: string
  title: string
  lead: string
  meta: string[]
  steps: string[]
  code: string
  minutes: number
  instant: boolean
  pass: number
  questions: QuizQuestion[]
}

export const diagnostic: QuizBank = {
  act: 'Actividad 1.1',
  title: 'Diagnóstico de presaberes',
  lead: 'Cinco preguntas en el emulador para identificar qué conceptos ya dominas antes de pasar a los talleres prácticos.',
  meta: ['5 preguntas', '10 minutos', 'Retroalimentación inmediata', 'No suma a la nota'],
  steps: [
    'Lee cada enunciado y elige la única respuesta que consideres correcta.',
    'Al elegir verás de inmediato si acertaste y por qué en la pantalla y en Logcat. No puedes cambiar la respuesta.',
    'Tienes 10 minutos. El tiempo corre desde que pulses Comenzar.',
    'Al final verás qué subtemas del OVA te conviene repasar con más cuidado.',
  ],
  code: 'fun main() = diagnostico()',
  minutes: 10,
  instant: true,
  pass: 0.6,
  questions: [
    {
      q: '¿Cuál es la función principal de un Entorno de Desarrollo Integrado (IDE) como Android Studio?',
      opts: [
        'Diseñar únicamente la interfaz gráfica sin programar.',
        'Proporcionar un conjunto unificado de herramientas para escribir, compilar, probar y depurar aplicaciones.',
        'Almacenar las aplicaciones en la nube automáticamente.',
        'Actuar como el sistema operativo del teléfono móvil.',
      ],
      correct: 1,
      why: 'Android Studio reúne en un solo lugar el editor de código, el diseñador de interfaces, el emulador y el sistema de construcción Gradle.',
      topic: 'Subtema 1.3 · ¿Qué es Android Studio?',
    },
    {
      q: '¿Cuál es el lenguaje recomendado oficialmente por Google para el desarrollo nativo en Android?',
      opts: ['Python.', 'Kotlin.', 'Swift.', 'PHP.'],
      correct: 1,
      why: 'Google anunció Kotlin como lenguaje oficial en 2017 y desde 2019 Android sigue un enfoque Kotlin-first. Swift es el lenguaje de Apple para iOS.',
      topic: 'Subtema 1.2 · ¿Qué es Kotlin?',
    },
    {
      q: '¿Qué extensión identifica a un archivo instalable directamente en el sistema operativo Android?',
      opts: ['.exe', '.apk', '.dmg', '.pdf'],
      correct: 1,
      why: 'El .apk es el paquete que se instala en el dispositivo. Para publicar en Google Play se usa además el formato .aab. El .exe es de Windows y el .dmg de macOS.',
      topic: 'Subtema 1.4 · Elementos básicos de una app',
    },
    {
      q: 'En el desarrollo Android, ¿qué representa una Activity?',
      opts: [
        'Una conexión a una base de datos.',
        'Una pantalla única de la aplicación con la que el usuario interactúa.',
        'Un sensor físico del teléfono.',
        'La tienda de aplicaciones Google Play.',
      ],
      correct: 1,
      why: 'Cada Activity representa una pantalla de la aplicación, por ejemplo el inicio de sesión o el formulario de pedido.',
      topic: 'Subtema 1.4 · Elementos básicos de una app',
    },
    {
      q: '¿Qué ventaja ofrece la característica Null Safety de Kotlin?',
      opts: [
        'Hace que las aplicaciones sean más livianas.',
        'Previene errores y caídas en tiempo de ejecución causados por referencias nulas.',
        'Aumenta la velocidad de descarga de la app.',
        'Permite traducir el código a diferentes idiomas automáticamente.',
      ],
      correct: 1,
      why: 'El sistema de tipos de Kotlin distingue entre valores que pueden ser nulos y los que no, evitando la NullPointerException que cierra muchas aplicaciones.',
      topic: 'Subtema 1.2 · ¿Qué es Kotlin?',
    },
  ],
}

export const TERMS = [
  { id: 1, name: 'Kotlin', match: 'C' },
  { id: 2, name: 'Android Studio', match: 'A' },
  { id: 3, name: 'Interfaz de Usuario (UI)', match: 'E' },
  { id: 4, name: 'Archivo APK', match: 'B' },
  { id: 5, name: 'Android Manifest', match: 'D' },
] as const

export const DEFS = [
  { l: 'A', t: 'Entorno de desarrollo integrado (IDE) oficial para programar y probar apps Android.' },
  { l: 'B', t: 'Paquete ejecutable e instalable que contiene el código y recursos de una aplicación Android.' },
  { l: 'C', t: 'Lenguaje de programación moderno, conciso y seguro utilizado para Android.' },
  { l: 'D', t: 'Archivo de configuración central que declara permisos, componentes y requerimientos de la app.' },
  { l: 'E', t: 'Conjunto de elementos visuales que permiten la interacción directa entre el usuario y la app.' },
] as const

export type IdeZone = {
  id: string
  nombre: string
  x: number
  y: number
  w: number
  h: number
  spatialLabel: string
  consigna: string
  pista: string
  explicacion: string
}

export const ZONAS: IdeZone[] = [
  {
    id: 'proyecto',
    nombre: 'Explorador de proyecto',
    x: 3.33,
    y: 6.11,
    w: 20.83,
    h: 63.33,
    spatialLabel: 'Panel lateral izquierdo con estructura en árbol de carpetas y archivos',
    consigna: 'Selecciona el área donde se organizan las carpetas del proyecto: el código Kotlin y los recursos de la app.',
    pista: 'Busca a la izquierda la columna con forma de árbol de carpetas (app, manifests, res, Gradle Scripts).',
    explicacion:
      'Muestra la estructura de la app: AndroidManifest.xml, el código Kotlin dentro de su paquete, la carpeta res con imágenes y textos, y los scripts de Gradle.',
  },
  {
    id: 'editor',
    nombre: 'Editor de código',
    x: 24.17,
    y: 6.11,
    w: 34.17,
    h: 63.33,
    spatialLabel: 'Panel central con pestañas de archivos abiertos y líneas numeradas de código',
    consigna: 'Selecciona la zona donde se escribe el código Kotlin de la aplicación.',
    pista: 'Es el área central que tiene pestañas de archivo arriba y números de línea a la izquierda.',
    explicacion:
      'Aquí escribes Kotlin (por ejemplo MainActivity.kt). Ofrece autocompletado, resaltado de sintaxis y avisos de errores mientras escribes.',
  },
  {
    id: 'preview',
    nombre: 'Vista previa de diseño',
    x: 58.33,
    y: 6.11,
    w: 16.67,
    h: 63.33,
    spatialLabel: 'Panel intermedio derecho con tarjeta visual de saludo y modos Code, Split y Design',
    consigna: 'Selecciona el área que muestra cómo se verá la interfaz sin tener que ejecutar la app.',
    pista: 'Está junto al código y dibuja el resultado de la función marcada con @Preview.',
    explicacion:
      'Dibuja la interfaz a partir del código sin instalar nada en un teléfono. Se actualiza en tiempo real mientras editas el diseño.',
  },
  {
    id: 'run',
    nombre: 'Barra de ejecución',
    x: 68.33,
    y: 0.83,
    w: 15.83,
    h: 4.44,
    spatialLabel: 'Control en la barra superior con selector Pixel 8 API 35 y botón triangular verde',
    consigna: 'Selecciona el control con el que eliges el dispositivo y ejecutas la app.',
    pista: 'Está en la barra superior derecha: busca el selector de dispositivo junto al triángulo verde.',
    explicacion:
      'Eliges el dispositivo virtual o físico y pulsas Ejecutar (▶). Gradle compila el proyecto e instala la app en el emulador.',
  },
  {
    id: 'emulador',
    nombre: 'Emulador (Running Devices)',
    x: 75,
    y: 6.11,
    w: 21.67,
    h: 63.33,
    spatialLabel: 'Panel lateral derecho con la silueta de un teléfono mostrando la aplicación',
    consigna: '¿Dónde se está ejecutando la app ahora mismo? Selecciónalo.',
    pista: 'Busca el teléfono virtual integrado a la derecha de la ventana.',
    explicacion:
      'El emulador simula un teléfono Android dentro de la computadora para probar la aplicación sin necesitar un dispositivo físico.',
  },
  {
    id: 'logcat',
    nombre: 'Logcat',
    x: 3.33,
    y: 69.44,
    w: 93.33,
    h: 26.39,
    spatialLabel: 'Panel inferior horizontal con registros de fecha, hora, nivel y mensajes del sistema',
    consigna: 'Selecciona el panel donde la app muestra sus mensajes internos mientras se ejecuta.',
    pista: 'Está en la franja inferior de toda la ventana, con líneas que llevan hora y nivel (I, D, W).',
    explicacion:
      'Consola de mensajes de la app en ejecución. Sirve para seguir el ciclo de vida (onCreate, onResume) y rastrear errores.',
  },
]

export const INTRO = [
  'Hola, soy Marta, de la Panadería La Espiga. Me recomendaron tu trabajo.',
  'Quiero una app para que mis clientes hagan pedidos desde el celular. Casi todos tienen Android, y me gustaría que puedan tomarle foto a su pedido escrito para no tener que digitarlo.',
] as const

export type ScenarioOption = {
  t: string
  v?: string
  g: 'ok' | 'meh' | 'bad'
  reply: string
  mentor: string
}

export type ScenarioStep = {
  spec: string
  topic: string
  ask: string
  options: ScenarioOption[]
}

export const STEPS: ScenarioStep[] = [
  {
    spec: 'Enfoque',
    topic: 'Subtema 1.1',
    ask: '¿Qué tipo de app me recomiendas?',
    options: [
      {
        t: 'Una app nativa para Android.',
        v: 'App nativa Android',
        g: 'ok',
        reply: 'Perfecto. Si es la que mejor funciona con la cámara, me convence.',
        mentor:
          'El desarrollo nativo usa el lenguaje y las herramientas propias de Android: da el mejor rendimiento y acceso completo a la cámara y al resto del hardware.',
      },
      {
        t: 'Una app híbrida, que es una página web dentro de una app.',
        g: 'meh',
        reply: 'Mmm, ¿y la cámara va a funcionar igual de bien?',
        mentor:
          'Una app híbrida puede funcionar, pero corre dentro de un contenedor web: suele ser más lenta y su acceso al hardware es limitado. Si depende de la cámara y es para Android, lo nativo es mejor.',
      },
      {
        t: 'Una página web normal.',
        g: 'bad',
        reply: 'Pero yo quería que la instalaran en el celular, como las demás apps…',
        mentor: 'Una página web tradicional no se instala como app nativa ni aprovecha igual la cámara y el almacenamiento local.',
      },
    ],
  },
  {
    spec: 'Lenguaje',
    topic: 'Subtema 1.2',
    ask: 'Listo. Mi sobrino dice que eso se programa en algo llamado Swift. ¿Es así?',
    options: [
      {
        t: 'Sí, en Swift.',
        g: 'bad',
        reply: 'Mi sobrino ahora dice que Swift es para iPhone… ¿seguro?',
        mentor: 'Swift es el lenguaje de Apple para iOS. No se utiliza para desarrollar una app nativa de Android.',
      },
      {
        t: 'No. Para Android lo recomendado es Kotlin.',
        v: 'Kotlin',
        g: 'ok',
        reply: 'Ah, bueno, tú conoces el tema. Kotlin entonces.',
        mentor:
          'Google declaró Kotlin lenguaje oficial de Android en 2017 y desde 2019 mantiene el enfoque Kotlin-first. Es conciso y su Null Safety evita muchas caídas.',
      },
      {
        t: 'En Java, como siempre se ha hecho.',
        g: 'meh',
        reply: 'Bueno, si funciona… aunque leí que Google recomienda otro.',
        mentor:
          'Java funciona en Android y convive con Kotlin en un mismo proyecto, pero para proyectos nuevos Google recomienda Kotlin: menos código repetitivo y mayor seguridad contra nulos.',
      },
    ],
  },
  {
    spec: 'Herramienta',
    topic: 'Subtema 1.3',
    ask: '¿Y con qué programa vas a hacer la app? Para saber si tengo que comprarte alguna licencia.',
    options: [
      {
        t: 'Con Photoshop, para que quede bonita.',
        g: 'bad',
        reply: 'Pero eso es para editar imágenes, ¿no?',
        mentor: 'Photoshop sirve para diseño gráfico, no para programar ni compilar. Las pantallas se construyen en Android Studio.',
      },
      {
        t: 'Con el Bloc de notas, que es más rápido.',
        g: 'bad',
        reply: '¿Y así se puede probar y armar la app completa?',
        mentor: 'Un editor básico no compila, no incluye emulador ni gestiona librerías. Para eso existe un IDE como Android Studio.',
      },
      {
        t: 'Con Android Studio, que es gratuito y es el oficial.',
        v: 'Android Studio',
        g: 'ok',
        reply: '¡Gratuito! Eso me gusta.',
        mentor:
          'Android Studio es el IDE oficial de Google: reúne editor de código, vista previa de interfaces, emulador y el sistema Gradle en un solo lugar.',
      },
    ],
  },
  {
    spec: 'Permisos',
    topic: 'Subtema 1.4',
    ask: 'Una duda: ¿la app le va a pedir permiso a la gente para usar la cámara? No quiero problemas.',
    options: [
      {
        t: 'No hace falta, la cámara funciona sola.',
        g: 'bad',
        reply: 'Me contaron de apps que se cierran solas por cosas así…',
        mentor: 'Si el permiso no se declara y solicita adecuadamente, Android bloquea el acceso a la cámara y la función falla.',
      },
      {
        t: 'Lo configuro únicamente en Gradle.',
        g: 'bad',
        reply: 'No entiendo mucho, pero eso suena a otra cosa…',
        mentor: 'Gradle gestiona las librerías y compila el proyecto. Los permisos de la aplicación se declaran en AndroidManifest.xml.',
      },
      {
        t: 'Sí. Lo declaro en el archivo AndroidManifest.xml.',
        v: 'Cámara en AndroidManifest.xml',
        g: 'ok',
        reply: 'Qué tranquilidad, gracias.',
        mentor:
          'AndroidManifest.xml es el archivo de configuración central: declara permisos como cámara o internet, las Activities y la versión de Android requerida.',
      },
    ],
  },
  {
    spec: 'Pruebas',
    topic: 'Subtema 1.3',
    ask: '¿Cuándo me la mandas? ¡Ojalá hoy mismo!',
    options: [
      {
        t: 'Primero la pruebo en el emulador y reviso Logcat; luego te la envío.',
        v: 'Emulador (AVD) y Logcat',
        g: 'ok',
        reply: 'Bueno, prefiero esperar un poco y que llegue funcionando bien.',
        mentor:
          'El emulador de Android simula teléfonos en la computadora para probar la app antes de entregarla, usando Logcat para verificar que no haya errores.',
      },
      {
        t: 'Ya mismo, sin probarla, para ganar tiempo.',
        g: 'bad',
        reply: 'La abrí y se cerró enseguida. ¿Qué pasó?',
        mentor: 'Saltarse las pruebas rompe la confianza del cliente. El emulador permite detectar fallas antes de entregar.',
      },
      {
        t: 'La subo de una vez a Google Play para que todos la descarguen.',
        g: 'bad',
        reply: '¿Sin que yo la vea antes? Me da miedo que salga con errores.',
        mentor: 'Publicar sin probar expone los errores a todos los usuarios. Primero se valida en el emulador o en un teléfono de prueba.',
      },
    ],
  },
  {
    spec: 'Entrega',
    topic: 'Subtema 1.4',
    ask: 'Ya la quiero probar en mi celular. ¿Qué archivo me mandas para instalarla?',
    options: [
      {
        t: 'Los archivos .kt con el código fuente.',
        g: 'bad',
        reply: 'Me llegaron varios archivos de texto y ninguno instala nada…',
        mentor: 'Los archivos .kt contienen el código fuente: el teléfono no los instala directamente. Hay que compilarlos con Gradle.',
      },
      {
        t: 'Un archivo .exe.',
        g: 'bad',
        reply: 'Mi celular dice que no puede abrir ese formato.',
        mentor: 'El formato .exe corresponde a programas de Windows. Android instala paquetes con extensión .apk.',
      },
      {
        t: 'El archivo .apk compilado en Android Studio.',
        v: 'Paquete .apk',
        g: 'ok',
        reply: '¡Ya la instalé! Se ve excelente.',
        mentor:
          'El archivo .apk es el paquete instalable que genera Android Studio. Cuando decidas publicarla en Google Play usarás además el formato .aab.',
      },
    ],
  },
]

export const exam: QuizBank = {
  act: 'Actividad 1.5',
  title: 'Quiz de verificación final',
  lead: 'Evaluación de cierre del OVA. Cada pregunta representa una tarea de compilación sobre los cuatro subtemas estudiados.',
  meta: ['5 preguntas', '15 minutos', 'Nota sobre 5.0', 'Aprueba con 3.0'],
  steps: [
    'Elige una respuesta por pregunta. Puedes moverte entre preguntas y cambiar tus respuestas antes de entregar.',
    'Tienes 15 minutos. Si se acaba el tiempo, se califica lo que alcanzaste a marcar.',
    'Las preguntas sin responder cuentan como incorrectas.',
    'Al compilar y entregar verás tu nota sobre 5.0, la revisión detallada y, si apruebas, tu constancia simbólica.',
  ],
  code: 'val nota: Double = evaluar()',
  minutes: 15,
  instant: false,
  pass: 0.6,
  questions: [
    {
      q: '¿Qué empresa creó el lenguaje Kotlin y qué empresa lo adoptó oficialmente para Android?',
      opts: [
        'Microsoft lo creó y Apple lo adoptó.',
        'JetBrains lo creó y Google lo adoptó oficialmente.',
        'Google lo creó y Oracle lo adoptó.',
        'Facebook lo creó y Google lo adoptó.',
      ],
      correct: 1,
      why: 'Kotlin es obra de JetBrains, la misma empresa creadora de IntelliJ IDEA. Google lo declaró lenguaje oficial de Android en 2017.',
      topic: 'Subtema 1.2 · ¿Qué es Kotlin?',
    },
    {
      q: '¿Cuál de las siguientes es una característica propia del lenguaje Kotlin?',
      opts: [
        'Requiere escribir código extenso y complejo para tareas simples.',
        'Manejo seguro de nulos (Null Safety) e interoperabilidad con Java.',
        'Funciona únicamente en sistemas operativos Windows.',
        'No requiere compilación para ejecutarse en un teléfono.',
      ],
      correct: 1,
      why: 'Kotlin protege contra referencias nulas desde el sistema de tipos y puede convivir con código Java dentro del mismo proyecto.',
      topic: 'Subtema 1.2 · ¿Qué es Kotlin?',
    },
    {
      q: '¿Cuál es la función del archivo AndroidManifest.xml en un proyecto Android?',
      opts: [
        'Dibujar la interfaz de usuario con botones y colores.',
        'Declarar la configuración central, permisos y componentes de la app.',
        'Guardar las fotos tomadas por la cámara.',
        'Compilar el código Kotlin a lenguaje máquina.',
      ],
      correct: 1,
      why: 'El manifiesto registra los componentes de la app (como las Activities), los permisos que solicita (cámara, internet) y los requisitos del sistema.',
      topic: 'Subtema 1.4 · Elementos básicos de una app',
    },
    {
      q: '¿Qué herramienta dentro de Android Studio se utiliza para ejecutar y probar la aplicación en la computadora?',
      opts: ['Gradle.', 'Emulador de Android (AVD - Android Virtual Device).', 'Editor de texto.', 'Servidor Apache.'],
      correct: 1,
      why: 'El emulador simula teléfonos, tabletas o relojes en la computadora. Gradle compila el proyecto, pero no emula el dispositivo.',
      topic: 'Subtema 1.3 · ¿Qué es Android Studio?',
    },
    {
      q: '¿Qué ventaja principal tiene el desarrollo nativo frente al desarrollo híbrido?',
      opts: [
        'Utiliza un solo código web sin compilar para cualquier navegador.',
        'Ofrece un rendimiento óptimo y acceso completo a las funciones del dispositivo.',
        'No requiere realizar pruebas de software.',
        'Es más lento de ejecutar pero consume menos batería.',
      ],
      correct: 1,
      why: 'Al usar el lenguaje y las herramientas propias de Android, la app nativa aprovecha el hardware y las APIs del sistema con el mejor rendimiento.',
      topic: 'Subtema 1.1 · ¿Qué es el desarrollo móvil?',
    },
  ],
}

export type CycleStation = {
  g: string
  t: string
  s: string
  h: string
  p: string
  fileCode?: string
  fileLabel: string
  tema: string
  act: string
}

export const ST: CycleStation[] = [
  {
    g: 'idea',
    t: 'La idea',
    s: 'Una necesidad',
    h: 'Todo empieza con un problema real que resolver',
    p: 'Antes de programar decides qué hará la app y para quién. Como debe usar la cámara y funcionar fluido en Android, eliges el desarrollo nativo.',
    fileLabel: 'Requisitos de la app',
    tema: 'Subtema 1.1 · ¿Qué es el desarrollo móvil?',
    act: 'Actividad 1.4 · Tu primer cliente',
  },
  {
    g: '.kt',
    t: 'Código Kotlin',
    s: 'La lógica',
    h: 'Escribes la lógica y los datos en Kotlin',
    p: 'Kotlin es el lenguaje preferido por Google para Android. Es conciso, previene errores por valores nulos (Null Safety) y convive con Java.',
    fileCode: 'MainActivity.kt',
    fileLabel: '',
    tema: 'Subtema 1.2 · ¿Qué es Kotlin?',
    act: 'Actividad 1.2 · ¡Conectados!',
  },
  {
    g: 'IDE',
    t: 'Android Studio',
    s: 'El taller',
    h: 'Construyes en Android Studio',
    p: 'En el IDE organizas el proyecto, escribes el código, diseñas la interfaz con vista previa y declaras componentes y permisos en el manifiesto.',
    fileCode: 'AndroidManifest.xml',
    fileLabel: ' y la interfaz',
    tema: 'Subtema 1.3 · Android Studio',
    act: 'Actividad 1.3 · Mapa de Android Studio',
  },
  {
    g: 'build',
    t: 'Gradle compila',
    s: 'La construcción',
    h: 'Gradle convierte el proyecto en una aplicación',
    p: 'Al pulsar Ejecutar, Gradle reúne el código, los recursos y las librerías, y compila el proyecto. Si hay errores, los informa antes de instalar.',
    fileCode: 'build.gradle.kts',
    fileLabel: '',
    tema: 'Subtema 1.3 · Android Studio',
    act: 'Actividad 1.5 · Quiz final',
  },
  {
    g: '.apk',
    t: 'Paquete APK',
    s: 'El instalable',
    h: 'El resultado es un paquete instalable',
    p: 'La compilación genera el archivo .apk que se instala en un dispositivo Android. Para publicar en Google Play se emplea además el formato .aab.',
    fileCode: 'app-release.apk',
    fileLabel: '',
    tema: 'Subtema 1.4 · Elementos básicos de una app',
    act: 'Actividad 1.5 · Quiz final',
  },
  {
    g: 'AVD',
    t: 'Emulador',
    s: 'La prueba',
    h: 'Pruebas y depuras la app antes de entregarla',
    p: 'El emulador simula un teléfono en tu computador. Si algo falla, lo observas en Logcat, vuelves al código, corriges y compilas de nuevo hasta que quede lista.',
    fileLabel: 'Running Devices y Logcat',
    tema: 'Subtema 1.3 · Android Studio',
    act: 'Actividad 1.1 · Diagnóstico',
  },
]
