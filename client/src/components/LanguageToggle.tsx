import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };
  const isEnglish = language === "en";
  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        relative h-10 px-3 rounded-full flex items-center justify-center 
        font-bold text-lg uppercase transition-colors duration-300
        
        // Style based on current language for visual feedback (e.g., color)
        ${
          isEnglish
            ? "text-blue-600  dark:text-blue-400 dark:hover:bg-gray-800" 
            : "text-green-600  dark:text-green-400 dark:hover:bg-gray-800" 
        }
      `}
      aria-label={`Switch to ${isEnglish ? "Amharic" : "English"}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={language}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute"
        >
          {isEnglish ? "EN" : "አማ"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
