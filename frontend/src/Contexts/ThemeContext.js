// ThemeContext.js
import React, { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getLPTheme from '../Pages/LandingPage/getLPTheme';


const ThemeContext = createContext({
  mode: 'dark',
  showCustomTheme: false,
  toggleColorMode: () => {},
  toggleCustomTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');
  const [showCustomTheme, setShowCustomTheme] = useState(false);

  const LPtheme = useMemo(() => createTheme(getLPTheme(mode)), [mode]);
  const defaultTheme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const value = {
    mode,
    showCustomTheme,
    toggleColorMode,
    toggleCustomTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
