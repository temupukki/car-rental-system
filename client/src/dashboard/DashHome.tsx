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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Session hook
const useSession = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch /api/me");

        const data = await res.json();
        setSession(data);
      } catch (err) {
        console.error("Error fetching /api/me:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  return { session, loading };
};

export default function DHome() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { session, loading } = useSession();
  const navigate = useNavigate();

  // Redirect if not logged in (you can remove this if you want public access)
  useEffect(() => {
    if (!loading && !session) {
      navigate("/");
    }
  }, [session, loading, navigate]);

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

  // Get user's first name for welcome message
  const getFirstName = (name: string) => {
    if (!name) return "there";
    return name.split(" ")[0];
  };

  if (loading) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center transition-all duration-500
        ${theme === 'light' 
          ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
          : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
        }
      `}>
        <div className="text-center">
          <div className={`
            animate-spin rounded-full h-16 w-16 border-b-2 mx-auto
            ${theme === 'light' ? 'border-blue-600' : 'border-blue-400'}
          `}></div>
          <p className={`
            mt-4 text-lg
            ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
          `}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      min-h-screen transition-all duration-500
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
      }
    `}>
    
      {/* Welcome Message */}
      {session && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mx-8 mt-6 p-6 rounded-2xl backdrop-blur-sm border
            ${theme === 'light'
              ? 'bg-white/80 border-gray-200'
              : 'bg-gray-800/80 border-gray-700'
            }
          `}
        >
          <div className="max-w-6xl mx-auto text-center">
            <h1 className={`
              text-3xl font-bold
              ${theme === 'light' ? 'text-gray-800' : 'text-white'}
            `}>
              Welcome back, {getFirstName(session.user?.name || session.user?.email)}! 👋
            </h1>
            <p className={`
              text-lg mt-2
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              Ready to find your perfect ride for your next adventure?
            </p>
          </div>
        </motion.div>
      )}
    
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
                    {session ? t("home.bookingCard.titleLoggedIn") || "Ready to Drive?" : t("home.bookingCard.title") || "Book Your Car"}
                  </CardTitle>
                  <CardDescription className={`
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {session ? t("home.bookingCard.subtitleLoggedIn") || "Your perfect car is waiting!" : t("home.bookingCard.subtitle") || "Everything you need to hit the road."}
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

                  <a href={session ? "/vehicles" : "/sign-in"}>
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
                      {session ? t("home.bookingCard.buttonLoggedIn") || "Browse Vehicles" : t("home.bookingCard.button") || "Sign Up to Book"}
                    </motion.button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Rest of your existing content remains the same */}
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

      {/* ... rest of your existing JSX remains exactly the same ... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-8 my-20">
        {/* ... existing content ... */}
      </div>

      <div className="max-w-7xl mx-auto px-8 my-20">
        {/* ... existing content ... */}
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