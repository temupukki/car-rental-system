import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        relative w-10 h-10 rounded-full flex items-center justify-center 
        transition-colors duration-300 p-1.5 // Reduced size and padding
        
        // No complex background or borders, just hover effects
        ${
          isLight
            ? "text-gray-700 hover:bg-gray-200"
            : "text-gray-300 hover:bg-gray-700"
        }
      `}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="w-full h-full flex items-center justify-center"
        >
          {isLight ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
