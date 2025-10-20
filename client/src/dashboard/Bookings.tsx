// components/OrdersPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
}

interface OrderUser {
  name: string;
  email: string;
  phone: string;
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

export default function Bookings() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

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
                              onClick={() => {
                                // View order details
                                toast.info("Viewing order details for " + order.vehicle.name);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                            
                            {(order.status === 'CONFIRMED' || order.status === 'ACTIVE') && (
                              <Button
                                size="sm"
                                className="rounded-xl bg-blue-500 hover:bg-blue-600"
                                onClick={() => {
                                  // Contact support or modify booking
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