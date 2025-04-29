import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ThemeMode = 'system' | 'manual';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setThemeMode: (mode: ThemeMode) => void;
  systemTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get system theme preference
  const getSystemTheme = (): Theme => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  // Get initial theme mode (system or manual)
  const getInitialThemeMode = (): ThemeMode => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    return savedMode === 'manual' ? 'manual' : 'system';
  };

  // Get initial theme based on mode and preferences
  const getInitialTheme = (): Theme => {
    const mode = getInitialThemeMode();

    if (mode === 'system') {
      return getSystemTheme();
    }

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      return savedTheme;
    }

    return 'light';
  };

  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme());
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getInitialThemeMode());
  const [theme, setThemeState] = useState<Theme>(getInitialTheme());

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);

      if (themeMode === 'system') {
        setThemeState(newSystemTheme);
      }
    };

    // Add event listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [themeMode]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove previous theme class
    root.classList.remove('light-theme', 'dark-theme');

    // Add current theme class
    root.classList.add(`${theme}-theme`);

    // Store theme preference in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Set theme mode with side effects
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);

    if (mode === 'system') {
      setThemeState(systemTheme);
    }
  };

  // Set theme with side effects
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setThemeModeState('manual');
    localStorage.setItem('themeMode', 'manual');
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themeMode,
      systemTheme,
      toggleTheme,
      setTheme,
      setThemeMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
