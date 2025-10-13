import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../components/LanguageContext";
import { div } from "framer-motion/client";

export default function Privacy() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const sections = [
    {
      id: "information-collection",
      title: t("privacy.infoCollectionTitle"),
      content: t("privacy.infoCollectionContent"),
    },
    {
      id: "data-usage",
      title: t("privacy.dataUsageTitle"),
      content: t("privacy.dataUsageContent"),
    },
    {
      id: "data-sharing",
      title: t("privacy.dataSharingTitle"),
      content: t("privacy.dataSharingContent"),
    },
    {
      id: "data-security",
      title: t("privacy.dataSecurityTitle"),
      content: t("privacy.dataSecurityContent"),
    },
    {
      id: "user-rights",
      title: t("privacy.userRightsTitle"),
      content: t("privacy.userRightsContent"),
    },
    {
      id: "cookies",
      title: t("privacy.cookiesTitle"),
      content: t("privacy.cookiesContent"),
    },
    {
      id: "policy-changes",
      title: t("privacy.policyChangesTitle"),
      content: t("privacy.policyChangesContent"),
    },
  ];

  const quickLinks = [
    { name: t("privacy.infoCollectionTitle"), href: "#information-collection" },
    { name: t("privacy.dataUsageTitle"), href: "#data-usage" },
    { name: t("privacy.dataSharingTitle"), href: "#data-sharing" },
    { name: t("privacy.userRightsTitle"), href: "#user-rights" },
    { name: t("privacy.contactTitle"), href: "#contact" },
  ];

  return (
    <div
      className={`
      min-h-screen transition-all duration-500
      ${
        theme === "light"
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
          : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
      }
    `}
    >
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
              🛡️ {t("privacy.heroBadge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`
              text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent
              ${
                theme === "light"
                  ? "from-blue-600 via-purple-600 to-cyan-600"
                  : "from-blue-400 via-purple-400 to-cyan-400"
              }
            `}
          >
            {t("privacy.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={`
              text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed
              ${theme === "light" ? "text-gray-700" : "text-gray-300"}
            `}
          >
            {t("privacy.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={`
              inline-flex items-center px-6 py-3 rounded-2xl backdrop-blur-sm border
              ${
                theme === "light"
                  ? "bg-white/80 border-gray-200"
                  : "bg-gray-800/80 border-gray-700"
              }
            `}
          >
            <span
              className={`
              text-sm
              ${theme === "light" ? "text-gray-600" : "text-gray-400"}
            `}
            >
              {t("privacy.lastUpdated")}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Quick Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <div
                className={`
                rounded-3xl p-6 backdrop-blur-sm border-2 sticky top-24
                ${
                  theme === "light"
                    ? "bg-white/80 border-blue-200 shadow-xl"
                    : "bg-gray-800/80 border-blue-700 shadow-xl"
                }
              `}
              >
                <h3
                  className={`
                  text-lg font-bold mb-4
                  ${theme === "light" ? "text-gray-900" : "text-white"}
                `}
                >
                  {t("privacy.quickNav")}
                </h3>
                <nav className="space-y-2">
                  {quickLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className={`
                        block py-2 px-3 rounded-lg text-sm transition-all duration-300
                        ${
                          theme === "light"
                            ? "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            : "text-gray-400 hover:text-blue-400 hover:bg-blue-900/30"
                        }
                      `}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </nav>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div
                className={`
                rounded-3xl p-8 backdrop-blur-sm border-2
                ${
                  theme === "light"
                    ? "bg-white/80 border-blue-200 shadow-2xl"
                    : "bg-gray-800/80 border-blue-700 shadow-2xl"
                }
              `}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <p
                    className={`
                    text-lg leading-relaxed
                    ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                  `}
                  >
                    {t("privacy.introduction")}
                  </p>
                </motion.div>

                <div className="space-y-12">
                  {sections.map((section, index) => (
                    <motion.section
                      key={section.id}
                      id={section.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="scroll-mt-24"
                    >
                      <h2
                        className={`
                        text-2xl md:text-3xl font-bold mb-6 flex items-center
                        ${theme === "light" ? "text-gray-900" : "text-white"}
                      `}
                      >
                        <span
                          className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3
                          ${
                            theme === "light"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-blue-900 text-blue-400"
                          }
                        `}
                        >
                          {index + 1}
                        </span>
                        {section.title}
                      </h2>
                      <div
                        className={`
                        prose prose-lg max-w-none
                        ${
                          theme === "light"
                            ? "prose-gray"
                            : "prose-invert prose-gray-300"
                        }
                      `}
                      >
                        <p className="leading-relaxed">{section.content}</p>
                      </div>
                    </motion.section>
                  ))}

                  <motion.section
                    id="contact"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className={`
                      rounded-2xl p-6 mt-8
                      ${
                        theme === "light"
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-blue-900/20 border border-blue-800"
                      }
                    `}
                  >
                    <h3
                      className={`
                      text-xl font-bold mb-4
                      ${theme === "light" ? "text-gray-900" : "text-white"}
                    `}
                    >
                      {t("privacy.contactTitle")}
                    </h3>
                    <p
                      className={`
                      mb-4
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      {t("privacy.contactContent")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.a
                        href="mailto:privacy@elitedrive.com"
                        whileHover={{ scale: 1.05 }}
                        className={`
                          inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300
                          ${
                            theme === "light"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }
                        `}
                      >
                        ✉️ {t("privacy.emailUs")}
                      </motion.a>
                      <Link to="/contact">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className={`
                            inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300
                            ${
                              theme === "light"
                                ? "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                                : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                            }
                          `}
                        >
                          💬 {t("privacy.contactForm")}
                        </motion.button>
                      </Link>
                    </div>
                  </motion.section>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className={`
                    rounded-2xl p-6 mt-12 text-center
                    ${
                      theme === "light"
                        ? "bg-green-50 border border-green-200"
                        : "bg-green-900/20 border border-green-800"
                    }
                  `}
                >
                  <h3
                    className={`
                    text-xl font-bold mb-2
                    ${theme === "light" ? "text-gray-900" : "text-white"}
                  `}
                  >
                    {t("privacy.acceptanceTitle")}
                  </h3>
                  <p
                    className={`
                    ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                  `}
                  >
                    {t("privacy.acceptanceContent")}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
