import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  Plus,
  Minus,
  Save,
  X,
  LogIn,
  Info,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api";

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

const enhancedApiService = {
  async createOrder(orderData: any): Promise<any> {
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  async processCheckoutWithChapa(checkoutData: any): Promise<any> {
    try {
      const orderData = {
        userId: checkoutData.userInfo.id,
        vehicleId: checkoutData.cartItems[0].id,
        startDate: checkoutData.rentalPeriod.startDate,
        endDate: checkoutData.rentalPeriod.endDate,
        totalDays: checkoutData.rentalPeriod.totalDays,
        dailyRate: checkoutData.cartItems[0].pricePerDay,
        totalAmount: checkoutData.totalAmount,
        customerName: checkoutData.userInfo.name,
        customerEmail: checkoutData.userInfo.email,
        customerPhone: checkoutData.userInfo.phone,
        customerLicense: "TO_BE_PROVIDED",
        pickupLocation: checkoutData.userInfo.address || "Main Office",
        dropoffLocation: checkoutData.userInfo.address || "Main Office",
        status: "PENDING",
        vehicle: checkoutData.cartItems[0],
      };

      console.log("📝 Creating order for payment:", orderData);

      const orderResponse = await this.createOrder(orderData);

      if (!orderResponse.success) {
        throw new Error(orderResponse.error || "Failed to create order");
      }

      console.log("✅ Order created successfully:", orderResponse.data);

      console.log("💰 Proceeding with Chapa payment...");

      const paymentResponse = await apiService.processCheckoutWithChapa({
        ...checkoutData,
        orderId: orderResponse.data.id,
      });

      return {
        ...paymentResponse,
        order: orderResponse.data,
      };
    } catch (error) {
      console.error("❌ Checkout error:", error);
      throw error;
    }
  },
};

export default function CheckoutPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [, setSession] = useState<ApiResponse | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<UserSession | null>(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("chapa");
  const [rentalDates, setRentalDates] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    const phoneRegex = /^(09|07)\d{8}$/;
    return phoneRegex.test(cleanPhone);
  };

  const handlePhoneChange = (phone: string) => {
    setEditedUser((prev) => (prev ? { ...prev, phone } : null));
    if (phoneError && phone.length > 0) {
      setPhoneError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!editedUser?.name || !editedUser?.email) {
      toast.error("Please fill in all required fields (name and email)");
      return false;
    }

    const currentPhone = editedUser.phone;
    if (!currentPhone) {
      toast.error("Phone number is required");
      return false;
    }

    if (!validatePhoneNumber(currentPhone)) {
      toast.error("Phone number must be in 09xxxxxxxx or 07xxxxxxxx format");
      return false;
    }

    setError(null);
    setPhoneError(null);
    return true;
  };

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
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    const orderId = urlParams.get("orderId");

    if (paymentStatus === "success" && orderId) {
      toast.success("Payment completed successfully! Redirecting to orders...");
      setTimeout(() => {
        window.location.href = `/orders?payment=success&orderId=${orderId}`;
      }, 2000);
    }
  }, []);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch /api/me");

        const data = await res.json();
        setSession(data);

        if (data && data.user) {
          const userData: UserSession = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            emailVerified: data.user.emailVerified,
            image: data.user.image,
            role: data.user.role,
            phone:data.user.phone,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
         
            address: data.user.image ,
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
    const tax = subtotal * 0.15;
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

  const saveUserInfo = async () => {
    if (!editedUser) return;

    try {
      if (!editedUser.phone) {
        toast.error("Phone number is required");
        return;
      }

      if (!validatePhoneNumber(editedUser.phone)) {
        toast.error("Phone number must be in 09xxxxxxxx or 07xxxxxxxx format");
        return;
      }

      console.log("💾 Saving user info with phone:", editedUser.phone);

      const updatedUserSession = {
        ...userSession,
        ...editedUser,
        phone: editedUser.phone,
      };

      setUserSession(updatedUserSession);
      setError(null);
      setPhoneError(null);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      toast.error("Failed to update profile");
    }
  };

  // Simplified handleCheckout function - no vehicle checks, just process payment
  const handleCheckout = async (): Promise<void> => {
    try {
      if (!userSession || !editedUser) {
        toast.error("Please complete your profile information");
        return;
      }

      if (!validateForm()) {
        return;
      }

      console.log("🔄 Starting direct payment process...");

      const finalPhone = editedUser.phone;

      if (!finalPhone) {
        toast.error(
          "Phone number is required. Please enter your phone number."
        );
        return;
      }

      if (!validatePhoneNumber(finalPhone)) {
        toast.error("Phone number must be in 09xxxxxxxx or 07xxxxxxxx format");
        return;
      }

      setProcessingPayment(true);

      const userData: any = {
        id: userSession.id,
        name: editedUser.name,
        email: editedUser.email,
        emailVerified: userSession.emailVerified,
        image: userSession.image,
        phone: finalPhone,
        address: editedUser.address,
        role: userSession.role,
        createdAt: userSession.createdAt,
        updatedAt: userSession.updatedAt,
      };

      console.log("💰 Processing payment directly...");

      const paymentResponse = await enhancedApiService.processCheckoutWithChapa(
        {
          userInfo: userData,
          cartItems,
          totalAmount: totals.total,
          rentalPeriod: {
            startDate: rentalDates.startDate,
            endDate: rentalDates.endDate,
            totalDays: totals.totalDays,
          },
        }
      );

      if (paymentResponse.success && paymentResponse.paymentUrl) {
        console.log("✅ Payment initialized, redirecting...");
        toast.success("Redirecting to payment...");

        localStorage.removeItem("vehicleRentalCart");

        window.location.href = paymentResponse.paymentUrl;
      } else {
        throw new Error(
          paymentResponse.message || "Failed to initialize payment"
        );
      }
    } catch (err: any) {
      console.error("❌ Payment error:", err);
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
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
              {t("company.name")}{" "}
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

        {/* Error Banner */}
        {(error || phoneError) && (
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
                <AlertCircle className="w-4 h-4" />
                <span>{error || phoneError}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setError(null);
                  setPhoneError(null);
                }}
                className="text-current hover:bg-current/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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

                  <Button
                    onClick={saveUserInfo}
                    className="rounded-2xl bg-green-500 hover:bg-green-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Information
                  </Button>
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
                        Update your information below. Phone number is required
                        for booking confirmation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field - NON EDITABLE */}
                  <div className="space-y-2">
                    <Label
                      className={`
                      block font-semibold
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        value={editedUser?.name || ""}
                        readOnly
                        disabled
                        className={`
                          pl-10 rounded-xl transition-all duration-200 opacity-70
                          ${
                            theme === "light"
                              ? "bg-gray-100 border-gray-300"
                              : "bg-gray-600 border-gray-500"
                          }
                        `}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Name cannot be changed during checkout
                    </p>
                  </div>

                  {/* Email Field - NON EDITABLE */}
                  <div className="space-y-2">
                    <Label
                      className={`
                      block font-semibold
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                    User Name *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        value={editedUser?.email || ""}
                        readOnly
                        disabled
                        className={`
                          pl-10 rounded-xl transition-all duration-200 opacity-70
                          ${
                            theme === "light"
                              ? "bg-gray-100 border-gray-300"
                              : "bg-gray-600 border-gray-500"
                          }
                        `}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Email cannot be changed during checkout
                    </p>
                  </div>

                  {/* Phone Field - Always Editable */}
                  <div className="space-y-2">
                    <Label
                      className={`
                      block font-semibold
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="tel"
                        value={editedUser?.phone || ""}
                         onChange={(e) =>
                          setEditedUser((prev) =>
                            prev ? { ...prev, phone: e.target.value } : null
                          )
                        }
                        className={`
                          pl-10 rounded-xl transition-all duration-200
                          ${
                            theme === "light"
                              ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              : "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-blue-400"
                          }
                          ${
                            phoneError
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : ""
                          }
                        `}
                        placeholder="09XXXXXXXX or 07XXXXXXXX"
                      />
                    </div>
                    {!editedUser?.phone ? (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Phone number is required for booking confirmation
                      </p>
                    ) : (
                      <p
                        className={`
                        text-xs
                        ${theme === "light" ? "text-gray-500" : "text-gray-400"}
                      `}
                      >
                        Format: 09XXXXXXXX or 07XXXXXXXX (10 digits)
                      </p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label
                      className={`
                      block font-semibold
                      ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                    `}
                    >
                      Delivery Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        value={editedUser?.address || ""}
                        onChange={(e) =>
                          setEditedUser((prev) =>
                            prev ? { ...prev, image: e.target.value } : null
                          )
                        }
                        className={`
                          pl-10 rounded-xl transition-all duration-200
                          ${
                            theme === "light"
                              ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              : "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-blue-400"
                          }
                        `}
                        placeholder="123 Main St, City, State 12345"
                      />
                    </div>
                    {!editedUser?.address && (
                      <p
                        className={`
                        text-xs
                        ${theme === "light" ? "text-gray-500" : "text-gray-400"}
                      `}
                      >
                        Add address for vehicle delivery (optional)
                      </p>
                    )}
                  </div>
                </div>

                {/* Rental Period Section */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                    <div className="space-y-2">
                      <Label
                        className={`
                        block font-semibold
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
                          rounded-xl transition-all duration-200
                          ${
                            theme === "light"
                              ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              : "bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-blue-400"
                          }
                        `}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        className={`
                        block font-semibold
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
                        text-xs
                        ${theme === "light" ? "text-gray-500" : "text-gray-400"}
                      `}
                      >
                        Auto-calculated based on start date
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Days Adjustment */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                    if (validateForm()) {
                      setCheckoutStep(2);
                    }
                  }}
                  className="w-full mt-6 rounded-2xl py-3 text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Continue to Payment
                </Button>
              </motion.div>
            )}

            {/* Payment Step */}
            {checkoutStep === 2 && (
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
                    <CreditCard className="w-6 h-6 text-blue-500" />
                    Payment Method
                  </h2>

                  <Button
                    onClick={() => setCheckoutStep(1)}
                    variant="outline"
                    className="rounded-2xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Information
                  </Button>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4 mb-6">
                  {/* Chapa Payment Option */}
                  <div
                    className={`
                    p-4 rounded-2xl border-2 cursor-pointer transition-all
                    ${
                      paymentMethod === "chapa"
                        ? theme === "light"
                          ? "border-green-500 bg-green-50"
                          : "border-green-500 bg-green-900/20"
                        : theme === "light"
                        ? "border-gray-200 bg-gray-50 hover:border-gray-300"
                        : "border-gray-600 bg-gray-700 hover:border-gray-500"
                    }
                  `}
                    onClick={() => setPaymentMethod("chapa")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center
                          ${
                            paymentMethod === "chapa"
                              ? "border-green-500 bg-green-500"
                              : theme === "light"
                              ? "border-gray-400"
                              : "border-gray-500"
                          }
                        `}
                        >
                          {paymentMethod === "chapa" && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div>
                          <h4
                            className={`
                            font-bold
                            ${
                              theme === "light" ? "text-gray-800" : "text-white"
                            }
                          `}
                          >
                            Chapa Payment
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
                            Secure payment via Chapa - Supports mobile banking &
                            cards
                          </p>
                        </div>
                      </div>
                      <div className="w-12 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        CHAPA
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapa Security Notice */}
                <div
                  className={`
                  mb-6 p-4 rounded-2xl
                  ${
                    theme === "light"
                      ? "bg-green-50 border border-green-200"
                      : "bg-green-900/20 border border-green-800"
                  }
                `}
                >
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p
                        className={`
                        text-sm font-semibold
                        ${
                          theme === "light"
                            ? "text-green-800"
                            : "text-green-400"
                        }
                      `}
                      >
                        Secure Payment with Chapa
                      </p>
                      <p
                        className={`
                        text-sm mt-1
                        ${
                          theme === "light"
                            ? "text-green-700"
                            : "text-green-300"
                        }
                      `}
                      >
                        Your payment is processed securely through Chapa. We
                        support all major Ethiopian banks and mobile banking
                        services. Your financial information is never stored on
                        our servers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
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
                  <h4
                    className={`
                    font-bold mb-3 flex items-center gap-2
                    ${theme === "light" ? "text-blue-800" : "text-blue-400"}
                  `}
                  >
                    <Info className="w-4 h-4" />
                    Payment Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span
                        className={
                          theme === "light" ? "text-blue-700" : "text-blue-300"
                        }
                      >
                        Amount:
                      </span>
                      <span
                        className={
                          theme === "light" ? "text-blue-800" : "text-blue-200"
                        }
                      >
                        ETB {totals.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={
                          theme === "light" ? "text-blue-700" : "text-blue-300"
                        }
                      >
                        Payment Method:
                      </span>
                      <span
                        className={
                          theme === "light" ? "text-blue-800" : "text-blue-200"
                        }
                      >
                        Chapa
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={
                          theme === "light" ? "text-blue-700" : "text-blue-300"
                        }
                      >
                        Currency:
                      </span>
                      <span
                        className={
                          theme === "light" ? "text-blue-800" : "text-blue-200"
                        }
                      >
                        ETB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setCheckoutStep(1)}
                    variant="outline"
                    className="flex-1 rounded-2xl py-3"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    disabled={processingPayment}
                    className="flex-1 rounded-2xl py-3 text-lg font-bold bg-green-500 hover:bg-green-600 text-white"
                  >
                    {processingPayment ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Pay with Chapa
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
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
                mt-6 p-4 rounded-2xl
                ${
                  theme === "light"
                    ? "bg-green-50 border border-green-200"
                    : "bg-green-900/20 border border-green-800"
                }
              `}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      className={`
                      text-sm font-semibold
                      ${theme === "light" ? "text-green-800" : "text-green-400"}
                    `}
                    >
                      Best Price Guarantee
                    </p>
                    <p
                      className={`
                      text-sm mt-1
                      ${theme === "light" ? "text-green-700" : "text-green-300"}
                    `}
                    >
                      Found a better price? We'll match it and give you 10% off
                      the difference.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Component
function CheckoutLoading({ theme }: { theme: string }) {
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
          Loading Checkout...
        </h2>
        <p
          className={`
          mt-2
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}
        >
          Preparing your booking details
        </p>
      </div>
    </div>
  );
}

// Error Component
function CheckoutError({
  error,
  theme,
  onLogin,
  onRetry,
}: {
  error: string;
  theme: string;
  onLogin: () => void;
  onRetry: () => void;
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
          Checkout Error
        </h2>
        <p
          className={`
          mb-6
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}
        >
          {error}
        </p>
        <div className="space-y-3">
          {error.includes("log in") && (
            <Button onClick={onLogin} className="w-full rounded-2xl">
              <LogIn className="w-4 h-4 mr-2" />
              Log In
            </Button>
          )}
          <Button
            onClick={onRetry}
            variant="outline"
            className="w-full rounded-2xl"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyCart({ theme }: { theme: string }) {
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
        <Car
          className={`
          w-16 h-16 mx-auto mb-4
          ${theme === "light" ? "text-gray-400" : "text-gray-500"}
        `}
        />
        <h2
          className={`
          text-2xl font-bold mb-2
          ${theme === "light" ? "text-gray-800" : "text-white"}
        `}
        >
          Your Cart is Empty
        </h2>
        <p
          className={`
          mb-6
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}
        >
          Add some vehicles to your cart before proceeding to checkout.
        </p>
        <Button
          onClick={() => (window.location.href = "/")}
          className="rounded-2xl"
        >
          Browse Vehicles
        </Button>
      </div>
    </div>
  );
}