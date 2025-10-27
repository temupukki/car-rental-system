import { motion } from "framer-motion";
import { useState, useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Car,
  Award,
  CreditCard,
  Gauge,
  Clock,
  Shield,
  Eye,
  EyeOff,
  ClipboardList,
  Plus,
} from "lucide-react";
import { authClient } from "../lib/auth-client";

interface RentalStat {
  label: string;
  value: string | number;
  icon: JSX.Element;
  color: string;
}

interface LoyaltyBadge {
  name: string;
  description: string;
  icon: JSX.Element;
  date: string;
}

interface UserSession {
  user?: {
    name: string;
    email: string;
    image?: string | null;
    createdAt: string;
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [rentalStats, setRentalStats] = useState<RentalStat[]>([]);
  const [loyaltyBadges] = useState<LoyaltyBadge[]>([]);
  const [reservations] = useState<any[]>([]);
  const [paymentMethods] = useState<any[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function fetchAllUserData() {
      try {
        const sessionRes = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });

        if (!sessionRes.ok) throw new Error("Failed to fetch user session");

        const sessionData = await sessionRes.json();
        setSession(sessionData);

        if (sessionData.user) {
          setRentalStats([
            {
              label: "Total Rentals",
              value: "0",
              icon: <Car className="w-5 h-5" />,
              color: "from-red-500 to-pink-500",
            },
            {
              label: "Rental Days",
              value: "0",
              icon: <Clock className="w-5 h-5" />,
              color: "from-green-500 to-emerald-500",
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllUserData();
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate("/");
          },
        },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await authClient.changePassword({
        newPassword: newPassword,
        currentPassword: currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setPasswordError(error.message || "Failed to change password");
        return;
      }

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setPasswordSuccess("");
      }, 5000);
    } catch (err: any) {
      console.error("Password change error:", err);
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const hasImage = session?.user?.image;
  const canChangePassword = !hasImage;

  const tabs = [
    {
      id: "profile",
      label: "Account Details",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "reservations",
      label: "Reservations",
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      id: "payment",
      label: "Payment Methods",
      icon: <CreditCard className="w-4 h-4" />,
    },
    ...(canChangePassword
      ? [
          {
            id: "security",
            label: "Security",
            icon: <Shield className="w-4 h-4" />,
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Warming up the engine...</p>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg"
        >
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Active Rental Session
          </h2>
          <p className="text-gray-600 mb-4">
            Please log in to manage your bookings
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/sign-in")}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold"
          >
            Drive to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            transition: { duration: 25, repeat: Infinity, ease: "linear" },
          }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-red-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            transition: { duration: 30, repeat: Infinity, ease: "linear" },
          }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
              >
                {hasImage ? (
                  <img
                    src={hasImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {session.user?.name?.charAt(0).toUpperCase() || "C"}
                  </div>
                )}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 border-4 border-white rounded-full"
                  title="Loyalty Member"
                />
              </motion.div>

              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {session.user?.name || "Customer"}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>{session.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      Member Since{" "}
                      {new Date(
                        session.user?.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  {hasImage && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600">
                        Loyalty Tier
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {logoutLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full"
                    />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-red-600" />
                Renting History
              </h2>
              <div className="space-y-4">
                {rentalStats.length > 0 ? (
                  rentalStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white`}
                        >
                          {stat.icon}
                        </div>
                        <span className="font-medium text-gray-700">
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {stat.value}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No rental history yet. Start your first trip!
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Loyalty Badges
              </h2>
              <div className="space-y-3">
                {loyaltyBadges.length > 0 ? (
                  loyaltyBadges.map((badge, index) => (
                    <motion.div
                      key={badge.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200"
                    >
                      <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {badge.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {badge.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {badge.date}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No badges earned yet. Keep renting!
                  </p>
                )}
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8"
          >
            <div className="flex overflow-x-auto pb-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Personal and Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600">
                        {session.user?.name || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600">
                        {session.user?.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Driver's License ID
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600">
                        Not Set / Linked
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Phone
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600">
                        Not Set
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "reservations" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Active & Past Reservations
                  </h3>
                  {reservations.length > 0 ? (
                    reservations.map((_reservation, index) => (
                      <div
                        key={index}
                        className="bg-red-50 border border-red-200 rounded-xl p-6"
                      ></div>
                    ))
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                      <Car className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="font-medium text-gray-700">
                        No active or past reservations found.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Ready to book your next ride?
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 text-sm px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium"
                      >
                        Start a New Reservation
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "payment" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Saved Payment Methods
                  </h3>
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((_method, index) => (
                      <div
                        key={index}
                        className="bg-green-50 border border-green-200 rounded-xl p-4"
                      ></div>
                    ))
                  ) : (
                    <div className="text-center py-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                      <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="font-medium text-gray-700">
                        No payment methods saved.
                      </p>
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-5 h-5" /> Add New Payment Method
                  </motion.button>
                </motion.div>
              )}

              {activeTab === "security" && canChangePassword && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Security Settings
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 pr-12"
                          placeholder="Enter current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 pr-12"
                          placeholder="Enter new password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 pr-12"
                          placeholder="Confirm new password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {passwordError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4"
                      >
                        <p className="text-red-700 text-sm">{passwordError}</p>
                      </motion.div>
                    )}

                    {passwordSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-4"
                      >
                        <p className="text-green-700 text-sm">
                          {passwordSuccess}
                        </p>
                      </motion.div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">
                            Security Notice
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Changing your password will log you out of all other
                            devices and sessions for security reasons.
                          </p>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={passwordLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Changing Password...
                        </div>
                      ) : (
                        "Change Password"
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {activeTab === "security" && !canChangePassword && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Password Management Not Available
                  </h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    Your account is managed through social authentication.
                    Password changes are not available for social login
                    accounts.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto">
                    <p className="text-sm text-red-700">
                      To manage your account security, please use the
                      authentication provider (Google, GitHub, etc.) you used to
                      sign up.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
