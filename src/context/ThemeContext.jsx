import React, { createContext, useState, useEffect, useContext } from 'react';

// Context Create karein
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // LocalStorage se theme check karo, agar nahi hai to 'dark' default rakhlo
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  // Jab bhi theme badle, HTML tag par class update karo
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Purani class hatao aur nayi lagao
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // LocalStorage me save karo taki refresh hone par yaad rahe
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook taki hum components me easily use kar sakein
export const useTheme = () => useContext(ThemeContext);