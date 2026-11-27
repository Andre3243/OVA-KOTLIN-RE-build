<div align="center">

# Kotlin Lab

**Primeros pasos en el desarrollo móvil con Kotlin**

Objeto Virtual de Aprendizaje · Android · Proyecto académico del equipo SJD

[Recorrido](#recorrido) · [Inicio rápido](#inicio-rápido) · [Estructura](#estructura-del-proyecto) · [Créditos](#créditos)

</div>

---

## ¿Qué es Kotlin Lab?

Una experiencia de aprendizaje autónomo para quienes están dando sus primeros pasos en Android. El curso presenta el ecosistema móvil, Kotlin y Android Studio, y lleva esos conceptos a un encargo concreto: ayudar a Marta, de la Panadería La Espiga, a diseñar una aplicación para recibir pedidos.

El recorrido combina lecciones interactivas, video introductorio, un pódcast de bienvenida con control de velocidad y transcripción, seis talleres nativos en React y una evaluación final. Incluye **Modo oscuro** y **Modo claro**, y se puede recorrer desde el menú lateral o siguiendo los botones **Anterior** y **Siguiente** (~**50 minutos** de referencia en una o varias sesiones).

## Objetivos de aprendizaje

Al terminar el recorrido podrás:

- Distinguir las restricciones de una app móvil y justificar cuándo usar un enfoque nativo, multiplataforma o híbrido.
- Leer ejemplos sencillos en Kotlin, compararlos frente a Java y reconocer cómo se controla la ausencia de un valor (`Null Safety`).
- Explicar para qué sirven el editor, Gradle, el emulador y Logcat en Android Studio, así como las diferencias entre Jetpack Compose y XML.
- Relacionar los conceptos de `Activity`, interfaz, `AndroidManifest.xml` y paquete `.apk` con las etapas de un proyecto.
- Tomar decisiones sobre permisos, pruebas y entrega a partir de un caso práctico.

## Recorrido

1. **Contextualización.** Introducción con video y pódcast accesible, metodología con competencias y tiempos, mapa de contenidos y 11 referentes en formato APA.
2. **Lecciones.** Desarrollo móvil (1.1), Kotlin frente a Java y línea de tiempo (1.2), y Android Studio + elementos básicos de una app (1.3 y 1.4).
3. **Diagnóstico.** Cinco preguntas sin nota dentro de un emulador Android con consola Logcat en vivo.
4. **Práctica.** Une conceptos en **¡Conectados!**, explora el IDE en **Mapa de Android Studio** y asesora a Marta en el **Escenario**.
5. **Evaluación y cierre.** Compila el **Quiz final** con constancia simbólica de APK firmada, recorre el **ciclo de una app Android** y compara tus resultados con el diagnóstico.

Cada taller incluye su objetivo, instrucciones y un bloque **Para recordar**.

## Inicio rápido

Necesitas **Git**, **npm** y **Node.js 22.12 o posterior** (o Node.js 20.19+).

```bash
git clone https://github.com/Andre3243/OVA-KOTLIN-RE-build.git
cd OVA-KOTLIN-RE-build
npm ci
npm run dev
```

Abre la dirección local que imprime Vite (`http://localhost:5173/`).

### Compilar y comprobar la versión de producción

```bash
npm run lint
npm run build
npm run preview
```

El resultado de la compilación queda en `dist/` con rutas relativas listas para alojarse en GitHub Pages o cualquier servidor estático.

## Estructura del proyecto

- [`src/Course.tsx`](src/Course.tsx) conecta las rutas, las lecciones ampliadas, el menú lateral y las transiciones entre vistas.
- [`src/Landing.tsx`](src/Landing.tsx) y [`src/PreCourse.tsx`](src/PreCourse.tsx) contienen la portada interactiva con editor en vivo y storyboard previo.
- [`src/Guide.tsx`](src/Guide.tsx) presenta la contextualización, reproductores multimedia y bibliografía APA.
- [`src/workshops/`](src/workshops/) contiene los seis talleres interactivos migrados nativamente a componentes React accesibles.
- [`src/LearningUI.tsx`](src/LearningUI.tsx) y [`src/themeContext.tsx`](src/themeContext.tsx) reúnen animaciones progresivas, tarjetas, acordeones y el selector de **Modo claro / Modo oscuro**.
- [`src/content/`](src/content/) contiene los módulos teóricos, bancos de preguntas, guía de talleres y metadatos multimedia.
- [`public/media/`](public/media/) contiene el pódcast de bienvenida y las tipografías locales (`Atkinson Hyperlegible`, `Unbounded` y `JetBrains Mono`).

## Créditos

- **Equipo SJD (Autores):** Sebastian Cufi, Deimy Vanegas y Jhonny Acosta.
- **Experto temático:** Franklin Albeiro Gomez Mendoza.
- **Diseñador instruccional y asesor pedagógico:** Raul Rodriguez.

Los referentes técnicos y lecturas recomendadas se encuentran en la sección **Referentes** del OVA.
