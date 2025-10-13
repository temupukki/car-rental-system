import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative p-3 rounded-2xl transition-all duration-300
        ${theme === 'light' 
          ? 'bg-gray-100 text-yellow-500 hover:bg-gray-200 border border-gray-300' 
          : 'bg-gray-800 text-blue-300 hover:bg-gray-700 border border-gray-600'
        }
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'light' ? 0 : 180,
          scale: theme === 'light' ? 1 : 0.8
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        className="text-xl"
      >
        {theme === 'light' ? '☀️' : '🌙'}
      </motion.div>
      
      
      <motion.div
        className={`
          absolute inset-0 rounded-2xl -z-10
          ${theme === 'light' 
            ? 'bg-gradient-to-br from-yellow-100 to-orange-100' 
            : 'bg-gradient-to-br from-blue-900 to-purple-900'
          }
        `}
        initial={false}
        animate={{ opacity: theme === 'light' ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}