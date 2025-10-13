import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../components/LanguageContext";
import { useState } from "react";

export default function Services() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: t('services.all'), icon: "🚗" },
    { id: "luxury", name: t('services.luxury'), icon: "🏎️" },
    { id: "suv", name: t('services.suv'), icon: "🚙" },
    { id: "sedan", name: t('services.sedan'), icon: "🚘" },
    { id: "economy", name: t('services.economy'), icon: "💰" },
    { id: "sports", name: t('services.sports'), icon: "⚡" },
    { id: "vans", name: t('services.vans'), icon: "🚐" }
  ];

  const carCategories = [
    {
      id: 1,
      name: t('services.luxury'),
      category: "luxury",
      description: t('services.luxuryDesc'),
      image: "/cars/luxury-mercedes.jpg",
      count: "12 vehicles",
      price: "From $99/day",
      features: ["Premium brands", "Leather interior", "Advanced tech", "VIP service"],
      popular: true
    },
    {
      id: 2,
      name: t('services.suv'),
      category: "suv",
      description: t('services.suvDesc'),
      image: "/cars/suv-range-rover.jpg",
      count: "18 vehicles",
      price: "From $69/day",
      features: ["7-seater options", "Family friendly", "All-wheel drive", "Spacious"],
      popular: false
    },
    {
      id: 3,
      name: t('services.sedan'),
      category: "sedan",
      description: t('services.sedanDesc'),
      image: "/cars/sedan-camry.jpg",
      count: "25 vehicles",
      price: "From $49/day",
      features: ["Fuel efficient", "Comfortable", "Business ready", "GPS included"],
      popular: false
    },
    {
      id: 4,
      name: t('services.economy'),
      category: "economy",
      description: t('services.economyDesc'),
      image: "/cars/economy-corolla.jpg",
      count: "30 vehicles",
      price: "From $29/day",
      features: ["Budget friendly", "Great mileage", "Easy to drive", "Reliable"],
      popular: false
    },
    {
      id: 5,
      name: t('services.sports'),
      category: "sports",
      description: t('services.sportsDesc'),
      image: "/cars/sports-porsche.jpg",
      count: "8 vehicles",
      price: "From $149/day",
      features: ["High performance", "Sport design", "Premium sound", "Fast & agile"],
      popular: true
    },
    {
      id: 6,
      name: t('services.vans'),
      category: "vans",
      description: t('services.vansDesc'),
      image: "/cars/van-hiace.jpg",
      count: "15 vehicles",
      price: "From $79/day",
      features: ["Large capacity", "Group travel", "Luggage space", "Comfortable"],
      popular: false
    }
  ];

  const featuredCars = [
    {
      id: 1,
      name: "Mercedes-Benz S-Class",
      category: "luxury",
      image: "/cars/featured-mercedes.jpg",
      price: "$129/day",
      specs: ["Automatic", "Premium", "2023 Model"],
      featured: true
    },
    {
      id: 2,
      name: "Toyota RAV4",
      category: "suv",
      image: "/cars/featured-rav4.jpg",
      price: "$79/day",
      specs: ["SUV", "Family", "2024 Model"],
      featured: true
    },
    {
      id: 3,
      name: "BMW 3 Series",
      category: "sedan",
      image: "/cars/featured-bmw.jpg",
      price: "$89/day",
      specs: ["Luxury", "Sport", "2023 Model"],
      featured: true
    },
    {
      id: 4,
      name: "Porsche 911",
      category: "sports",
      image: "/cars/featured-porsche.jpg",
      price: "$199/day",
      specs: ["Sports", "Premium", "2024 Model"],
      featured: true
    },
    {
      id: 5,
      name: "Toyota Hiace",
      category: "vans",
      image: "/cars/featured-hiace.jpg",
      price: "$89/day",
      specs: ["Van", "Spacious", "2023 Model"],
      featured: true
    },
    {
      id: 6,
      name: "Toyota Corolla",
      category: "economy",
      image: "/cars/featured-corolla.jpg",
      price: "$39/day",
      specs: ["Economy", "Efficient", "2024 Model"],
      featured: true
    }
  ];

  const filteredCategories = activeCategory === "all" 
    ? carCategories 
    : carCategories.filter(car => car.category === activeCategory);

  const filteredFeaturedCars = activeCategory === "all"
    ? featuredCars
    : featuredCars.filter(car => car.category === activeCategory);

  return (
    <div className={`
      min-h-screen transition-all duration-500
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 to-gray-100' 
        : 'bg-gradient-to-br from-gray-900 to-blue-900'
      }
    `}>
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`
              text-4xl md:text-6xl font-bold mb-6
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}
          >
            {t('services.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className={`
              text-xl md:text-2xl max-w-3xl mx-auto mb-8
              ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
            `}
          >
            {t('services.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300
                  ${theme === 'light'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }
                `}
              >
                {t('services.cta.primary')}
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300
                ${theme === 'light'
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  : 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
                }
              `}
            >
              {t('services.cta.secondary')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 border-2
                  ${activeCategory === category.id
                    ? theme === 'light'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                      : 'bg-blue-500 text-white border-blue-500 shadow-lg'
                    : theme === 'light'
                      ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-400'
                      : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-blue-400'
                  }
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`
              text-3xl md:text-4xl font-bold text-center mb-12
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}
          >
            {t('services.featuredTitle')}
          </motion.h2>

          <AnimatePresence mode="wait">
            {filteredFeaturedCars.length > 0 ? (
              <motion.div
                key={`featured-${activeCategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              >
                {filteredFeaturedCars.map((car, index) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -10 }}
                    className={`
                      rounded-2xl overflow-hidden shadow-2xl transition-all duration-300
                      ${theme === 'light' 
                        ? 'bg-white' 
                        : 'bg-gray-800'
                      }
                    `}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                      {/* Car Image Placeholder - Replace with actual images */}
                      <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                        🚗
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className={`
                          px-3 py-1 rounded-full text-sm font-semibold
                          ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}
                        `}>
                          {car.category === 'luxury' ? t('services.luxury') : 
                           car.category === 'suv' ? t('services.suv') : 
                           car.category === 'sedan' ? t('services.sedan') :
                           car.category === 'sports' ? t('services.sports') :
                           car.category === 'vans' ? t('services.vans') :
                           car.category === 'economy' ? t('services.economy') : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className={`
                        text-xl font-bold mb-2
                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                      `}>
                        {car.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {car.specs.map((spec, idx) => (
                          <span
                            key={idx}
                            className={`
                              px-2 py-1 rounded text-xs
                              ${theme === 'light' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-blue-900 text-blue-300'
                              }
                            `}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`
                          text-2xl font-bold
                          ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
                        `}>
                          {car.price}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300
                            ${theme === 'light'
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                            }
                          `}
                        >
                          {t('services.rentNow')}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-featured"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🚫</div>
                <p className={`
                  text-xl
                  ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  {t('services.noFeatured')}
                </p>
                <p className={`
                  mt-2
                  ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}
                `}>
                  {t('services.tryAnother')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Car Categories */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`
              text-3xl md:text-4xl font-bold text-center mb-12
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}
          >
            {t('services.categoriesTitle')}
          </motion.h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={`categories-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`
                    relative rounded-2xl overflow-hidden shadow-xl transition-all duration-300
                    ${theme === 'light'
                      ? 'bg-white hover:shadow-2xl'
                      : 'bg-gray-800 hover:shadow-2xl'
                    }
                    ${category.popular ? 'ring-2 ring-yellow-400' : ''}
                  `}
                >
                  {category.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold">
                        {t('services.popular')}
                      </span>
                    </div>
                  )}

                  {/* Category Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                      {category.category === 'luxury' ? '🏎️' :
                       category.category === 'suv' ? '🚙' :
                       category.category === 'sedan' ? '🚘' :
                       category.category === 'economy' ? '💰' :
                       category.category === 'sports' ? '⚡' :
                       category.category === 'vans' ? '🚐' : '🚗'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                      <p className="text-blue-200">{category.count}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className={`
                      mb-4
                      ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                    `}>
                      {category.description}
                    </p>

                    <div className="mb-4">
                      <h4 className={`
                        font-semibold mb-2
                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                      `}>
                        {t('services.includes')}:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className={`
                              px-3 py-1 rounded-full text-sm
                              ${theme === 'light'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-blue-900 text-blue-300 border border-blue-700'
                              }
                            `}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`
                        text-xl font-bold
                        ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
                      `}>
                        {category.price}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          px-6 py-2 rounded-lg font-semibold transition-all duration-300
                          ${theme === 'light'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                          }
                        `}
                      >
                        {t('services.viewCars')}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`
        py-16 px-6
        ${theme === 'light' 
          ? 'bg-white' 
          : 'bg-gray-800'
        }
      `}>
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`
              text-3xl md:text-4xl font-bold mb-12
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}
          >
            {t('services.whyChoose')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🚗", title: t('services.why1'), desc: t('services.whyDesc1') },
              { icon: "💰", title: t('services.why2'), desc: t('services.whyDesc2') },
              { icon: "⭐", title: t('services.why3'), desc: t('services.whyDesc3') }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className={`
                  text-xl font-bold mb-3
                  ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                `}>
                  {item.title}
                </h3>
                <p className={`
                  ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                `}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}