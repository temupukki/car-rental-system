import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../components/LanguageContext";

export default function FAQ() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = [
    { id: "all", name: t('faq.category.general') },
    { id: "general", name: t('faq.category.general') },
    { id: "booking", name: t('faq.category.booking') },
    { id: "payment", name: t('faq.category.payment') },
    { id: "requirements", name: t('faq.category.requirements') },
    { id: "delivery", name: t('faq.category.delivery') },
    { id: "insurance", name: t('faq.category.insurance') },
    { id: "support", name: t('faq.category.support') }
  ];

  const faqItems = [
    // General
    { id: 1, category: "general", question: t('faq.q1'), answer: t('faq.a1') },
    { id: 2, category: "general", question: t('faq.q2'), answer: t('faq.a2') },
    { id: 3, category: "general", question: t('faq.q3'), answer: t('faq.a3') },
    { id: 4, category: "general", question: t('faq.q4'), answer: t('faq.a4') },
    // Booking
    { id: 5, category: "booking", question: t('faq.q5'), answer: t('faq.a5') },
    { id: 6, category: "booking", question: t('faq.q6'), answer: t('faq.a6') },
    { id: 7, category: "booking", question: t('faq.q7'), answer: t('faq.a7') },
    { id: 8, category: "booking", question: t('faq.q8'), answer: t('faq.a8') },
    // Payment
    { id: 9, category: "payment", question: t('faq.q9'), answer: t('faq.a9') },
    { id: 10, category: "payment", question: t('faq.q10'), answer: t('faq.a10') },
    { id: 11, category: "payment", question: t('faq.q11'), answer: t('faq.a11') },
    { id: 12, category: "payment", question: t('faq.q12'), answer: t('faq.a12') },
    // Requirements
    { id: 13, category: "requirements", question: t('faq.q13'), answer: t('faq.a13') },
    { id: 14, category: "requirements", question: t('faq.q14'), answer: t('faq.a14') },
    { id: 15, category: "requirements", question: t('faq.q15'), answer: t('faq.a15') },
    { id: 16, category: "requirements", question: t('faq.q16'), answer: t('faq.a16') },
    // Delivery
    { id: 17, category: "delivery", question: t('faq.q17'), answer: t('faq.a17') },
    { id: 18, category: "delivery", question: t('faq.q18'), answer: t('faq.a18') },
    { id: 19, category: "delivery", question: t('faq.q19'), answer: t('faq.a19') },
    { id: 20, category: "delivery", question: t('faq.q20'), answer: t('faq.a20') },
    // Support
    { id: 21, category: "support", question: t('faq.q21'), answer: t('faq.a21') },
    { id: 22, category: "support", question: t('faq.q22'), answer: t('faq.a22') },
    { id: 23, category: "support", question: t('faq.q23'), answer: t('faq.a23') },
    { id: 24, category: "support", question: t('faq.q24'), answer: t('faq.a24') },
  ];

  const filteredItems = useMemo(() => {
    return faqItems.filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, faqItems]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={`
      min-h-screen transition-all duration-500
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
      }
    `}>
      
      {/* Animated Background */}
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
              ❓ FAQ
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
            {t('faq.title')}
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
            {t('faq.subtitle')}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className={`
              relative rounded-2xl p-2 backdrop-blur-sm border-2
              ${theme === 'light'
                ? 'bg-white/80 border-blue-200 shadow-xl'
                : 'bg-gray-800/80 border-blue-700 shadow-xl'
              }
            `}>
              <input
                type="text"
                placeholder={t('faq.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none text-lg
                  ${theme === 'light' ? 'text-gray-900 placeholder-gray-500' : 'text-white placeholder-gray-400'}
                `}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`
                  mt-2 text-sm
                  ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                `}
              >
                {filteredItems.length} {t('faq.resultsFound') || 'results found'} • 
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {t('faq.clearSearch')}
                </button>
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-64 flex-shrink-0"
            >
              <div className={`
                rounded-2xl p-6 backdrop-blur-sm border-2 sticky top-24
                ${theme === 'light'
                  ? 'bg-white/80 border-blue-200 shadow-xl'
                  : 'bg-gray-800/80 border-blue-700 shadow-xl'
                }
              `}>
                <h3 className={`
                  text-lg font-bold mb-4
                  ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                `}>
                  Categories
                </h3>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`
                        w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300
                        ${activeCategory === category.id
                          ? theme === 'light'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-blue-500 text-white shadow-lg'
                          : theme === 'light'
                            ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/30'
                        }
                      `}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* FAQ Items */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              {filteredItems.length === 0 ? (
                <div className={`
                  rounded-2xl p-12 text-center backdrop-blur-sm border-2
                  ${theme === 'light'
                    ? 'bg-white/80 border-blue-200 shadow-xl'
                    : 'bg-gray-800/80 border-blue-700 shadow-xl'
                  }
                `}>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className={`
                    text-xl font-bold mb-2
                    ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                  `}>
                    {t('faq.noResults')}
                  </h3>
                  <p className={`
                    mb-6
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    Try searching with different keywords or browse all categories.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className={`
                      px-6 py-3 rounded-xl font-semibold transition-all duration-300
                      ${theme === 'light'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                      }
                    `}
                  >
                    {t('faq.clearSearch')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className={`
                        rounded-2xl backdrop-blur-sm border-2 overflow-hidden
                        ${theme === 'light'
                          ? 'bg-white/80 border-blue-200 shadow-xl'
                          : 'bg-gray-800/80 border-blue-700 shadow-xl'
                        }
                      `}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`
                          w-full text-left p-6 flex items-center justify-between transition-all duration-300
                          ${theme === 'light'
                            ? 'hover:bg-blue-50'
                            : 'hover:bg-blue-900/20'
                          }
                        `}
                      >
                        <h3 className={`
                          text-lg font-semibold pr-8
                          ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                        `}>
                          {item.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {openItems.includes(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className={`
                              px-6 pb-6 border-t
                              ${theme === 'light'
                                ? 'border-blue-100 text-gray-700'
                                : 'border-blue-800 text-gray-300'
                              }
                            `}>
                              <p className="leading-relaxed">{item.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Contact CTA */}
              {filteredItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className={`
                    rounded-2xl p-8 mt-12 text-center backdrop-blur-sm border-2
                    ${theme === 'light'
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-xl'
                      : 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-700 shadow-xl'
                    }
                  `}
                >
                  <h3 className={`
                    text-2xl font-bold mb-4
                    ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                  `}>
                    {t('faq.contactPrompt')}
                  </h3>
                  <p className={`
                    text-lg mb-6 max-w-2xl mx-auto
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}
                  `}>
                    Our support team is here to help you with any questions you may have.
                  </p>
                  <Link to="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
                        ${theme === 'light'
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                          : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
                        }
                      `}
                    >
                      💬 {t('faq.contactButton')}
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}