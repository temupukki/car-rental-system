import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, type JSX, useRef } from "react";
import {
  Menu,
  X,
  Car,
  Users,
  Phone,
  User,
  LayoutDashboard,
  ChevronDown,
  ClipboardList,
  CarTaxiFront,
  Shield,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";

const useSession = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch /api/me");

        const data = await res.json();
        setSession(data);
      } catch (err) {
        console.error("Error fetching /api/me:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  return { session, loading };
};

export default function DNavbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { session, loading } = useSession();
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (location.pathname === "/sign-in") {
    return null;
  }

  const guestNavItems = [
    { path: "/", label: t("nav.home"), icon: <Car className="w-4 h-4" /> },
    {
      path: "/vehicles",
      label: t("nav.vehicles"),
    },
    {
      path: "/about",
      label: t("nav.about"),
    },
    {
      path: "/contact",
      label: t("nav.contact"),
      icon: <Phone className="w-4 h-4" />,
    },
    { path: "/sign-in", label: t("nav.book"), highlight: true },
  ];

  const baseUserNavItems = [
    {
      path: "/dashboard",
      label: t("nav.dashboard"),
    },
    {
      path: "/dashboard/vehicles",
      label: t("nav.vehicles"),
    },
    {
      path: "/dashboard/bookings",
      label: t("nav.myBookings"),
    },
     {
      path: "/dashboard/contact",
      label: t("nav.contact"),
    },
  ];

  const adminNavItems = [
    {
      path: "/dashboard/admin",
      label: t("nav.admin"),
      icon: <Shield className="w-4 h-4" />,
    },
  ];

  const getUserNavItems = () => {
    if (!session) return guestNavItems;

    const userRole = session.user?.role;

    let navItems = [...baseUserNavItems];

    if (userRole === "ADMIN") {
      navItems = [...navItems, ...adminNavItems];
    }

    return navItems;
  };

  const navItems = getUserNavItems();

  const getUserInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getFirstName = (name: string) => {
    if (!name) return t("user.defaultName");
    return name.split(" ")[0];
  };

  const getUsername = (email: string) => {
    if (!email) return "user";
    return email.split("@")[0];
  };

  const getUserRoleDisplay = () => {
    if (!session?.user?.role) return "";

    const role = session.user.role;
    switch (role) {
      case "USER":
        return t("user.roles.customer");
      case "ADMIN":
        return t("user.roles.administrator");
      default:
        return role;
    }
  };

  const isAdmin = session?.user?.role === "ADMIN";
  const userRoleDisplay = getUserRoleDisplay();

  if (loading) {
    return (
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          sticky top-0 z-50 shadow-sm border-b p-3 backdrop-blur-md
          ${
            theme === "light"
              ? "bg-white/95 border-gray-200"
              : "bg-gray-900/95 border-gray-700"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-full border-2 ${
                  theme === "light"
                    ? "border-blue-600 bg-gray-300"
                    : "border-blue-400 bg-gray-600"
                } animate-pulse`}
              />
              <div
                className={`h-6 w-32 ${
                  theme === "light" ? "bg-gray-300" : "bg-gray-600"
                } rounded animate-pulse`}
              />
            </div>
            <div className="hidden md:flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-10 w-20 ${
                    theme === "light" ? "bg-gray-300" : "bg-gray-600"
                  } rounded-full animate-pulse`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.nav>
    );
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`
          sticky top-0 z-50 shadow-sm border-b p-3 backdrop-blur-md
          ${
            theme === "light"
              ? "bg-white/95 border-gray-200"
              : "bg-gray-900/95 border-gray-700"
          }
          ${scrolled ? "shadow-lg" : ""}
        `}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 1.25 }}
                className="flex-shrink-0"
              >
                <img
                  src="/pppp.png"
                  alt="EliteDrive Car Rental Logo"
                  className="h-40 w-44 mt-4"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 1.18 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <h1
                  className={`
                  text-xl font-bold
                  ${theme === "light" ? "text-gray-900" : "text-white"}
                `}
                >
                  {t("company.name")}
                </h1>
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center space-x-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`
                      relative font-medium transition-colors duration-200 px-3 py-2 rounded-lg flex items-center gap-2
                      ${
                        location.pathname === item.path
                          ? theme === "light"
                            ? "text-blue-600 bg-blue-50"
                            : "text-blue-400 bg-blue-900/30"
                          : theme === "light"
                          ? "text-gray-700 hover:text-blue-500 hover:bg-gray-50"
                          : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                      }
                    `}
                  >
                    {item.label}
                    {location.pathname === item.path && (
                      <motion.div
                        className={`
                          absolute bottom-0 left-0 w-full h-0.5 rounded-full
                          ${theme === "light" ? "bg-blue-600" : "bg-blue-400"}
                        `}
                        layoutId="activeIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              <LanguageToggle />
              <ThemeToggle />

              {session ? (
                <motion.div
                  ref={userDropdownRef}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 border
                      ${
                        theme === "light"
                          ? "bg-gray-50 hover:bg-gray-100 border-gray-200"
                          : "bg-gray-800 hover:bg-gray-700 border-gray-600"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {getUserInitials(
                          session.user?.name || session.user?.email
                        )}
                      </div>
                      <div className="text-left">
                        <p
                          className={`font-semibold text-sm leading-tight ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {getFirstName(
                            session.user?.name || session.user?.email
                          )}
                          {isAdmin && (
                            <Shield className="w-3 h-3 text-blue-600 inline ml-1" />
                          )}
                        </p>
                        <p
                          className={`text-xs leading-tight ${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {getUsername(session.user?.email)}
                          {userRoleDisplay && ` • ${userRoleDisplay}`}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown
                        className={`w-4 h-4 ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}
                      />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`
                          absolute top-full right-0 mt-2 w-64 backdrop-blur-sm rounded-xl shadow-lg border overflow-hidden
                          ${
                            theme === "light"
                              ? "bg-white border-gray-200"
                              : "bg-gray-800 border-gray-600"
                          }
                        `}
                      >
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-lg font-bold">
                              {getUserInitials(
                                session.user?.name || session.user?.email
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold flex items-center gap-2">
                                {session.user?.name || t("user.defaultName")}
                                {isAdmin && (
                                  <Shield className="w-4 h-4 text-blue-200" />
                                )}
                              </p>
                              <p className="text-sm text-white/80">
                                {session.user?.email}
                                {userRoleDisplay && (
                                  <span className="block text-xs text-blue-200">
                                    {userRoleDisplay}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <Link
                            to="/dashboard/profile"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className={`
                              flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group
                              ${
                                theme === "light"
                                  ? "text-gray-700 hover:bg-blue-50"
                                  : "text-gray-300 hover:bg-blue-900/30"
                              }
                            `}
                          >
                            <div
                              className={`
                              p-2 rounded-lg transition-colors
                              ${
                                theme === "light"
                                  ? "bg-blue-100 group-hover:bg-blue-200"
                                  : "bg-blue-900/50 group-hover:bg-blue-800"
                              }
                            `}
                            >
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{t("user.profile")}</p>
                            </div>
                          </Link>

                          <Link
                            to="/dashboard"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className={`
                              flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group
                              ${
                                theme === "light"
                                  ? "text-gray-700 hover:bg-green-50"
                                  : "text-gray-300 hover:bg-green-900/30"
                              }
                            `}
                          >
                            <div
                              className={`
                              p-2 rounded-lg transition-colors
                              ${
                                theme === "light"
                                  ? "bg-green-100 group-hover:bg-green-200"
                                  : "bg-green-900/50 group-hover:bg-green-800"
                              }
                            `}
                            >
                              <LayoutDashboard className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {t("nav.dashboard")}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Link
                    to="/sign-in"
                    className={`
                      px-6 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center gap-2
                      ${
                        theme === "light"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }
                    `}
                  >
                    {t("nav.book")}
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-3 lg:hidden">
              <LanguageToggle />
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`
                  p-2 rounded-lg font-bold text-xl
                  ${theme === "light" ? "text-gray-700" : "text-gray-300"}
                `}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      className="w-6 h-6 flex items-center justify-center"
                    >
                      ✕
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      className="w-6 h-6 flex items-center justify-center"
                    >
                      ☰
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`
                lg:hidden fixed top-20 left-4 right-4 shadow-2xl rounded-xl border z-50 overflow-hidden backdrop-blur-sm
                ${
                  theme === "light"
                    ? "bg-white/95 border-gray-200"
                    : "bg-gray-900/95 border-gray-700"
                }
              `}
            >
              <div className="p-4 flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        block py-3 px-4 font-medium rounded-lg transition-all duration-200 flex items-center gap-3 mx-2
                        ${
                          location.pathname === item.path
                            ? theme === "light"
                              ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                              : "text-blue-400 bg-blue-900/30 border-l-4 border-blue-400"
                            : theme === "light"
                            ? "text-gray-700 hover:text-blue-500 hover:bg-gray-50 hover:border-l-4 hover:border-blue-200"
                            : "text-gray-300 hover:text-blue-400 hover:bg-gray-800 hover:border-l-4 hover:border-blue-600"
                        }
                      `}
                    >
                      <motion.span
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
                {session ? (
                  <>
                    <div
                      className={`border-t pt-4 mt-2 ${
                        theme === "light"
                          ? "border-gray-200"
                          : "border-gray-700"
                      }`}
                    >
                      <div
                        className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl mb-3
                        ${theme === "light" ? "bg-gray-50" : "bg-gray-800"}
                      `}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {getUserInitials(
                            session.user?.name || session.user?.email
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold flex items-center gap-2 ${
                              theme === "light" ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {session.user?.name || t("user.defaultName")}
                            {isAdmin && (
                              <Shield className="w-3 h-3 text-blue-600" />
                            )}
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                          >
                            {session.user?.email}
                            {userRoleDisplay && (
                              <span className="block text-xs text-blue-600">
                                {userRoleDisplay}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                          ${
                            theme === "light"
                              ? "text-gray-700 hover:bg-blue-50"
                              : "text-gray-300 hover:bg-blue-900/30"
                          }
                        `}
                      >
                        <User className="w-4 h-4" />
                        {t("user.profile")}
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                          ${
                            theme === "light"
                              ? "text-gray-700 hover:bg-blue-50"
                              : "text-gray-300 hover:bg-blue-900/30"
                          }
                        `}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {t("nav.dashboard")}
                      </Link>
                    </div>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="pt-2 px-2"
                  >
                    <Link
                      to="/sign-in"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        w-full py-3 rounded-lg font-semibold shadow-lg text-center block
                        ${
                          theme === "light"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }
                      `}
                    >
                      {t("nav.book")}
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
