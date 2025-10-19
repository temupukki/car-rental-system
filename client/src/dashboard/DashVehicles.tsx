import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Car,
  Users,
  Fuel,
  Gauge,
  Star,
  Heart,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  CarFront,
  SlidersHorizontal,
} from "lucide-react";
import { useLanguage } from "../components/LanguageContext";
import { useTheme } from "../components/ThemeContext";
import { apiService } from "../services/api";
import type { Vehicle } from "../types/vehicle";

interface VehicleType {
  value: string;
  label: string;
}
interface VehicleCardProps {
  vehicle: Vehicle;
  theme: string;
  onBookNow: (vehicle: Vehicle) => void;
  onToggleFavorite: (id: string) => void;
  vehicleTypes: VehicleType[];
  t: (key: string) => string | undefined;
}

export default function DVehicles() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");

  const vehicleTypes: VehicleType[] = [
    { value: "all", label: t("vehicles.allVehicles") || "All Vehicles" },
    { value: "SEDAN", label: t("vehicles.sedan") || "Sedan" },
    { value: "SUV", label: t("vehicles.suv") || "SUV" },
    { value: "LUXURY", label: t("vehicles.luxury") || "Luxury" },
    { value: "SPORTS", label: t("vehicles.sports") || "Sports" },
    { value: "COMPACT", label: t("vehicles.compact") || "Compact" },
    { value: "VAN", label: t("vehicles.van") || "Van" },
  ];

  const sortOptions = [
    { value: "featured", label: t("vehicles.featured") || "Featured" },
    { value: "price-low", label: t("vehicles.priceLow") || "Price: Low to High" },
    { value: "price-high", label: t("vehicles.priceHigh") || "Price: High to Low" },
    { value: "rating", label: t("vehicles.rating") || "Highest Rated" },
  ];

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        type: selectedType !== 'all' ? selectedType : undefined,
        search: searchTerm || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 200 ? priceRange[1] : undefined,
      };
      
      const data = await apiService.getVehicles(filters);
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vehicles');
      console.error('Error loading vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (): void => {
    loadVehicles();
  };

  const handleBookNow = async (vehicle: Vehicle): Promise<void> => {
    try {
      // In a real app, you'd have user authentication
      const userId = "user-id-from-auth"; // Get from your auth system
      
      // Navigate to booking page or open modal
      console.log('Booking vehicle:', vehicle);
      // You would typically navigate to a booking page:
      // navigate(`/booking/${vehicle.id}`);
    } catch (err) {
      console.error('Error booking vehicle:', err);
    }
  };

  const toggleFavorite = (id: string): void => {
    console.log("Toggle favorite:", id);
  };

  const filteredVehicles = vehicles
    .filter((vehicle: Vehicle) => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || vehicle.type === selectedType;
      const matchesPrice = vehicle.pricePerDay >= priceRange[0] && vehicle.pricePerDay <= priceRange[1];

      return matchesSearch && matchesType && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricePerDay - b.pricePerDay;
        case "price-high":
          return b.pricePerDay - a.pricePerDay;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setPriceRange([0, 200]);
    setSortBy("featured");
    loadVehicles();
  };

  if (loading) {
    return (
      <div className={`
        min-h-screen transition-all duration-500 flex items-center justify-center
        ${theme === 'light' 
          ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
          : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
        }
      `}>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <Car className="w-16 h-16 text-blue-600 mb-4" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border-4 border-blue-600 border-t-transparent rounded-full"
              />
            </div>
            <h3 className={`
              text-xl font-semibold mb-2
              ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
            `}>
              Loading Amazing Rides...
            </h3>
            <p className={`
              ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
            `}>
              Preparing your perfect vehicle collection
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`
        min-h-screen transition-all duration-500 flex items-center justify-center
        ${theme === 'light' 
          ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
          : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
        }
      `}>
        <div className="text-center max-w-md mx-auto p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4
              ${theme === 'light' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-red-900/50 text-red-400'
              }
            `}>
              <Car className="w-10 h-10" />
            </div>
            <h3 className={`
              text-xl font-semibold mb-2
              ${theme === 'light' ? 'text-gray-800' : 'text-white'}
            `}>
              Oops! Something went wrong
            </h3>
            <p className={`
              mb-6
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              {error}
            </p>
            <Button onClick={loadVehicles} className="rounded-xl">
              Try Again
            </Button>
          </motion.div>
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
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-b-3xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/cars/vehicle-hero.jpg')",
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 flex items-center justify-center text-center px-8"
        >
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t("vehicles.hero.title.line1") || "Discover Your"}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                {t("vehicles.hero.title.line2") || "Dream Ride"}
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
            >
              {t("vehicles.hero.subtitle") || "Explore our premium collection of vehicles. From luxury sedans to spacious SUVs, find the perfect car for your journey."}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`
            rounded-2xl shadow-2xl border-0 backdrop-blur-sm
            ${theme === 'light'
              ? 'bg-white/95 border-gray-200'
              : 'bg-gray-800/95 border-gray-700'
            }
          `}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <Label htmlFor="search" className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Search className="w-4 h-4" />
                    {t("vehicles.searchLabel") || "Search Vehicles"}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="search"
                      placeholder={t("vehicles.searchPlaceholder") || "Search by car name, brand, or type..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className={`
                        flex-1
                        ${theme === 'light'
                          ? 'border-gray-300 bg-white text-gray-900'
                          : 'border-gray-600 bg-gray-700 text-white'
                        }
                      `}
                    />
                    <Button onClick={handleSearch} className="whitespace-nowrap">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Filter className="w-4 h-4" />
                    {t("vehicles.vehicleType") || "Vehicle Type"}
                  </Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className={`
                      ${theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-gray-600 bg-gray-700 text-white'
                      }
                    `}>
                      <SelectValue placeholder={t("vehicles.selectTypePlaceholder") || "Select type"} />
                    </SelectTrigger>
                    <SelectContent className={`
                      ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
                    `}>
                      {vehicleTypes.map((type) => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value}
                          className={theme === 'light' ? 'text-gray-900' : 'text-white'}
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Price Range
                    <span className={`
                      font-bold ml-auto
                      ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
                    `}>
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </Label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className={`
                        w-full h-2 rounded-lg appearance-none cursor-pointer
                        ${theme === 'light' 
                          ? 'bg-gray-200 [&::-webkit-slider-thumb]:bg-blue-600' 
                          : 'bg-gray-600 [&::-webkit-slider-thumb]:bg-blue-400'
                        }
                      `}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant={selectedType === "all" ? "default" : "outline"}
                  onClick={() => setSelectedType("all")}
                  className="rounded-xl text-sm"
                >
                  {t("vehicles.allVehicles") || "All Cars"}
                </Button>
                {vehicleTypes.slice(1).map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "outline"}
                    onClick={() => setSelectedType(type.value)}
                    className="rounded-xl text-sm"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h2 className={`
              text-3xl font-bold
              ${theme === 'light' ? 'text-gray-800' : 'text-white'}
            `}>
              {t("vehicles.availableVehicles") || "Available Vehicles"}
            </h2>
            <p className={`
              mt-2
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              {filteredVehicles.length} {t("vehicles.vehiclesFound") || "vehicles found"}
              {selectedType !== "all" &&
                ` ${t("vehicles.inCategory") || "in"} ${
                  vehicleTypes.find((t) => t.value === selectedType)?.label
                }`}
              {searchTerm && ` ${t("vehicles.forSearch") || "for"} "${searchTerm}"`}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={`
                w-[180px] rounded-xl
                ${theme === 'light'
                  ? 'border-gray-300 bg-white text-gray-900'
                  : 'border-gray-600 bg-gray-700 text-white'
                }
              `}>
                <SelectValue placeholder={t("vehicles.sortBy") || "Sort by"} />
              </SelectTrigger>
              <SelectContent className={`
                ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
              `}>
                {sortOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className={theme === 'light' ? 'text-gray-900' : 'text-white'}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <AnimatePresence>
          {filteredVehicles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`
                  w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6
                  ${theme === 'light' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-blue-900/30 text-blue-400'
                  }
                `}
              >
                <CarFront className="w-16 h-16" />
              </motion.div>
              
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`
                  text-2xl font-bold mb-3
                  ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                `}
              >
                No Vehicles Found
              </motion.h3>
              
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`
                  text-lg mb-6 max-w-md mx-auto
                  ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                `}
              >
                We couldn't find any vehicles matching your criteria. Try adjusting your search filters or browse all available vehicles.
              </motion.p>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button onClick={resetFilters} className="rounded-xl">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
                <Button variant="outline" onClick={loadVehicles} className="rounded-xl">
                  <Car className="w-4 h-4 mr-2" />
                  Browse All Vehicles
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              layout
            >
              {filteredVehicles.map((vehicle) => (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  theme={theme}
                  onBookNow={handleBookNow}
                  onToggleFavorite={toggleFavorite}
                  vehicleTypes={vehicleTypes}
                  t={t}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredVehicles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              className={`
                rounded-2xl px-8 py-3 font-semibold
                ${theme === 'light'
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  : 'border-blue-400 text-blue-400 hover:bg-blue-900/20'
                }
              `}
            >
              {t("vehicles.loadMore") || "Load More Vehicles"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 my-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className={`
            rounded-3xl p-8 text-white shadow-2xl
            ${theme === 'light'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600'
              : 'bg-gradient-to-r from-blue-700 to-purple-700'
            }
          `}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("vehicles.benefits.insured.title") || "Fully Insured"}
              </h3>
              <p className="text-blue-100">
                {t("vehicles.benefits.insured.description") || "Comprehensive coverage for complete peace of mind"}
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("vehicles.benefits.support.title") || "24/7 Support"}
              </h3>
              <p className="text-blue-100">
                {t("vehicles.benefits.support.description") || "Round-the-clock assistance whenever you need it"}
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("vehicles.benefits.price.title") || "Best Price Guarantee"}
              </h3>
              <p className="text-blue-100">
                {t("vehicles.benefits.price.description") || "Find a better price? We'll match it!"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced Vehicle Card Component
const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  theme, 
  onBookNow, 
  onToggleFavorite, 
  vehicleTypes,
  t 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300
        ${theme === 'light'
          ? 'bg-white border border-gray-100'
          : 'bg-gray-800 border border-gray-700'
        }
      `}
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {!imageLoaded && !imageError && (
            <Car className="w-12 h-12 text-gray-400 animate-pulse" />
          )}
          <img
            src={imageError ? "/cars/placeholder-car.jpg" : (vehicle.image || "/cars/placeholder-car.jpg")}
            alt={vehicle.name}
            className={`w-full h-48 object-cover transition-all duration-500 ${
              imageLoaded ? 'group-hover:scale-110 opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(vehicle.id)}
          className={`
            absolute top-3 right-3 p-2 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm
            ${theme === 'light' 
              ? 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500' 
              : 'bg-gray-800/90 hover:bg-gray-700 text-gray-400 hover:text-red-400'
            }
          `}
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Vehicle Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold shadow-lg
            ${theme === 'light'
              ? 'bg-blue-500 text-white'
              : 'bg-blue-600 text-white'
            }
          `}>
            {vehicleTypes.find((t: { value: any; }) => t.value === vehicle.type)?.label || 
             vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
          </span>
        </div>

        {/* Rating Badge */}
        <div className={`
          absolute bottom-3 left-3 rounded-full px-3 py-1 flex items-center gap-1 shadow-lg backdrop-blur-sm
          ${theme === 'light' ? 'bg-white/90' : 'bg-gray-800/90'}
        `}>
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className={`
            font-semibold text-sm
            ${theme === 'light' ? 'text-gray-800' : 'text-white'}
          `}>
            {vehicle.rating}
          </span>
          <span className={`
            text-sm
            ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
          `}>
            ({vehicle.reviewCount})
          </span>
        </div>

        {/* Location Badge */}
        {vehicle.location && (
          <div className={`
            absolute bottom-3 right-3 rounded-full px-3 py-1 flex items-center gap-1 shadow-lg backdrop-blur-sm
            ${theme === 'light' ? 'bg-white/90' : 'bg-gray-800/90'}
          `}>
            <MapPin className="w-3 h-3" />
            <span className={`
              text-xs font-medium
              ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
            `}>
              {vehicle.location}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className={`
              font-bold text-lg mb-1 line-clamp-1
              ${theme === 'light' ? 'text-gray-800' : 'text-white'}
            `}>
              {vehicle.name}
            </h3>
            <p className={`
              text-sm
              ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
            `}>
              {t("vehicles.perDay") || "Per day"}
            </p>
          </div>
          <div className="text-right">
            <span className={`
              text-2xl font-bold
              ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
            `}>
              ${vehicle.pricePerDay}
            </span>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`
            flex items-center gap-2 text-sm
            ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
          `}>
            <Users className="w-4 h-4" />
            <span>{vehicle.seats} {t("vehicles.passengers") || "Pass"}</span>
          </div>
          <div className={`
            flex items-center gap-2 text-sm
            ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
          `}>
            <Fuel className="w-4 h-4" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className={`
            flex items-center gap-2 text-sm
            ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
          `}>
            <Gauge className="w-4 h-4" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className={`
            flex items-center gap-2 text-sm
            ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
          `}>
            <Clock className="w-4 h-4" />
            <span>{vehicle.mileage}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {vehicle.features.slice(0, 3).map((feature: string, index: number) => (
            <span
              key={index}
              className={`
                px-2 py-1 rounded-full text-xs font-medium transition-colors
                ${theme === 'light'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {feature}
            </span>
          ))}
          {vehicle.features.length > 3 && (
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${theme === 'light'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-blue-900/50 text-blue-300'
              }
            `}>
              +{vehicle.features.length - 3} {t("vehicles.more") || "more"}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => onBookNow(vehicle)}
            className={`
              flex-1 rounded-xl py-3 font-semibold transition-all duration-300
              ${theme === 'light'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl'
              }
            `}
          >
            {t("vehicles.bookNow") || "Book Now"}
          </Button>
          <Button
            variant="outline"
            className={`
              flex-1 rounded-xl py-3 px-4 transition-all duration-300
              ${theme === 'light'
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
              }
            `}
          >
            {t("vehicles.details") || "Details"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};