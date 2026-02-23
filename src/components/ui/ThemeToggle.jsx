import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-all duration-300 focus:outline-none 
                 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-yellow-400
                 hover:shadow-lg active:scale-95"
      title="Toggle Theme"
    >
      {/* Agar Dark hai to Sun dikhao, agar Light hai to Moon dikhao */}
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;