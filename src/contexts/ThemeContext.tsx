'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Only run on client side
    const stored = localStorage.getItem('theme') as Theme
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    let initialTheme: Theme = 'light'
    if (stored === 'dark' || stored === 'light') {
      initialTheme = stored
    } else if (systemPrefersDark) {
      initialTheme = 'dark'
    }
    
    setTheme(initialTheme)
    updateDOM(initialTheme)
  }, [])

  const updateDOM = (newTheme: Theme) => {
    const root = document.documentElement
    console.log('updateDOM called with theme:', newTheme)
    console.log('HTML element before update:', root.className)
    
    if (newTheme === 'dark') {
      root.classList.add('dark')
      console.log('Added dark class')
    } else {
      root.classList.remove('dark')
      console.log('Removed dark class')
    }
    
    console.log('HTML element after update:', root.className)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('Toggle clicked! Changing from', theme, 'to', newTheme)
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    updateDOM(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}