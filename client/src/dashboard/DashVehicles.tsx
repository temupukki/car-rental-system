import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  Heart,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  CarFront,
  ShoppingCart,
  DollarSign,
  X,
  Zap,
  Trash2,
  Filter,
  Sparkles,
  TrendingUp,
  Calendar,
  Truck,
  Plus,
  Minus,
  Package,
  AlertTriangle,
  LifeBuoy,
  Timer,
} from "lucide-react";

import { useLanguage } from "../components/LanguageContext";
import { useTheme } from "../components/ThemeContext";
import type { Vehicle } from "../types/vehicle";
import { toast } from "sonner";

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

interface RentalItem extends Vehicle {
  quantity: number;
  rentalDays: number;
  totalPrice: number;
  addedAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp (30 minutes from addedAt)
}

interface Filters {
  searchText: string;
  selectedTypes: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  sortBy: "featured" | "price_asc" | "price_desc" | "popular";
}

const API_BASE = "http://localhost:3000/api";

const initialFilters: Filters = {
  searchText: "",
  selectedTypes: [],
  selectedBrands: [],
  priceRange: [0, 10000],
  sortBy: "featured",
};

// Cart persistence with localStorage and expiration
const useRentalCart = () => {
  const [rentalCart, setRentalCart] = useState<RentalItem[]>(() => {
    // Load cart from localStorage on initial render
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("vehicleRentalCart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Filter out expired items on load
        const now = new Date();
        const validItems = parsedCart.filter((item: RentalItem) => 
          new Date(item.expiresAt) > now
        );
        
        // If any items were expired, update localStorage
        if (validItems.length !== parsedCart.length) {
          localStorage.setItem("vehicleRentalCart", JSON.stringify(validItems));
        }
        
        return validItems;
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vehicleRentalCart", JSON.stringify(rentalCart));
  }, [rentalCart]);

  // Function to restore stock for expired items
  const restoreStockForExpiredItems = useCallback(async (expiredItems: RentalItem[]) => {
    for (const item of expiredItems) {
      try {
        const stockResponse = await fetch(
          `${API_BASE}/vehicles/${item.id}/stock`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              stock: 1,
              operation: "increment",
            }),
          }
        );

        const stockResult = await stockResponse.json();
        if (!stockResult.success) {
          console.error(`Failed to restore stock for vehicle ${item.id}:`, stockResult.error);
        }
      } catch (error) {
        console.error(`Error restoring stock for vehicle ${item.id}:`, error);
      }
    }
  }, []);

  // Check for expired items every minute
  useEffect(() => {
    const checkExpiredItems = async () => {
      const now = new Date();
      const validItems = rentalCart.filter(item => new Date(item.expiresAt) > now);
      const expiredItems = rentalCart.filter(item => new Date(item.expiresAt) <= now);
      
      if (expiredItems.length > 0) {
        // Restore stock for expired items
        await restoreStockForExpiredItems(expiredItems);
        
        // Update cart state
        setRentalCart(validItems);
        
        // Show notification
        toast.error(`${expiredItems.length} rental cart item(s) have expired and were removed`);
      }
    };

    const interval = setInterval(checkExpiredItems, 60000); 
    return () => clearInterval(interval);
  }, [rentalCart, restoreStockForExpiredItems]);

  const addToRentalCart = useCallback((vehicle: Vehicle, days: number = 1) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); 

    setRentalCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === vehicle.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === vehicle.id
            ? {
                ...item,
                rentalDays: days,
                totalPrice: (vehicle.pricePerDay || 0) * days,
                addedAt: now.toISOString(),
                expiresAt: expiresAt.toISOString(),
              }
            : item
        );
      }
      return [
        ...prevCart,
        {
          ...vehicle,
          quantity: 1,
          rentalDays: days,
          totalPrice: (vehicle.pricePerDay || 0) * days,
          addedAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
        },
      ];
    });
  }, []);

  const updateRentalDays = useCallback((id: string, days: number) => {
    setRentalCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              rentalDays: days,
              totalPrice: (item.pricePerDay || 0) * days,
            }
          : item
      )
    );
  }, []);

  const removeFromRentalCart = useCallback(async (id: string, restoreStock: boolean = true) => {
    if (restoreStock) {
      const itemToRemove = rentalCart.find(item => item.id === id);
      if (itemToRemove) {
        try {
          const stockResponse = await fetch(
            `${API_BASE}/vehicles/${id}/stock`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                stock: 1,
                operation: "increment",
              }),
            }
          );

          const stockResult = await stockResponse.json();
          if (!stockResult.success) {
            console.error(`Failed to restore stock for vehicle ${id}:`, stockResult.error);
          }
        } catch (error) {
          console.error(`Error restoring stock for vehicle ${id}:`, error);
        }
      }
    }

    setRentalCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, [rentalCart]);

  const clearRentalCart = useCallback(async () => {
    // Restore stock for all items when clearing cart
    for (const item of rentalCart) {
      try {
        const stockResponse = await fetch(
          `${API_BASE}/vehicles/${item.id}/stock`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              stock: 1,
              operation: "increment",
            }),
          }
        );

        const stockResult = await stockResponse.json();
        if (!stockResult.success) {
          console.error(`Failed to restore stock for vehicle ${item.id}:`, stockResult.error);
        }
      } catch (error) {
        console.error(`Error restoring stock for vehicle ${item.id}:`, error);
      }
    }

    setRentalCart([]);
  }, [rentalCart]);

  const getTotalItems = useMemo(() => rentalCart.length, [rentalCart]);
  const getTotalPrice = useMemo(
    () => rentalCart.reduce((sum, item) => sum + item.totalPrice, 0),
    [rentalCart]
  );

  // Get time remaining for cart expiration
  const getTimeRemaining = useCallback(() => {
    if (rentalCart.length === 0) return null;
    
    const now = new Date();
    const earliestExpiration = rentalCart.reduce((earliest, item) => {
      const itemExpires = new Date(item.expiresAt);
      return earliest < itemExpires ? earliest : itemExpires;
    }, new Date(rentalCart[0].expiresAt));
    
    const timeRemaining = earliestExpiration.getTime() - now.getTime();
    return timeRemaining > 0 ? timeRemaining : 0;
  }, [rentalCart]);

  return {
    rentalCart,
    addToRentalCart,
    updateRentalDays,
    removeFromRentalCart,
    clearRentalCart,
    getTotalItems,
    getTotalPrice,
    getTimeRemaining,
  };
};

export default function DVehicles() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [maxPrice, setMaxPrice] = useState(10000);
  const {
    rentalCart,
    addToRentalCart,
    updateRentalDays,
    removeFromRentalCart,
    getTotalItems,
    getTotalPrice,
    getTimeRemaining,
  } = useRentalCart();
  const [isRentalCartOpen, setIsRentalCartOpen] = useState(false);
  const [rentalDays, setRentalDays] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Update time remaining every second
  useEffect(() => {
    const updateTimer = () => {
      setTimeRemaining(getTimeRemaining());
    };

    updateTimer(); // Initial update
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [getTimeRemaining]);

  // Dynamic vehicle types based on actual data
  const vehicleTypes: VehicleType[] = useMemo(() => {
    const uniqueTypes = Array.from(new Set(vehicles.map(v => v.type))).filter(Boolean);
    
    const typeConfigs: { [key: string]: { icon: React.ReactNode; color: string } } = {
      "City": { icon: <Car className="w-4 h-4" />, color: "from-blue-500 to-cyan-500" },
      "Tour": { icon: <Truck className="w-4 h-4" />, color: "from-green-500 to-emerald-500" },
      "Vacation": { icon: <Sparkles className="w-4 h-4" />, color: "from-purple-500 to-pink-500" },
      "Bridal": { icon: <TrendingUp className="w-4 h-4" />, color: "from-red-500 to-orange-500" },
      "SUV": { icon: <Car className="w-4 h-4" />, color: "from-indigo-500 to-purple-500" },
      "Sedan": { icon: <Car className="w-4 h-4" />, color: "from-gray-500 to-blue-500" },
      "Luxury": { icon: <Sparkles className="w-4 h-4" />, color: "from-yellow-500 to-orange-500" },
    };

    return uniqueTypes.map(type => {
      const config = typeConfigs[type] || { 
        icon: <Car className="w-4 h-4" />, 
        color: "from-gray-500 to-blue-500" 
      };
      
      return {
        value: type,
        label: `${type.toUpperCase()}`,
        icon: config.icon,
        color: config.color
      };
    });
  }, [vehicles, t]);

  const fetchVehicles = async (): Promise<Vehicle[]> => {
    try {
      const response = await fetch(`${API_BASE}/vehicles`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (!result.success)
        throw new Error(result.error || "Failed to fetch vehicles");
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

      const initialRentalDays: { [key: string]: number } = {};
      data.forEach((vehicle) => {
        initialRentalDays[vehicle.id] = 1;
      });
      setRentalDays(initialRentalDays);

      const maxP = Math.max(...data.map((v) => v.pricePerDay || 0), 1000);
      const safeMaxPrice = Math.ceil(maxP / 1000) * 1000;
      setMaxPrice(safeMaxPrice);
      setFilters((prev) => ({ ...prev, priceRange: [0, safeMaxPrice] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredAndSortedVehicles = useMemo(() => {
    const { searchText, selectedTypes, selectedBrands, priceRange, sortBy } =
      filters;
    const [minPrice, maxP] = priceRange;

    let filtered = vehicles.filter((vehicle) => {
      const searchMatch =
        !searchText ||
        (vehicle.name || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (vehicle.brand || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (vehicle.model || "").toLowerCase().includes(searchText.toLowerCase());

      const typeMatch =
        selectedTypes.length === 0 || selectedTypes.includes(vehicle.type);
      const brandMatch =
        selectedBrands.length === 0 || selectedBrands.includes(vehicle.brand);
      const priceMatch =
        (vehicle.pricePerDay || 0) >= minPrice &&
        (vehicle.pricePerDay || 0) <= maxP;

      return searchMatch && typeMatch && brandMatch && priceMatch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return (a.pricePerDay || 0) - (b.pricePerDay || 0);
        case "price_desc":
          return (b.pricePerDay || 0) - (a.pricePerDay || 0);
        case "popular":
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        default:
          return 0; // featured - no specific sorting
      }
    });

    return filtered;
  }, [vehicles, filters]);

  const handleBookNow = (vehicle: Vehicle): void => {
    const days = rentalDays[vehicle.id] || 1;
    console.log(`Booking: ${vehicle.name} for ${days} days`);
  };

  const toggleFavorite = (id: string): void => {
    console.log("Toggle favorite:", id);
  };

  const handleAddToRentalCart = async (vehicle: Vehicle): Promise<void> => {
    try {
      const days = rentalDays[vehicle.id] || 1;

      if (vehicle.stock === 0) {
        toast.error("This vehicle is out of stock");
        return;
      }

      if (!vehicle.isAvailable) {
        toast.error("This vehicle is currently unavailable");
        return;
      }

      const existingRentalItem = rentalCart.find((item) => item.id === vehicle.id);
      if (existingRentalItem) {
        toast.error("Vehicle is already in your rental cart");
        return;
      }

      const stockResponse = await fetch(
        `${API_BASE}/vehicles/${vehicle.id}/stock`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            stock: 1,
            operation: "decrement",
          }),
        }
      );

      const stockResult = await stockResponse.json();

      if (stockResult.success) {
        addToRentalCart(vehicle, days);

        setVehicles((prev) =>
          prev.map((v) =>
            v.id === vehicle.id ? { ...v, stock: Math.max(0, v.stock - 1) } : v
          )
        );

        toast.success("Vehicle added to rental cart! Reservation expires in 1 hour.");
      } else {
        toast.error(stockResult.error || "Failed to add to rental cart");
      }
    } catch (error) {
      console.error("Error adding to rental cart:", error);
      toast.error("Failed to add to rental cart");
    }
  };

  const handleRemoveFromRentalCart = async (vehicleId: string): Promise<void> => {
    try {
      await removeFromRentalCart(vehicleId, true);

      // Update local vehicles state to reflect stock increase
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId ? { ...v, stock: v.stock + 1 } : v
        )
      );

      toast.success("Vehicle removed from rental cart");
    } catch (error) {
      console.error("Error removing from rental cart:", error);
      toast.error("Failed to remove from rental cart");
    }
  };

  const updateVehicleRentalDays = (vehicleId: string, newDays: number) => {
    setRentalDays((prev) => ({
      ...prev,
      [vehicleId]: Math.max(1, newDays),
    }));

    const rentalItem = rentalCart.find((item) => item.id === vehicleId);
    if (rentalItem) {
      updateRentalDays(vehicleId, newDays);
    }
  };

  const formatTimeRemaining = (milliseconds: number) => {
    if (milliseconds <= 0) return "Expired";
    
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <LoadingScreen theme={theme} />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={loadVehicles} theme={theme} />;
  }

  const sortOptions = [
    { value: "featured", label: t("vehicles.featured") || "Featured" },
    {
      value: "price_asc",
      label: t("vehicles.priceLow") || "Price: Low to High",
    },
    {
      value: "price_desc",
      label: t("vehicles.priceHigh") || "Price: High to Low",
    },
    { value: "popular", label: t("vehicles.popular") || "Most Popular" },
  ];

  const companyLogos = [
    { name: "Toyota", logo: "/logos/toyota.jfif" },
    { name: "Honda", logo: "/logos/honda.png" },
    { name: "BMW", logo: "/logos/bmw.jfif" },
    { name: "Mercedes", logo: "/logos/merecedes.jfif" },
    { name: "Ford", logo: "/logos/ford.png" },
    { name: "Chevrolet", logo: "/logos/chevrolet.jfif" },
    { name: "Audi", logo: "/logos/audi.jfif" },
    { name: "Hyundai", logo: "/logos/hyundai.jfif" },
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
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/cars/vehicle-hero.jpg')",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute right-10 bottom-0 hidden lg:block"
        >
          <img
            src="/honda.png"
            alt="Luxury Car"
            className="h-210 w-auto object-contain ml-[21rem]"
          />
        </motion.div>

        <div className="absolute inset-0 flex items-center px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {t("vehicles.hero.title.line1") || "Find Your"}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  {t("vehicles.hero.title.line2") || "Perfect Ride"}
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-200 mb-8 max-w-2xl"
              >
                {t("vehicles.hero.subtitle") ||
                  "Discover our premium fleet of vehicles. From compact cars to luxury SUVs, find the perfect car that matches your style and needs."}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>

      <FloatingRentalCart
        itemCount={getTotalItems}
        totalPrice={getTotalPrice}
        timeRemaining={timeRemaining}
        onClick={() => setIsRentalCartOpen(true)}
        theme={theme}
      />

      <RentalCartModal
        isOpen={isRentalCartOpen}
        onClose={() => setIsRentalCartOpen(false)}
        rentalCart={rentalCart}
        updateRentalDays={updateRentalDays}
        removeFromRentalCart={handleRemoveFromRentalCart}
        timeRemaining={timeRemaining}
        theme={theme}
        t={t}
      />

      <div className="max-w-7xl mx-auto px-8 -mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card
            className={`
            rounded-2xl shadow-2xl border-0 backdrop-blur-sm
            ${
              theme === "light"
                ? "bg-white/95 border-gray-200"
                : "bg-gray-800/95 border-gray-700"
            }
          `}
          >
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <Label
                    htmlFor="search"
                    className={`
                      text-sm font-semibold mb-2 block
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                  >
                    <Search className="w-4 h-4 inline mr-2" />
                    {t("vehicles.searchLabel") || "Search Vehicles"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="search"
                      placeholder={
                        t("vehicles.searchPlaceholder") ||
                        "Search by car name, model, or type..."
                      }
                      value={filters.searchText}
                      onChange={(e) =>
                        handleFilterChange("searchText", e.target.value)
                      }
                      className={`
                        pl-4 py-3 rounded-xl text-lg
                        ${
                          theme === "light"
                            ? "border-gray-300 bg-white text-gray-900"
                            : "border-gray-600 bg-gray-700 text-white"
                        }
                      `}
                    />
                  </div>
                </div>

                <div>
                  <Label
                    className={`
                    text-sm font-semibold mb-2 block
                    ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                  `}
                  >
                    <Filter className="w-4 h-4 inline mr-2" />
                    {t("vehicles.vehicleType") || "Vehicle Type"}
                  </Label>
                  <Select
                    value={filters.selectedTypes[0] || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "selectedTypes",
                        value === "all" ? [] : [value]
                      )
                    }
                  >
                    <SelectTrigger
                      className={`
                      rounded-xl py-3
                      ${
                        theme === "light"
                          ? "border-gray-300 bg-white text-gray-900"
                          : "border-gray-600 bg-gray-700 text-white"
                      }
                    `}
                    >
                      <SelectValue
                        placeholder={
                          t("vehicles.selectTypePlaceholder") || "Select type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      className={`
                      ${theme === "light" ? "bg-white" : "bg-gray-800"}
                    `}
                    >
                      <SelectItem
                        value="all"
                        className={
                          theme === "light" ? "text-gray-900" : "text-white"
                        }
                      >
                        {t("vehicles.allVehicles") || "All Vehicles"}
                      </SelectItem>
                      {vehicleTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className={
                            theme === "light" ? "text-gray-900" : "text-white"
                          }
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    className={`
                    text-sm font-semibold mb-2 block
                    ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                  `}
                  >
                    <span
                      className={`
                      font-bold
                      ${theme === "light" ? "text-blue-600" : "text-blue-400"}
                    `}
                    >
                      ETB {filters.priceRange[0]}
                    </span>{" "}
                    -
                    <span
                      className={`
                      font-bold
                      ${theme === "light" ? "text-blue-600" : "text-blue-400"}
                    `}
                    >
                      {" "}
                      ETB {filters.priceRange[1]}
                    </span>
                    {t("vehicles.perDay") || "/day"}
                  </Label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        handleFilterChange("priceRange", [
                          filters.priceRange[0],
                          parseInt(e.target.value),
                        ])
                      }
                      className={`
                        w-full h-2 rounded-lg appearance-none cursor-pointer slider
                        ${theme === "light" ? "bg-gray-200" : "bg-gray-600"}
                      `}
                    />
                    <div
                      className={`
                      flex justify-between text-xs
                      ${theme === "light" ? "text-gray-500" : "text-gray-400"}
                    `}
                    >
                      <span>ETB 0</span>
                      <span>ETB {Math.round(maxPrice / 2)}</span>
                      <span>ETB {maxPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant={
                    filters.selectedTypes.length === 0 ? "default" : "outline"
                  }
                  onClick={() => handleFilterChange("selectedTypes", [])}
                  className="rounded-xl"
                >
                  {t("vehicles.allVehicles") || "All Cars"}
                </Button>
                {vehicleTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={
                      filters.selectedTypes.includes(type.value)
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleFilterChange(
                        "selectedTypes",
                        filters.selectedTypes.includes(type.value)
                          ? filters.selectedTypes.filter(
                              (t) => t !== type.value
                            )
                          : [...filters.selectedTypes, type.value]
                      )
                    }
                    className="rounded-xl"
                  >
                    {type.icon}
                    <span className="ml-2">{type.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-20">
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
              {filteredAndSortedVehicles.length}{" "}
              {t("vehicles.vehiclesFound") || "vehicles found"}
              {filters.selectedTypes.length > 0 &&
                ` ${t("vehicles.inCategory") || "in"} ${
                  vehicleTypes.find((t) => t.value === filters.selectedTypes[0])
                    ?.label
                }`}
              {filters.searchText &&
                ` ${t("vehicles.forSearch") || "for"} "${filters.searchText}"`}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger
                className={`
                w-[180px] rounded-xl
                ${
                  theme === "light"
                    ? "border-gray-300 bg-white text-gray-900"
                    : "border-gray-600 bg-gray-700 text-white"
                }
              `}
              >
                <SelectValue placeholder={t("vehicles.sortBy") || "Sort by"} />
              </SelectTrigger>
              <SelectContent
                className={`
                ${theme === "light" ? "bg-white" : "bg-gray-800"}
              `}
              >
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredAndSortedVehicles.length === 0 ? (
            <NoVehiclesFound theme={theme} loadVehicles={loadVehicles} t={t} />
          ) : (
            <motion.div
              key="vehicle-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              layout
            >
              {filteredAndSortedVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <VehicleCard
                    vehicle={vehicle}
                    theme={theme}
                    onBookNow={handleBookNow}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToRentalCart}
                    isAddedToCart={rentalCart.some((item) => item.id === vehicle.id)}
                    vehicleTypes={vehicleTypes}
                    t={t}
                    rentalDays={rentalDays[vehicle.id] || 1}
                    onRentalDaysChange={(days) =>
                      updateVehicleRentalDays(vehicle.id, days)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      
      </div>

      <div className="max-w-7xl mx-auto px-8 my-20">
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
              <p
                className={
                  theme === "light" ? "text-blue-100" : "text-gray-200"
                }
              >
                {t("vehicles.benefits.insured.description") ||
                  "Comprehensive coverage for complete peace of mind"}
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("vehicles.benefits.support.title") || "24/7 Support"}
              </h3>
              <p
                className={
                  theme === "light" ? "text-blue-100" : "text-gray-200"
                }
              >
                {t("vehicles.benefits.support.description") ||
                  "Round-the-clock assistance whenever you need it"}
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("vehicles.benefits.price.title") || "Best Price Guarantee"}
              </h3>
              <p
                className={
                  theme === "light" ? "text-blue-100" : "text-gray-200"
                }
              >
                {t("vehicles.benefits.price.description") ||
                  "Find a better price? We'll match it!"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-8 my-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2
            className={`
            text-3xl md:text-4xl font-bold mb-4
            ${theme === "light" ? "text-gray-800" : "text-white"}
          `}
          >
            {t("vehicles.trustedBrands.title") || "Trusted by Leading Brands"}
          </h2>
          <p
            className={`
            text-lg max-w-2xl mx-auto
            ${theme === "light" ? "text-gray-600" : "text-gray-400"}
          `}
          >
            {t("vehicles.trustedBrands.subtitle") ||
              "We partner with the world's most reputable automotive manufacturers to bring you the best vehicles"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center"
        >
          {companyLogos.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className={`
                flex items-center justify-center p-4 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300
                ${
                  theme === "light"
                    ? "bg-white border-gray-100"
                    : "bg-gray-800 border-gray-700"
                }
              `}
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-8 my-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className={`
            rounded-3xl p-12 text-center text-white shadow-2xl
            ${
              theme === "light"
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : "bg-gradient-to-r from-orange-600 to-red-600"
            }
          `}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("vehicles.cta.title") || "Ready to Find Your Perfect Car?"}
          </h2>
          <p
            className={`
            text-lg mb-8 max-w-2xl mx-auto
            ${theme === "light" ? "text-orange-100" : "text-gray-200"}
          `}
          >
            {t("vehicles.cta.subtitle") ||
              "Browse our extensive collection of premium vehicles and book your dream car today. Experience the best in car rental services."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/dashboard/contact"> 
            <Button
              variant="outline"
              className={`
                rounded-2xl px-8 py-3 text-lg
                ${
                  theme === "light"
                    ? "border-white text-white hover:bg-white hover:text-orange-600"
                    : "border-white text-white hover:bg-white hover:text-orange-700"
                }
              `}
            >
              {t("vehicles.cta.secondaryButton") || "Contact "}
            </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const LoadingScreen: React.FC<{ theme: string }> = ({ theme }) => (
  <div
    className={`min-h-screen flex items-center justify-center ${
      theme === "light"
        ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
        : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
    }`}
  >
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
        <h3
          className={`text-2xl font-bold mt-6 ${
            theme === "light" ? "text-gray-800" : "text-white"
          }`}
        >
          Loading Amazing Rides...
        </h3>
        <p
          className={`mt-2 ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          Preparing your perfect vehicle collection
        </p>
      </motion.div>
    </div>
  </div>
);

const ErrorScreen: React.FC<{
  error: string;
  onRetry: () => void;
  theme: string;
}> = ({ error, onRetry, theme }) => (
  <div
    className={`min-h-screen flex items-center justify-center ${
      theme === "light"
        ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
        : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
    }`}
  >
    <div className="text-center max-w-md mx-auto p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            theme === "light" ? "bg-red-100" : "bg-red-900/20"
          }`}
        >
          <Car className="w-12 h-12 text-red-500" />
        </div>
        <h3
          className={`text-2xl font-bold mb-3 ${
            theme === "light" ? "text-gray-800" : "text-white"
          }`}
        >
          Oops! Something went wrong
        </h3>
        <p
          className={`mb-6 ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {error}
        </p>
        <Button onClick={onRetry} className="rounded-2xl px-8 py-3">
          Try Again
        </Button>
      </motion.div>
    </div>
  </div>
);

const FloatingRentalCart: React.FC<{
  itemCount: number;
  totalPrice: number;
  timeRemaining: number | null;
  onClick: () => void;
  theme: string;
}> = ({ itemCount, totalPrice, timeRemaining, onClick, theme }) => {
  const formatTimeRemaining = (milliseconds: number) => {
    if (milliseconds <= 0) return "Expired";
    
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!timeRemaining || timeRemaining <= 0) return "text-red-500";
    if (timeRemaining <= 5 * 60 * 1000) return "text-orange-500"; // 5 minutes
    return "text-green-500";
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-50 p-4 rounded-2xl shadow-2xl transition-all duration-300 ${
        theme === "light"
          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
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
          <div className="text-sm font-semibold">ETB {totalPrice}</div>
          <div className="text-xs opacity-80">View Rental Cart</div>
          {timeRemaining !== null && timeRemaining > 0 && itemCount > 0 && (
            <div className={`text-xs font-semibold ${getTimerColor()} flex items-center gap-1 mt-1`}>
              <Timer className="w-3 h-3" />
              {formatTimeRemaining(timeRemaining)}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};

interface EnhancedVehicleCardProps extends VehicleCardProps {
  rentalDays: number;
  onRentalDaysChange: (days: number) => void;
}

const VehicleCard: React.FC<EnhancedVehicleCardProps> = ({
  vehicle,
  theme,
  onToggleFavorite,
  onAddToCart,
  isAddedToCart,
  vehicleTypes,
  t,
  rentalDays,
  onRentalDaysChange,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const safeVehicle = {
    id: vehicle.id || "unknown",
    name: vehicle.name || "Unnamed Vehicle",
    type: vehicle.type || "UNKNOWN",
    brand: vehicle.brand || "Unknown Brand",
    model: vehicle.model || "Unknown Model",
    pricePerDay: vehicle.pricePerDay || 0,
    seats: vehicle.seats || 4,
    fuelType: vehicle.fuelType || "Gasoline",
    transmission: vehicle.transmission || "Automatic",
    mileage: vehicle.mileage || "Unlimited",
    location: vehicle.location || "Location not specified",
    features: vehicle.features || [],
    image: vehicle.image || "/cars/placeholder-car.jpg",
    stock: vehicle.stock || 0,
    isAvailable: vehicle.isAvailable || false,
  };

  const vehicleType = vehicleTypes.find((t) => t.value === safeVehicle.type);
  const totalPrice = safeVehicle.pricePerDay * rentalDays;

  const handleDaysChange = (newDays: number) => {
    if (newDays >= 1 && newDays <= 30) {
      onRentalDaysChange(newDays);
    }
  };

  const incrementDays = () => {
    handleDaysChange(rentalDays + 1);
  };

  const decrementDays = () => {
    handleDaysChange(rentalDays - 1);
  };

  const getStockStatus = () => {
    if (safeVehicle.stock === 0) {
      return {
        text: "Out of Stock",
        color: "text-red-500",
        bg: "bg-red-100",
        border: "border-red-200",
        available: false,
      };
    } else if (safeVehicle.stock <= 3) {
      return {
        text: `Low Stock (${safeVehicle.stock} left)`,
        color: "text-orange-500",
        bg: "bg-orange-100",
        border: "border-orange-200",
        available: true,
      };
    } else {
      return {
        text: `In Stock (${safeVehicle.stock})`,
        color: "text-green-500",
        bg: "bg-green-100",
        border: "border-green-200",
        available: true,
      };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300
        ${
          theme === "light"
            ? "bg-white border border-gray-100"
            : "bg-gray-800 border border-gray-700"
        }
      `}
    >
      <div className="relative overflow-hidden">
        {!imageLoaded && !imageError && (
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              theme === "light" ? "bg-gray-200" : "bg-gray-700"
            }`}
          >
            <Car className="w-12 h-12 text-gray-400 animate-pulse" />
          </div>
        )}
        <img
          src={imageError ? "/cars/placeholder-car.jpg" : safeVehicle.image}
          alt={safeVehicle.name}
          className={`w-full h-48 object-cover transition-transform duration-300 ${
            imageLoaded ? "group-hover:scale-110 opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
    
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
            {vehicleType?.label || safeVehicle.type}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Stock Status */}
        <div
          className={`mb-4 p-3 rounded-xl border ${stockStatus.border} ${stockStatus.bg}`}
        >
          <div className="flex items-center gap-2">
            <Package className={`w-4 h-4 ${stockStatus.color}`} />
            <span className={`text-sm font-semibold ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>
          {!stockStatus.available && (
            <p className="text-xs text-red-600 mt-1">
              This vehicle is currently unavailable for rental
            </p>
          )}
        </div>

        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3
              className={`
              font-bold text-lg mb-1
              ${theme === "light" ? "text-gray-800" : "text-white"}
            `}
            >
              {safeVehicle.name}
            </h3>
            <p
              className={`
              text-sm
              ${theme === "light" ? "text-gray-500" : "text-gray-400"}
            `}
            >
              {safeVehicle.brand} • {safeVehicle.model}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`
              text-2xl font-bold
              ${theme === "light" ? "text-blue-600" : "text-blue-400"}
            `}
            >
              ETB {safeVehicle.pricePerDay}
            </span>
            <p
              className={`
              text-sm
              ${theme === "light" ? "text-gray-500" : "text-gray-400"}
            `}
            >
              {t("vehicles.perDay") || "per day"}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <Label
            className={`
            text-sm font-semibold mb-2 block
            ${theme === "light" ? "text-gray-700" : "text-gray-300"}
          `}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Rental Period
          </Label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={decrementDays}
                disabled={rentalDays <= 1 || !stockStatus.available}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all
                  ${
                    rentalDays <= 1 || !stockStatus.available
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : theme === "light"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }
                `}
              >
                <Minus className="w-4 h-4" />
              </motion.button>

              <motion.span
                key={rentalDays}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`
                  text-lg font-bold min-w-[40px] text-center
                  ${theme === "light" ? "text-gray-800" : "text-white"}
                `}
              >
                {rentalDays}
              </motion.span>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={incrementDays}
                disabled={rentalDays >= 30 || !stockStatus.available}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all
                  ${
                    rentalDays >= 30 || !stockStatus.available
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : theme === "light"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }
                `}
              >
                <Plus className="w-4 h-4" />
              </motion.button>

              <span
                className={`
                text-sm
                ${theme === "light" ? "text-gray-600" : "text-gray-400"}
              `}
              >
                day{rentalDays !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="text-right">
              <div
                className={`
                text-lg font-bold
                ${theme === "light" ? "text-green-600" : "text-green-400"}
              `}
              >
                ETB {totalPrice}
              </div>
              <div
                className={`
                text-xs
                ${theme === "light" ? "text-gray-500" : "text-gray-400"}
              `}
              >
                total
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className={`
            flex items-center gap-2 text-sm
            ${theme === "light" ? "text-gray-600" : "text-gray-400"}
          `}
          >
            <Users className="w-4 h-4" />
            <span>
              {safeVehicle.seats} {t("vehicles.passengers") || "Pass"}
            </span>
          </div>
          <div
            className={`
            flex items-center gap-2 text-sm
            ${theme === "light" ? "text-gray-600" : "text-gray-400"}
          `}
          >
            <Fuel className="w-4 h-4" />
            <span>{safeVehicle.fuelType}</span>
          </div>
          <div
            className={`
            flex items-center gap-2 text-sm
            ${theme === "light" ? "text-gray-600" : "text-gray-400"}
          `}
          >
            <Gauge className="w-4 h-4" />
            <span>{safeVehicle.transmission}</span>
          </div>
          <div
            className={`
            flex items-center gap-2 text-sm
            ${theme === "light" ? "text-gray-600" : "text-gray-400"}
          `}
          >
            <Clock className="w-4 h-4" />
            <span>{safeVehicle.mileage}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {safeVehicle.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className={`
                px-2 py-1 rounded-full text-xs font-medium
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
          {safeVehicle.features.length > 3 && (
            <span
              className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${
                theme === "light"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-gray-700 text-gray-300"
              }
            `}
            >
              +{safeVehicle.features.length - 3} {t("vehicles.more") || "more"}
            </span>
          )}
        </div>

        <div>
          <Button
            onClick={() => onAddToCart(vehicle)}
            disabled={
              isAddedToCart || !stockStatus.available || safeVehicle.stock === 0
            }
            variant={isAddedToCart ? "default" : "outline"}
            className={`
              rounded-xl py-3 px-4 transition-all w-full
              ${
                isAddedToCart
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : !stockStatus.available || safeVehicle.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : theme === "light"
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
              }
            `}
          >
            {isAddedToCart ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Added to Rental
              </>
            ) : !stockStatus.available || safeVehicle.stock === 0 ? (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Out of Stock
              </>
            ) : (
              <>
                <LifeBuoy className="w-4 h-4 mr-2" />
                Add to Rental Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

interface EnhancedRentalCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalCart: RentalItem[];
  updateRentalDays: (id: string, days: number) => void;
  removeFromRentalCart: (id: string) => void;
  timeRemaining: number | null;
  theme: string;
  t: (key: string) => string | undefined;
}

const RentalCartModal: React.FC<EnhancedRentalCartModalProps> = ({
  isOpen,
  onClose,
  rentalCart,
  updateRentalDays,
  removeFromRentalCart,
  timeRemaining,
  theme,
}) => {
  const totalPrice = useMemo(
    () => rentalCart.reduce((sum, item) => sum + item.totalPrice, 0),
    [rentalCart]
  );

  const formatTimeRemaining = (milliseconds: number) => {
    if (milliseconds <= 0) return "Expired";
    
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!timeRemaining || timeRemaining <= 0) return "text-red-500";
    if (timeRemaining <= 5 * 60 * 1000) return "text-orange-500"; // 5 minutes
    return "text-green-500";
  };

  const handleDaysChange = (id: string, newDays: number) => {
    if (newDays >= 1 && newDays <= 30) {
      updateRentalDays(id, newDays);
    }
  };

  const incrementDays = (id: string, currentDays: number) => {
    handleDaysChange(id, currentDays + 1);
  };

  const decrementDays = (id: string, currentDays: number) => {
    handleDaysChange(id, currentDays - 1);
  };

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
        className={`w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] flex flex-col ${
          theme === "light"
            ? "bg-white text-gray-900"
            : "bg-gray-800 text-white"
        }`}
      >
        <div
          className={`flex items-center justify-between p-8 border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-700"
          }`}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-blue-500" />
              Your Rental Cart
              {rentalCart.length > 0 && (
                <Badge className="bg-blue-500 text-white text-lg py-1 px-3">
                  {rentalCart.length}
                </Badge>
              )}
            </h2>
            {timeRemaining !== null && timeRemaining > 0 && rentalCart.length > 0 && (
              <div className={`flex items-center gap-2 ${getTimerColor()} font-semibold`}>
                <Timer className="w-5 h-5" />
                <span className="text-lg">{formatTimeRemaining(timeRemaining)}</span>
                <span className="text-sm opacity-80">remaining</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-2xl w-10 h-10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence>
            {rentalCart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <p className="text-2xl font-black mb-2">Your rental cart is empty</p>
                <p className="text-gray-500 text-lg">
                  Add some amazing vehicles to start your rental journey
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {rentalCart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center justify-between p-6 rounded-2xl ${
                      theme === "light"
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Car className="w-12 h-12 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-black text-lg line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-gray-500">
                          {item.brand} • {item.model}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span
                            className={`
                                                        text-sm font-semibold
                                                        ${
                                                          theme === "light"
                                                            ? "text-gray-700"
                                                            : "text-gray-300"
                                                        }
                                                    `}
                          >
                            ETB {item.pricePerDay}/day
                          </span>
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.stock === 0
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            Stock: {item.stock}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            decrementDays(item.id, item.rentalDays)
                          }
                          disabled={item.rentalDays <= 1}
                          className={`
                                                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                                                        ${
                                                          item.rentalDays <= 1
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : theme === "light"
                                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                                        }
                                                    `}
                        >
                          <Minus className="w-3 h-3" />
                        </motion.button>

                        <motion.span
                          key={item.rentalDays}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`
                                                        font-bold min-w-[30px] text-center
                                                        ${
                                                          theme === "light"
                                                            ? "text-gray-800"
                                                            : "text-white"
                                                        }
                                                    `}
                        >
                          {item.rentalDays}
                        </motion.span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            incrementDays(item.id, item.rentalDays)
                          }
                          disabled={item.rentalDays >= 30}
                          className={`
                                                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                                                        ${
                                                          item.rentalDays >= 30
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : theme === "light"
                                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                                        }
                                                    `}
                        >
                          <Plus className="w-3 h-3" />
                        </motion.button>

                        <span
                          className={`
                                                    text-sm
                                                    ${
                                                      theme === "light"
                                                        ? "text-gray-600"
                                                        : "text-gray-400"
                                                    }
                                                `}
                        >
                          day{item.rentalDays !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <div className="text-xl font-black text-green-600">
                          ETB {item.totalPrice}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromRentalCart(item.id)}
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

        {rentalCart.length > 0 && (
          <div
            className={`p-8 border-t ${
              theme === "light" ? "border-gray-200" : "border-gray-700"
            }`}
          >
            {timeRemaining !== null && timeRemaining > 0 && (
              <div className={`mb-4 p-3 rounded-xl border ${getTimerColor().replace('text', 'border')} ${getTimerColor().replace('text', 'bg')} bg-opacity-10`}>
                <div className="flex items-center justify-center gap-2">
                  <Timer className="w-4 h-4" />
                  <span className={`font-semibold ${getTimerColor()}`}>
                    Reservation expires in {formatTimeRemaining(timeRemaining)}
                  </span>
                </div>
                <p className="text-sm text-center text-gray-500 mt-1">
                  Complete checkout before time runs out to secure your vehicles
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-2xl font-black">Total Rental:</span>
                <p className="text-sm text-gray-500">
                  {rentalCart.length} vehicle{rentalCart.length !== 1 ? "s" : ""} •{" "}
                  {rentalCart.reduce((sum, item) => sum + item.rentalDays, 0)} total
                  rental days
                </p>
              </div>
              <span className="text-3xl font-black text-green-600">
                ETB {totalPrice}
              </span>
            </div>
            <Button
              onClick={() => {
                // Cart is already persisted in localStorage via the hook
                window.location.href = "/dashboard/checkout";
                toast.success("Proceeding to checkout page");
              }}
              className="w-full rounded-2xl py-4 text-lg font-black bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl flex items-center justify-center"
            >
              <DollarSign className="w-6 h-6 mr-3" />
              Proceed to Checkout ({rentalCart.length})
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const NoVehiclesFound: React.FC<{
  theme: string;
  loadVehicles: () => void;
  t: (key: string) => string | undefined;
}> = ({ theme, loadVehicles }) => (
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

    <h3
      className={`text-4xl font-black mb-4 ${
        theme === "light" ? "text-gray-900" : "text-white"
      }`}
    >
      No Vehicles Found
    </h3>

    <p
      className={`text-xl mb-8 max-w-md mx-auto ${
        theme === "light" ? "text-gray-600" : "text-gray-400"
      }`}
    >
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