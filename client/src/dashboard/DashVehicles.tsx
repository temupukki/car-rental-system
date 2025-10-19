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
import { useLanguage } from "../components/LanguageContext";
import { useTheme } from "../components/ThemeContext";

export default function DVehicles() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 200]);

  const vehicleTypes = [
    { value: "all", label: t("vehicles.allVehicles") || "All Vehicles" },
    { value: "sedan", label: t("vehicles.sedan") || "Sedan" },
    { value: "suv", label: t("vehicles.suv") || "SUV" },
    { value: "luxury", label: t("vehicles.luxury") || "Luxury" },
    { value: "sports", label: t("vehicles.sports") || "Sports" },
    { value: "compact", label: t("vehicles.compact") || "Compact" },
    { value: "van", label: t("vehicles.van") || "Van" },
  ];

  const sortOptions = [
    { value: "featured", label: t("vehicles.featured") || "Featured" },
    { value: "price-low", label: t("vehicles.priceLow") || "Price: Low to High" },
    { value: "price-high", label: t("vehicles.priceHigh") || "Price: High to Low" },
    { value: "rating", label: t("vehicles.rating") || "Highest Rated" },
    { value: "popular", label: t("vehicles.popular") || "Most Popular" },
  ];

  const vehicles = [
    {
      id: 1,
      name: t("vehicles.cars.camry.name") || "Toyota Camry 2023",
      type: "sedan",
      price: 45,
      image: "/bmw.jfif",
      features: [
        t("vehicles.cars.camry.features.seats") || "5 Seats",
        t("vehicles.cars.camry.features.transmission") || "Automatic",
        t("vehicles.cars.camry.features.ac") || "Air Conditioning",
        t("vehicles.cars.camry.features.gps") || "GPS"
      ],
      specs: {
        passengers: 5,
        fuel: t("vehicles.fuelTypes.hybrid") || "Hybrid",
        transmission: t("vehicles.transmissionTypes.automatic") || "Automatic",
        mileage: t("vehicles.mileage.unlimited") || "Unlimited",
      },
      rating: 4.8,
      reviews: 124,
      favorite: false,
    },
    {
      id: 2,
      name: t("vehicles.cars.crv.name") || "Honda CR-V Elite",
      type: "suv",
      price: 65,
      image: "/bmw.jfif",
      features: [
        t("vehicles.cars.crv.features.seats") || "7 Seats",
        t("vehicles.cars.crv.features.drive") || "4WD",
        t("vehicles.cars.crv.features.space") || "Spacious",
        t("vehicles.cars.crv.features.sunroof") || "Sunroof"
      ],
      specs: {
        passengers: 7,
        fuel: t("vehicles.fuelTypes.gasoline") || "Gasoline",
        transmission: t("vehicles.transmissionTypes.automatic") || "Automatic",
        mileage: t("vehicles.mileage.unlimited") || "Unlimited",
      },
      rating: 4.7,
      reviews: 89,
      favorite: true,
    },
    {
      id: 3,
      name: t("vehicles.cars.bmw.name") || "BMW 3 Series",
      type: "luxury",
      price: 89,
      image: "/bmw.jfif",
      features: [
        t("vehicles.cars.bmw.features.premium") || "Premium",
        t("vehicles.cars.bmw.features.sport") || "Sport Mode",
        t("vehicles.cars.bmw.features.leather") || "Leather",
        t("vehicles.cars.bmw.features.sound") || "Premium Sound"
      ],
      specs: {
        passengers: 5,
        fuel: t("vehicles.fuelTypes.gasoline") || "Gasoline",
        transmission: t("vehicles.transmissionTypes.automatic") || "Automatic",
        mileage: t("vehicles.mileage.unlimited") || "Unlimited",
      },
      rating: 4.9,
      reviews: 67,
      favorite: false,
    },
    {
      id: 4,
      name: t("vehicles.cars.mercedes.name") || "Mercedes-Benz C-Class",
      type: "luxury",
      price: 95,
      image: "/bmw.jfif",
      features: [
        t("vehicles.cars.mercedes.features.luxury") || "Luxury",
        t("vehicles.cars.mercedes.features.seats") || "Heated Seats",
        t("vehicles.cars.mercedes.features.roof") || "Panoramic Roof",
        t("vehicles.cars.mercedes.features.assist") || "Assist"
      ],
      specs: {
        passengers: 5,
        fuel: t("vehicles.fuelTypes.gasoline") || "Gasoline",
        transmission: t("vehicles.transmissionTypes.automatic") || "Automatic",
        mileage: t("vehicles.mileage.unlimited") || "Unlimited",
      },
      rating: 4.9,
      reviews: 92,
      favorite: true,
    },
    {
      id: 5,
      name: t("vehicles.cars.mustang.name") || "Ford Mustang",
      type: "sports",
      price: 75,
      image: "/bmw.jfif",
      features: [
        t("vehicles.cars.mustang.features.sport") || "Sport",
        t("vehicles.cars.mustang.features.convertible") || "Convertible",
        t("vehicles.cars.mustang.features.premium") || "Premium",
        t("vehicles.cars.mustang.features.fast") || "Fast"
      ],
      specs: {
        passengers: 4,
        fuel: t("vehicles.fuelTypes.gasoline") || "Gasoline",
        transmission: t("vehicles.transmissionTypes.manual") || "Manual",
        mileage: t("vehicles.mileage.unlimited") || "Unlimited",
      },
      rating: 4.6,
      reviews: 78,
      favorite: false,
    },
    {
      id: 6,
      name: t("vehicles.cars.rav4.name") || "Toyota RAV4",
      type: "suv",
      price: 55,
      image: "/bmw.jfif",
      features: [
        t("vehicles.cars.rav4.features.seats") || "5 Seats",
        t("vehicles.cars.rav4.features.drive") || "AWD",
        t("vehicles.cars.rav4.features.economical") || "Economical",
        t("vehicles.cars.rav4.features.space") || "Spacious"
      ],
      specs: {
        passengers: 5,
        fuel: t("vehicles.fuelTypes.hybrid") || "Hybrid",
        transmission: t("vehicles.transmissionTypes.automatic") || "Automatic",
        mileage: t("vehicles.mileage.unlimited") || "Unlimited",
      },
      rating: 4.7,
      reviews: 156,
      favorite: false,
    },
    {
      id: 7,
      name: t("vehicles.cars.civic.name") || "Honda Civic",
      type: "compact",
      price: 35,
      image: "/bmw.jfif",
      features: [
        t("vehicles.cars.civic.features.seats") || "5 Seats",
        t("vehicles.cars.civic.features.economical") || "Economical",
        t("vehicles.cars.civic.features.tech") || "Tech",
        t("vehicles.cars.civic.features.safe") || "Safe"
      ],
      specs: {
        passengers: 5,
        fuel: t("vehicles.fuelTypes.gasoline") || "Gasoline",
        transmission: t("vehicles.transmissionTypes.automatic") || "Automatic",
        mileage: t("vehicles.mileage.unlimited") || "Unlimited",
      },
      rating: 4.5,
      reviews: 203,
      favorite: false,
    },
    {
      id: 8,
      name: t("vehicles.cars.suburban.name") || "Chevrolet Suburban",
      type: "van",
      price: 85,
      image: "/bmw.jfif",
      features: [
        t("vehicles.cars.suburban.features.seats") || "8 Seats",
        t("vehicles.cars.suburban.features.space") || "Spacious",
        t("vehicles.cars.suburban.features.family") || "Family",
        t("vehicles.cars.suburban.features.luxury") || "Luxury"
      ],
      specs: {
        passengers: 8,
        fuel: t("vehicles.fuelTypes.gasoline") || "Gasoline",
        transmission: t("vehicles.transmissionTypes.automatic") || "Automatic",
        mileage: t("vehicles.mileage.unlimited") || "Unlimited",
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
    <div className={`
      min-h-screen transition-all duration-500
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
      }
    `}>
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
                {t("vehicles.hero.subtitle") || "Discover our premium fleet of vehicles. From compact cars to luxury SUVs, find the perfect car that matches your style and needs."}
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
          <Card className={`
            rounded-2xl shadow-2xl border-0 backdrop-blur-sm
            ${theme === 'light'
              ? 'bg-white/95 border-gray-200'
              : 'bg-gray-800/95 border-gray-700'
            }
          `}>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <Label
                    htmlFor="search"
                    className={`
                      text-sm font-semibold mb-2 block
                      ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                    `}
                  >
                    <Search className="w-4 h-4 inline mr-2" />
                    {t("vehicles.searchLabel") || "Search Vehicles"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="search"
                      placeholder={t("vehicles.searchPlaceholder") || "Search by car name, model, or type..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`
                        pl-4 py-3 rounded-xl text-lg
                        ${theme === 'light'
                          ? 'border-gray-300 bg-white text-gray-900'
                          : 'border-gray-600 bg-gray-700 text-white'
                        }
                      `}
                    />
                  </div>
                </div>

                <div>
                  <Label className={`
                    text-sm font-semibold mb-2 block
                    ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                  `}>
                    <Filter className="w-4 h-4 inline mr-2" />
                    {t("vehicles.vehicleType") || "Vehicle Type"}
                  </Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className={`
                      rounded-xl py-3
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
                  <Label className={`
                    text-sm font-semibold mb-2 block
                    ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                  `}>
                    <span className={`
                      font-bold
                      ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
                    `}>
                      ${priceRange[0]}
                    </span>{" "}
                    -
                    <span className={`
                      font-bold
                      ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
                    `}>
                      {" "}
                      ${priceRange[1]}
                    </span>
                    {t("vehicles.perDay") || "/day"}
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
                        w-full h-2 rounded-lg appearance-none cursor-pointer slider
                        ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}
                      `}
                    />
                    <div className={`
                      flex justify-between text-xs
                      ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                    `}>
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
                  {t("vehicles.allVehicles") || "All Cars"}
                </Button>
                <Button
                  variant={selectedType === "suv" ? "default" : "outline"}
                  onClick={() => setSelectedType("suv")}
                  className="rounded-xl"
                >
                  <Car className="w-4 h-4 mr-2" />
                  {t("vehicles.suv") || "SUV"}
                </Button>
                <Button
                  variant={selectedType === "sedan" ? "default" : "outline"}
                  onClick={() => setSelectedType("sedan")}
                  className="rounded-xl"
                >
                  <Car className="w-4 h-4 mr-2" />
                  {t("vehicles.sedan") || "Sedan"}
                </Button>
                <Button
                  variant={selectedType === "luxury" ? "default" : "outline"}
                  onClick={() => setSelectedType("luxury")}
                  className="rounded-xl"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {t("vehicles.luxury") || "Luxury"}
                </Button>
                <Button
                  variant={selectedType === "sports" ? "default" : "outline"}
                  onClick={() => setSelectedType("sports")}
                  className="rounded-xl"
                >
                  <Gauge className="w-4 h-4 mr-2" />
                  {t("vehicles.sports") || "Sports"}
                </Button>
                <Button
                  variant={selectedType === "compact" ? "default" : "outline"}
                  onClick={() => setSelectedType("compact")}
                  className="rounded-xl"
                >
                  <Car className="w-4 h-4 mr-2" />
                  {t("vehicles.compact") || "Compact"}
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
            <Select defaultValue="featured">
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

        {filteredVehicles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Car className={`
              w-16 h-16 mx-auto mb-4
              ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}
            `} />
            <h3 className={`
              text-xl font-semibold mb-2
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              {t("vehicles.noVehiclesFound") || "No vehicles found"}
            </h3>
            <p className={`
              mb-4
              ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}
            `}>
              {t("vehicles.adjustFilters") || "Try adjusting your search filters"}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setPriceRange([0, 200]);
              }}
              className="rounded-xl"
            >
              {t("vehicles.resetFilters") || "Reset Filters"}
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
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button
                    onClick={() => toggleFavorite(vehicle.id)}
                    className={`
                      absolute top-3 right-3 p-2 rounded-full hover:bg-white transition-colors shadow-lg backdrop-blur-sm
                      ${theme === 'light' ? 'bg-white/90' : 'bg-gray-800/90'}
                    `}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        vehicle.favorite
                          ? "fill-red-500 text-red-500"
                          : theme === 'light' 
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
                      ({vehicle.reviews})
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
                        ${vehicle.price}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={`
                      flex items-center gap-2 text-sm
                      ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                    `}>
                      <Users className="w-4 h-4" />
                      <span>{vehicle.specs.passengers} {t("vehicles.passengers") || "Pass"}</span>
                    </div>
                    <div className={`
                      flex items-center gap-2 text-sm
                      ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                    `}>
                      <Fuel className="w-4 h-4" />
                      <span>{vehicle.specs.fuel}</span>
                    </div>
                    <div className={`
                      flex items-center gap-2 text-sm
                      ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                    `}>
                      <Gauge className="w-4 h-4" />
                      <span>{vehicle.specs.transmission}</span>
                    </div>
                    <div className={`
                      flex items-center gap-2 text-sm
                      ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                    `}>
                      <Clock className="w-4 h-4" />
                      <span>{vehicle.specs.mileage}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
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
                    <Button className={`
                      flex-1 rounded-xl py-3 font-semibold
                      ${theme === 'light'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-700 hover:bg-blue-800 text-white'
                      }
                    `}>
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
            ))}
          </motion.div>
        )}

        {filteredVehicles.length > 0 && (
          <div className="text-center mt-12">
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
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-8 my-20">
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
              <p className={theme === 'light' ? 'text-blue-100' : 'text-gray-200'}>
                {t("vehicles.benefits.insured.description") || "Comprehensive coverage for complete peace of mind"}
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("vehicles.benefits.support.title") || "24/7 Support"}
              </h3>
              <p className={theme === 'light' ? 'text-blue-100' : 'text-gray-200'}>
                {t("vehicles.benefits.support.description") || "Round-the-clock assistance whenever you need it"}
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {t("vehicles.benefits.price.title") || "Best Price Guarantee"}
              </h3>
              <p className={theme === 'light' ? 'text-blue-100' : 'text-gray-200'}>
                {t("vehicles.benefits.price.description") || "Find a better price? We'll match it!"}
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
          <h2 className={`
            text-3xl md:text-4xl font-bold mb-4
            ${theme === 'light' ? 'text-gray-800' : 'text-white'}
          `}>
            {t("vehicles.trustedBrands.title") || "Trusted by Leading Brands"}
          </h2>
          <p className={`
            text-lg max-w-2xl mx-auto
            ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
          `}>
            {t("vehicles.trustedBrands.subtitle") || "We partner with the world's most reputable automotive manufacturers to bring you the best vehicles"}
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
                ${theme === 'light'
                  ? 'bg-white border-gray-100'
                  : 'bg-gray-800 border-gray-700'
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

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-8 my-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className={`
            rounded-3xl p-12 text-center text-white shadow-2xl
            ${theme === 'light'
              ? 'bg-gradient-to-r from-orange-500 to-red-500'
              : 'bg-gradient-to-r from-orange-600 to-red-600'
            }
          `}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("vehicles.cta.title") || "Ready to Find Your Perfect Car?"}
          </h2>
          <p className={`
            text-lg mb-8 max-w-2xl mx-auto
            ${theme === 'light' ? 'text-orange-100' : 'text-gray-200'}
          `}>
            {t("vehicles.cta.subtitle") || "Browse our extensive collection of premium vehicles and book your dream car today. Experience the best in car rental services."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className={`
              font-bold rounded-2xl px-8 py-3 text-lg
              ${theme === 'light'
                ? 'bg-white text-orange-600 hover:bg-gray-100'
                : 'bg-white text-orange-700 hover:bg-gray-100'
              }
            `}>
              {t("vehicles.cta.primaryButton") || "Browse All Vehicles"}
            </Button>
            <Button
              variant="outline"
              className={`
                rounded-2xl px-8 py-3 text-lg
                ${theme === 'light'
                  ? 'border-white text-white hover:bg-white hover:text-orange-600'
                  : 'border-white text-white hover:bg-white hover:text-orange-700'
                }
              `}
            >
              {t("vehicles.cta.secondaryButton") || "Contact Sales"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}