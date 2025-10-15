import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Calendar,
  MapPin,
  Star,
  Heart,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
} from "lucide-react";
import { useState, type SetStateAction } from "react";

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 200]);

  const vehicleTypes = [
    { value: "all", label: "All Vehicles" },
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "luxury", label: "Luxury" },
    { value: "sports", label: "Sports" },
    { value: "compact", label: "Compact" },
    { value: "van", label: "Van" },
  ];

  const vehicles = [
    {
      id: 1,
      name: "Toyota Camry 2023",
      type: "sedan",
      price: 45,
      image: "/camry.avif",
      features: ["5 Seats", "Automatic", "Air Conditioning", "GPS"],
      specs: {
        passengers: 5,
        fuel: "Hybrid",
        transmission: "Automatic",
        mileage: "Unlimited",
      },
      rating: 4.8,
      reviews: 124,
      favorite: false,
    },
    {
      id: 2,
      name: "Honda CR-V Elite",
      type: "suv",
      price: 65,
      image: "/camry.avif",
      features: ["7 Seats", "4WD", "Spacious", "Sunroof"],
      specs: {
        passengers: 7,
        fuel: "Gasoline",
        transmission: "Automatic",
        mileage: "Unlimited",
      },
      rating: 4.7,
      reviews: 89,
      favorite: true,
    },
    {
      id: 3,
      name: "BMW 3 Series",
      type: "luxury",
      price: 89,
      image: "/camry.avif",
      features: ["Premium", "Sport Mode", "Leather", "Premium Sound"],
      specs: {
        passengers: 5,
        fuel: "Gasoline",
        transmission: "Automatic",
        mileage: "Unlimited",
      },
      rating: 4.9,
      reviews: 67,
      favorite: false,
    },
    {
      id: 4,
      name: "Mercedes-Benz C-Class",
      type: "luxury",
      price: 95,
      image: "/camry.avif",
      features: ["Luxury", "Heated Seats", "Panoramic Roof", "Assist"],
      specs: {
        passengers: 5,
        fuel: "Gasoline",
        transmission: "Automatic",
        mileage: "Unlimited",
      },
      rating: 4.9,
      reviews: 92,
      favorite: true,
    },
    {
      id: 5,
      name: "Ford Mustang",
      type: "sports",
      price: 75,
      image: "/camry.avif",
      features: ["Sport", "Convertible", "Premium", "Fast"],
      specs: {
        passengers: 4,
        fuel: "Gasoline",
        transmission: "Manual",
        mileage: "Unlimited",
      },
      rating: 4.6,
      reviews: 78,
      favorite: false,
    },
    {
      id: 6,
      name: "Toyota RAV4",
      type: "suv",
      price: 55,
      image: "/camry.avif",
      features: ["5 Seats", "AWD", "Economical", "Spacious"],
      specs: {
        passengers: 5,
        fuel: "Hybrid",
        transmission: "Automatic",
        mileage: "Unlimited",
      },
      rating: 4.7,
      reviews: 156,
      favorite: false,
    },
    {
      id: 7,
      name: "Honda Civic",
      type: "compact",
      price: 35,
      image: "/camry.avif",
      features: ["5 Seats", "Economical", "Tech", "Safe"],
      specs: {
        passengers: 5,
        fuel: "Gasoline",
        transmission: "Automatic",
        mileage: "Unlimited",
      },
      rating: 4.5,
      reviews: 203,
      favorite: false,
    },
    {
      id: 8,
      name: "Chevrolet Suburban",
      type: "van",
      price: 85,
      image: "/camry.avif",
      features: ["8 Seats", "Spacious", "Family", "Luxury"],
      specs: {
        passengers: 8,
        fuel: "Gasoline",
        transmission: "Automatic",
        mileage: "Unlimited",
      },
      rating: 4.8,
      reviews: 45,
      favorite: false,
    },
  ];

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || vehicle.type === selectedType;
    const matchesPrice =
      vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];

    return matchesSearch && matchesType && matchesPrice;
  });

  const toggleFavorite = (id: number) => {
    console.log("Toggle favorite:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="h-[400px] rounded-b-3xl relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/cars/vehicle-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Find Your Perfect Ride
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Explore our premium fleet of vehicles. From compact cars to luxury
              SUVs, we have the perfect car for every journey.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-20 relative z-10">
        <Card className="rounded-2xl shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <Label
                  htmlFor="search"
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  Search Vehicles
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by car name, model, or type..."
                    value={searchTerm}
                    onChange={(e: {
                      target: { value: SetStateAction<string> };
                    }) => setSearchTerm(e.target.value)}
                    className="pl-10 py-3 rounded-xl border-gray-300"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Vehicle Type
                </Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="rounded-xl border-gray-300 py-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}/day
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e: { target: { value: string } }) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
                className="rounded-xl"
              >
                All Cars
              </Button>
              <Button
                variant={selectedType === "suv" ? "default" : "outline"}
                onClick={() => setSelectedType("suv")}
                className="rounded-xl"
              >
                SUV
              </Button>
              <Button
                variant={selectedType === "sedan" ? "default" : "outline"}
                onClick={() => setSelectedType("sedan")}
                className="rounded-xl"
              >
                Sedan
              </Button>
              <Button
                variant={selectedType === "luxury" ? "default" : "outline"}
                onClick={() => setSelectedType("luxury")}
                className="rounded-xl"
              >
                Luxury
              </Button>
              <Button
                variant={selectedType === "sports" ? "default" : "outline"}
                onClick={() => setSelectedType("sports")}
                className="rounded-xl"
              >
                Sports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Available Vehicles
            </h2>
            <p className="text-gray-600 mt-2">
              {filteredVehicles.length} vehicles found
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px] rounded-xl border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => toggleFavorite(vehicle.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        vehicle.favorite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {vehicle.type.charAt(0).toUpperCase() +
                        vehicle.type.slice(1)}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-sm">
                      {vehicle.rating}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({vehicle.reviews})
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {vehicle.name}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">Per day</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600">
                        ${vehicle.price}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{vehicle.specs.passengers} Passengers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Fuel className="w-4 h-4" />
                      <span>{vehicle.specs.fuel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Gauge className="w-4 h-4" />
                      <span>{vehicle.specs.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{vehicle.specs.mileage}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {vehicle.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{vehicle.features.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3">
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3 px-4"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredVehicles.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-2xl px-8 py-3"
            >
              Load More Vehicles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-8 my-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Fully Insured</h3>
              <p className="text-blue-100">
                Comprehensive coverage for complete peace of mind
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-blue-100">
                Round-the-clock assistance whenever you need it
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Best Price Guarantee</h3>
              <p className="text-blue-100">
                Find a better price? We'll match it!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
