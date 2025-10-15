'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from '@/components/icons';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
    >
      {theme === 'light' ? (
        <Moon className="h-6 w-6 text-gray-800" />
      ) : (
        <Sun className="h-6 w-6 text-yellow-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}