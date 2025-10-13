import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 border
        ${language === 'en' 
          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
          : 'bg-green-600 text-white border-green-600 hover:bg-green-700'
        }
      `}
      aria-label={`Switch to ${language === 'en' ? 'Amharic' : 'English'}`}
    >
      {language === 'en' ? 'EN' : 'አማ'}
    </motion.button>
  );
}