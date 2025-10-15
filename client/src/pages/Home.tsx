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

export default function Home() {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Flexible Locations",
      description: "Pick up and drop off at multiple convenient locations"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Service",
      description: "Round-the-clock booking and customer support"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Fully Insured",
      description: "Comprehensive insurance coverage for peace of mind"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Friendly",
      description: "Spacious vehicles perfect for family trips"
    }
  ];

  const carFeatures = [
    "GPS Navigation System",
    "Bluetooth Connectivity",
    "Climate Control",
    "Premium Sound System",
    "Backup Camera",
    "Leather Seats",
    "Sunroof/Moonroof"
  ];

  const cars = [
    {
      id: 1,
      name: "Toyota Camry",
      type: "Sedan",
      price: "$45/day",
      image: "/camry.avif",
      features: ["5 Seats", "Automatic", "Air Conditioning"],
      rating: 4.8
    },
    {
      id: 2,
      name: "Honda CR-V",
      type: "SUV",
      price: "$65/day",
      image: "/honda.png",
      features: ["7 Seats", "4WD", "Spacious"],
      rating: 4.7
    },
    {
      id: 3,
      name: "BMW 3 Series",
      type: "Luxury",
      price: "$89/day",
      image: "bmw.jfif",
      features: ["Premium", "Sport Mode", "Leather"],
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen">
    
      <div 
        className="mx-4 md:mx-16 h-[600px] rounded-3xl grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 relative overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/honda.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity:"0.9"
        }}
      >
        <div className="col-span-2 flex flex-col justify-center px-8 lg:px-16 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-bold text-white text-4xl md:text-6xl leading-tight"
          >
            Experience the road<br />like never before
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-lg md:text-xl mt-6 max-w-2xl"
          >
            Discover the perfect vehicle for your journey. From compact cars to luxury SUVs, 
            we offer premium rental services with unmatched convenience and reliability.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 mt-8"
          >
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl px-8 py-3 text-lg">
              View All Cars
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900 rounded-2xl px-8 py-3 text-lg">
              Learn More
            </Button>
          </motion.div>
        </div>
        
        <div className="col-span-1 flex items-center justify-center lg:justify-end relative z-10 p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm w-full max-w-md rounded-2xl shadow-2xl border-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="font-bold text-2xl text-gray-800">
                  Book Your Car
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Everything you need to hit the road.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="text-blue-600">
                        {feature.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm text-gray-800">{feature.title}</p>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <a href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-200"
                  >
                    Sign Up to Book
                  </motion.button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8 my-20">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg border border-blue-100"
        >
          <div className="p-4 bg-blue-500 rounded-2xl mb-6">
            <MapPin className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy Availability</h3>
          <p className="text-gray-600 text-lg">
            Find and book your perfect car in minutes with our real-time availability system.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-lg border border-green-100"
        >
          <div className="p-4 bg-green-500 rounded-2xl mb-6">
            <Car className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Comfort</h3>
          <p className="text-gray-600 text-lg">
            Travel in style with our well-maintained, comfortable, and clean vehicles.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-orange-50 to-white rounded-3xl shadow-lg border border-orange-100"
        >
          <div className="p-4 bg-orange-500 rounded-2xl mb-6">
            <Wallet className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Great Savings</h3>
          <p className="text-gray-600 text-lg">
            Competitive pricing with no hidden fees. Get the best value for your money.
          </p>
        </motion.div>
      </div>

 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-8 my-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <img
            src="/02.jfif"
            alt="Premium Car"
            className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
          />
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-xs">
            <h3 className="font-bold text-2xl text-gray-800">Luxury Experience</h3>
            <p className="text-gray-600 mt-2">Premium vehicles for extraordinary journeys</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Choose Our Cars?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Our fleet is meticulously maintained and equipped with the latest features 
            to ensure your journey is safe, comfortable, and memorable.
          </p>
          
          <div className="space-y-4">
            {carFeatures.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-lg">{feature}</span>
              </motion.div>
            ))}
          </div>

          <Button className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-8 py-3 text-lg w-fit">
            Explore Features
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* Car Cards Section */}
      <div className="max-w-7xl mx-auto px-8 my-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Vehicles</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium vehicles for every occasion and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <motion.div
              key={car.id}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-sm">{car.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{car.name}</h3>
                    <p className="text-gray-500 text-sm">{car.type}</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{car.price}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3">
                    Book Now
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3">
                    Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl px-12 py-3 text-lg">
            View All Vehicles
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mx-8 my-20 p-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their travel needs. 
            Book your perfect car today and hit the road with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold rounded-2xl px-8 py-3 text-lg">
              Book Your Car Now
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 rounded-2xl px-8 py-3 text-lg">
              Contact Us
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}