import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Car,
  DollarSign,
  Package,
  MapPin,
  Users,
  Fuel,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  Camera,
  Save,
} from "lucide-react";
import type { Vehicle, VehicleType, ApiResponse } from "../types/vehicle";

const fuelTypes: string[] = [
  "Gasoline",
  "Diesel",
  "Electric",
  "Hybrid",
  "Plug-in Hybrid",
];

const transmissionTypes: string[] = ["Automatic", "Manual", "CVT"];

const commonVehicleTypes: string[] = [
  'City', 'Vacation', 'Tour', 'Bridal', 'SUV', 'Luxury', 'Sports', 
  'Electric', 'Van', 'Truck', 'Convertible', 'Motorcycle', 'Bus',
  'Minivan', 'Crossover', 'Hatchback', 'Sedan', 'Coupe', 'Wagon'
];

interface StockStatus {
  status: "out-of-stock" | "low-stock" | "in-stock";
  color: string;
  bg: string;
  text: string;
}

const AdminManageCars: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [customVehicleType, setCustomVehicleType] = useState<string>("");
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  const API_BASE_URL = "http://localhost:3000/api";

  const fetchVehicles = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/vehicles/all`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Vehicle[]> = await response.json();

      if (result.success && result.data) {
        setVehicles(result.data);
        calculateStats(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch vehicles");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching vehicles";
      setError(errorMessage);
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (vehiclesData: Vehicle[]): void => {
    const total = vehiclesData.length;
    const available = vehiclesData.filter((v) => v.isAvailable).length;
    const unavailable = vehiclesData.filter((v) => !v.isAvailable).length;
    const lowStock = vehiclesData.filter(
      (v) => v.stock > 0 && v.stock <= 3
    ).length;
    const outOfStock = vehiclesData.filter((v) => v.stock === 0).length;
    const totalValue = vehiclesData.reduce(
      (sum, vehicle) => sum + vehicle.pricePerDay * vehicle.stock,
      0
    );

    setStats({
      total,
      available,
      unavailable,
      lowStock,
      outOfStock,
      totalValue,
    });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles: Vehicle[] = vehicles
    .filter((vehicle) => {
      const matchesSearch =
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !filterType || vehicle.type === filterType;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && vehicle.isAvailable) ||
        (availabilityFilter === "unavailable" && !vehicle.isAvailable);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && vehicle.stock > 0) ||
        (stockFilter === "low-stock" &&
          vehicle.stock > 0 &&
          vehicle.stock <= 3) ||
        (stockFilter === "out-of-stock" && vehicle.stock === 0);

      const matchesPrice =
        vehicle.pricePerDay >= priceRange[0] &&
        vehicle.pricePerDay <= priceRange[1];

      return (
        matchesSearch &&
        matchesType &&
        matchesAvailability &&
        matchesStock &&
        matchesPrice
      );
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Vehicle];
      let bValue: any = b[sortBy as keyof Vehicle];

      if (sortBy === "pricePerDay" || sortBy === "stock" || sortBy === "year") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleQuickAction = async (
    vehicleId: string,
    action: string,
    value?: any
  ): Promise<void> => {
    try {
      setError("");
      let endpoint = "";
      let method = "PATCH";
      let body: any = {};

      switch (action) {
        case "toggle-availability":
          endpoint = `${API_BASE_URL}/vehicles/${vehicleId}`;
          body = { isAvailable: value };
          break;
        case "update-stock":
          endpoint = `${API_BASE_URL}/vehicles/${vehicleId}/stock`;
          body = { stock: value, operation: "set" };
          break;
        case "update-price":
          endpoint = `${API_BASE_URL}/vehicles/${vehicleId}`;
          body = { pricePerDay: value };
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        fetchVehicles();
      } else {
        throw new Error(result.error || `Failed to ${action}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to perform ${action}`;
      setError(errorMessage);
      console.error(`Error performing ${action}:`, err);
    }
  };

  const handleDeleteVehicle = async (id: string): Promise<void> => {
    if (
      !window.confirm(
        "Are you sure you want to delete this vehicle? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        fetchVehicles();
      } else {
        setError(result.error || "Failed to delete vehicle");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete vehicle";
      setError(errorMessage);
      console.error("Error deleting vehicle:", err);
    }
  };

  const handleUpdateVehicle = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!selectedVehicle) return;

    try {
      setError("");

      const updatedVehicle = {
        ...selectedVehicle,
        images: additionalImages,
      };

      const response = await fetch(
        `${API_BASE_URL}/vehicles/${selectedVehicle.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedVehicle),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setShowEditModal(false);
        setSelectedVehicle(null);
        setImagePreview("");
        setAdditionalImages([]);
        setNewFeature("");
        setNewImageUrl("");
        setCustomVehicleType("");
        fetchVehicles();
      } else {
        setError(result.error || "Failed to update vehicle");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update vehicle";
      setError(errorMessage);
      console.error("Error updating vehicle:", err);
    }
  };

  const openEditModal = (vehicle: Vehicle): void => {
    setSelectedVehicle({ ...vehicle });
    setImagePreview(vehicle.image);
    setAdditionalImages(vehicle.images || []);
    setCustomVehicleType("");
    setShowEditModal(true);
  };

  const handleEditVehicleChange = (
    field: keyof Vehicle,
    value: string | number | boolean | string[] | VehicleType
  ): void => {
    if (selectedVehicle) {
      setSelectedVehicle((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  const handleImageChange = (value: string): void => {
    if (selectedVehicle) {
      setSelectedVehicle((prev) => (prev ? { ...prev, image: value } : null));
      setImagePreview(value);
    }
  };

  const handleAddAdditionalImage = (): void => {
    if (newImageUrl.trim()) {
      setAdditionalImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveAdditionalImage = (index: number): void => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFeature = (): void => {
    if (newFeature.trim() && selectedVehicle) {
      const updatedFeatures = [
        ...(selectedVehicle.features || []),
        newFeature.trim(),
      ];
      setSelectedVehicle((prev) =>
        prev ? { ...prev, features: updatedFeatures } : null
      );
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number): void => {
    if (selectedVehicle) {
      const updatedFeatures = (selectedVehicle.features || []).filter(
        (_, i) => i !== index
      );
      setSelectedVehicle((prev) =>
        prev ? { ...prev, features: updatedFeatures } : null
      );
    }
  };

 
  const handleAddVehicleType = (type: string): void => {
    if (!type.trim()) {
      return;
    }
    handleEditVehicleChange("type", type);
    setCustomVehicleType("");
  };

  const handleRemoveVehicleType = (): void => {
    handleEditVehicleChange("type", "");
  };

  const handleAddCommonVehicleType = (type: string): void => {
    handleEditVehicleChange("type", type);
  };

  const clearError = (): void => {
    setError("");
  };

  const getStockStatus = (stock: number): StockStatus => {
    if (stock === 0)
      return {
        status: "out-of-stock",
        color: "text-red-500",
        bg: "bg-red-100",
        text: "Out of Stock",
      };
    if (stock <= 3)
      return {
        status: "low-stock",
        color: "text-orange-500",
        bg: "bg-orange-100",
        text: "Low Stock",
      };
    return {
      status: "in-stock",
      color: "text-green-500",
      bg: "bg-green-100",
      text: "In Stock",
    };
  };


  const closeModal = (): void => {
    setShowEditModal(false);
    setSelectedVehicle(null);
    setImagePreview("");
    setAdditionalImages([]);
    setNewFeature("");
    setNewImageUrl("");
    setCustomVehicleType("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading vehicle inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Vehicle Inventory
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your rental fleet and stock levels
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/admin/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add New Vehicle
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">Total Vehicles</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.available}
                </p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <EyeOff className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.unavailable}
                </p>
                <p className="text-sm text-gray-600">Unavailable</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.lowStock}
                </p>
                <p className="text-sm text-gray-600">Low Stock</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.outOfStock}
                </p>
                <p className="text-sm text-gray-600">Out of Stock</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ETB {stats.totalValue}
                </p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2 flex-1">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 font-bold text-lg ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={filterType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterType(e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {commonVehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={availabilityFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setAvailabilityFilter(e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div>
              <select
                value={stockFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStockFilter(e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ETB {priceRange[0]} - ETB {priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="10000000"
                step="100"
                value={priceRange[1]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPriceRange([0, parseInt(e.target.value)])
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="pricePerDay">Price</option>
                <option value="stock">Stock</option>
                <option value="year">Year</option>
                <option value="createdAt">Date Added</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortOrder(e.target.value as "asc" | "desc")
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVehicles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                {vehicles.length === 0
                  ? "No vehicles in your inventory."
                  : "No vehicles found matching your criteria."}
              </p>
              {vehicles.length === 0 && (
                <Link
                  to="/dashboard/admin/add"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Vehicle
                </Link>
              )}
            </div>
          ) : (
            filteredVehicles.map((vehicle) => {
              const stockStatus = getStockStatus(vehicle.stock);

              return (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-2 border-transparent hover:border-blue-200"
                >
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.bg} ${stockStatus.color}`}
                      >
                        {vehicle.stock} in stock
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          vehicle.isAvailable
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {vehicle.isAvailable ? "Available" : "Unavailable"}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {vehicle.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {vehicle.brand} {vehicle.model} • {vehicle.year}
                        </p>
                      </div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {vehicle.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>ETB {vehicle.pricePerDay}/day</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{vehicle.seats} seats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-3 h-3" />
                        <span>{vehicle.fuelType}</span>
                      </div>
                    </div>

                    {vehicle.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{vehicle.location}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Stock:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuickAction(
                                vehicle.id,
                                "update-stock",
                                Math.max(0, vehicle.stock - 1)
                              )
                            }
                            className="w-6 h-6 bg-red-500 text-white rounded text-sm font-bold hover:bg-red-600"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold w-8 text-center">
                            {vehicle.stock}
                          </span>
                          <button
                            onClick={() =>
                              handleQuickAction(
                                vehicle.id,
                                "update-stock",
                                vehicle.stock + 1
                              )
                            }
                            className="w-6 h-6 bg-green-500 text-white rounded text-sm font-bold hover:bg-green-600"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Price:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuickAction(
                                vehicle.id,
                                "update-price",
                                Math.max(0, vehicle.pricePerDay - 10)
                              )
                            }
                            className="w-6 h-6 bg-red-500 text-white rounded text-sm font-bold hover:bg-red-600"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold">
                            ETB {vehicle.pricePerDay}
                          </span>
                          <button
                            onClick={() =>
                              handleQuickAction(
                                vehicle.id,
                                "update-price",
                                vehicle.pricePerDay + 10
                              )
                            }
                            className="w-6 h-6 bg-green-500 text-white rounded text-sm font-bold hover:bg-green-600"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Status:
                        </span>
                        <button
                          onClick={() =>
                            handleQuickAction(
                              vehicle.id,
                              "toggle-availability",
                              !vehicle.isAvailable
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            vehicle.isAvailable
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          {vehicle.isAvailable ? "Available" : "Unavailable"}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openEditModal(vehicle)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {showEditModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Vehicle - {selectedVehicle.name}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateVehicle} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Main Image
                      </label>
                      <div className="space-y-3">
                        <div className="relative h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Vehicle preview"
                              className="w-full h-full object-cover rounded-lg"
                              onError={() =>
                                setImagePreview(
                                  "https://via.placeholder.com/400x300?text=Invalid+Image"
                                )
                              }
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                              <Camera className="w-12 h-12 mb-2" />
                              <p>No image selected</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={selectedVehicle.image}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleImageChange(e.target.value)}
                            placeholder="Enter image URL"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              navigator.clipboard
                                .readText()
                                .then((text) => handleImageChange(text))
                            }
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Paste
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Additional Images
                      </label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={newImageUrl}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setNewImageUrl(e.target.value)}
                            placeholder="Enter image URL"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={handleAddAdditionalImage}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Add
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {additionalImages.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Additional ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "https://via.placeholder.com/150x100?text=Invalid+Image";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveAdditionalImage(index)
                                }
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Features
                      </label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newFeature}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setNewFeature(e.target.value)}
                            placeholder="Add a feature"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e: React.KeyboardEvent) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddFeature();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddFeature}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Add
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(selectedVehicle.features || []).map(
                            (feature, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                              >
                                {feature}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFeature(index)}
                                  className="text-blue-600 hover:text-blue-800 font-bold text-lg leading-none"
                                >
                                  ×
                                </button>
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Name *
                        </label>
                        <input
                          type="text"
                          value={selectedVehicle.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEditVehicleChange("name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Brand *
                        </label>
                        <input
                          type="text"
                          value={selectedVehicle.brand}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEditVehicleChange("brand", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Model *
                        </label>
                        <input
                          type="text"
                          value={selectedVehicle.model}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEditVehicleChange("model", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year *
                        </label>
                        <input
                          type="number"
                          min="1900"
                          max="2030"
                          value={selectedVehicle.year}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEditVehicleChange(
                              "year",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* Vehicle Type Section - Custom Input */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Vehicle Type *
                      </label>
                      
                      <div className="space-y-4">
                        {/* Custom Vehicle Type Input */}
                        <div className="flex gap-2">
                          <input
                            value={customVehicleType}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setCustomVehicleType(e.target.value)
                            }
                            placeholder="Enter custom vehicle type"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e: React.KeyboardEvent) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddVehicleType(customVehicleType);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddVehicleType(customVehicleType)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                          >
                            Add Type
                          </button>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-3 block">
                            Common Vehicle Types:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {commonVehicleTypes.map(type => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => handleAddCommonVehicleType(type)}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                  selectedVehicle.type === type 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {type}
                                {selectedVehicle.type === type && (
                                  <CheckCircle className="w-3 h-3 ml-1 inline" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {selectedVehicle.type && (
                          <div className="space-y-3">
                            <label className="text-sm font-medium">
                              Selected Vehicle Type:
                            </label>
                            <div className="flex flex-wrap gap-2">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200">
                                <CheckCircle className="w-4 h-4" />
                                {selectedVehicle.type}
                                <button
                                  type="button"
                                  onClick={handleRemoveVehicleType}
                                  className="text-blue-600 hover:text-blue-800 font-bold text-lg leading-none ml-2"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Per Day (ETB) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={selectedVehicle.pricePerDay}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEditVehicleChange(
                              "pricePerDay",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={selectedVehicle.stock}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEditVehicleChange(
                              "stock",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Seats *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={selectedVehicle.seats}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEditVehicleChange(
                              "seats",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Doors
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={selectedVehicle.doors || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEditVehicleChange(
                              "doors",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mileage (MPG)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={selectedVehicle.mileage || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEditVehicleChange(
                              "mileage",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fuel Type
                        </label>
                        <select
                          value={selectedVehicle.fuelType}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleEditVehicleChange("fuelType", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Fuel Type</option>
                          {fuelTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Transmission
                        </label>
                        <select
                          value={selectedVehicle.transmission}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleEditVehicleChange(
                              "transmission",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Transmission</option>
                          {transmissionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={selectedVehicle.location || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleEditVehicleChange("location", e.target.value)
                        }
                        placeholder="Enter vehicle location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={selectedVehicle.description || ""}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          handleEditVehicleChange("description", e.target.value)
                        }
                        rows={4}
                        placeholder="Enter vehicle description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        checked={selectedVehicle.isAvailable}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleEditVehicleChange(
                            "isAvailable",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="isAvailable"
                        className="text-sm font-medium text-gray-700"
                      >
                        Available for rental
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        Update Vehicle
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageCars;