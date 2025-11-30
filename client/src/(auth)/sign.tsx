import { motion } from "framer-motion";
import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Car,
  Shield,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  Phone,
  MapPin,
  CircleUser,
  Star,
  Users,
  Award,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../components/LanguageContext";
import { authClient } from "../lib/auth-client";
import { toast } from "sonner";

// Types
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  address: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  phone?: string;
  address?: string;
}

interface AuthFeature {
  icon: JSX.Element;
  text: string;
  description: string;
}

export default function Sign() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();

  // State management
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [checkingPhone, setCheckingPhone] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Features data
  const features: AuthFeature[] = [
    {
      icon: <Car className="w-6 h-6" />,
      text: t("auth.features.vehicles") || "500+ Premium Vehicles",
      description:
        t("auth.features.vehiclesDesc") ||
        "Luxury cars, SUVs, and economy vehicles",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      text: t("auth.features.locations") || "Multiple Pickup Locations",
      description:
        t("auth.features.locationsDesc") ||
        "Convenient locations across major cities",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      text: t("auth.features.insurance") || "Fully Insured & Safe",
      description:
        t("auth.features.insuranceDesc") ||
        "Comprehensive insurance coverage included",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      text: t("auth.features.support") || "24/7 Customer Support",
      description:
        t("auth.features.supportDesc") ||
        "Round-the-clock assistance available",
    },
  ];

  // Stats data
  const stats = [
    {
      value: "10K+",
      label: t("auth.stats.customers") || "Happy Customers",
      icon: <Users className="w-4 h-4" />,
    },
    {
      value: "4.9★",
      label: t("auth.stats.rating") || "Customer Rating",
      icon: <Star className="w-4 h-4" />,
    },
    {
      value: "50+",
      label: t("auth.stats.vehicles") || "Premium Vehicles",
      icon: <Award className="w-4 h-4" />,
    },
  ];

  // Check if phone number exists
  const checkPhoneNumberExists = async (
    phone: string
  ): Promise<{ exists: boolean; user?: any }> => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/check-phone?phone=${encodeURIComponent(
          phone
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to check phone number");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to check phone number");
      }

      return {
        exists: data.data.exists,
        user: data.data.user,
      };
    } catch (error) {
      console.error("Failed to check phone number:", error);
      throw error;
    }
  };

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return t("auth.errors.emailRequired") || "Username is required";
    }
    if (email.length < 3) {
      return (
        t("auth.errors.usernameTooShort") ||
        "Username must be at least 3 characters"
      );
    }
    if (!/^[a-zA-Z0-9_]+$/.test(email)) {
      return (
        t("auth.errors.usernameInvalid") ||
        "Username can only contain letters, numbers, and underscores"
      );
    }
    if (email.length > 20) {
      return (
        t("auth.errors.usernameTooLong") ||
        "Username must be less than 20 characters"
      );
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return t("auth.errors.passwordRequired") || "Password is required";
    }
    if (password.length < 6) {
      return (
        t("auth.errors.passwordLength") ||
        "Password must be at least 6 characters"
      );
    }
    return undefined;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string | undefined => {
    if (!confirmPassword) {
      return (
        t("auth.errors.confirmPasswordRequired") ||
        "Please confirm your password"
      );
    }
    if (password !== confirmPassword) {
      return t("auth.errors.passwordsDontMatch") || "Passwords don't match";
    }
    return undefined;
  };

  const validateFullName = (fullName: string): string | undefined => {
    if (!fullName.trim()) {
      return t("auth.errors.fullNameRequired") || "Full name is required";
    }
    if (fullName.length < 2) {
      return (
        t("auth.errors.fullNameTooShort") ||
        "Full name must be at least 2 characters"
      );
    }
    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      return (
        t("auth.errors.fullNameInvalid") ||
        "Full name can only contain letters and spaces"
      );
    }
    return undefined;
  };

  const validatePhone = async (phone: string): Promise<string | undefined> => {
    if (!phone.trim()) {
      return t("auth.errors.phoneRequired") || "Phone number is required";
    }

    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      return t("auth.errors.phoneLength") || "Phone number must be 10 digits";
    }

    if (!/^(09|07)/.test(cleanPhone)) {
      return (
        t("auth.errors.phonePrefix") || "Phone number must start with 09 or 07"
      );
    }

    if (!/^\d+$/.test(cleanPhone)) {
      return (
        t("auth.errors.phoneDigits") || "Phone number must contain only digits"
      );
    }

    // Check if phone number already exists (only for sign-up)
    if (!isLogin && cleanPhone.length === 10) {
      setCheckingPhone(true);
      try {
        const { exists, user } = await checkPhoneNumberExists(cleanPhone);
        if (exists) {
          toast.error(
            t("auth.errors.phoneExists") ||
              "📱 This phone number is already registered! Please use a different number or sign in with your existing account.",
            {
              duration: 5000,
              action: {
                label: "Sign In",
                onClick: () => setIsLogin(true),
              },
            }
          );
          return (
            t("auth.errors.phoneExists") ||
            "This phone number is already registered. Please use a different number."
          );
        }
      } catch (error) {
        console.error("Error checking phone number:", error);
        toast.warning(
          t("auth.errors.phoneCheckFailed") ||
            "⚠️ Unable to verify phone number availability. Please try again.",
          { duration: 3000 }
        );
        return (
          t("auth.errors.phoneCheckFailed") ||
          "Unable to verify phone number. Please try again."
        );
      } finally {
        setCheckingPhone(false);
      }
    }

    return undefined;
  };

  const validateAddress = (address: string): string | undefined => {
    if (!address.trim()) {
      return t("auth.errors.addressRequired") || "Address is required";
    }
    if (address.length < 5) {
      return (
        t("auth.errors.addressTooShort") ||
        "Address must be at least 5 characters"
      );
    }
    return undefined;
  };

  // Real-time validation for specific field
  const validateField = async (
    name: keyof FormData,
    value: string
  ): Promise<string | undefined> => {
    switch (name) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(formData.password, value);
      case "fullName":
        return validateFullName(value);
      case "phone":
        return await validatePhone(value);
      case "address":
        return validateAddress(value);
      default:
        return undefined;
    }
  };

  // Form validation
  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};

    // Validate all fields based on current mode
    if (!isLogin) {
      newErrors.fullName = validateFullName(formData.fullName);
      newErrors.phone = await validatePhone(formData.phone);
      newErrors.confirmPassword = validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      );
      newErrors.address = validateAddress(formData.address);
    }

    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);

    // Filter out undefined errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== undefined)
    ) as FormErrors;

    setErrors(filteredErrors);

    if (Object.keys(filteredErrors).length > 0) {
      // Don't show toast here as individual field validations already show toasts
      return false;
    }

    return true;
  };

  // Save phone number to backend
  const savePhoneNumber = async (
    email: string,
    phone: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/api/users/phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email + "@elitedrive.com",
          phone: phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save phone number");
      }

      await response.json();
      return true;
    } catch (error: any) {
      console.error("Failed to save phone number:", error);
      toast.error(
        error.message || "Failed to save phone number to your profile",
        { duration: 3000 }
      );
      return false;
    }
  };

  // Main form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignUp();
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(
        t("auth.errors.somethingWentWrong") ||
          "❌ Something went wrong. Please try again.",
        { duration: 4000 }
      );
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const handleLogin = async () => {
    const result = await authClient.signIn.email({
      email: formData.email + "@elitedrive.com",
      password: formData.password,
    });

    if (result.error) {
      toast.error(
        t("auth.errors.signInFailed") ||
          "🔐 Sign in failed. Please check your credentials and try again.",
        { duration: 4000 }
      );
      return;
    }

    toast.success(
      t("auth.success.welcomeBack") || "🎉 Welcome back to EliteDrive!",
      { duration: 3000 }
    );
    navigate("/dashboard");
  };

  // Signup handler
  const handleSignUp = async () => {
    // Double-check phone number existence before signup
    if (formData.phone) {
      const cleanPhone = formData.phone.replace(/\D/g, "");
      try {
        const { exists } = await checkPhoneNumberExists(cleanPhone);
        if (exists) {
          toast.error(
            t("auth.errors.phoneExists") ||
              "📱 This phone number is already registered! Please use a different number.",
            {
              duration: 5000,
              action: {
                label: "Sign In Instead",
                onClick: () => setIsLogin(true),
              },
            }
          );
          setErrors((prev) => ({
            ...prev,
            phone:
              t("auth.errors.phoneExists") || "Phone number already registered",
          }));
          return;
        }
      } catch (error) {
        console.error("Error checking phone number during signup:", error);
        toast.error("❌ Cannot verify phone number. Please try again later.", {
          duration: 4000,
        });
        return;
      }
    }

    const result = await authClient.signUp.email({
      email: formData.email + "@elitedrive.com",
      password: formData.password,
      name: formData.fullName,
      image: formData.address,
    });

    if (result.error) {
      toast.error(
        t("auth.errors.signUpFailed") ||
          "❌ Sign up failed. Please try again with different credentials.",
        { duration: 4000 }
      );
      return;
    }

    // Save phone number if provided
    if (formData.phone) {
      const phoneSaved = await savePhoneNumber(formData.email, formData.phone);
      if (!phoneSaved) {
        toast.warning(
          t("auth.info.phoneSaveFailed") ||
            "⚠️ Account created but phone number not saved. You can update it later in your profile.",
          { duration: 5000 }
        );
      }
    }

    toast.success(
      t("auth.success.accountCreated") ||
        "🎉 Account created successfully! Welcome to EliteDrive!",
      {
        duration: 4000,
        action: {
          label: "Go to Dashboard",
          onClick: () => navigate("/dashboard"),
        },
      }
    );

    // Reset form
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
      address: "",
    });

    // Switch to login mode
    setIsLogin(true);
  };

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.requestPasswordReset({
        email: resetEmail,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        toast.error(
          t("auth.errors.resetFailed") ||
            "❌ Password reset failed. Please check your email and try again.",
          { duration: 4000 }
        );
      } else {
        toast.success(
          t("auth.success.resetSent") ||
            "📧 Password reset link sent! Check your email inbox.",
          { duration: 5000 }
        );
        setShowForgotPassword(false);
        setResetEmail("");
      }
    } catch (error: any) {
      toast.error(
        t("auth.errors.somethingWentWrong") ||
          "❌ Something went wrong. Please try again.",
        { duration: 4000 }
      );
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Input change handler with real-time validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format phone number input
    let processedValue = value;
    if (name === "phone") {
      // Remove any non-digit characters and limit to 10 digits
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Input blur handler for validation
  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      name === "phone" &&
      !isLogin &&
      value.replace(/\D/g, "").length === 10
    ) {
      setCheckingPhone(true);
      try {
        const error = await validateField(name as keyof FormData, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      } finally {
        setCheckingPhone(false);
      }
    } else {
      const error = await validateField(name as keyof FormData, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Toggle auth mode
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear errors when switching modes
    setErrors({});
    // Clear form data when switching to sign up
    if (!isLogin) {
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phone: "",
        address: "",
      });
    }
  };

  // Theme classes
  const themeClasses = {
    background:
      theme === "light"
        ? "bg-gradient-to-br from-blue-50 via-white to-cyan-50"
        : "bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900",
    card:
      theme === "light"
        ? "bg-white/90 backdrop-blur-sm border-white/20"
        : "bg-gray-800/90 backdrop-blur-sm border-gray-700/20",
    text: {
      primary: theme === "light" ? "text-gray-900" : "text-white",
      secondary: theme === "light" ? "text-gray-600" : "text-gray-300",
      muted: theme === "light" ? "text-gray-500" : "text-gray-400",
      error: theme === "light" ? "text-red-600" : "text-red-400",
    },
    button: {
      primary:
        theme === "light"
          ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
      secondary:
        theme === "light"
          ? "border-gray-300 hover:bg-gray-50"
          : "border-gray-600 hover:bg-gray-700/50",
    },
    input: {
      normal:
        theme === "light"
          ? "border-gray-300 bg-white focus:border-blue-500"
          : "border-gray-600 bg-gray-700/50 text-white focus:border-blue-400",
      error:
        theme === "light"
          ? "border-red-500 bg-white focus:border-red-500"
          : "border-red-500 bg-gray-700/50 text-white focus:border-red-500",
    },
  };

  // Helper function to get input class based on error state
  const getInputClass = (fieldName: keyof FormErrors) => {
    const baseClass = `w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 outline-none transition-all duration-300 ${
      errors[fieldName] ? themeClasses.input.error : themeClasses.input.normal
    }`;

    return `${baseClass} ${
      errors[fieldName]
        ? "focus:ring-red-500"
        : "focus:ring-blue-500 focus:border-transparent"
    }`;
  };

  // Forgot Password Modal Component
  const ForgotPasswordModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`rounded-3xl shadow-2xl max-w-md w-full ${themeClasses.card} border`}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full ${
                  theme === "light" ? "bg-blue-100" : "bg-blue-900/30"
                }`}
              >
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2
                  className={`text-2xl font-bold ${themeClasses.text.primary}`}
                >
                  {t("auth.forgotPassword.title") || "Reset Password"}
                </h2>
                <p className={themeClasses.text.secondary}>
                  {t("auth.forgotPassword.instructions") ||
                    "Enter your email to receive a reset link"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForgotPassword(false)}
              className={`p-2 rounded-full transition-colors ${
                theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label
                className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}
              >
                {t("auth.labels.email") || "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${themeClasses.input.normal}`}
                  placeholder={
                    t("auth.placeholders.email") || "Enter your email"
                  }
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.button.primary}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("auth.loading.sendingLink") || "Sending reset link..."}
                </>
              ) : (
                <>
                  {t("auth.buttons.sendResetLink") || "Send Reset Link"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className={`font-semibold transition-colors ${
                  theme === "light"
                    ? "text-blue-600 hover:text-blue-800"
                    : "text-blue-400 hover:text-blue-300"
                }`}
              >
                {t("auth.buttons.backToSignIn") || "Back to Sign In"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${themeClasses.background}`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            transition: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
          className={`absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl ${
            theme === "light" ? "bg-blue-400/20" : "bg-blue-600/10"
          }`}
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            transition: { duration: 25, repeat: Infinity, ease: "linear" },
          }}
          className={`absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl ${
            theme === "light" ? "bg-cyan-400/20" : "bg-cyan-600/10"
          }`}
        />
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && <ForgotPasswordModal />}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Column - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl mb-12 ${themeClasses.card} shadow-lg`}
          >
            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              EliteDrive
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-5xl lg:text-6xl font-bold mb-6 leading-tight ${themeClasses.text.primary}`}
          >
            {isLogin
              ? t("auth.titles.welcomeBack") || "Welcome Back"
              : t("auth.titles.joinEliteDrive") || "Join EliteDrive"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-xl mb-12 max-w-lg leading-relaxed ${themeClasses.text.secondary}`}
          >
            {isLogin
              ? t("auth.subtitles.login") ||
                "Sign in to your account to continue your premium car rental experience"
              : t("auth.subtitles.signup") ||
                "Create your account and unlock access to our premium vehicle fleet"}
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex items-start gap-4 group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`p-3 rounded-xl transition-all duration-300 group-hover:shadow-lg ${
                    theme === "light"
                      ? "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                      : "bg-blue-900/50 text-blue-400 group-hover:bg-blue-800"
                  }`}
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h3
                    className={`font-semibold text-lg mb-1 ${themeClasses.text.primary}`}
                  >
                    {feature.text}
                  </h3>
                  <p className={`text-sm ${themeClasses.text.muted}`}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-md"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`flex items-center justify-center gap-2 mb-2 ${themeClasses.text.primary}`}
                >
                  {stat.icon}
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
                <div
                  className={`text-sm font-medium ${themeClasses.text.muted}`}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-3xl shadow-2xl border p-10 backdrop-blur-sm ${themeClasses.card} border`}
        >
          {/* Auth Mode Toggle */}
          <motion.div
            layout
            className={`flex rounded-2xl p-2 mb-10 relative shadow-inner ${
              theme === "light"
                ? "bg-gradient-to-r from-blue-100 to-cyan-100"
                : "bg-gradient-to-r from-blue-900/30 to-cyan-900/30"
            }`}
          >
            <motion.button
              layout
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 px-8 rounded-xl font-semibold transition-all duration-300 relative z-10 ${
                isLogin
                  ? "text-white"
                  : theme === "light"
                  ? "text-blue-600 hover:text-blue-700"
                  : "text-blue-400 hover:text-blue-300"
              }`}
            >
              {t("auth.buttons.signIn") || "Sign In"}
            </motion.button>
            <motion.button
              layout
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 px-8 rounded-xl font-semibold transition-all duration-300 relative z-10 ${
                !isLogin
                  ? "text-white"
                  : theme === "light"
                  ? "text-cyan-600 hover:text-cyan-700"
                  : "text-cyan-400 hover:text-cyan-300"
              }`}
            >
              {t("auth.buttons.signUp") || "Sign Up"}
            </motion.button>
            <motion.div
              layout
              animate={{
                x: isLogin ? 0 : "100%",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-2 w-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg"
            />
          </motion.div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name (Sign Up only) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}
                >
                  {t("auth.labels.fullName") || "Full Name"} *
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      errors.fullName ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass("fullName")}
                    placeholder={
                      t("auth.placeholders.fullName") || "Enter your full name"
                    }
                    required={!isLogin}
                  />
                </div>
                {errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 mt-2 text-sm ${themeClasses.text.error}`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Username */}
            <div>
              <label
                className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}
              >
                {t("auth.labels.username") || "Username"} *
              </label>
              <div className="relative">
                <CircleUser
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    errors.email ? "text-red-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass("email")}
                  placeholder={
                    t("auth.placeholders.username") || "Enter your username"
                  }
                  required
                />
                <div
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-sm ${
                    errors.email ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  @elitedrive.com
                </div>
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 mt-2 text-sm ${themeClasses.text.error}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Phone Number (Sign Up only) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}
                >
                  {t("auth.labels.phone") || "Phone Number"} *
                </label>
                <div className="relative">
                  <Phone
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      errors.phone ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass("phone")}
                    placeholder={
                      t("auth.placeholders.phone") || "07XX or 09XX XXXXXX"
                    }
                    required={!isLogin}
                    maxLength={10}
                    disabled={checkingPhone}
                  />
                  {checkingPhone && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 mt-2 text-sm ${themeClasses.text.error}`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </motion.p>
                )}
                <p className={`text-xs mt-2 ${themeClasses.text.muted}`}>
                  {t("auth.info.phoneFormat") ||
                    "Must be 10 digits starting with 07 or 09"}
                </p>
                {checkingPhone && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-xs mt-1 ${themeClasses.text.muted}`}
                  >
                    {t("auth.loading.checkingPhone") ||
                      "Checking phone number availability..."}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Address (Sign Up only) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}
                >
                  {t("auth.labels.address") || "Address"} *
                </label>
                <div className="relative">
                  <MapPin
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      errors.address ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass("address")}
                    placeholder={
                      t("auth.placeholders.address") || "Enter your address"
                    }
                    required={!isLogin}
                  />
                </div>
                {errors.address && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 mt-2 text-sm ${themeClasses.text.error}`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.address}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Password */}
            <div>
              <label
                className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}
              >
                {t("auth.labels.password") || "Password"} *
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    errors.password ? "text-red-500" : "text-gray-400"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass("password")}
                  placeholder={
                    t("auth.placeholders.password") || "Enter your password"
                  }
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 mt-2 text-sm ${themeClasses.text.error}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  className={`block text-sm font-semibold mb-3 ${themeClasses.text.primary}`}
                >
                  {t("auth.labels.confirmPassword") || "Confirm Password"} *
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      errors.confirmPassword ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass("confirmPassword")}
                    placeholder={
                      t("auth.placeholders.confirmPassword") ||
                      "Confirm your password"
                    }
                    required={!isLogin}
                    minLength={6}
                  />
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 mt-2 text-sm ${themeClasses.text.error}`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading || checkingPhone}
              className={`w-full text-white py-5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.button.primary}`}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLogin
                    ? t("auth.loading.signingIn") || "Signing in..."
                    : t("auth.loading.creatingAccount") ||
                      "Creating account..."}
                </>
              ) : (
                <>
                  {isLogin
                    ? t("auth.buttons.signIn") || "Sign In"
                    : t("auth.buttons.signUp") || "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Auth Mode Toggle Text */}
            <p className={`text-center py-4 ${themeClasses.text.secondary}`}>
              {isLogin
                ? t("auth.info.noAccount") || "Don't have an account?"
                : t("auth.info.haveAccount") || "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className={`font-semibold transition-colors ${
                  theme === "light"
                    ? "text-blue-600 hover:text-blue-800"
                    : "text-blue-400 hover:text-blue-300"
                }`}
              >
                {isLogin
                  ? t("auth.buttons.signUp") || "Sign up"
                  : t("auth.buttons.signIn") || "Sign in"}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
