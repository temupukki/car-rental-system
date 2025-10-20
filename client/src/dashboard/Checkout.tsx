// components/CheckoutPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/components/LanguageContext";
import {
  ArrowLeft,
  Car,
  User,
  Mail,
  Phone,
  CreditCard,
  Shield,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
  Fuel,
  Gauge,
  Star,
  Plus,
  Minus,
  Trash2,
  Edit,
  Save,
  X,
  LogIn,
  Info,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  brand: string;
  model: string;
  pricePerDay: number;
  rentalDays: number;
  totalPrice: number;
  image: string;
  type: string;
  seats: number;
  fuelType: string;
  transmission: string;
  rating: number;
  reviewCount: number;
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

interface ApiResponse {
  session: {
    expiresAt: string;
    token: string;
    createdAt: string;
    updatedAt: string;
    ipAddress: string;
    userAgent: string;
    userId: string;
    id: string;
  };
  user: UserSession;
}

interface CheckoutData {
  userInfo: UserSession;
  cartItems: CartItem[];
  paymentMethod: string;
  totalAmount: number;
  rentalPeriod: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
}

export default function CheckoutPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [session, setSession] = useState<ApiResponse | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserSession | null>(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [rentalDates, setRentalDates] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const totalRentalDays = cartItems.reduce(
    (sum, item) => sum + item.rentalDays,
    0
  );

  useEffect(() => {
    if (rentalDates.startDate) {
      const startDate = new Date(rentalDates.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + totalRentalDays);

      setRentalDates((prev) => ({
        ...prev,
        endDate: endDate.toISOString().split("T")[0],
      }));
    }
  }, [rentalDates.startDate, totalRentalDays]);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch /api/me");

        const data = await res.json();
        setSession(data);

        // Extract user data from session
        if (data && data.user) {
          const userData: UserSession = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            emailVerified: data.user.emailVerified,
            image: data.user.image,
            role: data.user.role,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
            phone: "",
            address: "",
          };
          setUserSession(userData);
          setEditedUser(userData);
        }
      } catch (err) {
        console.error("Error fetching /api/me:", err);
        setSession(null);
        setUserSession(null);
        setError("Please log in to continue with checkout");
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  useEffect(() => {
    const getCartItems = () => {
      try {
        const savedCart = localStorage.getItem("vehicleRentalCart");
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          setCartItems(cartData);

          // Check if cart is empty
          if (cartData.length === 0) {
            setError(
              "Your cart is empty. Please add vehicles before checkout."
            );
          }
        } else {
          setError("Your cart is empty. Please add vehicles before checkout.");
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
        setError("Failed to load cart items");
      }
    };

    getCartItems();
  }, []);

  const totals = React.useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.15; // 15% tax
    const serviceFee = cartItems.length * 15;
    const total = subtotal + tax + serviceFee;

    return {
      subtotal,
      tax,
      serviceFee,
      total,
      totalDays: cartItems.reduce((sum, item) => sum + item.rentalDays, 0),
    };
  }, [cartItems]);

  const updateRentalDays = (vehicleId: string, newDays: number) => {
    if (newDays < 1 || newDays > 30) return;

    const updatedCart = cartItems.map((item) =>
      item.id === vehicleId
        ? {
            ...item,
            rentalDays: newDays,
            totalPrice: item.pricePerDay * newDays,
          }
        : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("vehicleRentalCart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (vehicleId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== vehicleId);
    setCartItems(updatedCart);
    localStorage.setItem("vehicleRentalCart", JSON.stringify(updatedCart));
  };

  const saveUserInfo = async () => {
    if (!editedUser) return;

    try {
      console.log("Saving user info:", editedUser);

      setUserSession(editedUser);
      setIsEditing(false);

      setError(null);
      console.log("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleCheckout = async () => {
    try {
      if (!userSession) {
        setError("Please complete your profile information");
        return;
      }

      const checkoutData: CheckoutData = {
        userInfo: userSession,
        cartItems,
        paymentMethod,
        totalAmount: totals.total,
        rentalPeriod: {
          startDate: rentalDates.startDate,
          endDate: rentalDates.endDate,
          totalDays: totals.totalDays,
        },
      };

      console.log("Processing checkout:", checkoutData);

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      localStorage.removeItem("vehicleRentalCart");

      alert("🎉 Booking confirmed! Thank you for your reservation.");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setError("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateEndDate = (startDate: string, days: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  if (loading) {
    return <CheckoutLoading theme={theme} />;
  }

  if (error && !userSession) {
    return (
      <CheckoutError
        error={error}
        theme={theme}
        onLogin={handleLogin}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (cartItems.length === 0 && userSession) {
    return <EmptyCart theme={theme} />;
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
              Back to Vehicles
            </Button>
            <h1
              className={`
              text-4xl font-black
              ${theme === "light" ? "text-gray-800" : "text-white"}
            `}
            >
              Checkout
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge
              className={`
              px-4 py-2 text-lg
              ${
                theme === "light"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-600 text-white"
              }
            `}
            >
              {cartItems.length} vehicle{cartItems.length !== 1 ? "s" : ""}
            </Badge>

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
                    {userSession.role}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              mb-6 p-4 rounded-2xl border
              ${
                theme === "light"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                  : "bg-yellow-900/20 border-yellow-800 text-yellow-400"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>{error}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="text-current hover:bg-current/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                rounded-2xl p-6
                ${
                  theme === "light"
                    ? "bg-white border border-gray-200"
                    : "bg-gray-800 border border-gray-700"
                }
              `}
            >
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold
                      ${
                        checkoutStep >= step
                          ? "bg-blue-500 text-white"
                          : theme === "light"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-gray-700 text-gray-400"
                      }
                    `}
                    >
                      {checkoutStep > step ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 3 && (
                      <div
                        className={`
                        w-20 h-1 mx-4
                        ${
                          checkoutStep > step
                            ? "bg-blue-500"
                            : theme === "light"
                            ? "bg-gray-200"
                            : "bg-gray-700"
                        }
                      `}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {checkoutStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  rounded-2xl p-6
                  ${
                    theme === "light"
                      ? "bg-white border border-gray-200"
                      : "bg-gray-800 border border-gray-700"
                  }
                `}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={`
                    text-2xl font-bold flex items-center gap-3
                    ${theme === "light" ? "text-gray-800" : "text-white"}
                  `}
                  >
                    <User className="w-6 h-6 text-blue-500" />
                    Personal Information
                  </h2>

                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="rounded-2xl"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Information
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedUser(userSession);
                          setError(null);
                        }}
                        variant="outline"
                        className="rounded-2xl"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={saveUserInfo} className="rounded-2xl">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                <div
                  className={`
                  mb-6 p-4 rounded-2xl
                  ${
                    theme === "light"
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-blue-900/20 border border-blue-800"
                  }
                `}
                >
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p
                        className={`
                        text-sm font-semibold
                        ${theme === "light" ? "text-blue-800" : "text-blue-400"}
                      `}
                      >
                        Signed in as {userSession?.name}
                      </p>
                      <p
                        className={`
                        text-sm mt-1
                        ${theme === "light" ? "text-blue-700" : "text-blue-300"}
                      `}
                      >
                        Your profile information is loaded from your account.{" "}
                        {isEditing
                          ? "You're currently editing your information. Changes will be saved for this booking."
                          : "Click 'Edit Information' to update your details for this booking."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      className={`
                      block mb-2 font-semibold
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      Full Name *
                    </Label>
                    <Input
                      value={editedUser?.name || ""}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                      disabled={!isEditing}
                      className={`
                        rounded-xl
                        ${
                          theme === "light"
                            ? "bg-white border-gray-300"
                            : "bg-gray-700 border-gray-600"
                        }
                        ${!isEditing ? "opacity-80" : ""}
                      `}
                      placeholder="Enter your full name"
                    />
                    {!isEditing && (
                      <p
                        className={`
                        text-xs mt-1
                        ${theme === "light" ? "text-gray-500" : "text-gray-400"}
                      `}
                      >
                        From your account profile
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      className={`
                      block mb-2 font-semibold
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      Email Address *
                    </Label>
                    <Input
                      type="email"
                      value={editedUser?.email || ""}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, email: e.target.value } : null
                        )
                      }
                      disabled={!isEditing}
                      className={`
                        rounded-xl
                        ${
                          theme === "light"
                            ? "bg-white border-gray-300"
                            : "bg-gray-700 border-gray-600"
                        }
                        ${!isEditing ? "opacity-80" : ""}
                      `}
                      placeholder="your.email@example.com"
                    />
                    {!isEditing && editedUser?.emailVerified && (
                      <p
                        className={`
                        text-xs mt-1 text-green-600
                      `}
                      >
                        ✓ Email verified
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      className={`
                      block mb-2 font-semibold
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      value={editedUser?.phone || ""}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, phone: e.target.value } : null
                        )
                      }
                      disabled={!isEditing}
                      className={`
                        rounded-xl
                        ${
                          theme === "light"
                            ? "bg-white border-gray-300"
                            : "bg-gray-700 border-gray-600"
                        }
                        ${!isEditing ? "opacity-80" : ""}
                      `}
                      placeholder="Enter your phone number "
                    />
                    {!isEditing && !editedUser?.phone && (
                      <p
                        className={`
                        text-xs mt-1
                        ${theme === "light" ? "text-gray-500" : "text-gray-400"}
                      `}
                      >
                        Add your phone number for updates
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      className={`
                      block mb-2 font-semibold
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      Delivery Address
                    </Label>
                    <Input
                      value={editedUser?.address || ""}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, address: e.target.value } : null
                        )
                      }
                      disabled={!isEditing}
                      className={`
                        rounded-xl
                        ${
                          theme === "light"
                            ? "bg-white border-gray-300"
                            : "bg-gray-700 border-gray-600"
                        }
                        ${!isEditing ? "opacity-80" : ""}
                      `}
                      placeholder="123 Main St, City, State 12345"
                    />
                    {!isEditing && !editedUser?.address && (
                      <p
                        className={`
                        text-xs mt-1
                        ${theme === "light" ? "text-gray-500" : "text-gray-400"}
                      `}
                      >
                        Add address for vehicle delivery
                      </p>
                    )}
                  </div>
                </div>

                {/* Rental Period Section */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`
                      text-lg font-bold flex items-center gap-2
                      ${theme === "light" ? "text-gray-800" : "text-white"}
                    `}
                    >
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Rental Period
                    </h3>
                    <Badge
                      className={`
                      px-3 py-1
                      ${
                        theme === "light"
                          ? "bg-blue-500 text-white"
                          : "bg-blue-600 text-white"
                      }
                    `}
                    >
                      {totalRentalDays} day{totalRentalDays !== 1 ? "s" : ""}{" "}
                      total
                    </Badge>
                  </div>

                  {/* Rental Summary */}
                  <div
                    className={`
                    mb-4 p-4 rounded-2xl
                    ${
                      theme === "light"
                        ? "bg-gray-50 border border-gray-200"
                        : "bg-gray-700 border border-gray-600"
                    }
                  `}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span
                          className={`
                          block font-semibold
                          ${
                            theme === "light"
                              ? "text-gray-700"
                              : "text-gray-300"
                          }
                        `}
                        >
                          Start Date
                        </span>
                        <span
                          className={`
                          ${theme === "light" ? "text-gray-800" : "text-white"}
                        `}
                        >
                          {formatDate(rentalDates.startDate)}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`
                          block font-semibold
                          ${
                            theme === "light"
                              ? "text-gray-700"
                              : "text-gray-300"
                          }
                        `}
                        >
                          End Date
                        </span>
                        <span
                          className={`
                          ${theme === "light" ? "text-gray-800" : "text-white"}
                        `}
                        >
                          {formatDate(rentalDates.endDate)}
                        </span>
                      </div>
                    </div>
                    <p
                      className={`
                      text-xs mt-2 text-center
                      ${theme === "light" ? "text-gray-600" : "text-gray-400"}
                    `}
                    >
                      The end date is automatically calculated based on your{" "}
                      {totalRentalDays}-day rental period
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        className={`
                        block mb-2 font-semibold
                        ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                      `}
                      >
                        Start Date *
                      </Label>
                      <Input
                        type="date"
                        value={rentalDates.startDate}
                        onChange={(e) =>
                          setRentalDates((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className={`
                          rounded-xl
                          ${
                            theme === "light"
                              ? "bg-white border-gray-300"
                              : "bg-gray-700 border-gray-600"
                          }
                        `}
                      />
                    </div>

                    <div>
                      <Label
                        className={`
                        block mb-2 font-semibold
                        ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                      `}
                      >
                        End Date
                      </Label>
                      <Input
                        type="date"
                        value={rentalDates.endDate}
                        disabled
                        className={`
                          rounded-xl opacity-70
                          ${
                            theme === "light"
                              ? "bg-gray-100 border-gray-300"
                              : "bg-gray-600 border-gray-500"
                          }
                        `}
                      />
                      <p
                        className={`
                        text-xs mt-1
                        ${theme === "light" ? "text-gray-500" : "text-gray-400"}
                      `}
                      >
                        Auto-calculated based on start date
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Days Adjustment */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3
                    className={`
                    text-lg font-bold mb-4 flex items-center gap-2
                    ${theme === "light" ? "text-gray-800" : "text-white"}
                  `}
                  >
                    <Clock className="w-5 h-5 text-blue-500" />
                    Adjust Rental Days
                  </h3>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className={`
                        flex items-center justify-between p-4 rounded-2xl
                        ${
                          theme === "light"
                            ? "bg-gray-50 border border-gray-200"
                            : "bg-gray-700 border border-gray-600"
                        }
                      `}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h4
                              className={`
                              font-bold
                              ${
                                theme === "light"
                                  ? "text-gray-800"
                                  : "text-white"
                              }
                            `}
                            >
                              {item.name}
                            </h4>
                            <p
                              className={`
                              text-sm
                              ${
                                theme === "light"
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }
                            `}
                            >
                              ${item.pricePerDay}/day
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateRentalDays(item.id, item.rentalDays - 1)
                            }
                            disabled={item.rentalDays <= 1}
                            className="w-8 h-8 rounded-full p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span
                            className={`
                            w-12 text-center font-bold
                            ${
                              theme === "light" ? "text-gray-800" : "text-white"
                            }
                          `}
                          >
                            {item.rentalDays}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateRentalDays(item.id, item.rentalDays + 1)
                            }
                            disabled={item.rentalDays >= 30}
                            className="w-8 h-8 rounded-full p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>

                          <span
                            className={`
                            text-sm min-w-[60px] text-right
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
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (!editedUser?.name || !editedUser?.email) {
                      setError(
                        "Please fill in all required fields (name and email)"
                      );
                      return;
                    }
                    setCheckoutStep(2);
                    setError(null);
                  }}
                  className="w-full mt-6 rounded-2xl py-3 text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Continue to Payment
                </Button>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                rounded-2xl p-6 sticky top-6
                ${
                  theme === "light"
                    ? "bg-white border border-gray-200"
                    : "bg-gray-800 border border-gray-700"
                }
              `}
            >
              <h2
                className={`
                text-2xl font-bold mb-6
                ${theme === "light" ? "text-gray-800" : "text-white"}
              `}
              >
                Order Summary
              </h2>

              <ScrollArea className="h-64 mb-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4
                          className={`
                          font-bold text-sm
                          ${theme === "light" ? "text-gray-800" : "text-white"}
                        `}
                        >
                          {item.name}
                        </h4>
                        <p
                          className={`
                          text-xs
                          ${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }
                        `}
                        >
                          {item.rentalDays} day
                          {item.rentalDays !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">
                          ${item.totalPrice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Rental Period Summary */}
              <div
                className={`
                mb-4 p-4 rounded-2xl
                ${
                  theme === "light"
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-blue-900/20 border border-blue-800"
                }
              `}
              >
                <h4
                  className={`
                  font-bold mb-2 flex items-center gap-2
                  ${theme === "light" ? "text-blue-800" : "text-blue-400"}
                `}
                >
                  <Calendar className="w-4 h-4" />
                  Rental Period
                </h4>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span
                      className={
                        theme === "light" ? "text-blue-700" : "text-blue-300"
                      }
                    >
                      Start:
                    </span>
                    <span
                      className={
                        theme === "light" ? "text-blue-800" : "text-blue-200"
                      }
                    >
                      {new Date(rentalDates.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={
                        theme === "light" ? "text-blue-700" : "text-blue-300"
                      }
                    >
                      End:
                    </span>
                    <span
                      className={
                        theme === "light" ? "text-blue-800" : "text-blue-200"
                      }
                    >
                      {new Date(rentalDates.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 pt-1 border-t border-blue-200 dark:border-blue-700">
                    <span
                      className={
                        theme === "light" ? "text-blue-700" : "text-blue-300"
                      }
                    >
                      Total Days:
                    </span>
                    <span
                      className={`
                      font-bold
                      ${theme === "light" ? "text-blue-800" : "text-blue-200"}
                    `}
                    >
                      {totalRentalDays}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span
                    className={
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }
                  >
                    Subtotal
                  </span>
                  <span
                    className={
                      theme === "light" ? "text-gray-800" : "text-white"
                    }
                  >
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }
                  >
                    Tax (15%)
                  </span>
                  <span
                    className={
                      theme === "light" ? "text-gray-800" : "text-white"
                    }
                  >
                    ${totals.tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }
                  >
                    Service Fee
                  </span>
                  <span
                    className={
                      theme === "light" ? "text-gray-800" : "text-white"
                    }
                  >
                    ${totals.serviceFee.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span
                      className={
                        theme === "light" ? "text-gray-800" : "text-white"
                      }
                    >
                      Total
                    </span>
                    <span className="text-green-600">
                      ${totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`
                mt-6 p-4 rounded-2xl text-center
                ${
                  theme === "light"
                    ? "bg-green-50 border border-green-200"
                    : "bg-green-900/20 border border-green-800"
                }
              `}
              >
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p
                  className={`
                  text-sm font-semibold
                  ${theme === "light" ? "text-green-800" : "text-green-400"}
                `}
                >
                  Secure Checkout
                </p>
                <p
                  className={`
                  text-xs
                  ${theme === "light" ? "text-green-600" : "text-green-500"}
                `}
                >
                  Your payment information is encrypted and secure
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CheckoutLoading: React.FC<{ theme: string }> = ({ theme }) => (
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
          className={`
          text-2xl font-bold mt-6
          ${theme === "light" ? "text-gray-800" : "text-white"}
        `}
        >
          Loading Checkout...
        </h3>
        <p
          className={`
          mt-2
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}
        >
          Preparing your booking details
        </p>
      </motion.div>
    </div>
  </div>
);

const CheckoutError: React.FC<{
  error: string;
  theme: string;
  onLogin?: () => void;
  onRetry?: () => void;
}> = ({ error, theme, onLogin, onRetry }) => (
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
    <div className="text-center max-w-md mx-auto p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div
          className={`
          w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6
          ${theme === "light" ? "bg-red-100" : "bg-red-900/20"}
        `}
        >
          <Car className="w-12 h-12 text-red-500" />
        </div>
        <h3
          className={`
          text-2xl font-bold mb-3
          ${theme === "light" ? "text-gray-800" : "text-white"}
        `}
        >
          Checkout Error
        </h3>
        <p
          className={`
          mb-6
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}
        >
          {error}
        </p>
        <div className="flex gap-4 justify-center">
          {onLogin && (
            <Button onClick={onLogin} className="rounded-2xl px-6 py-3">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="rounded-2xl px-6 py-3"
            >
              Try Again
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  </div>
);

const EmptyCart: React.FC<{ theme: string }> = ({ theme }) => (
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
    <div className="text-center max-w-md mx-auto p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div
          className={`
          w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6
          ${theme === "light" ? "bg-yellow-100" : "bg-yellow-900/20"}
        `}
        >
          <Car className="w-12 h-12 text-yellow-500" />
        </div>
        <h3
          className={`
          text-2xl font-bold mb-3
          ${theme === "light" ? "text-gray-800" : "text-white"}
        `}
        >
          Your Cart is Empty
        </h3>
        <p
          className={`
          mb-6
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}
        >
          Please add some vehicles to your cart before proceeding to checkout.
        </p>
        <Button
          onClick={() => (window.location.href = "/vehicles")}
          className="rounded-2xl px-8 py-3"
        >
          Browse Vehicles
        </Button>
      </motion.div>
    </div>
  </div>
);
