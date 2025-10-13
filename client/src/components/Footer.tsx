import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`
      transition-colors duration-500
      ${theme === 'light' 
        ? 'bg-gray-900 text-white' 
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
              <h3 className="text-2xl font-bold text-white">EliteDrive</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your premier car rental service offering luxury, reliability, and unmatched customer experience since 2010.
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
                      ? 'bg-gray-800 hover:bg-blue-600' 
                      : 'bg-gray-800 hover:bg-blue-500'
                    }
                  `}
                >
                  <span className="text-white text-sm">
                    {social === 'facebook' && '📘'}
                    {social === 'twitter' && '🐦'}
                    {social === 'instagram' && '📷'}
                    {social === 'linkedin' && '💼'}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'FAQ', path: '/faq' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

    
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-6">Our Services</h4>
            <ul className="space-y-3">
              {[
                'Luxury Car Rental',
                'SUV & Family Cars',
                'Business Rentals',
                'Long Term Leasing',
                'Airport Pickup',
                '24/7 Roadside Assistance'
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2 cursor-pointer">
                    <span>🚗</span>
                    <span>{service}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📍</span>
                </div>
                <div>
                  <p className="text-gray-400">123 Drive Street</p>
                  <p className="text-gray-400">City, State 12345</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📞</span>
                </div>
                <div>
                  <p className="text-gray-400">(555) 123-4567</p>
                  <p className="text-gray-400">24/7 Support</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✉️</span>
                </div>
                <div>
                  <p className="text-gray-400">info@elitedrive.com</p>
                  <p className="text-gray-400">bookings@elitedrive.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`
            rounded-2xl p-8 mb-12
            ${theme === 'light' 
              ? 'bg-gray-800' 
              : 'bg-gray-900'
            }
          `}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <h4 className="text-2xl font-bold text-white mb-2">
                Stay Updated with EliteDrive
              </h4>
              <p className="text-gray-400">
                Get exclusive deals, new vehicle announcements, and travel tips delivered to your inbox.
              </p>
            </div>
            <div className="lg:w-1/2 flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className={`
                  flex-1 px-4 py-3 rounded-xl border transition-colors duration-300
                  ${theme === 'light'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400'
                  }
                `}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-gray-400 text-sm mb-4 md:mb-0"
            >
              © {currentYear} EliteDrive Car Rental. All rights reserved.
            </motion.p>
            
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  whileHover={{ scale: 1.05, color: '#60A5FA' }}
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300"
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
          fixed bottom-6 right-6 z-50
          ${theme === 'light' 
            ? 'bg-white shadow-2xl' 
            : 'bg-gray-800 shadow-2xl'
          }
          rounded-2xl p-4 border
          ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}
        `}
      >
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💬</span>
            </div>
          </div>
          <div>
            <p className={`
              font-semibold text-sm
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>
              Need Help?
            </p>
            <p className={`
              text-xs
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              Chat with us 24/7
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-white text-sm
              bg-gradient-to-r from-blue-600 to-cyan-500
            `}
          >
            →
          </motion.button>
        </div>
      </motion.div>
    </footer>
  );
}