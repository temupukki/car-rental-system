import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  id: number;
  name: string;
  href: string;
  icon?: string;
}

const navLinks: NavLink[] = [
  { id: 1, name: "Home", href: "/", icon: "🏠" },
  { id: 2, name: "Fleet", href: "/fleet", icon: "🚗" },
  { id: 3, name: "Services", href: "/services", icon: "🔧" },
  { id: 4, name: "Deals", href: "/deals", icon: "💰" },
  { id: 5, name: "About", href: "/about", icon: "ℹ️" },
  { id: 6, name: "Contact", href: "/contact", icon: "📞" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (href: string) => location.pathname === href;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 120, 
        damping: 20,
        duration: 0.8
      }}
      className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                <motion.span 
                  className="text-2xl"
                  whileHover={{ scale: 1.2 }}
                >
                  🚘
                </motion.span>
              </motion.div>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                EliteDrive
              </h1>
              <p className="text-xs text-gray-500 font-medium">Premium Rentals</p>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link
                  to={link.href}
                  className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 group ${
                    isActiveLink(link.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </span>
                  
                  {/* Active Indicator */}
                  {isActiveLink(link.href) && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-blue-200 rounded-full opacity-0 group-hover:opacity-100"
                    initial={false}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            ))}
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px -10px rgba(37, 99, 235, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Now
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <motion.div
              animate={isMenuOpen ? "open" : "closed"}
              variants={{
                open: { rotate: 90 },
                closed: { rotate: 0 }
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <motion.span
                  className="w-full h-0.5 bg-gray-700 rounded-full"
                  variants={{
                    open: { rotate: 45, y: 6 },
                    closed: { rotate: 0, y: 0 }
                  }}
                />
                <motion.span
                  className="w-full h-0.5 bg-gray-700 rounded-full"
                  variants={{
                    open: { opacity: 0 },
                    closed: { opacity: 1 }
                  }}
                />
                <motion.span
                  className="w-full h-0.5 bg-gray-700 rounded-full"
                  variants={{
                    open: { rotate: -45, y: -6 },
                    closed: { rotate: 0, y: 0 }
                  }}
                />
              </div>
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-6 border-t border-gray-200">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-4 rounded-2xl font-medium transition-all duration-200 ${
                          isActiveLink(link.href)
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "text-gray-700 hover:bg-gray-50 hover:border-gray-200 border border-transparent"
                        }`}
                      >
                        <span className="text-xl">{link.icon}</span>
                        <span>{link.name}</span>
                        {isActiveLink(link.href) && (
                          <motion.div
                            className="w-2 h-2 bg-blue-600 rounded-full ml-auto"
                            layoutId="mobileActiveIndicator"
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Mobile CTA Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold shadow-lg"
                  >
                    Book Your Car Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}