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
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const contactMethods = [
    {
      icon: "📞",
      title: t("contact.phone") || "Phone",
      details: "09090909090",
      description: t("contact.phoneDesc") || "Mon-Sun, 24/7 Support",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: "✉️",
      title: t("contact.email") || "Email",
      details: "hello@elitedrive.com",
      description: t("contact.emailDesc") || "We reply within 2 hours",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: "📍",
      title: t("contact.address") || "Address",
      details: "Gondar,Maraki",
      description: t("contact.addressDesc") || "Visit our main office",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: "🕒",
      title: t("contact.hours") || "Business Hours",
      details: "24/7 Available",
      description: t("contact.hoursDesc") || "Always here to help you",
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const faqs = [
    {
      question: t("contact.faq1q") || "How quickly can I get a response?",
      answer: t("contact.faq1a") || "We typically respond within 2 hours during business hours and within 12 hours for after-hours inquiries.",
    },
    {
      question: t("contact.faq2q") || "What's your cancellation policy?",
      answer: t("contact.faq2a") || "You can cancel your booking up to 24 hours before pickup for a full refund. Late cancellations may incur a small fee.",
    },
    {
      question: t("contact.faq3q") || "Do you offer long-term rentals?",
      answer: t("contact.faq3a") || "Yes! We offer special rates for weekly and monthly rentals. Contact us for custom long-term rental packages.",
    },
    {
      question: t("contact.faq4q") || "What payment methods do you accept?",
      answer: t("contact.faq4a") || "We accept all major credit cards, PayPal, and bank transfers. Corporate accounts are also available.",
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

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
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

      <div className="relative h-[500px] rounded-b-3xl overflow-hidden">
      
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/contact.jpg')",
          }}
        />

        <div className="absolute inset-0 flex items-center px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
               {t("contact.title")}
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-200 mb-8 max-w-2xl"
              >
                {t("contact.subtitle") || "Have questions? We're here to help. Get in touch with our team and let's discuss how we can assist you."}
              </motion.p>

         
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {[
                  { number: "2h", label: "Avg. Response" },
                  { number: "24/7", label: "Support" },
                  { number: "100%", label: "Satisfaction" },
                  { number: "5.0", label: "Rating" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-300">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

 
      <section className="py-20 px-6 relative -mt-20">
        <div className="max-w-7xl mx-auto">
       
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)"
                }}
                className={`
                  rounded-3xl p-8 text-center backdrop-blur-sm border-2 transition-all duration-300 relative overflow-hidden group
                  ${
                    theme === "light"
                      ? "bg-white/90 border-gray-200 shadow-2xl hover:shadow-3xl"
                      : "bg-gray-800/90 border-gray-700 shadow-2xl hover:shadow-3xl"
                  }
                `}
              >
           
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0`}
                  whileHover={{ opacity: 0.05 }}
                  transition={{ duration: 0.3 }}
                />

      
                <motion.div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${method.gradient} text-white text-3xl mb-6 mx-auto shadow-2xl relative overflow-hidden`}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: [0, -5, 5, 0],
                    boxShadow: `0 15px 30px -5px rgba(0,0,0,0.3)`
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300,
                    rotate: { duration: 0.5 }
                  }}
                >
                  {method.icon}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    whileHover={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <h3
                  className={`
                  text-xl font-bold mb-3 relative z-10
                  ${theme === "light" ? "text-gray-900" : "text-white"}
                `}
                >
                  {method.title}
                </h3>

                <p
                  className={`
                  font-semibold text-lg mb-3 relative z-10
                  ${theme === "light" ? "text-blue-600" : "text-blue-400"}
                `}
                >
                  {method.details}
                </p>

                <p
                  className={`
                  text-sm relative z-10
                  ${theme === "light" ? "text-gray-600" : "text-gray-400"}
                `}
                >
                  {method.description}
                </p>

             
                <motion.div
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${method.gradient} opacity-20`}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />
              </motion.div>
            ))}
          </div>

     
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
   
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`
                rounded-3xl p-8 backdrop-blur-sm border-2 relative overflow-hidden
                ${
                  theme === "light"
                    ? "bg-white/90 border-blue-200 shadow-2xl"
                    : "bg-gray-800/90 border-blue-700 shadow-2xl"
                }
              `}
            >
      
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-2xl"></div>
              </div>

              <div className="relative z-10">
                <h2
                  className={`
                  text-3xl font-bold mb-2
                  ${theme === "light" ? "text-gray-900" : "text-white"}
                `}
                >
                  {t("contact.formTitle") || "Send us a Message"}
                </h2>
                <p className={`mb-8 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`
                        block text-sm font-semibold mb-3
                        ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                      `}
                      >
                        {t("contact.name") || "Full Name"} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`
                          w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                          ${
                            theme === "light"
                              ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400"
                              : "bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-500"
                          }
                        `}
                        placeholder={t("contact.namePlaceholder") || "Enter your full name"}
                      />
                    </div>

                    <div>
                      <label
                        className={`
                        block text-sm font-semibold mb-3
                        ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                      `}
                      >
                        {t("contact.email") || "Email Address"} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`
                          w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                          ${
                            theme === "light"
                              ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400"
                              : "bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-500"
                          }
                        `}
                        placeholder={t("contact.emailPlaceholder") || "your@email.com"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`
                        block text-sm font-semibold mb-3
                        ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                      `}
                      >
                        {t("contact.phone") || "Phone Number"}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`
                          w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                          ${
                            theme === "light"
                              ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400"
                              : "bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-500"
                          }
                        `}
                        placeholder={t("contact.phonePlaceholder") || "+1 (555) 000-0000"}
                      />
                    </div>

                    <div>
                      <label
                        className={`
                        block text-sm font-semibold mb-3
                        ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                      `}
                      >
                        {t("contact.subject") || "Subject"} *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className={`
                          w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                          ${
                            theme === "light"
                              ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                              : "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                          }
                        `}
                      >
                        <option value="">{t("contact.selectSubject") || "Select a subject"}</option>
                        <option value="general">{t("contact.general") || "General Inquiry"}</option>
                        <option value="booking">{t("contact.booking") || "Booking Assistance"}</option>
                        <option value="support">{t("contact.support") || "Technical Support"}</option>
                        <option value="complaint">
                          {t("contact.complaint") || "Complaint"}
                        </option>
                        <option value="partnership">
                          {t("contact.partnership") || "Partnership"}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className={`
                      block text-sm font-semibold mb-3
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      {t("contact.message") || "Message"} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className={`
                        w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 resize-none
                        ${
                          theme === "light"
                            ? "bg-white border-gray-300 text-gray-900 focus:border-blue-500 placeholder-gray-400"
                            : "bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-500"
                        }
                      `}
                      placeholder={t("contact.messagePlaceholder") || "Tell us how we can help you..."}
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
                      w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group
                      ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl"
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <span className="relative z-10">
                          {t("contact.sendMessage") || "Send Message"}
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={false}
                        />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

        
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
           
              <div
                className={`
                rounded-3xl overflow-hidden backdrop-blur-sm border-2 relative
                ${
                  theme === "light"
                    ? "bg-white/90 border-blue-200 shadow-2xl"
                    : "bg-gray-800/90 border-blue-700 shadow-2xl"
                }
              `}
              >
                <div className="h-80 bg-cover bg-center relative" style={{ backgroundImage: "url('/show-room.jpg')" }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {t("contact.visitUs") || "Visit Our Office"}
                    </h3>
                    <p className="text-blue-100 text-lg">
                     Gondar, Maraki,Kebele 18
                    </p>
                    <p className="text-gray-300 mt-2">
                      🕒 Mon - Fri: 2:00 AM - 11:00 AM LT
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div
                className={`
                rounded-3xl p-8 backdrop-blur-sm border-2
                ${
                  theme === "light"
                    ? "bg-white/90 border-purple-200 shadow-2xl"
                    : "bg-gray-800/90 border-purple-700 shadow-2xl"
                }
              `}
              >
                <h3
                  className={`
                  text-2xl font-bold mb-2
                  ${theme === "light" ? "text-gray-900" : "text-white"}
                `}
                >
                  {t("contact.faqTitle") || "Frequently Asked Questions"}
                </h3>
                <p className={`mb-6 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Quick answers to common questions
                </p>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`
                        rounded-2xl p-4 border-2 transition-all duration-300 cursor-pointer
                        ${
                          theme === "light"
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300"
                            : "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-800 hover:border-blue-600"
                        }
                        ${activeFAQ === index ? 'ring-2 ring-blue-500/30' : ''}
                      `}
                      onClick={() => toggleFAQ(index)}
                    >
                      <div className="flex items-center justify-between">
                        <h4
                          className={`
                          font-semibold text-lg
                          ${theme === "light" ? "text-gray-900" : "text-white"}
                        `}
                        >
                          {faq.question}
                        </h4>
                        <motion.span
                          animate={{ rotate: activeFAQ === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-blue-500 text-xl"
                        >
                          ▼
                        </motion.span>
                      </div>
                      <motion.div
                        initial={false}
                        animate={{ 
                          height: activeFAQ === index ? 'auto' : 0,
                          opacity: activeFAQ === index ? 1 : 0 
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p
                          className={`
                          mt-3 text-sm leading-relaxed
                          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
                        `}
                        >
                          {faq.answer}
                        </p>
                      </motion.div>
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