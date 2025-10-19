import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  CarFront,
  SlidersHorizontal,
  ShoppingCart,
  DollarSign,
  X,
  Zap,
  Trash2,
} from "lucide-react";

// Assuming these are available in your project structure
import { useLanguage } from "../components/LanguageContext";
import { useTheme } from "../components/ThemeContext";
import type { Vehicle } from "../types/vehicle";

// --- START: UTILITY TYPES & HOOKS ---

interface VehicleType {
  value: string;
  label: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  theme: string;
  onBookNow: (vehicle: Vehicle) => void;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (vehicle: Vehicle) => void; 
  isAddedToCart: boolean; 
  vehicleTypes: VehicleType[];
  t: (key: string) => string | undefined;
}

interface CartItem extends Vehicle {
  quantity: number;
}

interface Filters {
  searchText: string;
  selectedTypes: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  sortBy: 'price_asc' | 'price_desc' | 'rating_desc';
}

const API_BASE = 'http://localhost:3000/api';

const initialFilters: Filters = {
  searchText: "",
  selectedTypes: [],
  selectedBrands: [],
  priceRange: [0, 1000],
  sortBy: 'rating_desc',
};

const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((vehicle: Vehicle) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === vehicle.id);
      // Only allow adding if it's not already in the cart (treating it as a single rental slot)
      if (!existingItem) {
        return [...prevCart, { ...vehicle, quantity: 1 }];
      }
      return prevCart;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, []);

  const getTotalItems = useMemo(() => cart.length, [cart]);

  return { cart, addToCart, removeFromCart, getTotalItems };
};

// --- END: UTILITY TYPES & HOOKS ---

// =========================================================================
// MAIN COMPONENT: DVehicles
// =========================================================================

export default function DVehicles() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Data States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cart & Filter States
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const { cart, addToCart, removeFromCart, getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const vehicleTypes: VehicleType[] = useMemo(() => [
    { value: "SEDAN", label: t("vehicles.sedan") || "Sedan" },
    { value: "SUV", label: t("vehicles.suv") || "SUV" },
    { value: "LUXURY", label: t("vehicles.luxury") || "Luxury" },
    { value: "SPORTS", label: t("vehicles.sports") || "Sports" },
    { value: "COMPACT", label: t("vehicles.compact") || "Compact" },
    { value: "VAN", label: t("vehicles.van") || "Van" },
  ], [t]);

  // --- Data Fetching ---

  const fetchVehicles = async (): Promise<Vehicle[]> => {
    try {
      const response = await fetch(`${API_BASE}/vehicles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch vehicles');
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const loadVehicles = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchVehicles();
      setVehicles(data);

      const maxP = Math.max(...data.map(v => v.pricePerDay || 0), 100);
      const safeMaxPrice = Math.ceil(maxP / 100) * 100 + 100;
      setMaxPrice(safeMaxPrice);
      setFilters(prev => ({ ...prev, priceRange: [initialFilters.priceRange[0], safeMaxPrice] }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // --- Filter and Sort Logic ---

  const availableBrands = useMemo(() => {
    const brands = new Set(vehicles.map(v => v.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [vehicles]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredAndSortedVehicles = useMemo(() => {
    const { searchText, selectedTypes, selectedBrands, priceRange, sortBy } = filters;
    const [minPrice, maxP] = priceRange;

    let filtered = vehicles.filter(vehicle => {
      // Filters (Search, Type, Brand, Price)
      const searchMatch = !searchText || 
        (vehicle.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (vehicle.brand || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (vehicle.model || '').toLowerCase().includes(searchText.toLowerCase());

      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(vehicle.type);
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(vehicle.brand);
      const priceMatch = (vehicle.pricePerDay || 0) >= minPrice && (vehicle.pricePerDay || 0) <= maxP;

      return searchMatch && typeMatch && brandMatch && priceMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'price_asc') return (a.pricePerDay || 0) - (b.pricePerDay || 0);
      if (sortBy === 'price_desc') return (b.pricePerDay || 0) - (a.pricePerDay || 0);
      if (sortBy === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    return filtered;
  }, [vehicles, filters]);

  const resetFilters = useCallback(() => {
    setFilters(prev => ({
        ...initialFilters,
        priceRange: [initialFilters.priceRange[0], maxPrice]
    }));
  }, [maxPrice]);


  // --- Handlers ---

  const handleBookNow = (vehicle: Vehicle): void => {
    // This is the individual 'Book Now' button on the card.
    // It is primarily a call to action. We'll simulate navigation.
    console.log(`Navigating to booking for: ${vehicle.name}`);
    alert(`Vehicle: ${vehicle.name} is selected for immediate booking! (Simulated)`);
  };

  const toggleFavorite = (id: string): void => {
    console.log("Toggle favorite:", id);
  };

  // --- Render (Loading/Error) ---

  if (loading) {
    // ... (Loading state rendering - kept for visual style)
    return (
      <div
        className={`
        min-h-screen transition-all duration-500 flex items-center justify-center
        ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
            : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
        }
      `}
      >
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
            <h3
              className={`
              text-xl font-semibold mb-2
              ${theme === "light" ? "text-gray-700" : "text-gray-300"}
            `}
            >
              Loading Amazing Rides...
            </h3>
            <p
              className={`
              ${theme === "light" ? "text-gray-500" : "text-gray-400"}
            `}
            >
              Preparing your perfect vehicle collection
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
     // ... (Error state rendering - kept for visual style)
     return (
      <div
        className={`
        min-h-screen transition-all duration-500 flex items-center justify-center
        ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
            : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
        }
      `}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`
              w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4
              ${
                theme === "light"
                  ? "bg-red-100 text-red-600"
                  : "bg-red-900/50 text-red-400"
              }
            `}
            >
              <Car className="w-10 h-10" />
            </div>
            <h3
              className={`
              text-xl font-semibold mb-2
              ${theme === "light" ? "text-gray-800" : "text-white"}
            `}
            >
              Oops! Something went wrong
            </h3>
            <p
              className={`
              mb-6
              ${theme === "light" ? "text-gray-600" : "text-gray-400"}
            `}
            >
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

  // --- Main Render ---

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
              {t("vehicles.hero.subtitle") ||
                "Explore our premium collection of vehicles. From luxury sedans to spacious SUVs, find the perfect car for your journey."}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Floating Cart Button (New) */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: getTotalItems > 0 ? 1 : 0, opacity: getTotalItems > 0 ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`
          fixed bottom-10 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 relative
          ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}
        `}
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingCart className="w-7 h-7" />
        <AnimatePresence>
          {getTotalItems > 0 && (
            <motion.div
              key="cart-count"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-gray-800"
            >
              {getTotalItems}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        theme={theme}
        t={t}
      />


      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 mt-12 flex gap-8">
        
        {/* Filter Sidebar */}
        <FilterSidebar
            filters={filters}
            handleFilterChange={handleFilterChange}
            availableBrands={availableBrands}
            vehicleTypes={vehicleTypes}
            maxPrice={maxPrice}
            resetFilters={resetFilters}
            theme={theme}
            t={t}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
        />

        {/* Vehicle Results */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
          >
            <div>
              <h2
                className={`
                text-3xl font-bold
                ${theme === "light" ? "text-gray-800" : "text-white"}
              `}
              >
                {t("vehicles.availableVehicles") || "Available Vehicles"}
              </h2>
              <p
                className={`
                mt-2
                ${theme === "light" ? "text-gray-600" : "text-gray-400"}
              `}
              >
                **{filteredAndSortedVehicles.length}** of {vehicles.length}{" "}
                {t("vehicles.vehiclesFound") || "vehicles matched"}
              </p>
            </div>
            
            {/* Filter Toggle for Mobile & Search Bar */}
            <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
                <Button 
                    variant="outline"
                    className="p-3 lg:hidden"
                    onClick={() => setIsFilterOpen(true)}
                >
                    <SlidersHorizontal className="w-5 h-5" />
                </Button>
                <div className="relative flex-grow">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                    <Input
                        type="text"
                        placeholder={t("vehicles.searchPlaceholder") || "Search by name, model, or brand..."}
                        value={filters.searchText}
                        onChange={(e) => handleFilterChange('searchText', e.target.value)}
                        className={`
                            pl-10 rounded-xl w-full sm:w-80
                            ${theme === 'light' ? 'bg-white border-gray-300 focus:ring-blue-500' : 'bg-gray-700 border-gray-600 text-white'}
                        `}
                    />
                </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {filteredAndSortedVehicles.length === 0 ? (
              <NoVehiclesFound theme={theme} loadVehicles={loadVehicles} t={t} />
            ) : (
              <motion.div
                key="vehicle-grid"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                layout
              >
                {filteredAndSortedVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    theme={theme}
                    onBookNow={handleBookNow}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={addToCart} 
                    isAddedToCart={cart.some(item => item.id === vehicle.id)} 
                    vehicleTypes={vehicleTypes}
                    t={t}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Features Section (Kept for great looks) */}
      <div className="max-w-7xl mx-auto px-6 my-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className={`
            rounded-3xl p-8 text-white shadow-2xl
            ${
              theme === "light"
                ? "bg-gradient-to-r from-blue-600 to-purple-600"
                : "bg-gradient-to-r from-blue-700 to-purple-700"
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
                {t("vehicles.benefits.insured.description") ||
                  "Comprehensive coverage for complete peace of mind"}
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("vehicles.benefits.support.title") || "24/7 Support"}
              </h3>
              <p className="text-blue-100">
                {t("vehicles.benefits.support.description") ||
                  "Round-the-clock assistance whenever you need it"}
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("vehicles.benefits.price.title") || "Best Price Guarantee"}
              </h3>
              <p className="text-blue-100">
                {t("vehicles.benefits.price.description") ||
                  "Find a better price? We'll match it!"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-COMPONENT: VehicleCard (Enhanced)
// =========================================================================

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  theme,
  onBookNow,
  onToggleFavorite,
  onAddToCart,
  isAddedToCart,
  vehicleTypes,
  t,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const safeVehicle = {
    id: vehicle.id || 'unknown',
    name: vehicle.name || 'Unnamed Vehicle',
    type: vehicle.type || 'UNKNOWN',
    brand: vehicle.brand || 'Unknown Brand',
    model: vehicle.model || 'Unknown Model',
    pricePerDay: vehicle.pricePerDay || 0,
    rating: vehicle.rating || 0,
    reviewCount: vehicle.reviewCount || 0,
    seats: vehicle.seats || 4,
    fuelType: vehicle.fuelType || 'Gasoline',
    transmission: vehicle.transmission || 'Automatic',
    mileage: vehicle.mileage || 'Unlimited',
    location: vehicle.location || 'Location not specified',
    features: vehicle.features || [],
    image: vehicle.image || '/cars/placeholder-car.jpg'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-2xl shadow-xl overflow-hidden group transition-all duration-300
        ${
          theme === "light"
            ? "bg-white border border-gray-100"
            : "bg-gray-800 border border-gray-700"
        }
      `}
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {!imageLoaded && !imageError && (
            <Car className="w-12 h-12 text-gray-400 animate-pulse" />
          )}
          <img
            src={imageError ? "/cars/placeholder-car.jpg" : safeVehicle.image}
            alt={safeVehicle.name}
            className={`w-full h-48 object-cover transition-all duration-500 ${
              imageLoaded ? "group-hover:scale-110 opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.log('❌ Image failed to load:', safeVehicle.image);
              setImageError(true);
            }}
          />
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(safeVehicle.id)}
          className={`
            absolute top-3 right-3 p-2 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm
            ${
              theme === "light"
                ? "bg-white/90 hover:bg-white text-gray-600 hover:text-red-500"
                : "bg-gray-800/90 hover:bg-gray-700 text-gray-400 hover:text-red-400"
            }
          `}
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Vehicle Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`
            px-3 py-1 rounded-full text-xs font-semibold shadow-lg
            ${
              theme === "light"
                ? "bg-blue-500 text-white"
                : "bg-blue-600 text-white"
            }
          `}
          >
            {vehicleTypes.find((t) => t.value === safeVehicle.type)?.label ||
              safeVehicle.type.charAt(0).toUpperCase() + safeVehicle.type.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Rating Badge */}
        <div
          className={`
          absolute bottom-3 left-3 rounded-full px-3 py-1 flex items-center gap-1 shadow-lg backdrop-blur-sm
          ${theme === "light" ? "bg-white/90" : "bg-gray-800/90"}
        `}
        >
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span
            className={`
            font-semibold text-sm
            ${theme === "light" ? "text-gray-800" : "text-white"}
          `}
        >
          {safeVehicle.rating > 0 ? safeVehicle.rating.toFixed(1) : 'N/A'}
        </span>
        <span
          className={`
          text-sm
          ${theme === "light" ? "text-gray-500" : "text-gray-400"}
        `}
        >
          ({safeVehicle.reviewCount})
        </span>
        </div>

        {/* Price Tag Overlay */}
        <div
          className={`
            absolute bottom-0 right-0 p-3 rounded-tl-2xl flex flex-col items-end
            ${theme === "light" ? "bg-blue-600/90 text-white" : "bg-blue-700/90 text-white"}
          `}
        >
          <span className="text-lg font-bold">
            ${safeVehicle.pricePerDay}
          </span>
          <span className="text-xs font-medium opacity-80">
            {t("vehicles.perDay") || "per day"}
          </span>
        </div>

      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3
              className={`
              font-bold text-xl mb-1 line-clamp-1
              ${theme === "light" ? "text-gray-800" : "text-white"}
            `}
            >
              {safeVehicle.name}
            </h3>
            <p
              className={`
              text-sm font-medium
              ${theme === "light" ? "text-blue-600" : "text-blue-400"}
            `}
            >
              {safeVehicle.brand} • {safeVehicle.model}
            </p>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className={`grid grid-cols-2 gap-y-3 gap-x-4 mb-4 border-t border-b py-4 ${theme === 'light' ? 'border-gray-100' : 'border-gray-700'}`}>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 text-orange-500" />
            <span>
              **{safeVehicle.seats}** {t("vehicles.passengers") || "Pass"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Fuel className="w-4 h-4 text-green-500" />
            <span>{safeVehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Gauge className="w-4 h-4 text-red-500" />
            <span>{safeVehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 text-cyan-500" />
            <span>{safeVehicle.mileage}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onBookNow(vehicle)}
            className={`
              flex-1 rounded-xl py-3 font-semibold transition-all duration-300
              ${
                theme === "light"
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl"
              }
            `}
          >
            {t("vehicles.bookNow") || "Book Now"}
          </Button>
          <Button
            onClick={() => onAddToCart(vehicle)}
            disabled={isAddedToCart}
            className={`
              rounded-xl py-3 px-4 transition-all duration-300
              ${
                isAddedToCart
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : (theme === "light" 
                    ? "border-blue-500 text-blue-500 hover:bg-blue-50"
                    : "border-blue-400 text-blue-400 hover:bg-blue-900/20")
              }
            `}
            variant={isAddedToCart ? 'default' : 'outline'}
          >
            {isAddedToCart ? (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Added
                </motion.div>
            ) : (
                <ShoppingCart className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// =========================================================================
// SUB-COMPONENT: FilterSidebar
// =========================================================================

interface FilterSidebarProps {
    filters: Filters;
    handleFilterChange: (key: keyof Filters, value: any) => void;
    availableBrands: string[];
    vehicleTypes: VehicleType[];
    maxPrice: number;
    resetFilters: () => void;
    theme: string;
    t: (key: string) => string | undefined;
    isFilterOpen: boolean;
    setIsFilterOpen: (open: boolean) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filters,
    handleFilterChange,
    availableBrands,
    vehicleTypes,
    maxPrice,
    resetFilters,
    theme,
    t,
    isFilterOpen,
    setIsFilterOpen,
}) => {

    const handleTypeToggle = (type: string, isChecked: boolean) => {
        const newTypes = isChecked
            ? [...filters.selectedTypes, type]
            : filters.selectedTypes.filter(t => t !== type);
        handleFilterChange('selectedTypes', newTypes);
    };

    const handleBrandToggle = (brand: string, isChecked: boolean) => {
        const newBrands = isChecked
            ? [...filters.selectedBrands, brand]
            : filters.selectedBrands.filter(b => b !== brand);
        handleFilterChange('selectedBrands', newBrands);
    };

    const priceRangeValue = useMemo(() => filters.priceRange, [filters.priceRange]);

    return (
        <>
            {/* Mobile/Overlay Sidebar */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[99] lg:hidden"
                        onClick={() => setIsFilterOpen(false)}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={isFilterOpen ? { x: 0 } : { x: "-100%" }}
                transition={{ duration: 0.3 }}
                className={`
                    fixed top-0 left-0 h-full z-[100] w-64 p-6 shadow-2xl overflow-y-auto lg:static lg:block lg:w-64 lg:h-auto lg:p-0 lg:shadow-none transition-all duration-300
                    ${theme === 'light' ? 'bg-white lg:border-r lg:border-gray-100' : 'bg-gray-800 lg:border-r lg:border-gray-700'}
                `}
            >
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                        <SlidersHorizontal className="inline-block w-6 h-6 mr-2 text-blue-500" /> Filters
                    </h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="space-y-8 mt-4 lg:mt-0">
                    
                    {/* Sort By */}
                    <div>
                        <Label className={`text-lg font-semibold mb-3 block ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                            {t("filters.sortBy") || "Sort By"}
                        </Label>
                        <Select
                            value={filters.sortBy}
                            onValueChange={(value) => handleFilterChange('sortBy', value)}
                        >
                            <SelectTrigger className={`rounded-xl ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600 text-white'}`}>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className={theme === 'dark' ? 'dark' : ''}>
                                <SelectItem value="rating_desc">Rating (High to Low)</SelectItem>
                                <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                                <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <Label className={`text-lg font-semibold mb-3 block ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                            {t("filters.price") || "Price Range (per day)"}
                        </Label>
                        <div className={`
                            flex justify-between p-3 rounded-xl mb-4 font-bold text-sm
                            ${theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-blue-900/30 text-blue-300'}
                        `}>
                            <span>${priceRangeValue[0]}</span>
                            <span>${priceRangeValue[1]}</span>
                        </div>
                        <Slider
                            min={0}
                            max={maxPrice}
                            step={10}
                            value={priceRangeValue}
                            onValueChange={(value: number[]) => handleFilterChange('priceRange', [value[0], value[1]])}
                            className="w-full"
                        />
                    </div>

                    {/* Vehicle Type Filter */}
                    <div>
                        <Label className={`text-lg font-semibold mb-3 block ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                            {t("filters.type") || "Vehicle Type"}
                        </Label>
                        <ScrollArea className="h-40 pr-4">
                            <div className="space-y-3">
                                {vehicleTypes.filter(t => t.value !== 'all').map((type) => (
                                    <div key={type.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`type-${type.value}`}
                                            checked={filters.selectedTypes.includes(type.value)}
                                            onCheckedChange={(checked: boolean) => handleTypeToggle(type.value, checked)}
                                            className="border-blue-500 data-[state=checked]:bg-blue-500"
                                        />
                                        <Label
                                            htmlFor={`type-${type.value}`}
                                            className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                                        >
                                            {type.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Brand Filter */}
                    <div>
                        <Label className={`text-lg font-semibold mb-3 block ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                            {t("filters.brand") || "Brand"}
                        </Label>
                        <ScrollArea className="h-40 pr-4">
                            <div className="space-y-3">
                                {availableBrands.map((brand) => (
                                    <div key={brand} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`brand-${brand}`}
                                            checked={filters.selectedBrands.includes(brand)}
                                            onCheckedChange={(checked: boolean) => handleBrandToggle(brand, checked)}
                                            className="border-blue-500 data-[state=checked]:bg-blue-500"
                                        />
                                        <Label
                                            htmlFor={`brand-${brand}`}
                                            className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
                                        >
                                            {brand}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Reset Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Button 
                            onClick={resetFilters} 
                            variant="secondary"
                            className="w-full rounded-xl mt-4"
                        >
                            <X className="w-4 h-4 mr-2" />
                            {t("filters.reset") || "Reset Filters"}
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
};


// =========================================================================
// SUB-COMPONENT: CartModal (New)
// =========================================================================

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    removeFromCart: (id: string) => void;
    theme: string;
    t: (key: string) => string | undefined;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cart, removeFromCart, theme, t }) => {
    
    const totalPrice = useMemo(() => 
        cart.reduce((sum, item) => sum + (item.pricePerDay || 0), 0),
    [cart]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className={`
                    w-full max-w-md rounded-2xl p-6 shadow-2xl relative
                    ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}
                `}
            >
                <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold flex items-center">
                        <ShoppingCart className="w-6 h-6 mr-2 text-blue-500" />
                        {t("cart.title") || "Your Rental Cart"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
                    <AnimatePresence>
                        {cart.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-8"
                            >
                                <Zap className="w-10 h-10 mx-auto mb-3 text-yellow-500" />
                                <p className="text-lg font-medium">{t("cart.empty") || "Your cart is empty!"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Add some dream rides to start your journey.</p>
                            </motion.div>
                        ) : (
                            cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    layout
                                    className={`
                                        flex items-center justify-between p-3 rounded-xl transition-all duration-300
                                        ${theme === 'light' ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-700 hover:bg-gray-600'}
                                    `}
                                >
                                    <div className="flex items-center">
                                        <Car className="w-6 h-6 mr-3 text-blue-500" />
                                        <div>
                                            <p className="font-semibold text-base line-clamp-1">{item.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="font-bold text-blue-600 dark:text-blue-400">${item.pricePerDay}</span>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:bg-red-500/10 rounded-full"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
                
                {cart.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
                    >
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>{t("cart.total") || "Total Rental Price (per day):"}</span>
                            <span className="text-blue-600 dark:text-blue-400">
                                **${totalPrice.toFixed(2)}**
                            </span>
                        </div>
                        <Button 
                            onClick={() => alert(`Ready to finalize ${cart.length} vehicles! (Proceeding to payment gateway)`)}
                            className="w-full rounded-xl py-3 font-semibold text-lg bg-green-600 hover:bg-green-700 text-white"
                        >
                            <DollarSign className="w-5 h-5 mr-2" />
                            {t("cart.checkout") || "Proceed to Checkout"}
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};


// =========================================================================
// SUB-COMPONENT: NoVehiclesFound
// =========================================================================

const NoVehiclesFound: React.FC<{ theme: string; loadVehicles: () => void; t: (key: string) => string | undefined }> = ({ theme, loadVehicles, t }) => (
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
                ${
                    theme === "light"
                        ? "bg-red-50 text-red-600"
                        : "bg-red-900/30 text-red-400"
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
                ${theme === "light" ? "text-gray-800" : "text-white"}
            `}
        >
            No Rides Match Your Filters!
        </motion.h3>

        <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`
                text-lg mb-6 max-w-md mx-auto
                ${theme === "light" ? "text-gray-600" : "text-gray-400"}
            `}
        >
            Try broadening your search or adjusting the price range to find your perfect vehicle.
        </motion.p>

        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            <Button onClick={loadVehicles} className="rounded-xl">
                <Car className="w-4 h-4 mr-2" />
                Reload All Vehicles
            </Button>
        </motion.div>
    </motion.div>
);