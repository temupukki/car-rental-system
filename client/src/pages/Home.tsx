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
  Car,
  MapPin,
  Wallet,
  Shield,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../components/LanguageContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/me");
        if (response.ok) {
          navigate("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const features = [
    {
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t("home.features.locations.title") || "Flexible Locations",
      description:
        t("home.features.locations.description") ||
        "Pick up and drop off at multiple convenient locations",
    },
    {
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t("home.features.service.title") || "24/7 Service",
      description:
        t("home.features.service.description") ||
        "Round-the-clock booking and customer support",
    },
    {
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: t("home.features.insurance.title") || "Fully Insured",
      description:
        t("home.features.insurance.description") ||
        "Comprehensive insurance coverage for peace of mind",
    },
  ];

  const carFeatures = [
    t("home.carFeatures.gps") || "GPS Navigation System",
    t("home.carFeatures.bluetooth") || "Bluetooth Connectivity",
    t("home.carFeatures.climate") || "Climate Control",
    t("home.carFeatures.sound") || "Premium Sound System",
    t("home.carFeatures.camera") || "Backup Camera",
    t("home.carFeatures.seats") || "Leather Seats",
    t("home.carFeatures.sunroof") || "Sunroof/Moonroof",
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
        t("home.cars.camry.features.ac") || "Air Conditioning",
      ],
      rating: 4.8,
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
        t("home.cars.crv.features.space") || "Spacious",
      ],
      rating: 4.7,
    },
    {
      id: 3,
      name: t("home.cars.bmw.name") || "BMW 3 Series",
      type: t("home.cars.bmw.type") || "Luxury",
      price: t("home.cars.bmw.price") || "$89/day",
      image: "/bmw.jfif",
      features: [
        t("home.cars.bmw.features.premium") || "Premium",
        t("home.cars.bmw.features.sport") || "Sport Mode",
        t("home.cars.bmw.features.leather") || "Leather",
      ],
      rating: 4.9,
    },
  ];

  const mainFeatures = [
    {
      color: "blue",
      icon: <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: t("home.mainFeatures.availability.title") || "Easy Availability",
      description:
        t("home.mainFeatures.availability.description") ||
        "Find and book your perfect car in minutes with our real-time availability system.",
    },
    {
      color: "green",
      icon: <Car className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: t("home.mainFeatures.comfort.title") || "Premium Comfort",
      description:
        t("home.mainFeatures.comfort.description") ||
        "Travel in style with our well-maintained, comfortable, and clean vehicles.",
    },
    {
      color: "orange",
      icon: <Wallet className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: t("home.mainFeatures.savings.title") || "Great Savings",
      description:
        t("home.mainFeatures.savings.description") ||
        "Competitive pricing with no hidden fees. Get the best value for your money.",
    },
  ];

  if (isLoading) {
    return (
      <div
        className={`
        min-h-screen flex items-center justify-center transition-all duration-500
        ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
            : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
        }
      `}
      >
        <div className="text-center">
          <div
            className={`
            animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4
            ${theme === "light" ? "border-blue-600" : "border-blue-400"}
          `}
          ></div>
          <p
            className={`
            text-lg
            ${theme === "light" ? "text-gray-600" : "text-gray-400"}
          `}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

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
      <div className="relative mx-4 md:mx-8 lg:mx-16 h-auto lg:h-[600px] rounded-3xl mt-4 lg:mt-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/honda.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div
          className={`
          absolute inset-0
          ${
            theme === "light"
              ? "bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-cyan-900/40"
              : "bg-gradient-to-r from-gray-900/60 via-blue-900/50 to-slate-900/60"
          }
        `}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 h-full relative z-10 py-8 lg:py-0">
          <div className="col-span-2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-center lg:text-left
                ${theme === "light" ? "text-white" : "text-white"}
              `}
            >
              {t("home.hero.title.line1") || "Experience the road"}
              <br />
              {t("home.hero.title.line2") || "like never before"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`
                text-base sm:text-lg md:text-xl mt-4 sm:mt-6 max-w-2xl text-center lg:text-left mx-auto lg:mx-0
                ${theme === "light" ? "text-gray-200" : "text-gray-300"}
              `}
            >
              {t("home.hero.subtitle") ||
                "Discover the perfect vehicle for your journey. From compact cars to luxury SUVs, we offer premium rental services with unmatched convenience and reliability."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center lg:justify-start"
            >
              <Link to="/sign">
                <Button
                  className={`
                font-bold rounded-2xl px-6 sm:px-8 py-3 text-base sm:text-lg
                ${
                  theme === "light"
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }
              `}
                >
                  {t("home.hero.cta.primary") || "View All Cars"}
                </Button>
              </Link>
              <Link to="/sign">
                <Button
                  variant="outline"
                  className={`
                rounded-2xl px-6 sm:px-8 py-3 text-base sm:text-lg
                ${
                  theme === "light"
                    ? "bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
                    : "bg-transparent border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
                }
              `}
                >
                  {t("home.hero.cta.secondary") || "Learn More"}
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="col-span-1 flex items-center justify-center lg:justify-end p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-sm lg:max-w-md"
            >
              <Card
                className={`
                w-full rounded-2xl shadow-2xl border-0 backdrop-blur-sm
                ${
                  theme === "light"
                    ? "bg-white/95 border-gray-200"
                    : "bg-gray-800/95 border-gray-700"
                }
              `}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle
                    className={`
                    font-bold text-xl sm:text-2xl
                    ${theme === "light" ? "text-gray-800" : "text-white"}
                  `}
                  >
                    {t("home.bookingCard.title") || "Book Your Car"}
                  </CardTitle>
                  <CardDescription
                    className={`
                    text-sm sm:text-base
                    ${theme === "light" ? "text-gray-600" : "text-gray-400"}
                  `}
                  >
                    {t("home.bookingCard.subtitle") ||
                      "Everything you need to hit the road."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className={`
                        flex items-center gap-3 p-3 rounded-lg
                        ${
                          theme === "light"
                            ? "bg-gray-50 border border-gray-200"
                            : "bg-gray-700/50 border border-gray-600"
                        }
                      `}
                      >
                        <div
                          className={
                            theme === "light"
                              ? "text-blue-600"
                              : "text-blue-400"
                          }
                        >
                          {feature.icon}
                        </div>
                        <div className="text-left flex-1">
                          <p
                            className={`
                            font-semibold text-sm sm:text-base
                            ${
                              theme === "light" ? "text-gray-800" : "text-white"
                            }
                          `}
                          >
                            {feature.title}
                          </p>
                          <p
                            className={`
                            text-xs sm:text-sm mt-1
                            ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-400"
                            }
                          `}
                          >
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a href="/sign" className="block">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full font-semibold py-3 sm:py-4 rounded-xl transition-all duration-200 mt-4 text-base sm:text-lg
                        ${
                          theme === "light"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            : "bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-12 sm:my-16 lg:my-20">
        {mainFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className={`
              flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl shadow-lg border transition-all duration-300
              ${
                theme === "light"
                  ? `bg-white border-${feature.color}-100 hover:shadow-xl`
                  : `bg-gray-800 border-${feature.color}-800 hover:shadow-2xl`
              }
            `}
          >
            <div
              className={`
              p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6
              ${
                theme === "light"
                  ? `bg-${feature.color}-500`
                  : `bg-${feature.color}-600`
              }
            `}
            >
              {feature.icon}
            </div>
            <h3
              className={`
              text-xl sm:text-2xl font-bold mb-3 sm:mb-4
              ${theme === "light" ? "text-gray-800" : "text-white"}
            `}
            >
              {feature.title}
            </h3>
            <p
              className={`
              text-sm sm:text-lg leading-relaxed
              ${theme === "light" ? "text-gray-600" : "text-gray-400"}
            `}
            >
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 sm:my-16 lg:my-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className={`
            text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4
            ${theme === "light" ? "text-gray-800" : "text-white"}
          `}
          >
            {t("home.featuredCars.title") || "Featured Vehicles"}
          </h2>
          <p
            className={`
            text-base sm:text-lg max-w-2xl mx-auto px-4
            ${theme === "light" ? "text-gray-600" : "text-gray-400"}
          `}
          >
            {t("home.featuredCars.subtitle") ||
              "Discover our handpicked selection of premium vehicles for every occasion and budget."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cars.map((car) => (
            <motion.div
              key={car.id}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`
                rounded-3xl shadow-xl overflow-hidden group
                ${
                  theme === "light"
                    ? "bg-white border border-gray-100"
                    : "bg-gray-800 border border-gray-700"
                }
              `}
            >
              <div className="relative overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  className={`
                  absolute top-3 right-3 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1
                  ${theme === "light" ? "bg-white/90" : "bg-gray-800/90"}
                `}
                >
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                  <span
                    className={`
                    font-semibold text-xs sm:text-sm
                    ${theme === "light" ? "text-gray-800" : "text-white"}
                  `}
                  >
                    {car.rating}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3
                      className={`
                      font-bold text-lg sm:text-xl
                      ${theme === "light" ? "text-gray-800" : "text-white"}
                    `}
                    >
                      {car.name}
                    </h3>
                    <p
                      className={`
                      text-xs sm:text-sm
                      ${theme === "light" ? "text-gray-500" : "text-gray-400"}
                    `}
                    >
                      {car.type}
                    </p>
                  </div>
                  <span
                    className={`
                    text-xl sm:text-2xl font-bold
                    ${theme === "light" ? "text-blue-600" : "text-blue-400"}
                  `}
                  >
                    {car.price}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className={`
                        px-2 py-1 rounded-full text-xs sm:text-sm
                        ${
                          theme === "light"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-gray-700 text-gray-300"
                        }
                      `}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div>
                  <Link to="/sign">
                    <Button
                      className={`
                     rounded-xl py-2 sm:py-3 text-sm sm:text-base w-full
                    ${
                      theme === "light"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-700 hover:bg-blue-800 text-white"
                    }
                  `}
                    >
                      {t("home.featuredCars.bookButton") || "Book Now"}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link to="/sign">
            <Button
              className={`
            rounded-2xl px-8 sm:px-12 py-3 text-base sm:text-lg
            ${
              theme === "light"
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
            }
          `}
            >
              {t("home.featuredCars.viewAllButton") || "View All Vehicles"}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <div
        className={`
        rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-12 sm:my-16 lg:my-20 p-6 sm:p-8 lg:p-12 text-center
        ${
          theme === "light"
            ? "bg-gradient-to-r from-blue-600 to-purple-600"
            : "bg-gradient-to-r from-blue-700 to-purple-700"
        }
      `}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2
            className={`
            text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4
            ${theme === "light" ? "text-white" : "text-white"}
          `}
          >
            {t("home.cta.title") || "Ready to Start Your Journey?"}
          </h2>
          <p
            className={`
            text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto
            ${theme === "light" ? "text-blue-100" : "text-gray-200"}
          `}
          >
            {t("home.cta.subtitle") ||
              "Join thousands of satisfied customers who trust us for their travel needs. Book your perfect car today and hit the road with confidence."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/sign">
              <Button
                className={`
              font-bold rounded-2xl px-6 sm:px-8 py-3 text-base sm:text-lg
              ${
                theme === "light"
                  ? "bg-white text-blue-600 hover:bg-gray-100"
                  : "bg-white text-blue-700 hover:bg-gray-100"
              }
            `}
              >
                {t("home.cta.primaryButton") || "Book Your Car Now"}
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                className={`
              rounded-2xl px-6 sm:px-8 py-3 text-base sm:text-lg
              ${
                theme === "light"
                  ? "border-white text-white hover:bg-white hover:text-blue-600"
                  : "border-white text-white hover:bg-white hover:text-blue-700"
              }
            `}
              >
                {t("home.cta.secondaryButton") || "Contact Us"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
