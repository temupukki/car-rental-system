import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Vehicle, VehicleType, CreateVehicleInput, ApiResponse } from '../types/vehicle';

const AdminManageCars: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all'); // 'all', 'available', 'unavailable'
  const [newFeatureInput, setNewFeatureInput] = useState<string>('');
  const [editFeatureInput, setEditFeatureInput] = useState<string>('');

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState<CreateVehicleInput>({
    name: '',
    type: 'SEDAN',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    pricePerDay: 0,
    image: '',
    images: [],
    seats: 5,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    mileage: 'Unlimited',
    features: [],
    location: '',
    isAvailable: true
  });

  // API base URL - adjust this to match your actual API endpoint
  const API_BASE_URL = 'http://localhost:3000/api';

  // Fetch all vehicles
  const fetchVehicles = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Vehicle[]> = await response.json();
      
      if (result.success && result.data) {
        setVehicles(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch vehicles');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching vehicles';
      setError(errorMessage);
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter vehicles based on search and filter
  const filteredVehicles: Vehicle[] = vehicles.filter(vehicle => {
    const matchesSearch: boolean = 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType: boolean = !filterType || vehicle.type === filterType;
    
    const matchesAvailability: boolean = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && vehicle.isAvailable) ||
      (availabilityFilter === 'unavailable' && !vehicle.isAvailable);
    
    return matchesSearch && matchesType && matchesAvailability;
  });

  // Handle create vehicle
  const handleCreateVehicle = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(newVehicle),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
      }

      const result: ApiResponse<Vehicle> = await response.json();

      if (result.success && result.data) {
        setShowAddModal(false);
        // Reset form with all required fields including isAvailable
        setNewVehicle({
          name: '',
          type: 'SEDAN',
          brand: '',
          model: '',
          year: new Date().getFullYear(),
          pricePerDay: 0,
          image: '',
          images: [],
          seats: 5,
          fuelType: 'Gasoline',
          transmission: 'Automatic',
          mileage: 'Unlimited',
          features: [],
          location: '',
          isAvailable: true
        });
        fetchVehicles();
      } else {
        setError(result.error || 'Failed to create vehicle');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create vehicle';
      setError(errorMessage);
      console.error('Error creating vehicle:', err);
    }
  };

  // Handle update vehicle
  const handleUpdateVehicle = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!selectedVehicle) return;

    try {
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/vehicles/${selectedVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(selectedVehicle),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
      }

      const result: ApiResponse<Vehicle> = await response.json();

      if (result.success) {
        setShowEditModal(false);
        setSelectedVehicle(null);
        setEditFeatureInput('');
        fetchVehicles();
      } else {
        setError(result.error || 'Failed to update vehicle');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update vehicle';
      setError(errorMessage);
      console.error('Error updating vehicle:', err);
    }
  };

  // Handle delete vehicle
  const handleDeleteVehicle = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        fetchVehicles();
      } else {
        setError(result.error || 'Failed to delete vehicle');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete vehicle';
      setError(errorMessage);
      console.error('Error deleting vehicle:', err);
    }
  };

  // Handle feature input for new vehicle
  const handleNewFeatureAdd = (): void => {
    if (newFeatureInput.trim()) {
      setNewVehicle(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeatureInput.trim()]
      }));
      setNewFeatureInput('');
    }
  };

  // Handle feature removal for new vehicle
  const handleNewFeatureRemove = (featureToRemove: string): void => {
    setNewVehicle(prev => ({
      ...prev,
      features: (prev.features || []).filter(feature => feature !== featureToRemove)
    }));
  };

  // Handle feature input for edit vehicle
  const handleEditFeatureAdd = (): void => {
    if (editFeatureInput.trim() && selectedVehicle) {
      setSelectedVehicle(prev => prev ? {
        ...prev,
        features: [...(prev.features || []), editFeatureInput.trim()]
      } : null);
      setEditFeatureInput('');
    }
  };

  // Handle feature removal for edit vehicle
  const handleEditFeatureRemove = (featureToRemove: string): void => {
    if (selectedVehicle) {
      setSelectedVehicle(prev => prev ? {
        ...prev,
        features: (prev.features || []).filter(feature => feature !== featureToRemove)
      } : null);
    }
  };

  // Handle feature input key press for new vehicle
  const handleNewFeatureKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNewFeatureAdd();
    }
  };

  // Handle feature input key press for edit vehicle
  const handleEditFeatureKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditFeatureAdd();
    }
  };

  // Open edit modal
  const openEditModal = (vehicle: Vehicle): void => {
    setSelectedVehicle({ ...vehicle });
    setEditFeatureInput('');
    setShowEditModal(true);
  };

  // Handle input changes for new vehicle form
  const handleNewVehicleChange = (
    field: keyof CreateVehicleInput,
    value: string | number | boolean | string[] | VehicleType
  ): void => {
    setNewVehicle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle input changes for edit vehicle form
  const handleEditVehicleChange = (
    field: keyof Vehicle,
    value: string | number | boolean | string[] | VehicleType
  ): void => {
    if (selectedVehicle) {
      setSelectedVehicle(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  // Clear error
  const clearError = (): void => {
    setError('');
  };

  // Get availability count
  const availableCount = vehicles.filter(v => v.isAvailable).length;
  const unavailableCount = vehicles.filter(v => !v.isAvailable).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Management</h1>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>Total: {vehicles.length}</span>
              <span className="text-green-600">Available: {availableCount}</span>
              <span className="text-red-600">Unavailable: {unavailableCount}</span>
            </div>
          </div>
          <Link 
            to="/dashboard/admin/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block mt-4 sm:mt-0"
          >
            Add New Vehicle
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <div className="flex-1">
              <strong className="font-semibold">Error:</strong>
              <span className="ml-2">{error}</span>
            </div>
            <button 
              onClick={clearError}
              className="text-red-500 hover:text-red-700 font-bold text-lg ml-4"
            >
              ×
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search vehicles by name, brand, or model..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select 
              value={filterType} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="HATCHBACK">Hatchback</option>
              <option value="COUPE">Coupe</option>
              <option value="CONVERTIBLE">Convertible</option>
              <option value="TRUCK">Truck</option>
              <option value="VAN">Van</option>
              <option value="MOTORCYCLE">Motorcycle</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select 
              value={availabilityFilter} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAvailabilityFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Vehicles</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚗</div>
              <p className="text-gray-500 text-lg">
                {vehicles.length === 0 ? 'No vehicles found in the database.' : 'No vehicles found matching your criteria.'}
              </p>
              {vehicles.length === 0 && (
                <Link 
                  to="/dashboard/admin/add"
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-block"
                >
                  Add Your First Vehicle
                </Link>
              )}
            </div>
          ) : (
            filteredVehicles.map((vehicle: Vehicle) => (
              <div 
                key={vehicle.id} 
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border-2 ${
                  !vehicle.isAvailable 
                    ? 'border-red-300 bg-red-50 opacity-80' 
                    : 'border-transparent hover:border-blue-200'
                }`}
              >
                {/* Vehicle Image */}
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                    vehicle.isAvailable 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                  {!vehicle.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-lg shadow-lg">
                        CURRENTLY UNAVAILABLE
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Vehicle Info */}
                <div className="p-4">
                  <h3 className={`font-semibold text-lg mb-1 ${
                    !vehicle.isAvailable ? 'text-gray-500' : 'text-gray-900'
                  }`}>
                    {vehicle.name}
                    {!vehicle.isAvailable && (
                      <span className="ml-2 text-xs text-red-500">(Not Available)</span>
                    )}
                  </h3>
                  <p className={`text-sm mb-2 ${
                    !vehicle.isAvailable ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {vehicle.brand} {vehicle.model} • {vehicle.year}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-block text-xs px-2 py-1 rounded ${
                      !vehicle.isAvailable 
                        ? 'bg-gray-200 text-gray-600' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {vehicle.type}
                    </span>
                    <span className={`font-bold ${
                      !vehicle.isAvailable ? 'text-gray-500' : 'text-green-600'
                    }`}>
                      ${vehicle.pricePerDay}/day
                    </span>
                  </div>

                  {/* Vehicle Details */}
                  <div className={`flex flex-wrap gap-2 text-xs mb-3 ${
                    !vehicle.isAvailable ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span>🚗 {vehicle.seats} seats</span>
                    <span>⛽ {vehicle.fuelType}</span>
                    <span>⚙️ {vehicle.transmission}</span>
                  </div>

                  {vehicle.location && (
                    <p className={`text-sm mb-3 flex items-center gap-1 ${
                      !vehicle.isAvailable ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      📍 {vehicle.location}
                    </p>
                  )}

                  {/* Features */}
                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="mb-4">
                      <p className={`text-sm font-medium mb-2 ${
                        !vehicle.isAvailable ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        Features:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {vehicle.features.slice(0, 3).map((feature: string, index: number) => (
                          <span 
                            key={index} 
                            className={`text-xs px-2 py-1 rounded ${
                              !vehicle.isAvailable 
                                ? 'bg-gray-200 text-gray-500' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                        {vehicle.features.length > 3 && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            !vehicle.isAvailable 
                              ? 'bg-gray-200 text-gray-500' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            +{vehicle.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                      onClick={() => openEditModal(vehicle)}
                    >
                      Edit
                    </button>
                    <button 
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Vehicle Modal */}
        {showEditModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Vehicle</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleUpdateVehicle} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={selectedVehicle.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditVehicleChange('name', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={selectedVehicle.type}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        handleEditVehicleChange('type', e.target.value as VehicleType)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="SEDAN">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="HATCHBACK">Hatchback</option>
                      <option value="COUPE">Coupe</option>
                      <option value="CONVERTIBLE">Convertible</option>
                      <option value="TRUCK">Truck</option>
                      <option value="VAN">Van</option>
                      <option value="MOTORCYCLE">Motorcycle</option>
                    </select>
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      value={selectedVehicle.brand}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditVehicleChange('brand', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      value={selectedVehicle.model}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditVehicleChange('model', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Per Day *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={selectedVehicle.pricePerDay}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditVehicleChange('pricePerDay', parseFloat(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image URL *
                    </label>
                    <input
                      type="url"
                      value={selectedVehicle.image}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditVehicleChange('image', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <select
                      value={selectedVehicle.isAvailable.toString()}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        handleEditVehicleChange('isAvailable', e.target.value === 'true')
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={selectedVehicle.location || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditVehicleChange('location', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Features Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add a feature"
                      value={editFeatureInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFeatureInput(e.target.value)}
                      onKeyPress={handleEditFeatureKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button 
                      type="button"
                      onClick={handleEditFeatureAdd}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(selectedVehicle.features || []).map((feature: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                        {feature}
                        <button 
                          type="button" 
                          onClick={() => handleEditFeatureRemove(feature)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Update Vehicle
                  </button>
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