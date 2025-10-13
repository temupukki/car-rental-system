import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className={`
      min-h-screen bg-gradient-to-br overflow-hidden transition-all duration-500
      ${theme === 'light'
        ? 'from-blue-50 via-white to-gray-100'
        : 'from-gray-900 via-blue-900 to-gray-900'
      }
    `}>
     
      <div className={`
        absolute inset-0 z-0 transition-all duration-500
        ${theme === 'light' ? 'bg-white/40' : 'bg-black/40'}
      `}></div>
      <div className={`
        absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl transition-all duration-500
        ${theme === 'light' ? 'bg-blue-500/20' : 'bg-blue-500/10'}
      `}></div>
      <div className={`
        absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl transition-all duration-500
        ${theme === 'light' ? 'bg-purple-500/20' : 'bg-purple-500/10'}
      `}></div>
      
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`
              inline-flex items-center px-4 py-2 rounded-full border mb-8 transition-all duration-300
              ${theme === 'light'
                ? 'bg-blue-600/20 border-blue-500/30'
                : 'bg-blue-400/20 border-blue-400/30'
              }
            `}
          >
            <span className={`
              text-sm font-semibold transition-colors duration-300
              ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}
            `}>
              🏆 #1 Rated Car Rental in the City
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={`
              text-5xl md:text-7xl font-bold mb-6 leading-tight transition-colors duration-300
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}
          >
            Drive Your
            <span className={`
              bg-clip-text text-transparent bg-gradient-to-r transition-all duration-500
              ${theme === 'light'
                ? 'from-blue-600 to-cyan-500'
                : 'from-blue-400 to-cyan-300'
              }
            `}> Dreams</span>
            <br />
            With EliteDrive
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={`
              text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed transition-colors duration-300
              ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
            `}
          >
            Experience luxury, reliability, and unmatched service. From economy to premium, 
            we have the perfect vehicle for every journey.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to="/services">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px -5px rgba(37, 99, 235, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-8 py-4 text-white rounded-xl font-semibold text-lg shadow-2xl transition-all duration-300
                  bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600
                `}
              >
                🚗 Explore Our Fleet
              </motion.button>
            </Link>
            
            <Link to="/deals">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px -5px rgba(147, 51, 234, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-8 py-4 text-white rounded-xl font-semibold text-lg shadow-2xl transition-all duration-300
                  bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600
                `}
              >
                💰 View Hot Deals
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {[
              { number: "500+", label: "Vehicles" },
              { number: "50+", label: "Locations" },
              { number: "24/7", label: "Support" },
              { number: "98%", label: "Satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                className={`
                  text-center p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300
                  ${theme === 'light'
                    ? 'bg-white/80 border-gray-200/50 text-gray-900'
                    : 'bg-white/5 border-white/10 text-white'
                  }
                `}
              >
                <div className={`
                  text-2xl md:text-3xl font-bold mb-1 transition-colors duration-300
                  ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                `}>
                  {stat.number}
                </div>
                <div className={`
                  text-sm transition-colors duration-300
                  ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`
              text-sm flex flex-col items-center transition-colors duration-300
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}
          >
            <span>Scroll to explore</span>
            <div className={`
              w-4 h-8 border-2 rounded-full flex justify-center mt-2 transition-colors duration-300
              ${theme === 'light' ? 'border-gray-600' : 'border-gray-400'}
            `}>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`
                  w-1 h-1 rounded-full mt-2 transition-colors duration-300
                  ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}
                `}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={`
        relative z-10 py-20 px-6 transition-all duration-500
        ${theme === 'light'
          ? 'bg-gradient-to-b from-transparent to-gray-100/50'
          : 'bg-gradient-to-b from-transparent to-black/50'
        }
      `}>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`
              text-4xl md:text-5xl font-bold text-center mb-16 transition-colors duration-300
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}
          >
            Why Choose <span className="text-blue-500">EliteDrive</span>?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Instant Booking",
                description: "Book your dream car in under 2 minutes with our seamless process"
              },
              {
                icon: "🛡️",
                title: "Full Insurance",
                description: "Comprehensive coverage for complete peace of mind on every trip"
              },
              {
                icon: "💰",
                title: "Best Prices",
                description: "Competitive rates with no hidden fees. Price match guarantee!"
              },
              {
                icon: "🚀",
                title: "Premium Fleet",
                description: "From economy to luxury, all vehicles maintained to highest standards"
              },
              {
                icon: "📱",
                title: "Mobile App",
                description: "Manage your rentals on the go with our feature-rich mobile application"
              },
              {
                icon: "⭐",
                title: "5-Star Support",
                description: "24/7 customer service to assist you whenever you need help"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className={`
                  backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:border-blue-500/30
                  ${theme === 'light'
                    ? 'bg-white/80 border-gray-200/50 hover:shadow-lg'
                    : 'bg-white/5 border-white/10 hover:shadow-xl'
                  }
                `}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className={`
                  text-xl font-bold mb-3 transition-colors duration-300
                  ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                `}>
                  {feature.title}
                </h3>
                <p className={`
                  leading-relaxed transition-colors duration-300
                  ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 py-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className={`
            max-w-4xl mx-auto text-center rounded-3xl p-12 border backdrop-blur-sm transition-all duration-500
            ${theme === 'light'
              ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-gray-200/50'
              : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-white/10'
            }
          `}
        >
          <h2 className={`
            text-3xl md:text-4xl font-bold mb-6 transition-colors duration-300
            ${theme === 'light' ? 'text-gray-900' : 'text-white'}
          `}>
            Ready to Hit the Road?
          </h2>
          <p className={`
            text-xl mb-8 transition-colors duration-300
            ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
          `}>
            Join thousands of satisfied customers and experience the EliteDrive difference today.
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 15px 40px -5px rgba(37, 99, 235, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 hover:from-blue-700 hover:to-cyan-600"
            >
              Start Your Journey Now
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}