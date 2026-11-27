import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { gentleHover, gentleTap, silkEase, springTransition } from './motionPresets'

export type ThemeMode = 'dark' | 'light'

type ThemeContextValue = {
  theme: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
})

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  try {
    const saved = localStorage.getItem('ruta.tema')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Continúa con modo oscuro predeterminado si el almacenamiento está restringido.
  }
  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('ruta.tema', theme)
    } catch {
      // Silencioso si localStorage no está disponible.
    }
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeToggle({ compactLabel = false }: { compactLabel?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <motion.button
      type="button"
      className="themeToggleBtn"
      onClick={toggleTheme}
      aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      title={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      transition={springTransition}
      whileHover={gentleHover}
      whileTap={gentleTap}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="themeToggleIcon"
          initial={{ opacity: 0, rotate: -35, scale: 0.75 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 35, scale: 0.75 }}
          transition={{ duration: 0.24, ease: silkEase }}
        >
          {isLight ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
      <span className={compactLabel ? 'themeToggleText is-compact' : 'themeToggleText'}>
        {isLight ? 'Modo oscuro' : 'Modo claro'}
      </span>
    </motion.button>
  )
}
