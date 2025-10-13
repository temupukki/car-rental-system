import { motion } from "framer-motion";
import { useState } from "react";
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
  CheckCircle,
  ArrowLeft,
  X,
  Phone,
  MapPin,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../components/LanguageContext";
import { authClient } from "../lib/auth-client";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });

  const features = [
    { 
      icon: <Car className="w-6 h-6" />, 
      text: t('auth.feature1') 
    },
    { 
      icon: <MapPin className="w-6 h-6" />, 
      text: t('auth.feature2') 
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      text: t('auth.feature3') 
    },
    { 
      icon: <Clock className="w-6 h-6" />, 
      text: t('auth.feature4') 
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        });

        if (result.error) {
          toast.error(t('auth.signInFailed') + result.error.message);
        } else {
          if (result.data.user.emailVerified) {
            toast.success(t('auth.welcomeBack'));
            navigate("/dashboard");
          } else {
            setVerificationSent(true);
            setPendingEmail(formData.email);
            toast.warning(t('auth.verifyEmail'));
          }
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error(t('auth.passwordsDontMatch'));
          setLoading(false);
          return;
        }

        const result = await authClient.signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
        });

        if (result.error) {
          toast.error(t('auth.signUpFailed') + result.error.message);
        } else {
          setVerificationSent(true);
          setPendingEmail(formData.email);
          toast.success(t('auth.accountCreated'));
          
          setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
            phone: "",
          });
        }
      }
    } catch (error: any) {
      toast.error(t('auth.somethingWentWrong'));
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });

      toast.success(t('auth.googleSuccess'));

      if (result.error) {
        toast.error(result.error.message);
        return;
      }
      toast.loading(t('auth.processing'));
     
    } catch (error: any) {
      toast.error(t('auth.googleFailed'));
      console.error("Google auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      toast.info(t('auth.checkSpam'));
      
      setTimeout(() => {
        toast.success(t('auth.emailResent'));
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      toast.error(t('auth.resendFailed'));
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.requestPasswordReset({
        email: resetEmail,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        toast.error(t('auth.resetFailed') + result.error.message);
      } else {
        toast.success(t('auth.resetSent'));
        setShowForgotPassword(false);
        setResetEmail("");
      }
    } catch (error: any) {
      toast.error(t('auth.somethingWentWrong'));
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAuth = () => {
    setVerificationSent(false);
    if (isLogin) {
      setFormData(prev => ({ 
        ...prev, 
        password: "",
        confirmPassword: "",
        fullName: "",
        phone: "",
      }));
    } else {
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phone: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const ForgotPasswordModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`
        rounded-3xl shadow-2xl max-w-md w-full
        ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
      `}>
        <button
          onClick={() => setShowForgotPassword(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-50"
          style={{ position: 'fixed', top: '1rem', right: '1rem' }}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
              ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'}
            `}>
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className={`
              text-2xl font-bold mb-2
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>
              {t('auth.resetPassword')}
            </h2>
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
              {t('auth.resetInstructions')}
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className={`
                block text-sm font-medium mb-2
                ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}
              `}>
                {t('auth.emailAddress')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200
                    ${theme === 'light' 
                      ? 'border-gray-300 bg-white' 
                      : 'border-gray-600 bg-gray-700 text-white'
                    }
                  `}
                  placeholder={t('auth.enterEmail')}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                ${theme === 'light' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('auth.sendingLink')}
                </>
              ) : (
                <>
                  {t('auth.sendResetLink')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className={`
                  font-medium transition-colors
                  ${theme === 'light' 
                    ? 'text-blue-600 hover:text-blue-800' 
                    : 'text-blue-400 hover:text-blue-300'
                  }
                `}
              >
                {t('auth.backToSignIn')}
              </button>
            </div>
          </form>

          <div className={`
            mt-6 p-4 rounded-xl
            ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'}
          `}>
            <h3 className={`
              text-sm font-medium mb-2
              ${theme === 'light' ? 'text-blue-800' : 'text-blue-200'}
            `}>
              {t('auth.whatHappensNext')}
            </h3>
            <ul className={`
              text-xs space-y-1
              ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}
            `}>
              <li>• {t('auth.step1')}</li>
              <li>• {t('auth.step2')}</li>
              <li>• {t('auth.step3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  if (verificationSent) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center p-4
        ${theme === 'light' 
          ? 'bg-gradient-to-br from-blue-50 to-cyan-100' 
          : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
        }
      `}>
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              transition: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
            className={`
              absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl
              ${theme === 'light' ? 'bg-blue-400/20' : 'bg-blue-600/10'}
            `}
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              transition: { duration: 25, repeat: Infinity, ease: "linear" },
            }}
            className={`
              absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl
              ${theme === 'light' ? 'bg-cyan-400/20' : 'bg-cyan-600/10'}
            `}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            max-w-md w-full rounded-3xl shadow-2xl border p-8 text-center backdrop-blur-sm
            ${theme === 'light' 
              ? 'bg-white/80 border-white/20' 
              : 'bg-gray-800/80 border-gray-700/20'
            }
          `}
        >
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBackToAuth}
            className={`
              flex items-center gap-2 mb-6 transition-colors self-start
              ${theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-gray-200'}
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('auth.backTo')} {isLogin ? t('auth.signIn') : t('auth.signUp')}
          </motion.button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 backdrop-blur-sm
              ${theme === 'light' ? 'bg-white/80' : 'bg-gray-800/80'}
            `}
          >
            <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className={`
              text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent
              ${theme === 'light' 
                ? 'from-blue-600 to-cyan-600' 
                : 'from-blue-400 to-cyan-400'
              }
            `}>
              EliteDrive
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4
              ${theme === 'light' ? 'bg-green-100' : 'bg-green-900/20'}
            `}>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className={`
              text-2xl font-bold mb-2
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>
              {t('auth.checkEmail')}
            </h2>
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
              {t('auth.verificationSent')}
            </p>
            <p className={`
              text-lg font-semibold mb-6 py-2 px-4 rounded-lg
              ${theme === 'light' ? 'text-blue-600 bg-blue-50' : 'text-blue-400 bg-blue-900/20'}
            `}>
              {pendingEmail}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className={`
              rounded-xl p-4 text-left border
              ${theme === 'light' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-800'}
            `}>
              <h3 className={`
                font-semibold mb-2 flex items-center gap-2
                ${theme === 'light' ? 'text-blue-800' : 'text-blue-200'}
              `}>
                <CheckCircle className="w-4 h-4" />
                {t('auth.whatsNext')}
              </h3>
              <ul className={`
                text-sm space-y-2
                ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}
              `}>
                <li className="flex items-center gap-2">
                  <div className={`
                    w-2 h-2 rounded-full
                    ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'}
                  `}></div>
                  {t('auth.step1')}
                </li>
                <li className="flex items-center gap-2">
                  <div className={`
                    w-2 h-2 rounded-full
                    ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'}
                  `}></div>
                  {t('auth.step2')}
                </li>
                <li className="flex items-center gap-2">
                  <div className={`
                    w-2 h-2 rounded-full
                    ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'}
                  `}></div>
                  {t('auth.step3')}
                </li>
                <li className="flex items-center gap-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <strong>{t('auth.checkSpam')}</strong> {t('auth.ifNotSee')}
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className={`
                  flex-1 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2
                  ${theme === 'light' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('auth.sending')}
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    {t('auth.resendEmail')}
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleBackToAuth}
                className={`
                  font-semibold transition-colors flex items-center justify-center gap-2 w-full py-2
                  ${theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'}
                `}
              >
                <ArrowLeft className="w-4 h-4" />
                {t('auth.backTo')} {isLogin ? t('auth.signIn') : t('auth.signUp')}
              </button>
            </div>

            <p className={`
              text-sm py-2 px-3 rounded-lg
              ${theme === 'light' ? 'text-gray-500 bg-gray-50' : 'text-gray-400 bg-gray-700/50'}
            `}>
              💡 <strong>{t('auth.tip')}:</strong> {t('auth.linkExpires')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`
      min-h-screen flex items-center justify-center p-4
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 to-cyan-100' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900'
      }
    `}>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            transition: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
          className={`
            absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl
            ${theme === 'light' ? 'bg-blue-400/20' : 'bg-blue-600/10'}
          `}
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            transition: { duration: 25, repeat: Infinity, ease: "linear" },
          }}
          className={`
            absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl
            ${theme === 'light' ? 'bg-cyan-400/20' : 'bg-cyan-600/10'}
          `}
        />
      </div>

      {showForgotPassword && <ForgotPasswordModal />}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 backdrop-blur-sm
              ${theme === 'light' ? 'bg-white/80' : 'bg-gray-800/80'}
            `}
          >
            <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className={`
              text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent
              ${theme === 'light' 
                ? 'from-blue-600 to-cyan-600' 
                : 'from-blue-400 to-cyan-400'
              }
            `}>
              EliteDrive
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`
              text-4xl lg:text-5xl font-bold mb-6
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}
          >
            {isLogin ? t('auth.welcomeBack') : t('auth.joinEliteDrive')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`
              text-lg mb-8 max-w-md
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}
            `}
          >
            {isLogin
              ? t('auth.loginSubtitle')
              : t('auth.signupSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 mb-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 10 }}
                className={`
                  flex items-center gap-3
                  ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                `}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className={`
                    p-2 rounded-full
                    ${theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/50 text-blue-400'}
                  `}
                >
                  {feature.icon}
                </motion.div>
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-4 max-w-xs"
          >
            <div className="text-center">
              <div className={`
                text-2xl font-bold
                ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
              `}>10K+</div>
              <div className={theme === 'light' ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}>
                {t('auth.customers')}
              </div>
            </div>
            <div className="text-center">
              <div className={`
                text-2xl font-bold
                ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
              `}>4.9★</div>
              <div className={theme === 'light' ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}>
                {t('auth.rating')}
              </div>
            </div>
            <div className="text-center">
              <div className={`
                text-2xl font-bold
                ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}
              `}>50+</div>
              <div className={theme === 'light' ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}>
                {t('auth.vehicles')}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`
            rounded-3xl shadow-2xl border p-8 backdrop-blur-sm
            ${theme === 'light' 
              ? 'bg-white/80 border-white/20' 
              : 'bg-gray-800/80 border-gray-700/20'
            }
          `}
        >
          <motion.div
            layout
            className={`
              flex rounded-2xl p-1 mb-8 relative shadow-inner
              ${theme === 'light' 
                ? 'bg-gradient-to-r from-blue-100 to-cyan-100' 
                : 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30'
              }
            `}
          >
            <motion.button
              layout
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 relative z-10 ${
                isLogin 
                  ? "text-white shadow-lg" 
                  : theme === 'light' ? "text-blue-600 hover:text-blue-700" : "text-blue-400 hover:text-blue-300"
              }`}
            >
              {t('auth.signIn')}
            </motion.button>
            <motion.button
              layout
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 relative z-10 ${
                !isLogin 
                  ? "text-white shadow-lg" 
                  : theme === 'light' ? "text-cyan-600 hover:text-cyan-700" : "text-cyan-400 hover:text-cyan-300"
              }`}
            >
              {t('auth.signUp')}
            </motion.button>
            <motion.div
              layout
              animate={{
                x: isLogin ? 0 : "100%",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-1 w-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg"
            />
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className={`
                  block text-sm font-medium mb-2
                  ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}
                `}>
                  {t('auth.fullName')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300
                      ${theme === 'light' 
                        ? 'border-gray-300' 
                        : 'border-gray-600 bg-gray-700/50 text-white'
                      }
                    `}
                    placeholder={t('auth.enterFullName')}
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className={`
                block text-sm font-medium mb-2
                ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}
              `}>
                {t('auth.emailAddress')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300
                    ${theme === 'light' 
                      ? 'border-gray-300' 
                      : 'border-gray-600 bg-gray-700/50 text-white'
                    }
                  `}
                  placeholder={t('auth.enterEmail')}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className={`
                  block text-sm font-medium mb-2
                  ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}
                `}>
                  {t('auth.phoneNumber')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300
                      ${theme === 'light' 
                        ? 'border-gray-300' 
                        : 'border-gray-600 bg-gray-700/50 text-white'
                      }
                    `}
                    placeholder={t('auth.enterPhone')}
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className={`
                block text-sm font-medium mb-2
                ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}
              `}>
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`
                    w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300
                    ${theme === 'light' 
                      ? 'border-gray-300' 
                      : 'border-gray-600 bg-gray-700/50 text-white'
                    }
                  `}
                  placeholder={t('auth.enterPassword')}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {isLogin && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className={`
                      text-sm font-medium transition-colors
                      ${theme === 'light' 
                        ? 'text-blue-600 hover:text-blue-800' 
                        : 'text-blue-400 hover:text-blue-300'
                      }
                    `}
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className={`
                  block text-sm font-medium mb-2
                  ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}
                `}>
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300
                      ${theme === 'light' 
                        ? 'border-gray-300' 
                        : 'border-gray-600 bg-gray-700/50 text-white'
                      }
                    `}
                    placeholder={t('auth.confirmPassword')}
                    required={!isLogin}
                    minLength={6}
                  />
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className={`
                w-full text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                ${theme === 'light' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLogin ? t('auth.signingIn') : t('auth.creatingAccount')}
                </>
              ) : (
                <>
                  {isLogin ? t('auth.signIn') : t('auth.createAccount')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {isLogin ? (
              <p className={`
                text-center
                ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
              `}>
                {t('auth.noAccount')}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`
                    font-semibold transition-colors
                    ${theme === 'light' 
                      ? 'text-blue-600 hover:text-blue-800' 
                      : 'text-blue-400 hover:text-blue-300'
                    }
                  `}
                >
                  {t('auth.signUp')}
                </button>
              </p>
            ) : (
              <p className={`
                text-center
                ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
              `}>
                {t('auth.haveAccount')}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`
                    font-semibold transition-colors
                    ${theme === 'light' 
                      ? 'text-blue-600 hover:text-blue-800' 
                      : 'text-blue-400 hover:text-blue-300'
                    }
                  `}
                >
                  {t('auth.signIn')}
                </button>
              </p>
            )}

            <div className="relative flex items-center py-4">
              <div className={`
                flex-grow border-t
                ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'}
              `}></div>
              <span className={`
                flex-shrink mx-4 text-sm
                ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}
              `}>
                {t('auth.orContinueWith')}
              </span>
              <div className={`
                flex-grow border-t
                ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'}
              `}></div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`
                w-full p-3 border rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50
                ${theme === 'light' 
                  ? 'border-gray-300 hover:bg-gray-50' 
                  : 'border-gray-600 hover:bg-gray-700/50'
                }
              `}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('auth.continueWithGoogle')}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}