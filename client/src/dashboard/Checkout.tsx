// components/CheckoutPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Info
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
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [rentalDates, setRentalDates] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Fetch session data using your exact implementation
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
            phone: '', // These fields might not be in the session
            address: ''
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

  // Fetch cart data from localStorage
  useEffect(() => {
    const getCartItems = () => {
      try {
        const savedCart = localStorage.getItem('vehicleRentalCart');
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          setCartItems(cartData);
          
          // Check if cart is empty
          if (cartData.length === 0) {
            setError('Your cart is empty. Please add vehicles before checkout.');
          }
        } else {
          setError('Your cart is empty. Please add vehicles before checkout.');
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        setError('Failed to load cart items');
      }
    };

    getCartItems();
  }, []);

  // Calculate totals
  const totals = React.useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.1; // 10% tax
    const serviceFee = cartItems.length * 15;
    const total = subtotal + tax + serviceFee;

    return {
      subtotal,
      tax,
      serviceFee,
      total,
      totalDays: cartItems.reduce((sum, item) => sum + item.rentalDays, 0)
    };
  }, [cartItems]);

  // Update rental days for a vehicle
  const updateRentalDays = (vehicleId: string, newDays: number) => {
    if (newDays < 1 || newDays > 30) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === vehicleId 
        ? { ...item, rentalDays: newDays, totalPrice: item.pricePerDay * newDays }
        : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('vehicleRentalCart', JSON.stringify(updatedCart));
  };

  // Remove vehicle from cart
  const removeFromCart = (vehicleId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== vehicleId);
    setCartItems(updatedCart);
    localStorage.setItem('vehicleRentalCart', JSON.stringify(updatedCart));
  };

  // Save user info edits
  const saveUserInfo = async () => {
    if (!editedUser) return;

    try {
      // Here you would typically send the updated user info to your API
      console.log('Saving user info:', editedUser);
      
      // For now, just update local state
      setUserSession(editedUser);
      setIsEditing(false);
      
      // Show success message
      setError(null);
      console.log('Profile updated successfully!');
      
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  // Handle checkout submission
  const handleCheckout = async () => {
    try {
      if (!userSession) {
        setError('Please complete your profile information');
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
          totalDays: totals.totalDays
        }
      };

      console.log('Processing checkout:', checkoutData);

      // Simulate API call
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      localStorage.removeItem('vehicleRentalCart');
      
      // Show success message
      alert('🎉 Booking confirmed! Thank you for your reservation.');
      
      // Redirect to home or confirmation page
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (err) {
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = () => {
    // Redirect to login page
    window.location.href = '/login';
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
    <div className={`
      min-h-screen transition-all duration-500
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
      }
    `}>
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
            <h1 className={`
              text-4xl font-black
              ${theme === 'light' ? 'text-gray-800' : 'text-white'}
            `}>
              Checkout
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className={`
              px-4 py-2 text-lg
              ${theme === 'light' 
                ? 'bg-blue-500 text-white' 
                : 'bg-blue-600 text-white'
              }
            `}>
              {cartItems.length} vehicle{cartItems.length !== 1 ? 's' : ''}
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
                  <p className={`
                    text-sm font-semibold
                    ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                  `}>
                    {userSession.name}
                  </p>
                  <p className={`
                    text-xs
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {userSession.role}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              mb-6 p-4 rounded-2xl border
              ${theme === 'light' 
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                : 'bg-yellow-900/20 border-yellow-800 text-yellow-400'
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
          {/* Left Column - Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                rounded-2xl p-6
                ${theme === 'light' 
                  ? 'bg-white border border-gray-200' 
                  : 'bg-gray-800 border border-gray-700'
                }
              `}
            >
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold
                      ${checkoutStep >= step
                        ? 'bg-blue-500 text-white'
                        : theme === 'light'
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-700 text-gray-400'
                      }
                    `}>
                      {checkoutStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`
                        w-20 h-1 mx-4
                        ${checkoutStep > step 
                          ? 'bg-blue-500' 
                          : theme === 'light'
                          ? 'bg-gray-200'
                          : 'bg-gray-700'
                        }
                      `} />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between text-sm font-medium">
                <span className={checkoutStep >= 1 ? 'text-blue-500' : 'text-gray-500'}>
                  Personal Info
                </span>
                <span className={checkoutStep >= 2 ? 'text-blue-500' : 'text-gray-500'}>
                  Payment
                </span>
                <span className={checkoutStep >= 3 ? 'text-blue-500' : 'text-gray-500'}>
                  Confirmation
                </span>
              </div>
            </motion.div>

            {/* Step 1: Personal Information */}
            {checkoutStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  rounded-2xl p-6
                  ${theme === 'light' 
                    ? 'bg-white border border-gray-200' 
                    : 'bg-gray-800 border border-gray-700'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`
                    text-2xl font-bold flex items-center gap-3
                    ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                  `}>
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
                      <Button
                        onClick={saveUserInfo}
                        className="rounded-2xl"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                {/* Session Info Banner */}
                <div className={`
                  mb-6 p-4 rounded-2xl
                  ${theme === 'light' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-blue-900/20 border border-blue-800'
                  }
                `}>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className={`
                        text-sm font-semibold
                        ${theme === 'light' ? 'text-blue-800' : 'text-blue-400'}
                      `}>
                        Signed in as {userSession?.name}
                      </p>
                      <p className={`
                        text-sm mt-1
                        ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}
                      `}>
                        Your profile information is loaded from your account. {
                          isEditing 
                            ? "You're currently editing your information. Changes will be saved for this booking."
                            : "Click 'Edit Information' to update your details for this booking."
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className={`
                      block mb-2 font-semibold
                      ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                    `}>
                      Full Name *
                    </Label>
                    <Input
                      value={editedUser?.name || ''}
                      onChange={(e) => setEditedUser(prev => prev ? {...prev, name: e.target.value} : null)}
                      disabled={!isEditing}
                      className={`
                        rounded-xl
                        ${theme === 'light' 
                          ? 'bg-white border-gray-300' 
                          : 'bg-gray-700 border-gray-600'
                        }
                        ${!isEditing ? 'opacity-80' : ''}
                      `}
                      placeholder="Enter your full name"
                    />
                    {!isEditing && (
                      <p className={`
                        text-xs mt-1
                        ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                      `}>
                        From your account profile
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className={`
                      block mb-2 font-semibold
                      ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                    `}>
                      Email Address *
                    </Label>
                    <Input
                      type="email"
                      value={editedUser?.email || ''}
                      onChange={(e) => setEditedUser(prev => prev ? {...prev, email: e.target.value} : null)}
                      disabled={!isEditing}
                      className={`
                        rounded-xl
                        ${theme === 'light' 
                          ? 'bg-white border-gray-300' 
                          : 'bg-gray-700 border-gray-600'
                        }
                        ${!isEditing ? 'opacity-80' : ''}
                      `}
                      placeholder="your.email@example.com"
                    />
                    {!isEditing && editedUser?.emailVerified && (
                      <p className={`
                        text-xs mt-1 text-green-600
                      `}>
                        ✓ Email verified
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className={`
                      block mb-2 font-semibold
                      ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                    `}>
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      value={editedUser?.phone || ''}
                      onChange={(e) => setEditedUser(prev => prev ? {...prev, phone: e.target.value} : null)}
                      disabled={!isEditing}
                      className={`
                        rounded-xl
                        ${theme === 'light' 
                          ? 'bg-white border-gray-300' 
                          : 'bg-gray-700 border-gray-600'
                        }
                        ${!isEditing ? 'opacity-80' : ''}
                      `}
                      placeholder="+1 (555) 123-4567"
                    />
                    {!isEditing && !editedUser?.phone && (
                      <p className={`
                        text-xs mt-1
                        ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                      `}>
                        Add your phone number for updates
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className={`
                      block mb-2 font-semibold
                      ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                    `}>
                      Delivery Address
                    </Label>
                    <Input
                      value={editedUser?.address || ''}
                      onChange={(e) => setEditedUser(prev => prev ? {...prev, address: e.target.value} : null)}
                      disabled={!isEditing}
                      className={`
                        rounded-xl
                        ${theme === 'light' 
                          ? 'bg-white border-gray-300' 
                          : 'bg-gray-700 border-gray-600'
                        }
                        ${!isEditing ? 'opacity-80' : ''}
                      `}
                      placeholder="123 Main St, City, State 12345"
                    />
                    {!isEditing && !editedUser?.address && (
                      <p className={`
                        text-xs mt-1
                        ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                      `}>
                        Add address for vehicle delivery
                      </p>
                    )}
                  </div>
                </div>

                {/* Account Information (Read-only) */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className={`
                    text-lg font-bold mb-4 flex items-center gap-2
                    ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                  `}>
                    <Shield className="w-5 h-5 text-green-500" />
                    Account Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={`
                        block
                        ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                      `}>
                        Account ID
                      </span>
                      <span className={`
                        font-mono
                        ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                      `}>
                        {userSession?.id}
                      </span>
                    </div>
                    <div>
                      <span className={`
                        block
                        ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                      `}>
                        Member Since
                      </span>
                      <span className={`
                        ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                      `}>
                        {userSession?.createdAt ? new Date(userSession.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rental Dates */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className={`
                    text-lg font-bold mb-4 flex items-center gap-2
                    ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                  `}>
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Rental Period
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className={`
                        block mb-2 font-semibold
                        ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                      `}>
                        Start Date *
                      </Label>
                      <Input
                        type="date"
                        value={rentalDates.startDate}
                        onChange={(e) => setRentalDates(prev => ({...prev, startDate: e.target.value}))}
                        min={new Date().toISOString().split('T')[0]}
                        className={`
                          rounded-xl
                          ${theme === 'light' 
                            ? 'bg-white border-gray-300' 
                            : 'bg-gray-700 border-gray-600'
                          }
                        `}
                      />
                    </div>
                    
                    <div>
                      <Label className={`
                        block mb-2 font-semibold
                        ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                      `}>
                        End Date *
                      </Label>
                      <Input
                        type="date"
                        value={rentalDates.endDate}
                        onChange={(e) => setRentalDates(prev => ({...prev, endDate: e.target.value}))}
                        min={rentalDates.startDate}
                        className={`
                          rounded-xl
                          ${theme === 'light' 
                            ? 'bg-white border-gray-300' 
                            : 'bg-gray-700 border-gray-600'
                          }
                        `}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    // Basic validation
                    if (!editedUser?.name || !editedUser?.email) {
                      setError('Please fill in all required fields (name and email)');
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

            {/* Steps 2 and 3 would go here */}
            {/* ... (Payment and Review steps from previous implementation) */}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                rounded-2xl p-6 sticky top-6
                ${theme === 'light' 
                  ? 'bg-white border border-gray-200' 
                  : 'bg-gray-800 border border-gray-700'
                }
              `}
            >
              <h2 className={`
                text-2xl font-bold mb-6
                ${theme === 'light' ? 'text-gray-800' : 'text-white'}
              `}>
                Order Summary
              </h2>

              {/* Vehicles List */}
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
                        <h4 className={`
                          font-bold text-sm
                          ${theme === 'light' ? 'text-gray-800' : 'text-white'}
                        `}>
                          {item.name}
                        </h4>
                        <p className={`
                          text-xs
                          ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                        `}>
                          {item.rentalDays} day{item.rentalDays !== 1 ? 's' : ''}
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

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                    Subtotal
                  </span>
                  <span className={theme === 'light' ? 'text-gray-800' : 'text-white'}>
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                    Tax (10%)
                  </span>
                  <span className={theme === 'light' ? 'text-gray-800' : 'text-white'}>
                    ${totals.tax.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                    Service Fee
                  </span>
                  <span className={theme === 'light' ? 'text-gray-800' : 'text-white'}>
                    ${totals.serviceFee.toFixed(2)}
                  </span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className={theme === 'light' ? 'text-gray-800' : 'text-white'}>
                      Total
                    </span>
                    <span className="text-green-600">
                      ${totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className={`
                mt-6 p-4 rounded-2xl text-center
                ${theme === 'light' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-green-900/20 border border-green-800'
                }
              `}>
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className={`
                  text-sm font-semibold
                  ${theme === 'light' ? 'text-green-800' : 'text-green-400'}
                `}>
                  Secure Checkout
                </p>
                <p className={`
                  text-xs
                  ${theme === 'light' ? 'text-green-600' : 'text-green-500'}
                `}>
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

// Loading Component (same as before)
const CheckoutLoading: React.FC<{ theme: string }> = ({ theme }) => (
  <div className={`
    min-h-screen flex items-center justify-center
    ${theme === 'light' 
      ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
      : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
    }
  `}>
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
        <h3 className={`
          text-2xl font-bold mt-6
          ${theme === "light" ? "text-gray-800" : "text-white"}
        `}>
          Loading Checkout...
        </h3>
        <p className={`
          mt-2
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}>
          Preparing your booking details
        </p>
      </motion.div>
    </div>
  </div>
);

// Enhanced Error Component with login option
const CheckoutError: React.FC<{ error: string; theme: string; onLogin?: () => void; onRetry?: () => void }> = ({ error, theme, onLogin, onRetry }) => (
  <div className={`
    min-h-screen flex items-center justify-center
    ${theme === 'light' 
      ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
      : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
    }
  `}>
    <div className="text-center max-w-md mx-auto p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className={`
          w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6
          ${theme === "light" ? "bg-red-100" : "bg-red-900/20"}
        `}>
          <Car className="w-12 h-12 text-red-500" />
        </div>
        <h3 className={`
          text-2xl font-bold mb-3
          ${theme === "light" ? "text-gray-800" : "text-white"}
        `}>
          Checkout Error
        </h3>
        <p className={`
          mb-6
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}>
          {error}
        </p>
        <div className="flex gap-4 justify-center">
          {onLogin && (
            <Button 
              onClick={onLogin}
              className="rounded-2xl px-6 py-3"
            >
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

// Empty Cart Component
const EmptyCart: React.FC<{ theme: string }> = ({ theme }) => (
  <div className={`
    min-h-screen flex items-center justify-center
    ${theme === 'light' 
      ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50' 
      : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
    }
  `}>
    <div className="text-center max-w-md mx-auto p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className={`
          w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6
          ${theme === "light" ? "bg-yellow-100" : "bg-yellow-900/20"}
        `}>
          <Car className="w-12 h-12 text-yellow-500" />
        </div>
        <h3 className={`
          text-2xl font-bold mb-3
          ${theme === "light" ? "text-gray-800" : "text-white"}
        `}>
          Your Cart is Empty
        </h3>
        <p className={`
          mb-6
          ${theme === "light" ? "text-gray-600" : "text-gray-400"}
        `}>
          Please add some vehicles to your cart before proceeding to checkout.
        </p>
        <Button 
          onClick={() => window.location.href = '/vehicles'}
          className="rounded-2xl px-8 py-3"
        >
          Browse Vehicles
        </Button>
      </motion.div>
    </div>
  </div>
);