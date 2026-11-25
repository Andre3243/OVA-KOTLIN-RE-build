export const workshopGuide: Record<string, {
  objective: string
  instructions: string[]
  takeaway: string
}> = {
  'actividad-1-1-diagnostico': {
    objective: 'Identificar tus conocimientos previos sobre desarrollo móvil, Kotlin y Android Studio. El resultado no suma a tu nota.',
    instructions: [
      'Pulsa Comenzar en el emulador. Desde ese momento tienes 10 minutos.',
      'Elige una opción por pregunta. La respuesta se registra en Logcat y no se puede cambiar.',
      'Lee la explicación y pulsa Siguiente hasta responder las cinco preguntas.',
      'Revisa el resultado y anota los temas que te conviene reforzar.',
    ],
    takeaway: 'Usa el diagnóstico como punto de partida. Anota los conceptos que quieres reforzar mientras practicas y vuelve a ellos antes del quiz final.',
  },
  'actividad-1-2-pareo': {
    objective: 'Relacionar cinco conceptos del ecosistema Android con la función que cumplen en un proyecto.',
    instructions: [
      'Encuentra los términos a la izquierda y sus definiciones a la derecha.',
      'Arrastra de un término a su definición. Si usas una pantalla táctil, también puedes tocar el término y luego la definición.',
      'Toca una definición conectada para soltar el cable y elegir otra.',
      'Con las cinco conexiones listas, pulsa Comprobar. Las correctas se marcan en verde y las que hay que revisar, en rojo.',
      'Pulsa Soltar las incorrectas y prueba otra vez hasta acertar las cinco.',
    ],
    takeaway: 'Kotlin aporta el lenguaje, Android Studio reúne las herramientas, la interfaz permite interactuar, el manifiesto define componentes y permisos, y el APK instala la app. En el mapa verás dónde se trabaja con estas piezas.',
  },
  'actividad-1-3-mapa': {
    objective: 'Identificar seis zonas de Android Studio y explicar cuándo se usa cada una.',
    instructions: [
      'Pulsa Comenzar recorrido y lee la consigna de la barra superior.',
      'Selecciona la zona correspondiente. Si aciertas, el reflector te muestra qué hace ese panel.',
      'Si seleccionas otra zona, usa Ver pista o vuelve a intentarlo. Tras dos errores, aparece una pista.',
      'Avanza con Siguiente o Enter. Después de seis consignas, explora las zonas numeradas para repasar.',
      'En pantallas pequeñas, desliza dentro del esquema si necesitas ver toda la ventana.',
    ],
    takeaway: 'El explorador organiza, el editor permite programar y la vista previa muestra el diseño. Ejecuta la app en el emulador y consulta Logcat para entender qué pasó durante la prueba.',
  },
  'actividad-1-4-escenario': {
    objective: 'Aplicar lo aprendido para tomar decisiones sobre una app de pedidos: enfoque, lenguaje, herramientas, permisos, pruebas y entrega.',
    instructions: [
      'Lee el mensaje de Marta y responde cada una de sus seis preguntas.',
      'Consulta su reacción y la nota del mentor para entender las consecuencias.',
      'Si necesitas replantear la decisión, pulsa Elegir otra opción y vuelve a intentarlo.',
      'Al final, revisa la ficha del proyecto para distinguir los aciertos iniciales de las decisiones corregidas.',
    ],
    takeaway: 'Las decisiones que corregiste indican qué conviene repasar. Antes de la evaluación, explica cómo usarías la cámara, en qué dispositivo probarías la app y qué archivo entregarías.',
  },
  'actividad-1-5-quiz-final': {
    objective: 'Comprobar lo que aprendiste sobre desarrollo móvil, Kotlin, Android Studio y los componentes de una app.',
    instructions: [
      'Pulsa Ejecutar quiz. Tienes 15 minutos para responder cinco preguntas.',
      'Elige una opción por pregunta. Navega con Anterior, Siguiente o la lista de tareas. Puedes cambiar la respuesta hasta entregar.',
      'Pulsa Compilar y entregar y confirma. Las preguntas sin responder cuentan como incorrectas.',
      'Consulta las explicaciones en el panel Problems. Si apruebas, puedes generar tu constancia en la simulación.',
    ],
    takeaway: 'Revisa el resultado como revisarías una compilación: cada error te indica dónde volver a mirar. Cuando termines, compara tus resultados y elige qué aprender o practicar después.',
  },
  'conclusiones-ciclo': {
    objective: 'Explicar el ciclo de desarrollo de una aplicación Android y reconocer tu progreso desde el diagnóstico.',
    instructions: [
      'Explora cada etapa del ciclo, desde la idea hasta las pruebas.',
      'Lee qué herramienta o archivo interviene en cada etapa.',
      'Al final, compara tus resultados y responde las preguntas de reflexión.',
    ],
    takeaway: 'Una primera app es una oportunidad para repetir el ciclo completo. Crea un proyecto sencillo, ejecútalo en el emulador y usa Logcat para observar qué ocurre.',
  },
}
