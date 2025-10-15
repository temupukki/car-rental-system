import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Camera,
  Car,
  HandCoins,
  MapPin,
  Wallet,
  Shield,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../components/LanguageContext";

export default function Home() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t("home.features.locations.title") || "Flexible Locations",
      description: t("home.features.locations.description") || "Pick up and drop off at multiple convenient locations"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t("home.features.service.title") || "24/7 Service",
      description: t("home.features.service.description") || "Round-the-clock booking and customer support"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("home.features.insurance.title") || "Fully Insured",
      description: t("home.features.insurance.description") || "Comprehensive insurance coverage for peace of mind"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t("home.features.family.title") || "Family Friendly",
      description: t("home.features.family.description") || "Spacious vehicles perfect for family trips"
    }
  ];

  const carFeatures = [
    t("home.carFeatures.gps") || "GPS Navigation System",
    t("home.carFeatures.bluetooth") || "Bluetooth Connectivity",
    t("home.carFeatures.climate") || "Climate Control",
    t("home.carFeatures.sound") || "Premium Sound System",
    t("home.carFeatures.camera") || "Backup Camera",
    t("home.carFeatures.seats") || "Leather Seats",
    t("home.carFeatures.sunroof") || "Sunroof/Moonroof"
  ];

  const cars = [
    {
      id: 1,
      name: t("home.cars.camry.name") || "Toyota Camry",
      type: t("home.cars.camry.type") || "Sedan",
      price: t("home.cars.camry.price") || "$45/day",
      image: "/camry.avif",
      features: [
        t("home.cars.camry.features.seats") || "5 Seats",
        t("home.cars.camry.features.transmission") || "Automatic",
        t("home.cars.camry.features.ac") || "Air Conditioning"
      ],
      rating: 4.8
    },
    {
      id: 2,
      name: t("home.cars.crv.name") || "Honda CR-V",
      type: t("home.cars.crv.type") || "SUV",
      price: t("home.cars.crv.price") || "$65/day",
      image: "/honda.png",
      features: [
        t("home.cars.crv.features.seats") || "7 Seats",
        t("home.cars.crv.features.drive") || "4WD",
        t("home.cars.crv.features.space") || "Spacious"
      ],
      rating: 4.7
    },
    {
      id: 3,
      name: t("home.cars.bmw.name") || "BMW 3 Series",
      type: t("home.cars.bmw.type") || "Luxury",
      price: t("home.cars.bmw.price") || "$89/day",
      image: "bmw.jfif",
      features: [
        t("home.cars.bmw.features.premium") || "Premium",
        t("home.cars.bmw.features.sport") || "Sport Mode",
        t("home.cars.bmw.features.leather") || "Leather"
      ],
      rating: 4.9
    }
  ];

  const mainFeatures = [
    {
      color: "blue",
      icon: <MapPin className="w-12 h-12 text-white" />,
      title: t("home.mainFeatures.availability.title") || "Easy Availability",
      description: t("home.mainFeatures.availability.description") || "Find and book your perfect car in minutes with our real-time availability system."
    },
    {
      color: "green",
      icon: <Car className="w-12 h-12 text-white" />,
      title: t("home.mainFeatures.comfort.title") || "Premium Comfort",
      description: t("home.mainFeatures.comfort.description") || "Travel in style with our well-maintained, comfortable, and clean vehicles."
    },
    {
      color: "orange",
      icon: <Wallet className="w-12 h-12 text-white" />,
      title: t("home.mainFeatures.savings.title") || "Great Savings",
      description: t("home.mainFeatures.savings.description") || "Competitive pricing with no hidden fees. Get the best value for your money."
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
    
      <div className="relative mx-4 md:mx-16 h-[600px] rounded-3xl mt-6 overflow-hidden">
      
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/honda.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
    
        <div className={`
          absolute inset-0
          ${theme === 'light' 
            ? 'bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-cyan-900/40' 
            : 'bg-gradient-to-r from-gray-900/60 via-blue-900/50 to-slate-900/60'
          }
        `} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full relative z-10">
          <div className="col-span-2 flex flex-col justify-center px-8 lg:px-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                font-bold text-4xl md:text-6xl leading-tight
                ${theme === 'light' ? 'text-white' : 'text-white'}
              `}
            >
              {t("home.hero.title.line1") || "Experience the road"}<br />
              {t("home.hero.title.line2") || "like never before"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`
                text-lg md:text-xl mt-6 max-w-2xl
                ${theme === 'light' ? 'text-gray-200' : 'text-gray-300'}
              `}
            >
              {t("home.hero.subtitle") || "Discover the perfect vehicle for your journey. From compact cars to luxury SUVs, we offer premium rental services with unmatched convenience and reliability."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 mt-8"
            >
              <Button className={`
                font-bold rounded-2xl px-8 py-3 text-lg
                ${theme === 'light'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
                }
              `}>
                {t("home.hero.cta.primary") || "View All Cars"}
              </Button>
              <Button variant="outline" className={`
                rounded-2xl px-8 py-3 text-lg
                ${theme === 'light'
                  ? 'bg-transparent border-white text-white hover:bg-white hover:text-gray-900'
                  : 'bg-transparent border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900'
                }
              `}>
                {t("home.hero.cta.secondary") || "Learn More"}
              </Button>
            </motion.div>
          </div>
          
          <div className="col-span-1 flex items-center justify-center lg:justify-end p-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className={`
                w-full max-w-md rounded-2xl shadow-2xl border-0 backdrop-blur-sm
                ${theme === 'light'
                  ? 'bg-white/95 border-gray-200'
                  : 'bg-gray-800/95 border-gray-700'
                }
              `}>
                <CardHeader className="text-center pb-4">
                  <CardTitle className={`
                    font-bold text-2xl
                    ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                  `}>
                    {t("home.bookingCard.title") || "Book Your Car"}
                  </CardTitle>
                  <CardDescription className={`
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {t("home.bookingCard.subtitle") || "Everything you need to hit the road."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className={`
                        flex items-center gap-2 p-3 rounded-lg
                        ${theme === 'light'
                          ? 'bg-gray-50 border border-gray-200'
                          : 'bg-gray-700/50 border border-gray-600'
                        }
                      `}>
                        <div className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'}>
                          {feature.icon}
                        </div>
                        <div className="text-left">
                          <p className={`
                            font-semibold text-sm
                            ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                          `}>
                            {feature.title}
                          </p>
                     
                        </div>
                      </div>
                    ))}
                  </div>

                  <a href="/signup">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full font-semibold py-4 rounded-xl transition-all duration-200 mt-4
                        ${theme === 'light'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                          : 'bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white'
                        }
                      `}
                    >
                      {t("home.bookingCard.button") || "Sign Up to Book"}
                    </motion.button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8 my-20">
        {mainFeatures.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`
              flex flex-col items-center text-center p-8 rounded-3xl shadow-lg border
              ${theme === 'light'
                ? `bg-gradient-to-br from-${feature.color}-50 to-white border-${feature.color}-100`
                : `bg-gradient-to-br from-gray-800 to-gray-900 border-${feature.color}-800`
              }
            `}
          >
            <div className={`
              p-4 rounded-2xl mb-6
              ${theme === 'light' 
                ? `bg-${feature.color}-500` 
                : `bg-${feature.color}-600`
              }
            `}>
              {feature.icon}
            </div>
            <h3 className={`
              text-2xl font-bold mb-4
              ${theme === 'light' ? 'text-gray-800' : 'text-white'}
            `}>
              {feature.title}
            </h3>
            <p className={`
              text-lg
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-8 my-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <img
            src="/02.jfif"
            alt="Premium Car"
            className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
          />
          <div className={`
            absolute bottom-6 left-6 backdrop-blur-sm rounded-2xl p-6 max-w-xs
            ${theme === 'light' 
              ? 'bg-white/90 border border-gray-200' 
              : 'bg-gray-800/90 border border-gray-700'
            }
          `}>
            <h3 className={`
              font-bold text-2xl
              ${theme === 'light' ? 'text-gray-800' : 'text-white'}
            `}>
              {t("home.carExperience.title") || "Luxury Experience"}
            </h3>
            <p className={`
              mt-2
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              {t("home.carExperience.subtitle") || "Premium vehicles for extraordinary journeys"}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <h2 className={`
            text-4xl font-bold mb-6
            ${theme === 'light' ? 'text-gray-800' : 'text-white'}
          `}>
            {t("home.whyChoose.title") || "Why Choose Our Cars?"}
          </h2>
          <p className={`
            text-lg mb-8
            ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
          `}>
            {t("home.whyChoose.description") || "Our fleet is meticulously maintained and equipped with the latest features to ensure your journey is safe, comfortable, and memorable."}
          </p>
          
          <div className="space-y-4">
            {carFeatures.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${theme === 'light'
                    ? 'hover:bg-gray-50'
                    : 'hover:bg-gray-800/50'
                  }
                `}
              >
                <CheckCircle className={`
                  w-5 h-5 flex-shrink-0
                  ${theme === 'light' ? 'text-green-500' : 'text-green-400'}
                `} />
                <span className={`
                  text-lg
                  ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                `}>
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          <Button className={`
            mt-8 rounded-2xl px-8 py-3 text-lg w-fit
            ${theme === 'light'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              : 'bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white'
            }
          `}>
            {t("home.whyChoose.button") || "Explore Features"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-8 my-20">
        <div className="text-center mb-12">
          <h2 className={`
            text-4xl font-bold mb-4
            ${theme === 'light' ? 'text-gray-800' : 'text-white'}
          `}>
            {t("home.featuredCars.title") || "Featured Vehicles"}
          </h2>
          <p className={`
            text-lg max-w-2xl mx-auto
            ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
          `}>
            {t("home.featuredCars.subtitle") || "Discover our handpicked selection of premium vehicles for every occasion and budget."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <motion.div
              key={car.id}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`
                rounded-3xl shadow-xl overflow-hidden group
                ${theme === 'light'
                  ? 'bg-white border border-gray-100'
                  : 'bg-gray-800 border border-gray-700'
                }
              `}
            >
              <div className="relative overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`
                  absolute top-4 right-4 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1
                  ${theme === 'light' ? 'bg-white/90' : 'bg-gray-800/90'}
                `}>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className={`
                    font-semibold text-sm
                    ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                  `}>
                    {car.rating}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`
                      font-bold text-xl
                      ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                    `}>
                      {car.name}
                    </h3>
                    <p className={`
                      text-sm
                      ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                    `}>
                      {car.type}
                    </p>
                  </div>
                  <span className={`
                    text-2xl font-bold
                    ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
                  `}>
                    {car.price}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className={`
                        px-3 py-1 rounded-full text-sm
                        ${theme === 'light'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-gray-700 text-gray-300'
                        }
                      `}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button className={`
                    flex-1 rounded-xl py-3
                    ${theme === 'light'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-700 hover:bg-blue-800 text-white'
                    }
                  `}>
                    {t("home.featuredCars.bookButton") || "Book Now"}
                  </Button>
                  <Button variant="outline" className={`
                    flex-1 rounded-xl py-3
                    ${theme === 'light'
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    }
                  `}>
                    {t("home.featuredCars.detailsButton") || "Details"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className={`
            rounded-2xl px-12 py-3 text-lg
            ${theme === 'light'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
              : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
            }
          `}>
            {t("home.featuredCars.viewAllButton") || "View All Vehicles"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      <div className={`
        rounded-3xl mx-8 my-20 p-12 text-center
        ${theme === 'light'
          ? 'bg-gradient-to-r from-blue-600 to-purple-600'
          : 'bg-gradient-to-r from-blue-700 to-purple-700'
        }
      `}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className={`
            text-4xl font-bold mb-4
            ${theme === 'light' ? 'text-white' : 'text-white'}
          `}>
            {t("home.cta.title") || "Ready to Start Your Journey?"}
          </h2>
          <p className={`
            text-lg mb-8 max-w-2xl mx-auto
            ${theme === 'light' ? 'text-blue-100' : 'text-gray-200'}
          `}>
            {t("home.cta.subtitle") || "Join thousands of satisfied customers who trust us for their travel needs. Book your perfect car today and hit the road with confidence."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className={`
              font-bold rounded-2xl px-8 py-3 text-lg
              ${theme === 'light'
                ? 'bg-white text-blue-600 hover:bg-gray-100'
                : 'bg-white text-blue-700 hover:bg-gray-100'
              }
            `}>
              {t("home.cta.primaryButton") || "Book Your Car Now"}
            </Button>
            <Button variant="outline" className={`
              rounded-2xl px-8 py-3 text-lg
              ${theme === 'light'
                ? 'border-white text-white hover:bg-white hover:text-blue-600'
                : 'border-white text-white hover:bg-white hover:text-blue-700'
              }
            `}>
              {t("home.cta.secondaryButton") || "Contact Us"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}