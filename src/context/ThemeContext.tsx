import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'warm';
type ThemeMode = Theme | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  activeTheme: Theme; // The actual applied theme (resolved from system)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'tic-tac-toe-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return (saved as ThemeMode) || 'system';
  });

  const [activeTheme, setActiveTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function applyTheme() {
      let resolvedTheme: Theme;

      if (theme === 'system') {
        resolvedTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        resolvedTheme = theme;
      }

      root.setAttribute('data-theme', resolvedTheme);
      setActiveTheme(resolvedTheme);
    }

    applyTheme();

    // Listener for system changes
    const handleChange = () => {
      if (theme === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Persist preference
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme, activeTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
