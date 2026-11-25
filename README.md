<div align="center">

# Kotlin Lab

**Primeros pasos en el desarrollo móvil con Kotlin**

Objeto Virtual de Aprendizaje · Android · Proyecto académico del equipo SJD

[Recorrido](#recorrido) · [Inicio rápido](#inicio-rápido) · [Estructura](#estructura-del-proyecto) · [Créditos](#créditos)

</div>

---

## ¿Qué es Kotlin Lab?

Una experiencia de aprendizaje autónomo para quienes están dando sus primeros pasos en Android. El curso presenta el ecosistema móvil, Kotlin y Android Studio, y lleva esos conceptos a un encargo concreto: ayudar a Marta, de la Panadería La Espiga, a diseñar una aplicación para recibir pedidos.

El recorrido combina lecciones, un pódcast de bienvenida, actividades interactivas y una evaluación. Se puede abrir cada sección desde el menú lateral o seguir los botones **Anterior** y **Siguiente**. Reserva unos **50 minutos** como referencia. Puedes dividir el curso en varias sesiones.

## Objetivos de aprendizaje

Al terminar el recorrido podrás:

- Distinguir las restricciones de una app móvil y justificar cuándo usar un enfoque nativo, multiplataforma o híbrido.
- Leer ejemplos sencillos en Kotlin y reconocer cómo se controla la ausencia de un valor.
- Explicar para qué sirven el editor, Gradle, el emulador y Logcat en Android Studio.
- Relacionar los conceptos de interfaz, manifiesto y APK con las etapas de un proyecto.
- Tomar decisiones sobre permisos, pruebas y entrega a partir de un caso práctico.

## Recorrido

1. **Contextualización.** Introducción animada, pódcast de bienvenida, metodología, contenidos y referentes.
2. **Lecciones.** Desarrollo móvil, Kotlin y Android Studio. El recorrido pasa de Android Studio al diagnóstico.
3. **Diagnóstico.** Cinco preguntas sin nota para identificar los temas que conviene reforzar antes de las prácticas.
4. **Práctica.** Une conceptos en **¡Conectados!**, explora el IDE con el **Mapa de Android Studio** y responde a Marta en el **Escenario**.
5. **Evaluación y cierre.** Resuelve el **Quiz final**, explora el **ciclo de desarrollo** y compara los resultados con los del diagnóstico.

Cada taller tiene un objetivo, instrucciones y un bloque **Para recordar**. El progreso distingue las lecciones marcadas como revisadas de las actividades completadas.

## Inicio rápido

Necesitas **Git**, **npm** y **Node.js 22.12 o posterior**. También puedes usar Node.js 20.19 dentro de la rama 20.

```bash
git clone https://github.com/Andre3243/OVA-KOTLIN-RE-build.git
cd OVA-KOTLIN-RE-build
npm ci
npm run dev
```

Abre la dirección que imprime Vite. Desde la portada puedes explorar la ruta guía o entrar a la introducción.

### Compilar y comprobar la versión de producción

```bash
npm run build
npm run preview
```

El resultado de la compilación queda en `dist/`. El proyecto funciona como un sitio estático y no requiere base de datos ni claves de acceso.

## Estructura del proyecto

- [`src/Course.tsx`](src/Course.tsx) conecta las rutas, el menú lateral y el seguimiento del recorrido.
- [`src/Landing.tsx`](src/Landing.tsx) y [`src/PreCourse.tsx`](src/PreCourse.tsx) contienen la portada y la introducción animada.
- [`src/LearningUI.tsx`](src/LearningUI.tsx) reúne el indicador de lectura, las tarjetas, los acordeones y la navegación entre secciones.
- [`src/content/`](src/content/) contiene el mapa de navegación, los módulos y las instrucciones para los talleres.
- [`public/talleres/`](public/talleres/) contiene las seis actividades originales integradas en React.
- [`public/media/`](public/media/) contiene el pódcast de bienvenida y las fuentes que usa la interfaz.

## Tecnología y decisiones de diseño

- **React, TypeScript y Vite** para la interfaz y la compilación.
- **React Router** con rutas hash para navegar en un sitio estático.
- **Framer Motion (`motion/react`)** para transiciones, apariciones al desplazar y respuesta visual de los controles. Se respeta la preferencia de movimiento reducido del sistema.
- **Lucide React** para los iconos de navegación y de los bloques pedagógicos.
- **`localStorage`** conserva el avance, los resultados del diagnóstico y el quiz y la última sección visitada en el navegador. El progreso no se sincroniza entre dispositivos.

## Créditos

**Equipo SJD** · Sebastian Cufi, Deimy Vanegas y Jhonny Acosta.

Los referentes técnicos y las lecturas recomendadas están en la sección **Referentes** del OVA.
