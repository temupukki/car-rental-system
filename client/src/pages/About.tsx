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
      title: t("about.milestones.2010.title") || "Company Founded",
      description: t("about.milestones.2010.description") || "Started with 10 vehicles in downtown location",
      icon: "🚀",
    },
    {
      year: "2014",
      title: t("about.milestones.2014.title") || "Fleet Expansion",
      description: t("about.milestones.2014.description") || "Grew to 50+ vehicles across 3 locations",
      icon: "📈",
    },
    {
      year: "2018",
      title: t("about.milestones.2018.title") || "Premium Launch",
      description: t("about.milestones.2018.description") || "Introduced luxury and premium vehicle categories",
      icon: "🏎️",
    },
    {
      year: "2023",
      title: t("about.milestones.2023.title") || "Digital Transformation",
      description: t("about.milestones.2023.description") || "Launched mobile app and online booking platform",
      icon: "📱",
    },
  ];

  const values = [
    {
      icon: "🤝",
      title: t("about.values.customer.title") || "Customer First",
      description: t("about.values.customer.description") || "We prioritize customer satisfaction above all else",
    },
    {
      icon: "⚡",
      title: t("about.values.excellence.title") || "Excellence",
      description: t("about.values.excellence.description") || "We strive for excellence in every aspect of our service",
    },
    {
      icon: "🛡️",
      title: t("about.values.reliability.title") || "Reliability",
      description: t("about.values.reliability.description") || "You can count on us to deliver what we promise",
    },
    {
      icon: "💡",
      title: t("about.values.innovation.title") || "Innovation",
      description: t("about.values.innovation.description") || "We continuously improve and embrace new technologies",
    },
  ];

  const teamStats = [
    { number: "50+", label: t("about.stats.team") || "Team Members" },
    { number: "24/7", label: t("about.stats.support") || "Support" },
    { number: "99%", label: t("about.stats.satisfaction") || "Satisfaction Rate" },
    { number: "5.0", label: t("about.stats.rating") || "Average Rating" },
  ];

  const additionalStats = [
    { number: "500+", label: t("about.stats.vehicles") || "Vehicles", color: "blue" },
    { number: "50+", label: t("about.stats.locations") || "Locations", color: "green" },
    { number: "10K+", label: t("about.stats.customers") || "Customers", color: "purple" },
    { number: "15+", label: t("about.stats.cities") || "Cities", color: "orange" },
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
  
      <div className="relative h-[500px] rounded-b-3xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center m-6 rounded-2xl overflow-hidden "
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/mud.jpg')",
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
                {t("about.hero.title.line1") || "Driving"}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                  {t("about.hero.title.line2") || "Excellence"}
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-200 mb-8 max-w-2xl"
              >
                {t("about.hero.subtitle") ||
                  "We're revolutionizing the car rental experience with innovation, reliability, and unmatched customer service."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {teamStats.map((stat, index) => (
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
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

 
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className={`
                text-4xl md:text-5xl font-bold mb-6
                ${theme === "light" ? "text-gray-900" : "text-white"}
              `}
              >
                {t("about.story.title.line1") || "Our Journey of"}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {t("about.story.title.line2") || "Innovation"}
                </span>
              </h2>
              <div
                className={`
                space-y-6 text-lg leading-relaxed
                ${theme === "light" ? "text-gray-600" : "text-gray-300"}
              `}
              >
                <p>
                  {t("about.story.paragraph1") ||
                    "Founded in 2010, we started with a simple mission: to make car rental accessible, affordable, and enjoyable for everyone. What began as a small fleet of 10 vehicles has grown into a comprehensive mobility solution serving thousands of customers."}
                </p>
                <p>
                  {t("about.story.paragraph2") ||
                    "Our commitment to innovation and customer satisfaction has driven our expansion across multiple cities, introducing premium vehicles and digital solutions that redefine the rental experience."}
                </p>
                <p>
                  {t("about.story.paragraph3") ||
                    "Today, we continue to push boundaries, leveraging technology to create seamless experiences while maintaining the personal touch that our customers love."}
                </p>
              </div>

              {/* Enhanced Stats */}
              <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {additionalStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`
                      text-center p-6 rounded-2xl backdrop-blur-sm border-2 transition-all duration-300
                      ${
                        theme === "light"
                          ? "bg-white/80 border-gray-200 shadow-lg"
                          : "bg-gray-800/80 border-gray-700 shadow-lg"
                      }
                    `}
                  >
                    <div className={`text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400 mb-2`}>
                      {stat.number}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Values Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
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
              <h3
                className={`
                text-3xl font-bold mb-8 text-center
                ${theme === "light" ? "text-gray-900" : "text-white"}
              `}
              >
                {t("about.values.title") || "Our Values"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                    }}
                    className={`
                      text-center p-6 rounded-2xl transition-all duration-300 border
                      ${
                        theme === "light"
                          ? "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100"
                          : "bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800"
                      }
                    `}
                  >
                    <motion.div
                      className="text-4xl mb-4"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      {value.icon}
                    </motion.div>
                    <h3
                      className={`
                      font-bold text-xl mb-3
                      ${theme === "light" ? "text-gray-900" : "text-white"}
                    `}
                    >
                      {value.title}
                    </h3>
                    <p
                      className={`
                      text-sm leading-relaxed
                      ${theme === "light" ? "text-gray-600" : "text-gray-400"}
                    `}
                    >
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
      <section
        className={`
        py-20 px-6 relative
        ${
          theme === "light"
            ? "bg-gradient-to-br from-white to-blue-50"
            : "bg-gradient-to-br from-gray-800 to-blue-900/20"
        }
      `}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className={`
              text-4xl md:text-5xl font-bold mb-6
              ${theme === "light" ? "text-gray-900" : "text-white"}
            `}
            >
              {t("about.timeline.title.line1") || "Our"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {t("about.timeline.title.line2") || "Journey"}
              </span>
            </h2>
            <p
              className={`
              text-xl max-w-2xl mx-auto
              ${theme === "light" ? "text-gray-600" : "text-gray-400"}
            `}
            >
              {t("about.timeline.subtitle") ||
                "From humble beginnings to industry leadership - our story of growth and innovation"}
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div
              className={`
              absolute left-1/2 transform -translate-x-1/2 h-full w-1
              ${
                theme === "light"
                  ? "bg-gradient-to-b from-blue-200 to-purple-200"
                  : "bg-gradient-to-b from-blue-800 to-purple-800"
              }
            `}
            ></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`w-1/2 ${index % 2 === 0 ? "pr-12" : "pl-12"}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`
                        rounded-3xl p-8 backdrop-blur-sm border-2 transition-all duration-300 relative overflow-hidden group
                        ${
                          theme === "light"
                            ? "bg-white/80 border-blue-200 shadow-xl hover:shadow-2xl"
                            : "bg-gray-800/80 border-blue-700 shadow-xl hover:shadow-2xl"
                        }
                      `}
                    >
                      {/* Background Gradient on Hover */}
                      <div
                        className={`
                        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        bg-gradient-to-r from-blue-500/10 to-purple-500/10
                      `}
                      ></div>

                      <div className="flex items-center space-x-4 mb-4 relative z-10">
                        <motion.div
                          className="text-3xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                          {milestone.icon}
                        </motion.div>
                        <span
                          className={`
                          text-2xl font-bold
                          ${
                            theme === "light"
                              ? "text-blue-600"
                              : "text-blue-400"
                          }
                        `}
                        >
                          {milestone.year}
                        </span>
                      </div>
                      <h3
                        className={`
                        text-xl font-bold mb-3 relative z-10
                        ${theme === "light" ? "text-gray-900" : "text-white"}
                      `}
                      >
                        {milestone.title}
                      </h3>
                      <p
                        className={`
                        relative z-10
                        ${theme === "light" ? "text-gray-600" : "text-gray-400"}
                      `}
                      >
                        {milestone.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      className={`
                        w-6 h-6 rounded-full border-4 transition-all duration-300
                        ${
                          theme === "light"
                            ? "bg-white border-blue-500 hover:border-purple-500"
                            : "bg-gray-800 border-blue-400 hover:border-purple-400"
                        }
                      `}
                    ></motion.div>
                  </div>

                  {/* Spacer */}
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`
        py-20 px-6 relative overflow-hidden
        ${
          theme === "light"
            ? "bg-gradient-to-br from-blue-50 to-cyan-50"
            : "bg-gradient-to-br from-blue-900/20 to-cyan-900/20"
        }
      `}
      >
        {/* Background Pattern */}
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
              rounded-3xl p-12 backdrop-blur-sm border-2
              ${
                theme === "light"
                  ? "bg-white/80 border-blue-200 shadow-2xl"
                  : "bg-gray-800/80 border-blue-700 shadow-2xl"
              }
            `}
          >
            <motion.div
              className="text-6xl mb-6"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🎯
            </motion.div>

            <h2
              className={`
              text-3xl md:text-4xl font-bold mb-6
              ${theme === "light" ? "text-gray-900" : "text-white"}
            `}
            >
              {t("about.cta.title") || "Ready to Experience Excellence?"}
            </h2>

            <p
              className={`
              text-xl leading-relaxed mb-8 max-w-2xl mx-auto
              ${theme === "light" ? "text-gray-700" : "text-gray-300"}
            `}
            >
              {t("about.cta.subtitle") ||
                "Join thousands of satisfied customers who trust us for their mobility needs. Discover why we're the preferred choice for car rentals."}
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link to="/vehicles">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 20px 40px -10px rgba(37, 99, 235, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group
                    bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl
                  `}
                >
                  <span className="relative z-10">
                    {t("about.cta.primaryButton") || "Explore Our Fleet"}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.button>
              </Link>

              <Link to="/contact">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 20px 40px -10px rgba(139, 92, 246, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-8 py-4 rounded-2xl font-bold text-lg border-2 transition-all duration-300 backdrop-blur-sm
                    ${
                      theme === "light"
                        ? "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white bg-white/80"
                        : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white bg-gray-800/80"
                    }
                  `}
                >
                  {t("about.cta.secondaryButton") || "Get In Touch"}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}