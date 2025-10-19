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
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useLanguage } from "../components/LanguageContext";
import { useTheme } from "../components/ThemeContext";
import { apiService } from "../services/api";
import type { Vehicle } from "../types/vehicle";

interface VehicleType {
  value: string;
  label: string;
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

  const filteredVehicles = vehicles.filter((vehicle: Vehicle) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || vehicle.type === selectedType;
    const matchesPrice = vehicle.pricePerDay >= priceRange[0] && vehicle.pricePerDay <= priceRange[1];

    return matchesSearch && matchesType && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={loadVehicles}>Retry</Button>
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
      {/* Your existing JSX structure remains the same, just update the vehicle mapping */}
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        layout
      >
        {filteredVehicles.map((vehicle: Vehicle) => (
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
      
      {/* Rest of your existing JSX */}
    </div>
  );
}

// Separate component for vehicle card
interface VehicleCardProps {
  vehicle: Vehicle;
  theme: string;
  onBookNow: (vehicle: Vehicle) => void;
  onToggleFavorite: (id: string) => void;
  vehicleTypes: VehicleType[];
  t: (key: string) => string | undefined;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  theme, 
  onBookNow, 
  onToggleFavorite, 
  vehicleTypes,
  t 
}) => {
  return (
    <motion.div
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
        <img
          src={vehicle.image || "/bmw.jfif"}
          alt={vehicle.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={() => onToggleFavorite(vehicle.id)}
          className={`
            absolute top-3 right-3 p-2 rounded-full hover:bg-white transition-colors shadow-lg backdrop-blur-sm
            ${theme === 'light' ? 'bg-white/90' : 'bg-gray-800/90'}
          `}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              theme === 'light' 
                ? "text-gray-600 hover:text-red-500" 
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
        <div className="absolute top-3 left-3">
          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold shadow-lg
            ${theme === 'light'
              ? 'bg-blue-500 text-white'
              : 'bg-blue-600 text-white'
            }
          `}>
            {vehicleTypes.find(t => t.value === vehicle.type)?.label || 
             vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
          </span>
        </div>
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
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className={`
              font-bold text-lg mb-1
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

        <div className="flex flex-wrap gap-1 mb-4">
          {vehicle.features.slice(0, 3).map((feature: string, index: number) => (
            <span
              key={index}
              className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${theme === 'light'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-700 text-gray-300'
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
                ? 'bg-gray-100 text-gray-700'
                : 'bg-gray-700 text-gray-300'
              }
            `}>
              +{vehicle.features.length - 3} {t("vehicles.more") || "more"}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => onBookNow(vehicle)}
            className={`
              flex-1 rounded-xl py-3 font-semibold
              ${theme === 'light'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-700 hover:bg-blue-800 text-white'
              }
            `}
          >
            {t("vehicles.bookNow") || "Book Now"}
          </Button>
          <Button
            variant="outline"
            className={`
              flex-1 rounded-xl py-3 px-4
              ${theme === 'light'
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
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