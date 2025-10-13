import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../components/LanguageContext";

export default function About() {
  const { theme } = useTheme();
  const { t } = useLanguage();



  const milestones = [
    {
      year: "2010",
      title: "Company Founded",
      description: "Started with 10 vehicles in downtown location",
      icon: "🚀"
    },
    {
      year: "2014",
      title: "Fleet Expansion",
      description: "Grew to 50+ vehicles across 3 locations",
      icon: "📈"
    },
    {
      year: "2018",
      title: "Premium Launch",
      description: "Introduced luxury and premium vehicle categories",
      icon: "🏎️"
    },
    {
      year: "2023",
      title: "Digital Transformation",
      description: "Launched mobile app and online booking platform",
      icon: "📱"
    }
  ];

  const values = [
    {
      icon: "🤝",
      title: "Customer First",
      description: "We prioritize customer satisfaction above all else"
    },
    {
      icon: "⚡",
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service"
    },
    {
      icon: "🛡️",
      title: "Reliability",
      description: "You can count on us to deliver what we promise"
    },
    {
      icon: "💡",
      title: "Innovation",
      description: "We continuously improve and embrace new technologies"
    }
  ];

  return (
    <div className={`
      min-h-screen transition-all duration-500
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
      }
    `}>
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              🏢 {t('about.heroBadge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`
              text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent
              ${theme === 'light' 
                ? 'from-blue-600 via-purple-600 to-cyan-600' 
                : 'from-blue-400 via-purple-400 to-cyan-400'
              }
            `}
          >
            {t('about.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={`
              text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed
              ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
            `}
          >
            {t('about.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={`
                text-4xl md:text-5xl font-bold mb-6
                ${theme === 'light' ? 'text-gray-900' : 'text-white'}
              `}>
                {t('about.storyTitle')}
              </h2>
              <div className={`
                space-y-4 text-lg leading-relaxed
                ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}
              `}>
                <p>{t('about.story1')}</p>
                <p>{t('about.story2')}</p>
                <p>{t('about.story3')}</p>
              </div>
              
              <motion.div
                className="flex flex-wrap gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className={`
                  px-6 py-3 rounded-2xl backdrop-blur-sm border
                  ${theme === 'light'
                    ? 'bg-white/80 border-gray-200'
                    : 'bg-gray-800/80 border-gray-700'
                  }
                `}>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('about.vehiclesCount')}</div>
                </div>
                <div className={`
                  px-6 py-3 rounded-2xl backdrop-blur-sm border
                  ${theme === 'light'
                    ? 'bg-white/80 border-gray-200'
                    : 'bg-gray-800/80 border-gray-700'
                  }
                `}>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('about.locationsCount')}</div>
                </div>
                <div className={`
                  px-6 py-3 rounded-2xl backdrop-blur-sm border
                  ${theme === 'light'
                    ? 'bg-white/80 border-gray-200'
                    : 'bg-gray-800/80 border-gray-700'
                  }
                `}>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">10K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('about.customersCount')}</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`
                rounded-3xl p-8 backdrop-blur-sm border-2
                ${theme === 'light'
                  ? 'bg-white/80 border-blue-200 shadow-2xl'
                  : 'bg-gray-800/80 border-blue-700 shadow-2xl'
                }
              `}
            >
              <div className="grid grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -5 }}
                    className={`
                      text-center p-6 rounded-2xl transition-all duration-300
                      ${theme === 'light'
                        ? 'bg-blue-50 border border-blue-100'
                        : 'bg-blue-900/20 border border-blue-800'
                      }
                    `}
                  >
                    <div className="text-3xl mb-3">{value.icon}</div>
                    <h3 className={`
                      font-bold mb-2
                      ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                    `}>
                      {value.title}
                    </h3>
                    <p className={`
                      text-sm
                      ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                    `}>
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={`
        py-20 px-6 relative
        ${theme === 'light' 
          ? 'bg-gradient-to-br from-white to-blue-50' 
          : 'bg-gradient-to-br from-gray-800 to-blue-900/20'
        }
      `}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`
              text-4xl md:text-5xl font-bold mb-6
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>
              {t('about.timelineTitle')}
            </h2>
            <p className={`
              text-xl max-w-2xl mx-auto
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              {t('about.timelineSubtitle')}
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className={`
              absolute left-1/2 transform -translate-x-1/2 h-full w-1
              ${theme === 'light' ? 'bg-blue-200' : 'bg-blue-800'}
            `}></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`
                        rounded-3xl p-6 backdrop-blur-sm border-2 transition-all duration-300
                        ${theme === 'light'
                          ? 'bg-white/80 border-blue-200 shadow-xl'
                          : 'bg-gray-800/80 border-blue-700 shadow-xl'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">{milestone.icon}</div>
                        <span className={`
                          text-2xl font-bold
                          ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
                        `}>
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className={`
                        text-xl font-bold mb-2
                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                      `}>
                        {milestone.title}
                      </h3>
                      <p className={`
                        ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                      `}>
                        {milestone.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <div className={`
                      w-6 h-6 rounded-full border-4
                      ${theme === 'light' ? 'bg-white border-blue-500' : 'bg-gray-800 border-blue-400'}
                    `}></div>
                  </div>

                  {/* Spacer */}
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`
        py-20 px-6 relative overflow-hidden
        ${theme === 'light' 
          ? 'bg-gradient-to-br from-blue-50 to-cyan-50' 
          : 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20'
        }
      `}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`
              rounded-3xl p-12 backdrop-blur-sm border
              ${theme === 'light'
                ? 'bg-white/80 border-gray-200 shadow-2xl'
                : 'bg-gray-800/80 border-gray-700 shadow-2xl'
              }
            `}
          >
            <motion.div
              className="text-6xl mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎯
            </motion.div>

            <h2 className={`
              text-3xl md:text-4xl font-bold mb-6
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>
              {t('about.missionTitle')}
            </h2>

            <p className={`
              text-xl leading-relaxed mb-8
              ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
            `}>
              {t('about.missionStatement')}
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link to="/services">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 20px 40px -10px rgba(37, 99, 235, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group
                    ${theme === 'light'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-2xl'
                    }
                  `}
                >
                  <span className="relative z-10">{t('about.ctaServices')}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.button>
              </Link>

              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-8 py-4 rounded-2xl font-bold text-lg border-2 transition-all duration-300 backdrop-blur-sm
                    ${theme === 'light'
                      ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-white/80'
                      : 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-gray-800/80'
                    }
                  `}
                >
                  {t('about.ctaContact')}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}