import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';

export default function Footer() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`
      transition-colors duration-500
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 border-t border-gray-200' 
        : 'bg-gray-950 text-gray-300'
      }
    `}>
      <div className="max-w-7xl mx-auto px-6 py-16">
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
     
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/pppp.png"
                alt="EliteDrive Logo"
                className="h-12 w-auto"
              />
              <h3 className={`
                text-2xl font-bold
                ${theme === 'light' ? 'text-gray-900' : 'text-white'}
              `}>EliteDrive</h3>
            </div>
            <p className={`
              mb-6 leading-relaxed
              ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}
            `}>
              {t('footer.company')}
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${theme === 'light' 
                      ? 'bg-white shadow-lg border border-gray-200 hover:bg-blue-500 hover:text-white hover:shadow-xl' 
                      : 'bg-gray-800 hover:bg-blue-500 text-white'
                    }
                  `}
                >
                  <span className="text-sm">
                    {social === 'facebook' && '📘'}
                    {social === 'twitter' && '🐦'}
                    {social === 'instagram' && '📷'}
                    {social === 'linkedin' && '💼'}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className={`
              text-lg font-semibold mb-6
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {[
                { name: t('nav.home'), path: '/' },
                { name: t('nav.services'), path: '/services' },
                { name: t('nav.about'), path: '/about' },
                { name: t('nav.contact'), path: '/contact' },
                { name: t('footer.faq'), path: '/faq' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`
                      transition-colors duration-300 flex items-center space-x-2
                      ${theme === 'light' 
                        ? 'text-gray-600 hover:text-blue-600' 
                        : 'text-gray-400 hover:text-blue-400'
                      }
                    `}
                  >
                    <span className={`
                      transition-colors duration-300
                      ${theme === 'light' ? 'text-blue-500' : 'text-cyan-400'}
                    `}>→</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className={`
              text-lg font-semibold mb-6
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>{t('footer.services')}</h4>
            <ul className="space-y-3">
              {[
                t('services.luxury'),
                t('services.suv'),
                t('services.business'),
                t('services.leasing'),
                t('services.airport'),
                t('services.assistance')
              ].map((service) => (
                <li key={service}>
                  <span className={`
                    transition-colors duration-300 flex items-center space-x-2 cursor-pointer
                    ${theme === 'light' 
                      ? 'text-gray-600 hover:text-blue-600' 
                      : 'text-gray-400 hover:text-blue-400'
                    }
                  `}>
                    <span className={`
                      transition-colors duration-300
                      ${theme === 'light' ? 'text-yellow-500' : 'text-yellow-300'}
                    `}>🚗</span>
                    <span>{service}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className={`
              text-lg font-semibold mb-6
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>{t('footer.contact')}</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300
                  ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-blue-500'}
                `}>
                  <span className="text-sm">📍</span>
                </div>
                <div>
                  <p className={`
                    ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}
                  `}>123 Drive Street</p>
                  <p className={`
                    ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}
                  `}>City, State 12345</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300
                  ${theme === 'light' ? 'bg-green-500 text-white' : 'bg-green-500'}
                `}>
                  <span className="text-sm">📞</span>
                </div>
                <div>
                  <p className={`
                    ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}
                  `}>(555) 123-4567</p>
                  <p className={`
                    ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}
                  `}>{t('footer.support247')}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300
                  ${theme === 'light' ? 'bg-purple-500 text-white' : 'bg-purple-500'}
                `}>
                  <span className="text-sm">✉️</span>
                </div>
                <div>
                  <p className={`
                    ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}
                  `}>info@elitedrive.com</p>
                  <p className={`
                    ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}
                  `}>bookings@elitedrive.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`
            rounded-2xl p-8 mb-12 border transition-all duration-500
            ${theme === 'light' 
              ? 'bg-white shadow-lg border-gray-200' 
              : 'bg-gray-900 border-gray-800'
            }
          `}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <h4 className={`
                text-2xl font-bold mb-2
                ${theme === 'light' ? 'text-gray-900' : 'text-white'}
              `}>
                {t('footer.newsletter.title')}
              </h4>
              <p className={`
                ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}
              `}>
                {t('footer.newsletter.subtitle')}
              </p>
            </div>
            <div className="lg:w-1/2 flex space-x-4">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className={`
                  flex-1 px-4 py-3 rounded-xl border-2 transition-colors duration-300
                  ${theme === 'light'
                    ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:shadow-lg'
                    : 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-700'
                  }
                `}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-6 py-3 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg
                  ${theme === 'light'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500'
                  }
                `}
              >
                {t('footer.newsletter.button')}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className={`
          border-t pt-8 transition-colors duration-500
          ${theme === 'light' ? 'border-gray-300' : 'border-gray-700'}
        `}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={`
                text-sm mb-4 md:mb-0
                ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
              `}
            >
              © {currentYear} EliteDrive Car Rental. {t('footer.rights')}
            </motion.p>
            
            <div className="flex space-x-6">
              {[
                t('footer.privacy'),
                t('footer.terms'),
                t('footer.cookies')
              ].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  className={`
                    text-sm transition-colors duration-300
                    ${theme === 'light' 
                      ? 'text-gray-600 hover:text-blue-600' 
                      : 'text-gray-500 hover:text-cyan-400'
                    }
                  `}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={`
          fixed bottom-6 right-6 z-50 transition-all duration-500 shadow-2xl
          ${theme === 'light' 
            ? 'bg-white border border-gray-200' 
            : 'bg-gray-800 border-gray-700'
          }
          rounded-2xl p-4
        `}
      >
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300
              ${theme === 'light' ? 'bg-green-500' : 'bg-green-400'}
            `}>
              <span className="text-white text-sm">💬</span>
            </div>
          </div>
          <div>
            <p className={`
              font-semibold text-sm transition-colors duration-300
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>
              {t('footer.help.title')}
            </p>
            <p className={`
              text-xs transition-colors duration-300
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              {t('footer.help.subtitle')}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-white text-sm transition-all duration-300 shadow-lg
              ${theme === 'light'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500'
              }
            `}
          >
            →
          </motion.button>
        </div>
      </motion.div>
    </footer>
  );
}