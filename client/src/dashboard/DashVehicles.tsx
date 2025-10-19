import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter,
  Sparkles,
  TrendingUp,
  Calendar,
  ShieldCheck,
  Bike,
  Truck,
} from "lucide-react";

import { useLanguage } from "../components/LanguageContext";
import { useTheme } from "../components/ThemeContext";
import type { Vehicle } from "../types/vehicle";

// =========================================================================
// TYPES & INTERFACES
// =========================================================================

interface VehicleType {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
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
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating_desc' | 'popular';
}

const API_BASE = 'http://localhost:3000/api';

const initialFilters: Filters = {
  searchText: "",
  selectedTypes: [],
  selectedBrands: [],
  priceRange: [0, 1000],
  sortBy: 'featured',
};

// =========================================================================
// CUSTOM HOOKS
// =========================================================================

const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((vehicle: Vehicle) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === vehicle.id);
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
  const getTotalPrice = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.pricePerDay || 0), 0), 
    [cart]
  );

  return { cart, addToCart, removeFromCart, getTotalItems, getTotalPrice };
};

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

  // UI States
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const { cart, addToCart, removeFromCart, getTotalItems, getTotalPrice } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Enhanced Vehicle Types with Icons
  const vehicleTypes: VehicleType[] = useMemo(() => [
    { 
      value: "SEDAN", 
      label: t("vehicles.sedan") || "Sedan", 
      icon: <Car className="w-4 h-4" />,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      value: "SUV", 
      label: t("vehicles.suv") || "SUV", 
      icon: <Truck className="w-4 h-4" />,
      color: "from-green-500 to-emerald-500"
    },
    { 
      value: "LUXURY", 
      label: t("vehicles.luxury") || "Luxury", 
      icon: <Sparkles className="w-4 h-4" />,
      color: "from-purple-500 to-pink-500"
    },
    { 
      value: "SPORTS", 
      label: t("vehicles.sports") || "Sports", 
      icon: <TrendingUp className="w-4 h-4" />,
      color: "from-red-500 to-orange-500"
    },
    { 
      value: "COMPACT", 
      label: t("vehicles.compact") || "Compact", 
      icon: <CarFront className="w-4 h-4" />,
      color: "from-gray-500 to-slate-500"
    },
    { 
      value: "VAN", 
      label: t("vehicles.van") || "Van", 
      icon: <Users className="w-4 h-4" />,
      color: "from-yellow-500 to-amber-500"
    },
  ], [t]);

  // Data Fetching
  const fetchVehicles = async (): Promise<Vehicle[]> => {
    try {
      const response = await fetch(`${API_BASE}/vehicles`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to fetch vehicles');
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
      const safeMaxPrice = Math.ceil(maxP / 100) * 100;
      setMaxPrice(safeMaxPrice);
      setFilters(prev => ({ ...prev, priceRange: [0, safeMaxPrice] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Filter and Sort Logic
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
      const searchMatch = !searchText || 
        (vehicle.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (vehicle.brand || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (vehicle.model || '').toLowerCase().includes(searchText.toLowerCase());

      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(vehicle.type);
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(vehicle.brand);
      const priceMatch = (vehicle.pricePerDay || 0) >= minPrice && (vehicle.pricePerDay || 0) <= maxP;

      return searchMatch && typeMatch && brandMatch && priceMatch;
    });

    // Enhanced Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return (a.pricePerDay || 0) - (b.pricePerDay || 0);
        case 'price_desc': return (b.pricePerDay || 0) - (a.pricePerDay || 0);
        case 'rating_desc': return (b.rating || 0) - (a.rating || 0);
        case 'popular': return (b.reviewCount || 0) - (a.reviewCount || 0);
        default: return (b.rating || 0) - (a.rating || 0); // featured
      }
    });

    return filtered;
  }, [vehicles, filters]);

  const resetFilters = useCallback(() => {
    setFilters({
      ...initialFilters,
      priceRange: [0, maxPrice]
    });
  }, [maxPrice]);

  const activeFilterCount = useMemo(() => {
    return (
      (filters.searchText ? 1 : 0) +
      filters.selectedTypes.length +
      filters.selectedBrands.length +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0)
    );
  }, [filters, maxPrice]);

  // Handlers
  const handleBookNow = (vehicle: Vehicle): void => {
    console.log(`Booking: ${vehicle.name}`);
    // Navigate to booking page
  };

  const toggleFavorite = (id: string): void => {
    console.log("Toggle favorite:", id);
  };

  // Loading State
  if (loading) {
    return <LoadingScreen theme={theme} />;
  }

  // Error State
  if (error) {
    return <ErrorScreen error={error} onRetry={loadVehicles} theme={theme} />;
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === "light"
        ? "bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30"
        : "bg-gradient-to-br from-gray-900 via-blue-900/20 to-slate-900"
    }`}>
      
      {/* Enhanced Hero Section */}
      <div className="relative h-[500px] rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 mix-blend-multiply" />
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/cars/vehicle-hero.jpg')",
              backgroundBlendMode: "overlay"
            }}
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
              🚀 Premium Vehicle Rentals
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Perfect Ride
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Discover premium vehicles for every journey. From luxury sedans to rugged SUVs, 
              experience the perfect blend of comfort and performance.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="font-semibold">{vehicles.length}+ Vehicles</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                <span className="font-semibold">24/7 Support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                <span className="font-semibold">Best Prices</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-10 right-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute top-20 right-1/4 w-16 h-16 bg-orange-400/20 rounded-full backdrop-blur-sm"
        />
      </div>

      {/* Floating Cart Button */}
      <FloatingCart 
        itemCount={getTotalItems} 
        totalPrice={getTotalPrice}
        onClick={() => setIsCartOpen(true)}
        theme={theme}
      />

      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        theme={theme}
        t={t}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-20 relative z-20">
        {/* Quick Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className={`p-8 rounded-3xl shadow-2xl ${
            theme === "light" 
              ? "bg-white border border-gray-100" 
              : "bg-gray-800 border border-gray-700"
          }`}>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {vehicleTypes.map((type) => (
                <motion.button
                  key={type.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange('selectedTypes', 
                    filters.selectedTypes.includes(type.value) 
                      ? filters.selectedTypes.filter(t => t !== type.value)
                      : [...filters.selectedTypes, type.value]
                  )}
                  className={`p-4 rounded-2xl transition-all duration-300 border-2 ${
                    filters.selectedTypes.includes(type.value)
                      ? `border-transparent bg-gradient-to-r ${type.color} text-white shadow-lg`
                      : theme === "light"
                      ? "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
                      : "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {type.icon}
                    <span className="text-sm font-semibold">{type.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search Section */}
          <div className={`flex-1 p-6 rounded-3xl ${
            theme === "light" 
              ? "bg-white border border-gray-100 shadow-lg" 
              : "bg-gray-800 border border-gray-700 shadow-2xl"
          }`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <Input
                  type="text"
                  placeholder="Search vehicles, brands, or models..."
                  value={filters.searchText}
                  onChange={(e) => handleFilterChange('searchText', e.target.value)}
                  className={`pl-12 pr-4 py-3 text-lg rounded-2xl border-0 ${
                    theme === 'light' 
                      ? 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500' 
                      : 'bg-gray-700 focus:bg-gray-600 focus:ring-2 focus:ring-blue-400 text-white'
                  }`}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden rounded-2xl px-6 py-3 border-2"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger className={`w-48 rounded-2xl py-3 text-lg border-2 ${
                    theme === 'light' 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-gray-700 border-gray-600 text-white'
                  }`}>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating_desc">Highest Rated</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className={`p-6 rounded-3xl min-w-[280px] ${
            theme === "light"
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
              : "bg-gradient-to-br from-blue-600 to-purple-700 text-white"
          }`}>
            <div className="text-center">
              <div className="text-3xl font-black mb-2">{filteredAndSortedVehicles.length}</div>
              <div className="text-blue-100 font-semibold">Vehicles Available</div>
              <div className="text-sm text-blue-200 mt-2">
                of {vehicles.length} total
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
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
            activeFilterCount={activeFilterCount}
          />

          {/* Results Section */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredAndSortedVehicles.length === 0 ? (
                <NoVehiclesFound theme={theme} loadVehicles={loadVehicles} t={t} />
              ) : (
                <motion.div
                  key="vehicle-grid"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  layout
                >
                  {filteredAndSortedVehicles.map((vehicle, index) => (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <VehicleCard
                        vehicle={vehicle}
                        theme={theme}
                        onBookNow={handleBookNow}
                        onToggleFavorite={toggleFavorite}
                        onAddToCart={addToCart}
                        isAddedToCart={cart.some(item => item.id === vehicle.id)}
                        vehicleTypes={vehicleTypes}
                        t={t}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="container mx-auto px-6 py-16 mt-12">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 text-sm bg-blue-500 text-white border-0">
            Why Choose Us
          </Badge>
          <h2 className="text-4xl font-black mb-4">
            The Ultimate <span className="text-blue-500">Rental Experience</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best vehicle rental experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-12 h-12" />,
              title: "Fully Insured",
              description: "Comprehensive coverage for complete peace of mind on every journey",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: <Clock className="w-12 h-12" />,
              title: "24/7 Support",
              description: "Round-the-clock assistance whenever you need it, wherever you are",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: <DollarSign className="w-12 h-12" />,
              title: "Best Price Guarantee",
              description: "Find a better price? We'll match it! No questions asked",
              color: "from-purple-500 to-pink-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`p-8 rounded-3xl text-center ${
                theme === "light" 
                  ? "bg-white border border-gray-100 shadow-xl" 
                  : "bg-gray-800 border border-gray-700 shadow-2xl"
              }`}
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mx-auto mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className={`${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-COMPONENTS
// =========================================================================

const LoadingScreen: React.FC<{ theme: string }> = ({ theme }) => (
  <div className={`min-h-screen flex items-center justify-center ${
    theme === "light" 
      ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50" 
      : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
  }`}>
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <Car className="w-10 h-10 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className={`text-2xl font-bold mt-6 ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}>
          Loading Amazing Rides...
        </h3>
        <p className={`mt-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
          Preparing your perfect vehicle collection
        </p>
      </motion.div>
    </div>
  </div>
);

const ErrorScreen: React.FC<{ error: string; onRetry: () => void; theme: string }> = 
  ({ error, onRetry, theme }) => (
  <div className={`min-h-screen flex items-center justify-center ${
    theme === "light" 
      ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50" 
      : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
  }`}>
    <div className="text-center max-w-md mx-auto p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          theme === "light" ? "bg-red-100" : "bg-red-900/20"
        }`}>
          <Car className="w-12 h-12 text-red-500" />
        </div>
        <h3 className={`text-2xl font-bold mb-3 ${
          theme === "light" ? "text-gray-800" : "text-white"
        }`}>
          Oops! Something went wrong
        </h3>
        <p className={`mb-6 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
          {error}
        </p>
        <Button onClick={onRetry} className="rounded-2xl px-8 py-3">
          Try Again
        </Button>
      </motion.div>
    </div>
  </div>
);

const FloatingCart: React.FC<{ 
  itemCount: number; 
  totalPrice: number;
  onClick: () => void;
  theme: string;
}> = ({ itemCount, totalPrice, onClick, theme }) => (
  <motion.button
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`fixed bottom-8 right-8 z-50 p-4 rounded-2xl shadow-2xl transition-all duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white"
          >
            {itemCount}
          </motion.span>
        )}
      </div>
      <div className="text-left">
        <div className="text-sm font-semibold">${totalPrice}</div>
        <div className="text-xs opacity-80">View Cart</div>
      </div>
    </div>
  </motion.button>
);

// =========================================================================
// VEHICLE CARD COMPONENT
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

  const vehicleType = vehicleTypes.find(t => t.value === safeVehicle.type);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
        theme === "light" 
          ? "bg-white border border-gray-100" 
          : "bg-gray-800 border border-gray-700"
      }`}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            theme === "light" ? "bg-gray-200" : "bg-gray-700"
          }`}>
            <Car className="w-12 h-12 text-gray-400 animate-pulse" />
          </div>
        )}
        <img
          src={imageError ? "/cars/placeholder-car.jpg" : safeVehicle.image}
          alt={safeVehicle.name}
          className={`w-full h-48 object-cover transition-all duration-700 ${
            imageLoaded ? "group-hover:scale-110 opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {vehicleType && (
            <Badge className={`bg-gradient-to-r ${vehicleType.color} text-white border-0 font-semibold`}>
              {vehicleType.icon}
              <span className="ml-1">{vehicleType.label}</span>
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleFavorite(safeVehicle.id)}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all ${
            theme === "light"
              ? "bg-white/90 hover:bg-white text-gray-600 hover:text-red-500"
              : "bg-gray-800/90 hover:bg-gray-700 text-gray-400 hover:text-red-400"
          }`}
        >
          <Heart className="w-4 h-4" />
        </motion.button>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div className={`px-3 py-2 rounded-2xl backdrop-blur-sm ${
              theme === "light" ? "bg-white/90" : "bg-gray-800/90"
            }`}>
              <div className="text-2xl font-black text-gray-900">
                ${safeVehicle.pricePerDay}
              </div>
              <div className="text-xs text-gray-600 font-medium">per day</div>
            </div>
            
            <div className={`px-3 py-2 rounded-2xl backdrop-blur-sm flex items-center gap-1 ${
              theme === "light" ? "bg-white/90" : "bg-gray-800/90"
            }`}>
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-bold text-sm">
                {safeVehicle.rating > 0 ? safeVehicle.rating.toFixed(1) : 'N/A'}
              </span>
              <span className="text-xs text-gray-600">({safeVehicle.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className={`font-black text-xl mb-2 line-clamp-1 ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}>
            {safeVehicle.name}
          </h3>
          <p className={`text-lg font-semibold ${
            theme === "light" ? "text-blue-600" : "text-blue-400"
          }`}>
            {safeVehicle.brand} • {safeVehicle.model}
          </p>
        </div>

        {/* Specifications Grid */}
        <div className={`grid grid-cols-2 gap-4 mb-6 py-4 border-y ${
          theme === "light" ? "border-gray-100" : "border-gray-700"
        }`}>
          {[
            { icon: <Users className="w-4 h-4" />, label: `${safeVehicle.seats} Seats` },
            { icon: <Fuel className="w-4 h-4" />, label: safeVehicle.fuelType },
            { icon: <Gauge className="w-4 h-4" />, label: safeVehicle.transmission },
            { icon: <MapPin className="w-4 h-4" />, label: safeVehicle.location }
          ].map((spec, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                theme === "light" ? "bg-blue-50 text-blue-600" : "bg-blue-900/20 text-blue-400"
              }`}>
                {spec.icon}
              </div>
              <span className={`text-sm font-medium ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}>
                {spec.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => onBookNow(vehicle)}
            className="flex-1 rounded-2xl py-3 font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            Book Now
          </Button>
          <Button
            onClick={() => onAddToCart(vehicle)}
            disabled={isAddedToCart}
            size="icon"
            className={`rounded-2xl w-12 h-12 transition-all ${
              isAddedToCart
                ? "bg-green-500 hover:bg-green-600 text-white"
                : theme === "light"
                ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                : "border-2 border-blue-400 text-blue-400 hover:bg-blue-900/20"
            }`}
          >
            {isAddedToCart ? (
              <CheckCircle className="w-5 h-5" />
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
// FILTER SIDEBAR COMPONENT
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
    activeFilterCount: number;
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
    activeFilterCount,
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

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsFilterOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={isFilterOpen ? { x: 0 } : { x: "-100%" }}
                transition={{ type: "spring", damping: 30 }}
                className={`fixed top-0 left-0 h-full w-80 z-50 p-6 overflow-y-auto lg:static lg:block lg:w-80 lg:h-auto lg:p-0 lg:transform-none ${
                    theme === 'light' 
                        ? 'bg-white border-r border-gray-200' 
                        : 'bg-gray-800 border-r border-gray-700'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className={`text-2xl font-black flex items-center gap-3 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                        <SlidersHorizontal className="w-6 h-6 text-blue-500" />
                        Filters
                        {activeFilterCount > 0 && (
                            <Badge className="bg-blue-500 text-white">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </h3>
                    <div className="flex gap-2 lg:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="text-sm"
                        >
                            Reset
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsFilterOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Price Range */}
                    <div>
                        <Label className={`font-black text-lg mb-4 block ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                            💰 Price Range
                        </Label>
                        <div className={`p-4 rounded-2xl mb-4 ${
                            theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'
                        }`}>
                            <div className="flex justify-between text-lg font-black">
                                <span>${filters.priceRange[0]}</span>
                                <span>${filters.priceRange[1]}</span>
                            </div>
                        </div>
                        <Slider
                            min={0}
                            max={maxPrice}
                            step={10}
                            value={filters.priceRange}
                            onValueChange={(value) => handleFilterChange('priceRange', value)}
                            className="mb-2"
                        />
                    </div>

                    {/* Vehicle Types */}
                    <div>
                        <Label className={`font-black text-lg mb-4 block ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                            🚗 Vehicle Types
                        </Label>
                        <ScrollArea className="h-48">
                            <div className="space-y-3">
                                {vehicleTypes.map((type) => (
                                    <div key={type.value} className="flex items-center space-x-3">
                                        <Checkbox
                                            id={`type-${type.value}`}
                                            checked={filters.selectedTypes.includes(type.value)}
                                            onCheckedChange={(checked) => 
                                                handleTypeToggle(type.value, checked as boolean)
                                            }
                                            className="h-5 w-5"
                                        />
                                        <Label
                                            htmlFor={`type-${type.value}`}
                                            className={`flex items-center gap-2 font-semibold ${
                                                theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                                            }`}
                                        >
                                            {type.icon}
                                            {type.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Brands */}
                    <div>
                        <Label className={`font-black text-lg mb-4 block ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                            🏷️ Brands
                        </Label>
                        <ScrollArea className="h-48">
                            <div className="space-y-3">
                                {availableBrands.map((brand) => (
                                    <div key={brand} className="flex items-center space-x-3">
                                        <Checkbox
                                            id={`brand-${brand}`}
                                            checked={filters.selectedBrands.includes(brand)}
                                            onCheckedChange={(checked) => 
                                                handleBrandToggle(brand, checked as boolean)
                                            }
                                            className="h-5 w-5"
                                        />
                                        <Label
                                            htmlFor={`brand-${brand}`}
                                            className={`font-medium ${
                                                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                            }`}
                                        >
                                            {brand}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Reset Button */}
                    <Button
                        onClick={resetFilters}
                        variant="outline"
                        className="w-full rounded-2xl py-3 font-semibold border-2"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Reset All Filters
                    </Button>
                </div>
            </motion.div>
        </>
    );
};

// =========================================================================
// CART MODAL COMPONENT
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-2xl rounded-3xl shadow-2xl ${
                    theme === 'light' 
                        ? 'bg-white text-gray-900' 
                        : 'bg-gray-800 text-white'
                }`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-8 border-b ${
                    theme === 'light' ? 'border-gray-200' : 'border-gray-700'
                }`}>
                    <h2 className="text-3xl font-black flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-blue-500" />
                        Your Rental Cart
                        {cart.length > 0 && (
                            <Badge className="bg-blue-500 text-white text-lg py-1 px-3">
                                {cart.length}
                            </Badge>
                        )}
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-2xl w-10 h-10"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Cart Items */}
                <div className="max-h-96 overflow-y-auto p-8">
                    <AnimatePresence>
                        {cart.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                                <p className="text-2xl font-black mb-2">Your cart is empty</p>
                                <p className="text-gray-500 text-lg">
                                    Add some amazing vehicles to start your journey
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className={`flex items-center justify-between p-6 rounded-2xl ${
                                            theme === 'light' 
                                                ? 'bg-gray-50 hover:bg-gray-100' 
                                                : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Car className="w-10 h-10 text-blue-500" />
                                            <div>
                                                <p className="font-black text-lg line-clamp-1">
                                                    {item.name}
                                                </p>
                                                <p className="text-gray-500">
                                                    {item.brand} • {item.model}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-black text-blue-600">
                                                ${item.pricePerDay}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-10 h-10 text-red-500 hover:bg-red-500/10 rounded-2xl"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className={`p-8 border-t ${
                        theme === 'light' ? 'border-gray-200' : 'border-gray-700'
                    }`}>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-2xl font-black">Total (per day):</span>
                            <span className="text-3xl font-black text-blue-600">
                                ${totalPrice}
                            </span>
                        </div>
                        <Button
                            onClick={() => alert(`Proceeding to checkout with ${cart.length} vehicles`)}
                            className="w-full rounded-2xl py-4 text-lg font-black bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl"
                        >
                            <DollarSign className="w-6 h-6 mr-3" />
                            Proceed to Checkout
                        </Button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

// =========================================================================
// NO VEHICLES FOUND COMPONENT
// =========================================================================

const NoVehiclesFound: React.FC<{ theme: string; loadVehicles: () => void; t: (key: string) => string | undefined }> = 
  ({ theme, loadVehicles, t }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
    >
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 ${
                theme === "light" ? "bg-red-50" : "bg-red-900/20"
            }`}
        >
            <CarFront className="w-16 h-16 text-red-500" />
        </motion.div>

        <h3 className={`text-4xl font-black mb-4 ${
            theme === "light" ? "text-gray-900" : "text-white"
        }`}>
            No Vehicles Found
        </h3>

        <p className={`text-xl mb-8 max-w-md mx-auto ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
        }`}>
            Try adjusting your filters or search terms to find more options.
        </p>

        <Button
            onClick={loadVehicles}
            className="rounded-2xl px-8 py-4 text-lg font-black bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
            <Car className="w-5 h-5 mr-3" />
            Reload All Vehicles
        </Button>
    </motion.div>
);