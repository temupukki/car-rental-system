import React, { useState, useEffect } from "react";
import { toast } from "sonner";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  isAvailable: boolean;
  image?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
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
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLicense: string;
  licenseFrontImage: string;
  licenseBackImage: string;
  pickupLocation: string;
  dropoffLocation: string;
  createdAt: string;
  updatedAt: string;
  vehicle: Vehicle;
  user: User;
}

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, dateFilter, searchFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/orders", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
        setError(null);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!orders || !Array.isArray(orders)) {
      setFilteredOrders([]);
      return;
    }

    let filtered = [...orders];

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const filterDate = new Date(dateFilter).toLocaleDateString();
        return orderDate === filterDate;
      });
    }

    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerEmail.toLowerCase().includes(searchLower) ||
          order.vehicle.make.toLowerCase().includes(searchLower) ||
          order.vehicle.model.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower)
      );
    }

    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setDateFilter("");
    setSearchFilter("");
    setShowFilters(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const data = await response.json();

      if (data.success) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success("Order status updated successfully!");
      } else {
        throw new Error(data.error || "Failed to update order status");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status");
    }
  };

  const refreshOrders = async () => {
    await fetchOrders();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Order Management
          </h1>
          <p className="text-gray-600 text-center mt-2 text-sm sm:text-base">
            Manage vehicle rental orders and their status
          </p>
        </div>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-red-800 text-sm sm:text-base">{error}</span>
            <button
              onClick={refreshOrders}
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm w-full sm:w-auto"
            >
              Retry
            </button>
          </div>
        )}

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white border border-gray-300 rounded-lg p-3 flex items-center justify-between shadow-sm"
          >
            <span className="font-medium text-gray-700">Filters</span>
            <span
              className={`transform transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
        </div>

        <div
          className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 ${
            showFilters ? "block" : "hidden lg:block"
          }`}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Filters</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div>
              <label
                htmlFor="search-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                id="search-filter"
                type="text"
                placeholder="Search orders..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as OrderStatus | "")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="date-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Order Date
              </label>
              <input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="flex items-end">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Results
                </label>
                <p className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded border border-gray-300">
                  {filteredOrders.length} orders
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={clearFilters}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm flex-1"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm flex-1"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <p className="text-gray-700 font-medium text-sm sm:text-base">
              Showing {filteredOrders?.length || 0} of {orders?.length || 0}{" "}
              orders
            </p>
            <div className="flex gap-1 text-xs flex-wrap">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Pending:{" "}
                {orders?.filter((o) => o.status === "PENDING").length || 0}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Confirmed:{" "}
                {orders?.filter((o) => o.status === "CONFIRMED").length || 0}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Active:{" "}
                {orders?.filter((o) => o.status === "ACTIVE").length || 0}
              </span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                Completed:{" "}
                {orders?.filter((o) => o.status === "COMPLETED").length || 0}
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                Cancelled:{" "}
                {orders?.filter((o) => o.status === "CANCELLED").length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:hidden space-y-3 mb-6">
          {(filteredOrders?.length || 0) === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-gray-500">
                No orders found matching your filters
              </p>
            </div>
          ) : (
            filteredOrders?.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {order.customerName[0]?.toUpperCase() || "O"}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.vehicle.make} {order.vehicle.model}
                      </div>
                      <code className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                        {order.id.slice(0, 8)}...
                      </code>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <div className="text-xs font-semibold text-gray-900 mt-1">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <label className="text-gray-500 text-xs">Dates</label>
                    <p className="mt-1 text-gray-900 text-xs">
                      {formatDate(order.startDate)} -{" "}
                      {formatDate(order.endDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs">Duration</label>
                    <p className="mt-1 text-gray-900 text-xs">
                      {order.totalDays} days
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-gray-500 text-xs">
                    Pickup Location
                  </label>
                  <p className="mt-1 text-gray-900 text-xs">
                    {order.pickupLocation}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-800 text-xs transition-colors"
                  >
                    View Details
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="text-xs px-2 py-1 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
            )) || []
          )}
        </div>

        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(filteredOrders?.length || 0) === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No orders found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredOrders?.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {order.id.slice(0, 8)}...
                        </code>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-xs">
                              {order.customerName[0]?.toUpperCase() || "C"}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {order.customerName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.customerEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.vehicle.make} {order.vehicle.model}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.vehicle.year}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatDate(order.startDate)}</div>
                        <div>to {formatDate(order.endDate)}</div>
                        <div className="text-xs text-gray-400">
                          {order.totalDays} days
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 transition-colors text-xs mr-3"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )) || []
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={refreshOrders}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
          >
            Refresh Orders
          </button>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Details
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Order Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500">
                          Order ID
                        </label>
                        <p className="text-sm text-gray-900 font-mono">
                          {selectedOrder.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Status</label>
                        <p className="text-sm">
                          <span
                            className={`font-medium px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(
                              selectedOrder.status
                            )}`}
                          >
                            {selectedOrder.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Created</label>
                        <p className="text-sm text-gray-900">
                          {formatDateTime(selectedOrder.createdAt)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Updated</label>
                        <p className="text-sm text-gray-900">
                          {formatDateTime(selectedOrder.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Pricing
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500">
                          Daily Rate
                        </label>
                        <p className="text-sm text-gray-900">
                          {formatCurrency(selectedOrder.dailyRate)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Total Days
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedOrder.totalDays} days
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Total Amount
                        </label>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(selectedOrder.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.customerName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.customerEmail}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.customerPhone}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Customer License</label>
                      <p className="text-sm text-gray-900 font-mono">
                        {selectedOrder.customerLicense || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedOrder.licenseFrontImage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      License Images
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedOrder.licenseFrontImage && (
                        <div>
                          <label className="text-xs text-gray-500">
                            Front License
                          </label>
                          <div className="mt-1">
                            <img
                              src={selectedOrder.licenseFrontImage}
                              alt="License Front"
                              className="w-full h-32 object-cover rounded border border-gray-300"
                            />
                          </div>
                        </div>
                      )}
                      {selectedOrder.licenseBackImage && (
                        <div>
                          <label className="text-xs text-gray-500">
                            Back License
                          </label>
                          <div className="mt-1">
                            <img
                              src={selectedOrder.licenseBackImage}
                              alt="License Back"
                              className="w-full h-32 object-cover rounded border border-gray-300"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Vehicle Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Vehicle</label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.vehicle.make}{" "}
                        {selectedOrder.vehicle.model} (
                        {selectedOrder.vehicle.year})
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        Daily Price
                      </label>
                      <p className="text-sm text-gray-900">
                        {formatCurrency(selectedOrder.vehicle.pricePerDay)}
                      </p>
                    </div>
                    
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Location Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">
                        Pickup Location
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.pickupLocation}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        Drop-off Location
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.dropoffLocation}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Rental Period
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">
                        Start Date
                      </label>
                      <p className="text-sm text-gray-900">
                        {formatDateTime(selectedOrder.startDate)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End Date</label>
                      <p className="text-sm text-gray-900">
                        {formatDateTime(selectedOrder.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   
                    <div>
                      <label className="text-xs text-gray-500">Full Name</label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.user.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">User name</label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.user.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">User Phone</label>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.user.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;