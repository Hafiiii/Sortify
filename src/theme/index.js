import { createContext, useContext } from 'react';
import palette from './palette';

const ThemeContext = createContext();

const theme = {
  palette,
};

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
