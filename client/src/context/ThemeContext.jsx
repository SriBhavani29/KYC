import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Default to pure 'light' mode as requested
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('kyc_ops_theme');
    // If user previously set dark mode or old session, reset to light
    if (saved === 'dark') {
      localStorage.setItem('kyc_ops_theme', 'light');
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('kyc_ops_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

