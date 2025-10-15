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
  Calendar,
  MapPin,
  Star,
  Heart,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
} from "lucide-react";
import { useState } from "react";

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
      image: "/bmw.jfif",
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
      image: "/bmw.jfif",
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
      image: "/bmw.jfif",
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
      image: "/bmw.jfif",
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
      image: "/bmw.jfif",
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
      image: "/bmw.jfif",
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
      image: "/bmw.jfif",
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
      image: "/bmw.jfif",
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
                Find Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  Perfect Ride
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-200 mb-8 max-w-2xl"
              >
                Discover our premium fleet of vehicles. From compact cars to
                luxury SUVs, find the perfect car that matches your style and
                needs.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rounded-2xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <Label
                    htmlFor="search"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    <Search className="w-4 h-4 inline mr-2" />
                    Search Vehicles
                  </Label>
                  <div className="relative">
                    <Input
                      id="search"
                      placeholder="Search by car name, model, or type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-4 py-3 rounded-xl border-gray-300 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    <Filter className="w-4 h-4 inline mr-2" />
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
                    <span className="text-blue-600 font-bold">
                      ${priceRange[0]}
                    </span>{" "}
                    -
                    <span className="text-blue-600 font-bold">
                      {" "}
                      ${priceRange[1]}
                    </span>
                    /day
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$0</span>
                      <span>$100</span>
                      <span>$200</span>
                    </div>
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
                  <Car className="w-4 h-4 mr-2" />
                  SUV
                </Button>
                <Button
                  variant={selectedType === "sedan" ? "default" : "outline"}
                  onClick={() => setSelectedType("sedan")}
                  className="rounded-xl"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Sedan
                </Button>
                <Button
                  variant={selectedType === "luxury" ? "default" : "outline"}
                  onClick={() => setSelectedType("luxury")}
                  className="rounded-xl"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Luxury
                </Button>
                <Button
                  variant={selectedType === "sports" ? "default" : "outline"}
                  onClick={() => setSelectedType("sports")}
                  className="rounded-xl"
                >
                  <Gauge className="w-4 h-4 mr-2" />
                  Sports
                </Button>
                <Button
                  variant={selectedType === "compact" ? "default" : "outline"}
                  onClick={() => setSelectedType("compact")}
                  className="rounded-xl"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Compact
                </Button>
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
            <h2 className="text-3xl font-bold text-gray-800">
              Available Vehicles
            </h2>
            <p className="text-gray-600 mt-2">
              {filteredVehicles.length} vehicles found
              {selectedType !== "all" &&
                ` in ${
                  vehicleTypes.find((t) => t.value === selectedType)?.label
                }`}
              {searchTerm && ` for "${searchTerm}"`}
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
        </motion.div>

        {filteredVehicles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search filters
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setPriceRange([0, 200]);
              }}
              className="rounded-xl"
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            layout
          >
            {filteredVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button
                    onClick={() => toggleFavorite(vehicle.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        vehicle.favorite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    />
                  </button>
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {vehicle.type.charAt(0).toUpperCase() +
                        vehicle.type.slice(1)}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
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
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {vehicle.name}
                      </h3>
                      <p className="text-gray-500 text-sm">Per day</p>
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
                      <span>{vehicle.specs.passengers} Pass</span>
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
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                    {vehicle.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        +{vehicle.features.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold">
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
          </motion.div>
        )}

        {filteredVehicles.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-2xl px-8 py-3 font-semibold"
            >
              Load More Vehicles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-8 my-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
        >
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
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-8 my-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Trusted by Leading Brands
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We partner with the world's most reputable automotive manufacturers
            to bring you the best vehicles
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
              className="flex items-center justify-center p-4 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
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

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-8 my-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of premium vehicles and book your
            dream car today. Experience the best in car rental services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 font-bold rounded-2xl px-8 py-3 text-lg">
              Browse All Vehicles
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 rounded-2xl px-8 py-3 text-lg"
            >
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
