import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../components/LanguageContext";

export default function Terms() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const sections = [
    {
      id: "agreement-overview",
      title: t("terms.agreementOverviewTitle"),
      content: t("terms.agreementOverviewContent"),
    },
    {
      id: "services-description",
      title: t("terms.servicesDescriptionTitle"),
      content: t("terms.servicesDescriptionContent"),
    },
    {
      id: "user-eligibility",
      title: t("terms.userEligibilityTitle"),
      content: t("terms.userEligibilityContent"),
    },
    {
      id: "account-registration",
      title: t("terms.accountRegistrationTitle"),
      content: t("terms.accountRegistrationContent"),
    },
    {
      id: "booking-policies",
      title: t("terms.bookingPoliciesTitle"),
      content: t("terms.bookingPoliciesContent"),
    },
    {
      id: "payment-terms",
      title: t("terms.paymentTermsTitle"),
      content: t("terms.paymentTermsContent"),
    },
    {
      id: "cancellation-refund",
      title: t("terms.cancellationRefundTitle"),
      content: t("terms.cancellationRefundContent"),
    },
    {
      id: "user-responsibilities",
      title: t("terms.userResponsibilitiesTitle"),
      content: t("terms.userResponsibilitiesContent"),
    },
    {
      id: "prohibited-activities",
      title: t("terms.prohibitedActivitiesTitle"),
      content: t("terms.prohibitedActivitiesContent"),
    },
    {
      id: "insurance-coverage",
      title: t("terms.insuranceCoverageTitle"),
      content: t("terms.insuranceCoverageContent"),
    },
    {
      id: "liability-limitations",
      title: t("terms.liabilityLimitationsTitle"),
      content: t("terms.liabilityLimitationsContent"),
    },
    {
      id: "intellectual-property",
      title: t("terms.intellectualPropertyTitle"),
      content: t("terms.intellectualPropertyContent"),
    },
    {
      id: "termination",
      title: t("terms.terminationTitle"),
      content: t("terms.terminationContent"),
    },
    {
      id: "governing-law",
      title: t("terms.governingLawTitle"),
      content: t("terms.governingLawContent"),
    },
    {
      id: "changes-terms",
      title: t("terms.changesTermsTitle"),
      content: t("terms.changesTermsContent"),
    },
  ];

  const quickLinks = [
    { name: t("terms.agreementOverviewTitle"), href: "#agreement-overview" },
    { name: t("terms.bookingPoliciesTitle"), href: "#booking-policies" },
    { name: t("terms.paymentTermsTitle"), href: "#payment-terms" },
    { name: t("terms.cancellationRefundTitle"), href: "#cancellation-refund" },
    { name: t("terms.userResponsibilitiesTitle"), href: "#user-responsibilities" },
    { name: t("terms.insuranceCoverageTitle"), href: "#insurance-coverage" },
    { name: t("terms.liabilityLimitationsTitle"), href: "#liability-limitations" },
    { name: t("terms.contactTitle"), href: "#contact" },
  ];

  return (
    <div
      className={`
      min-h-screen transition-all duration-500
      ${
        theme === "light"
          ? "bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50"
          : "bg-gradient-to-br from-gray-900 via-orange-900 to-amber-900"
      }
    `}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
              ⚖️ {t("terms.heroBadge")}
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
                  ? "from-orange-600 via-amber-600 to-yellow-600"
                  : "from-orange-400 via-amber-400 to-yellow-400"
              }
            `}
          >
            {t("terms.title")}
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
            {t("terms.subtitle")}
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
              {t("terms.lastUpdated")}
            </span>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
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
                    ? "bg-white/80 border-orange-200 shadow-xl"
                    : "bg-gray-800/80 border-orange-700 shadow-xl"
                }
              `}
              >
                <h3
                  className={`
                  text-lg font-bold mb-4
                  ${theme === "light" ? "text-gray-900" : "text-white"}
                `}
                >
                  {t("terms.quickNav")}
                </h3>
                <nav className="space-y-2">
                  {quickLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className={`
                        block py-2 px-3 rounded-lg text-sm transition-all duration-300
                        ${
                          theme === "light"
                            ? "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                            : "text-gray-400 hover:text-orange-400 hover:bg-orange-900/30"
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
                    ? "bg-white/80 border-orange-200 shadow-2xl"
                    : "bg-gray-800/80 border-orange-700 shadow-2xl"
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
                    {t("terms.introduction")}
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
                              ? "bg-orange-100 text-orange-600"
                              : "bg-orange-900 text-orange-400"
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
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className={`
                      rounded-2xl p-6
                      ${
                        theme === "light"
                          ? "bg-red-50 border border-red-200"
                          : "bg-red-900/20 border border-red-800"
                      }
                    `}
                  >
                    <h3
                      className={`
                      text-xl font-bold mb-4 flex items-center
                      ${theme === "light" ? "text-red-800" : "text-red-200"}
                    `}
                    >
                      ⚠️ {t("terms.importantNoticeTitle")}
                    </h3>
                    <p
                      className={`
                      ${theme === "light" ? "text-red-700" : "text-red-300"}
                    `}
                    >
                      {t("terms.importantNoticeContent")}
                    </p>
                  </motion.div>

                  {/* Contact Section */}
                  <motion.section
                    id="contact"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className={`
                      rounded-2xl p-6 mt-8
                      ${
                        theme === "light"
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-orange-900/20 border border-orange-800"
                      }
                    `}
                  >
                    <h3
                      className={`
                      text-xl font-bold mb-4
                      ${theme === "light" ? "text-gray-900" : "text-white"}
                    `}
                    >
                      {t("terms.contactTitle")}
                    </h3>
                    <p
                      className={`
                      mb-4
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      {t("terms.contactContent")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                    
                      <Link to="/contact">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className={`
                            inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300
                            ${
                              theme === "light"
                                ? "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                                : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                            }
                          `}
                        >
                          💬 {t("terms.contactForm")}
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
                    {t("terms.acceptanceTitle")}
                  </h3>
                  <p
                    className={`
                    ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                  `}
                  >
                    {t("terms.acceptanceContent")}
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