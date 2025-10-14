import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../components/LanguageContext";

export default function Contact() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: "📞",
      title: t("contact.phone"),
      details: "+1 (555) 123-4567",
      description: t("contact.phoneDesc"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "✉️",
      title: t("contact.email"),
      details: "hello@elitedrive.com",
      description: t("contact.emailDesc"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "📍",
      title: t("contact.address"),
      details: "123 Drive Street, City",
      description: t("contact.addressDesc"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: "🕒",
      title: t("contact.hours"),
      details: "24/7 Available",
      description: t("contact.hoursDesc"),
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const faqs = [
    {
      question: t("contact.faq1q"),
      answer: t("contact.faq1a"),
    },
    {
      question: t("contact.faq2q"),
      answer: t("contact.faq2a"),
    },
    {
      question: t("contact.faq3q"),
      answer: t("contact.faq3a"),
    },
    {
      question: t("contact.faq4q"),
      answer: t("contact.faq4a"),
    },
  ];

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Form submitted:", formData);
    }, 2000);
  };

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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
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
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              💬 {t("contact.heroBadge")}
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
            {t("contact.title")}
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
            {t("contact.subtitle")}
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`
                  rounded-3xl p-6 text-center backdrop-blur-sm border-2 transition-all duration-300 relative overflow-hidden group
                  ${
                    theme === "light"
                      ? "bg-white/80 border-gray-200 shadow-xl"
                      : "bg-gray-800/80 border-gray-700 shadow-xl"
                  }
                `}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0`}
                  whileHover={{ opacity: 0.05 }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${method.gradient} text-white text-2xl mb-4 mx-auto shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {method.icon}
                </motion.div>

                <h3
                  className={`
                  text-lg font-bold mb-2
                  ${theme === "light" ? "text-gray-900" : "text-white"}
                `}
                >
                  {method.title}
                </h3>

                <p
                  className={`
                  font-semibold mb-2
                  ${theme === "light" ? "text-blue-600" : "text-blue-400"}
                `}
                >
                  {method.details}
                </p>

                <p
                  className={`
                  text-sm
                  ${theme === "light" ? "text-gray-600" : "text-gray-400"}
                `}
                >
                  {method.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`
                rounded-3xl p-8 backdrop-blur-sm border-2
                ${
                  theme === "light"
                    ? "bg-white/80 border-blue-200 shadow-2xl"
                    : "bg-gray-800/80 border-blue-700 shadow-2xl"
                }
              `}
            >
              <h2
                className={`
                text-3xl font-bold mb-6
                ${theme === "light" ? "text-gray-900" : "text-white"}
              `}
              >
                {t("contact.formTitle")}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`
                      block text-sm font-semibold mb-2
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      {t("contact.name")} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                        ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                            : "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                        }
                      `}
                      placeholder={t("contact.namePlaceholder")}
                    />
                  </div>

                  <div>
                    <label
                      className={`
                      block text-sm font-semibold mb-2
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      {t("contact.email")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                        ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                            : "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                        }
                      `}
                      placeholder={t("contact.emailPlaceholder")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`
                      block text-sm font-semibold mb-2
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      {t("contact.phone")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                        ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                            : "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                        }
                      `}
                      placeholder={t("contact.phonePlaceholder")}
                    />
                  </div>

                  <div>
                    <label
                      className={`
                      block text-sm font-semibold mb-2
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      {t("contact.subject")} *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                        ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                            : "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                        }
                      `}
                    >
                      <option value="">{t("contact.selectSubject")}</option>
                      <option value="general">{t("contact.general")}</option>
                      <option value="booking">{t("contact.booking")}</option>
                      <option value="support">{t("contact.support")}</option>
                      <option value="complaint">
                        {t("contact.complaint")}
                      </option>
                      <option value="partnership">
                        {t("contact.partnership")}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className={`
                    block text-sm font-semibold mb-2
                    ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                  `}
                  >
                    {t("contact.message")} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`
                      w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 resize-none
                      ${
                        theme === "light"
                          ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                          : "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                      }
                    `}
                    placeholder={t("contact.messagePlaceholder")}
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{
                    scale: isSubmitting ? 1 : 1.05,
                    y: isSubmitting ? 0 : -2,
                  }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group
                    ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : theme === "light"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl"
                        : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-2xl"
                    }
                  `}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                    />
                  ) : (
                    <>
                      <span className="relative z-10">
                        {t("contact.sendMessage")}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Map & FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div
                className={`
                rounded-3xl overflow-hidden backdrop-blur-sm border-2
                ${
                  theme === "light"
                    ? "bg-white/80 border-blue-200 shadow-2xl"
                    : "bg-gray-800/80 border-blue-700 shadow-2xl"
                }
              `}
              >
                <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                    🗺️
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">
                      {t("contact.visitUs")}
                    </h3>
                    <p className="text-blue-100">
                      123 Drive Street, City, State 12345
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div
                className={`
                rounded-3xl p-6 backdrop-blur-sm border-2
                ${
                  theme === "light"
                    ? "bg-white/80 border-purple-200 shadow-2xl"
                    : "bg-gray-800/80 border-purple-700 shadow-2xl"
                }
              `}
              >
                <h3
                  className={`
                  text-2xl font-bold mb-6
                  ${theme === "light" ? "text-gray-900" : "text-white"}
                `}
                >
                  {t("contact.faqTitle")}
                </h3>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`
                        rounded-xl p-4 border transition-all duration-300
                        ${
                          theme === "light"
                            ? "bg-blue-50 border-blue-200"
                            : "bg-blue-900/20 border-blue-800"
                        }
                      `}
                    >
                      <h4
                        className={`
                        font-semibold mb-2
                        ${theme === "light" ? "text-gray-900" : "text-white"}
                      `}
                      >
                        {faq.question}
                      </h4>
                      <p
                        className={`
                        text-sm
                        ${theme === "light" ? "text-gray-600" : "text-gray-400"}
                      `}
                      >
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
