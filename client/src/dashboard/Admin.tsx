import { Link } from "react-router-dom";
import { Users, DollarSign, HelpCircle, Settings, Car, ReceiptText } from "lucide-react";

export default function Admin() {
  const links = [
    { name: "Manage Users", icon: <Users className="w-6 h-6" />, to: "/dashboard/admin/user" },
    { name: "Orders", icon: <ReceiptText  className="w-6 h-6" />, to: "/dashboard/admin/orders" },
    { name: "Add Cars", icon: <Car className="w-6 h-6" />, to: "/dashboard/admin/add" },

    { name: "Customer Requests", icon: <HelpCircle className="w-6 h-6" />, to: "/dashboard/admin/request" },
    { name: "Settings", icon: <Settings className="w-6 h-6" />, to: "/dashboard/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            {link.icon}
            <span className="font-semibold text-gray-800">{link.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
