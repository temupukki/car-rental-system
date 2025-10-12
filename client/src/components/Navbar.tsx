import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  id: number;
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Services", href: "/services" },
  { id: 3, name: "Deals", href: "/deals" },
  { id: 4, name: "About", href: "/about" },
  { id: 5, name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (href: string) => location.pathname === href;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 8, duration: 1 }}
      className="bg-white sticky top-0 z-50 shadow-sm border-b"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
           
            <motion.div
              whileHover={{
                scale: 1.15, 
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              whileTap={{ scale: 1.25 }}
              className="flex-shrink-0" 
            >
            
              <img
                src="/pppp.png" // <--- **CHANGE THIS PATH** to where you save the generated logo
                alt="EliteDrive Car Rental Logo"
                className="h-30 w-44 mt-4 ml-[-30px]" // Set height, maintain aspect ratio
                loading="lazy"
              />
            </motion.div>
            {/* End Logo Integration */}

            <motion.div
              whileHover={{ x: 3 }}
              whileTap={{ scale: 1.18 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <h1 className="text-xl font-bold text-gray-900 ml-[-63px]">EliteDrive</h1>
            </motion.div>
          </Link>

          <motion.div
            className="hidden lg:flex items-center space-x-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <motion.div
                key={link.id}
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.href}
                  className={`relative font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${
                    isActiveLink(link.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-500 hover:bg-gray-50"
                  }`}
                >
                  {link.name}

                  {isActiveLink(link.href) && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"
                      layoutId="activeIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Removed the border-2 hover effect as it can be distracting in a navbar */}
                </Link>
              </motion.div>
            ))}

            <motion.div
              whileHover={{
                scale: 1.06,
                y: -1,
              }}
              whileTap={{ scale: 1.18 }}
            >
              <motion.button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                whileHover={{
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
                }}
              >
                Book Now
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{
              scale: 1.1, // Slightly less aggressive hover for burger
              rotate: isMenuOpen ? 90 : 0, // Animate rotate only on click
            }}
            whileTap={{ scale: 0.9 }} // Consistent tap effect
            className="lg:hidden p-2 font-bold text-xl text-gray-700" // Added text color for clarity
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }} // Smooth rotation for the icon
              transition={{ duration: 0.3 }}
              className="w-6 h-6 flex items-center justify-center" // Center the icon
            >
              {isMenuOpen ? "✕" : "☰"}
            </motion.div>
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t bg-white/95 backdrop-blur-sm"
            >
              <motion.div
                className="py-4 space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {navLinks.map((link) => (
                  <motion.div
                    key={link.id}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-3 px-4 font-medium rounded-lg transition-all duration-200 ${
                        isActiveLink(link.href)
                          ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                          : "text-gray-700 hover:text-blue-500 hover:bg-gray-50 hover:border-l-4 hover:border-blue-200"
                      }`}
                    >
                      <motion.span
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <motion.button
                    whileHover={{
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      boxShadow: "0 8px 20px -5px rgba(37, 99, 235, 0.4)",
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg"
                  >
                    Book Vehicle
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}