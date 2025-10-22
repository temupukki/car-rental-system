// components/OrdersPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/components/LanguageContext";
import {
  ArrowLeft,
  Car,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Filter,
  Search,
  RefreshCw,
  Users,
  Fuel,
  Gauge,
  Star,
  Shield,
  FileText,
  CreditCard as CreditCardIcon,
  Car as CarIcon,
  Navigation,
  Mail as MailIcon,
  Phone as PhoneIcon,
  User as UserIcon,
  X,
  Printer,
  Share2,
  MessageCircle,
  Truck,
  Wrench,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";

// Define proper TypeScript interfaces
interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  image: string;
  type: string;
  seats: number;
  fuelType: string;
  transmission: string;
  pricePerDay: number;
  features: string[];
  mileage: string;
  location: string;
  rating: number;
  reviewCount: number;
}

interface OrderUser {
  name: string;
  email: string;
  phone: string;
  address?: string;
  licenseNumber?: string;
}

interface Order {
  id: string;
  userId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLicense: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  vehicle: Vehicle;
  user?: OrderUser;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  paymentMethod?: string;
  insuranceIncluded: boolean;
  additionalDriver: boolean;
  specialRequests?: string;
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  phone?: string;
  address?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Update the apiService to include proper typing
const apiService = {
  // Get user orders with proper typing
  async getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
    try {
      const response = await fetch(`http://localhost:3000/api/orders?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      return data as ApiResponse<Order[]>;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
};

// Order Details Modal Component
const OrderDetailsModal: React.FC<{
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}> = ({ order, isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    const config = {
      PENDING: { color: "bg-yellow-500", text: "Pending", icon: Clock },
      CONFIRMED: { color: "bg-blue-500", text: "Confirmed", icon: CheckCircle },
      ACTIVE: { color: "bg-green-500", text: "Active", icon: Car },
      COMPLETED: { color: "bg-gray-500", text: "Completed", icon: CheckCircle },
      CANCELLED: { color: "bg-red-500", text: "Cancelled", icon: XCircle },
    };
    return config[status as keyof typeof config] || config.PENDING;
  };

  const getPaymentStatusConfig = (status: string) => {
    const config = {
      PENDING: { color: "bg-yellow-500", text: "Pending" },
      PAID: { color: "bg-green-500", text: "Paid" },
      REFUNDED: { color: "bg-blue-500", text: "Refunded" },
      FAILED: { color: "bg-red-500", text: "Failed" },
    };
    return config[status as keyof typeof config] || config.PENDING;
  };

  const statusConfig = getStatusConfig(order.status);
  const paymentStatusConfig = getPaymentStatusConfig(order.paymentStatus);
  const StatusIcon = statusConfig.icon;

  const handlePrint = () => {
    toast.success("Printing order details...");
    // In a real app, this would generate a PDF
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${order.id} - ${order.vehicle.name}`,
        text: `Check out my order for ${order.vehicle.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Order link copied to clipboard!");
    }
  };

  const handleContactSupport = () => {
    toast.info("Connecting you with our support team...");
    // In a real app, this would open a chat or phone
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col
          ${
            theme === "light"
              ? "bg-white text-gray-900"
              : "bg-gray-800 text-white"
          }
        `}
      >
        {/* Header */}
        <div
          className={`
          flex items-center justify-between p-6 border-b
          ${theme === "light" ? "border-gray-200" : "border-gray-700"}
        `}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-2xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Order Details</h2>
              <p className="text-sm opacity-70">Order #{order.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrint}
              className="rounded-2xl"
            >
              <Printer className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-2xl"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-2xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order & Vehicle Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status & Summary */}
              <Card className={theme === "light" ? "bg-gray-50" : "bg-gray-700"}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${statusConfig.color}`}>
                        <StatusIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Order Status</h3>
                        <Badge className={`${statusConfig.color} text-white mt-1`}>
                          {statusConfig.text}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-600">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-sm opacity-70">
                        {order.totalDays} day{order.totalDays !== 1 ? 's' : ''} • {formatCurrency(order.dailyRate)}/day
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold opacity-70">Order Date</p>
                      <p>{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="font-semibold opacity-70">Payment Status</p>
                      <Badge className={`${paymentStatusConfig.color} text-white`}>
                        {paymentStatusConfig.text}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-semibold opacity-70">Payment Method</p>
                      <p>{order.paymentMethod || "Credit Card"}</p>
                    </div>
                    <div>
                      <p className="font-semibold opacity-70">Insurance</p>
                      <p>{order.insuranceIncluded ? "Included ✓" : "Not Included"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Details */}
              <Card className={theme === "light" ? "bg-gray-50" : "bg-gray-700"}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CarIcon className="w-5 h-5 text-blue-500" />
                    Vehicle Information
                  </h3>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={order.vehicle.image}
                      alt={order.vehicle.name}
                      className="w-48 h-32 rounded-xl object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-black mb-2">{order.vehicle.name}</h4>
                      <p className="text-sm opacity-70 mb-3">
                        {order.vehicle.brand} • {order.vehicle.model} • {order.vehicle.type}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>{order.vehicle.seats} seats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Fuel className="w-4 h-4 text-green-500" />
                          <span>{order.vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-purple-500" />
                          <span>{order.vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-orange-500" />
                          <span>{order.vehicle.mileage}</span>
                        </div>
                      </div>

                      {order.vehicle.features && order.vehicle.features.length > 0 && (
                        <div>
                          <p className="font-semibold text-sm mb-2">Features:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.vehicle.features.slice(0, 6).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {order.vehicle.features.length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{order.vehicle.features.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rental Period & Locations */}
              <Card className={theme === "light" ? "bg-gray-50" : "bg-gray-700"}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Rental Schedule
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-500">Pickup</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(order.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{order.pickupLocation}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-green-500">Drop-off</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(order.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{order.dropoffLocation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Rental Period:</span>
                      <span className="font-bold">{order.totalDays} day{order.totalDays !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Customer & Actions */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card className={theme === "light" ? "bg-gray-50" : "bg-gray-700"}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-purple-500" />
                    Customer Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <div>
                        <p className="font-semibold">{order.customerName}</p>
                        <p className="text-sm opacity-70">Primary Driver</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4" />
                      <span className="text-sm">{order.customerEmail}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" />
                      <span className="text-sm">{order.customerPhone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="w-4 h-4" />
                      <span className="text-sm">License: {order.customerLicense}</span>
                    </div>
                  </div>

                  {order.additionalDriver && (
                    <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">Additional Driver Included</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Price Breakdown */}
              <Card className={theme === "light" ? "bg-gray-50" : "bg-gray-700"}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Price Breakdown</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Daily Rate ({order.totalDays} days)</span>
                      <span>{formatCurrency(order.dailyRate * order.totalDays)}</span>
                    </div>
                    
                    {order.insuranceIncluded && (
                      <div className="flex justify-between">
                        <span>Insurance Coverage</span>
                        <span className="text-green-500">Included</span>
                      </div>
                    )}
                    
                    {order.additionalDriver && (
                      <div className="flex justify-between">
                        <span>Additional Driver</span>
                        <span>{formatCurrency(500)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total Amount</span>
                      <span className="text-green-600">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className={theme === "light" ? "bg-gray-50" : "bg-gray-700"}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={handleContactSupport}
                      className="w-full rounded-xl bg-blue-500 hover:bg-blue-600"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handlePrint}
                      className="w-full rounded-xl"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print Receipt
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="w-full rounded-xl"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Order
                    </Button>

                    {(order.status === 'ACTIVE' || order.status === 'CONFIRMED') && (
                      <Button
                        variant="outline"
                        className="w-full rounded-xl text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => toast.info("Cancellation process started")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Support Information */}
              <Card className={theme === "light" ? "bg-blue-50 border-blue-200" : "bg-blue-900/20 border-blue-800"}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    24/7 Support
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>support@rentalcars.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Available 24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
};

export default function Bookings() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUserAndOrders() {
      try {
        // Fetch user session
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user session');
        }

        const userData = await res.json();
        setUserSession(userData.user);

        // Fetch user orders with proper typing
        if (userData.user) {
          const ordersResponse: ApiResponse<Order[]> = await apiService.getUserOrders(userData.user.id);
          if (ordersResponse.success) {
            setOrders(ordersResponse.data);
          } else {
            throw new Error(ordersResponse.error || 'Failed to fetch orders');
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders");
        setOrders([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndOrders();
  }, []);

  const refreshOrders = async () => {
    if (!userSession) return;
    
    setLoading(true);
    try {
      const ordersResponse: ApiResponse<Order[]> = await apiService.getUserOrders(userSession.id);
      if (ordersResponse.success) {
        setOrders(ordersResponse.data);
        toast.success("Orders updated");
      } else {
        throw new Error(ordersResponse.error || 'Failed to refresh orders');
      }
    } catch (err) {
      console.error("Error refreshing orders:", err);
      toast.error("Failed to refresh orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = order.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-500", text: "Pending", icon: Clock },
      CONFIRMED: { color: "bg-blue-500", text: "Confirmed", icon: CheckCircle },
      ACTIVE: { color: "bg-green-500", text: "Active", icon: Car },
      COMPLETED: { color: "bg-gray-500", text: "Completed", icon: CheckCircle },
      CANCELLED: { color: "bg-red-500", text: "Cancelled", icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(amount);
  };

  if (loading) {
    return <OrdersLoading theme={theme} />;
  }

  if (!userSession) {
    return (
      <OrdersError 
        theme={theme} 
        message="Please log in to view your orders"
        onAction={() => window.location.href = "/login"}
        actionText="Log In"
      />
    );
  }

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="rounded-2xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1
              className={`
              text-4xl font-black
              ${theme === "light" ? "text-gray-800" : "text-white"}
            `}
            >
              My Orders
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={refreshOrders}
              variant="outline"
              className="rounded-2xl"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            {userSession && (
              <div className="flex items-center gap-3">
                {userSession.image && (
                  <img
                    src={userSession.image}
                    alt={userSession.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="text-right">
                  <p
                    className={`
                    text-sm font-semibold
                    ${theme === "light" ? "text-gray-800" : "text-white"}
                  `}
                  >
                    {userSession.name}
                  </p>
                  <p
                    className={`
                    text-xs
                    ${theme === "light" ? "text-gray-600" : "text-gray-400"}
                  `}
                  >
                    {orders.length} order{orders.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mb-6 p-6 rounded-2xl
            ${
              theme === "light"
                ? "bg-white border border-gray-200"
                : "bg-gray-800 border border-gray-700"
            }
          `}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`
                  px-4 py-2 rounded-xl border
                  ${
                    theme === "light"
                      ? "bg-white border-gray-300"
                      : "bg-gray-700 border-gray-600 text-white"
                  }
                `}
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by vehicle, brand, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  px-4 py-2 rounded-xl border flex-1
                  ${
                    theme === "light"
                      ? "bg-white border-gray-300"
                      : "bg-gray-700 border-gray-600 text-white"
                  }
                `}
              />
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                text-center py-12 rounded-2xl
                ${
                  theme === "light"
                    ? "bg-white border border-gray-200"
                    : "bg-gray-800 border border-gray-700"
                }
              `}
            >
              <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3
                className={`
                text-xl font-bold mb-2
                ${theme === "light" ? "text-gray-800" : "text-white"}
              `}
              >
                No Orders Found
              </h3>
              <p
                className={`
                mb-6
                ${theme === "light" ? "text-gray-600" : "text-gray-400"}
              `}
              >
                {orders.length === 0 
                  ? "You haven't made any orders yet. Start by renting a vehicle!"
                  : "No orders match your current filters."}
              </p>
              {orders.length === 0 && (
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="rounded-2xl"
                >
                  Browse Vehicles
                </Button>
              )}
            </motion.div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  rounded-2xl overflow-hidden
                  ${
                    theme === "light"
                      ? "bg-white border border-gray-200"
                      : "bg-gray-800 border border-gray-700"
                  }
                `}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Vehicle Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={order.vehicle.image}
                          alt={order.vehicle.name}
                          className="w-48 h-32 rounded-xl object-cover"
                        />
                      </div>

                      {/* Order Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                          <div>
                            <h3
                              className={`
                              text-xl font-bold mb-1
                              ${theme === "light" ? "text-gray-800" : "text-white"}
                            `}
                            >
                              {order.vehicle.name}
                            </h3>
                            <p
                              className={`
                              text-sm mb-2
                              ${
                                theme === "light" ? "text-gray-600" : "text-gray-400"
                              }
                            `}
                            >
                              {order.vehicle.brand} • {order.vehicle.model} • {order.vehicle.type}
                            </p>
                            {getStatusBadge(order.status)}
                          </div>

                          <div className="text-right mt-2 md:mt-0">
                            <p
                              className={`
                              text-2xl font-bold
                              ${theme === "light" ? "text-gray-800" : "text-white"}
                            `}
                            >
                              {formatCurrency(order.totalAmount)}
                            </p>
                            <p
                              className={`
                              text-sm
                              ${
                                theme === "light" ? "text-gray-600" : "text-gray-400"
                              }
                            `}
                            >
                              {order.totalDays} day{order.totalDays !== 1 ? "s" : ""} • {formatCurrency(order.dailyRate)}/day
                            </p>
                          </div>
                        </div>

                        {/* Order Meta Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span
                              className={`
                              text-sm
                              ${
                                theme === "light" ? "text-gray-600" : "text-gray-400"
                              }
                            `}
                            >
                              {formatDate(order.startDate)} - {formatDate(order.endDate)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-500" />
                            <span
                              className={`
                              text-sm
                              ${
                                theme === "light" ? "text-gray-600" : "text-gray-400"
                              }
                            `}
                            >
                              {order.pickupLocation}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-500" />
                            <span
                              className={`
                              text-sm
                              ${
                                theme === "light" ? "text-gray-600" : "text-gray-400"
                              }
                            `}
                            >
                              {order.customerName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-orange-500" />
                            <span
                              className={`
                              text-sm
                              ${
                                theme === "light" ? "text-gray-600" : "text-gray-400"
                              }
                            `}
                            >
                              {order.customerPhone}
                            </span>
                          </div>
                        </div>

                        {/* Vehicle Specifications */}
                        <div
                          className={`
                          p-3 rounded-xl mb-4
                          ${
                            theme === "light"
                              ? "bg-gray-50"
                              : "bg-gray-700"
                          }
                        `}
                        >
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span>{order.vehicle.seats} seats</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Fuel className="w-4 h-4 text-green-500" />
                              <span>{order.vehicle.fuelType}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Gauge className="w-4 h-4 text-purple-500" />
                              <span>{order.vehicle.transmission}</span>
                            </div>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex flex-wrap gap-2 justify-between items-center">
                          <div>
                            <p
                              className={`
                              text-xs
                              ${
                                theme === "light" ? "text-gray-500" : "text-gray-400"
                              }
                            `}
                            >
                              Order ID: {order.id} • Created: {formatDate(order.createdAt)}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            
                            {(order.status === 'CONFIRMED' || order.status === 'ACTIVE') && (
                              <Button
                                size="sm"
                                className="rounded-xl bg-blue-500 hover:bg-blue-600"
                                onClick={() => {
                                  toast.info("Contacting support for " + order.vehicle.name);
                                }}
                              >
                                <Phone className="w-4 h-4 mr-1" />
                                Contact Support
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Stats Summary */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`
              mt-8 p-6 rounded-2xl
              ${
                theme === "light"
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-blue-900/20 border border-blue-800"
              }
            `}
          >
            <h4
              className={`
              font-bold mb-4 flex items-center gap-2
              ${theme === "light" ? "text-blue-800" : "text-blue-400"}
            `}
            >
              <CreditCard className="w-5 h-5" />
              Order Summary
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p
                  className={`
                  text-2xl font-bold
                  ${theme === "light" ? "text-blue-800" : "text-blue-400"}
                `}
                >
                  {orders.length}
                </p>
                <p className={theme === "light" ? "text-blue-700" : "text-blue-300"}>
                  Total Orders
                </p>
              </div>
              <div className="text-center">
                <p
                  className={`
                  text-2xl font-bold text-green-600
                `}
                >
                  {orders.filter(o => o.status === 'COMPLETED').length}
                </p>
                <p className={theme === "light" ? "text-blue-700" : "text-blue-300"}>
                  Completed
                </p>
              </div>
              <div className="text-center">
                <p
                  className={`
                  text-2xl font-bold text-blue-600
                `}
                >
                  {orders.filter(o => o.status === 'ACTIVE' || o.status === 'CONFIRMED').length}
                </p>
                <p className={theme === "light" ? "text-blue-700" : "text-blue-300"}>
                  Active
                </p>
              </div>
              <div className="text-center">
                <p
                  className={`
                  text-2xl font-bold
                  ${theme === "light" ? "text-blue-800" : "text-blue-400"}
                `}
                >
                  {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                </p>
                <p className={theme === "light" ? "text-blue-700" : "text-blue-300"}>
                  Total Spent
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setTimeout(() => setSelectedOrder(null), 300);
            }}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Loading Component for Orders
function OrdersLoading({ theme }: { theme: string }) {
  return (
    <div
      className={`
      min-h-screen flex items-center justify-center
      ${
        theme === "light"
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
          : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
      }
    `}
    >
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2
          className={`
          text-2xl font-bold
          ${theme === "light" ? "text-gray-800" : "text-white"}
        `}
        >
          Loading Orders...
        </h2>
        <p
          className={`
          mt-2
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}
        >
          Fetching your rental history
        </p>
      </div>
    </div>
  );
}

// Error Component for Orders
function OrdersError({
  theme,
  message,
  onAction,
  actionText,
}: {
  theme: string;
  message: string;
  onAction: () => void;
  actionText: string;
}) {
  return (
    <div
      className={`
      min-h-screen flex items-center justify-center
      ${
        theme === "light"
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
          : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900"
      }
    `}
    >
      <div
        className={`
        max-w-md w-full p-8 rounded-2xl text-center
        ${
          theme === "light"
            ? "bg-white border border-gray-200"
            : "bg-gray-800 border border-gray-700"
        }
      `}
      >
        <AlertCircle
          className={`
          w-16 h-16 mx-auto mb-4
          ${theme === "light" ? "text-red-500" : "text-red-400"}
        `}
        />
        <h2
          className={`
          text-2xl font-bold mb-2
          ${theme === "light" ? "text-gray-800" : "text-white"}
        `}
        >
          Unable to Load Orders
        </h2>
        <p
          className={`
          mb-6
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}
        >
          {message}
        </p>
        <Button onClick={onAction} className="rounded-2xl">
          {actionText}
        </Button>
      </div>
    </div>
  );
}