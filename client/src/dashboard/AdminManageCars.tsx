import React, { useState, useEffect } from 'react';

const AdminVehiclesManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
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

  // Fetch all vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vehicles');
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setVehicles(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch vehicles');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter vehicles based on search and filter
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || vehicle.type === filterType;
    return matchesSearch && matchesType;
  });

  // Handle create vehicle
  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVehicle),
      });

      const result = await response.json();

      if (result.success) {
        setShowAddModal(false);
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
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create vehicle');
      console.error('Error creating vehicle:', err);
    }
  };

  // Handle update vehicle
  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/vehicles/${selectedVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedVehicle),
      });

      const result = await response.json();

      if (result.success) {
        setShowEditModal(false);
        setSelectedVehicle(null);
        fetchVehicles();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update vehicle');
      console.error('Error updating vehicle:', err);
    }
  };

  // Handle delete vehicle
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        fetchVehicles();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to delete vehicle');
      console.error('Error deleting vehicle:', err);
    }
  };

  // Handle feature input for new vehicle
  const handleFeatureAdd = (feature) => {
    if (feature.trim() && !newVehicle.features.includes(feature.trim())) {
      setNewVehicle(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
    }
  };

  // Handle feature removal for new vehicle
  const handleFeatureRemove = (featureToRemove) => {
    setNewVehicle(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  // Open edit modal
  const openEditModal = (vehicle) => {
    setSelectedVehicle({ ...vehicle });
    setShowEditModal(true);
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Vehicle Management</h1>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            onClick={() => setShowAddModal(true)}
          >
            Add New Vehicle
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 font-bold text-lg"
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-64">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
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
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚗</div>
              <p className="text-gray-500 text-lg">No vehicles found matching your criteria.</p>
            </div>
          ) : (
            filteredVehicles.map(vehicle => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                {/* Vehicle Image */}
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                    vehicle.isAvailable 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                </div>
                
                {/* Vehicle Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{vehicle.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{vehicle.brand} {vehicle.model} • {vehicle.year}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {vehicle.type}
                    </span>
                    <span className="font-bold text-green-600">${vehicle.pricePerDay}/day</span>
                  </div>

                  {/* Vehicle Details */}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                    <span>🚗 {vehicle.seats} seats</span>
                    <span>⛽ {vehicle.fuelType}</span>
                    <span>⚙️ {vehicle.transmission}</span>
                  </div>

                  {vehicle.location && (
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      📍 {vehicle.location}
                    </p>
                  )}

                  {/* Features */}
                  {vehicle.features.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {vehicle.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {vehicle.features.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
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

        {/* Add Vehicle Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateVehicle} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, name: e.target.value }))}
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
                      value={newVehicle.type}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, type: e.target.value }))}
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
                      value={newVehicle.brand}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, brand: e.target.value }))}
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
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      value={newVehicle.pricePerDay}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, pricePerDay: parseFloat(e.target.value) }))}
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
                      value={newVehicle.image}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Seats */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seats
                    </label>
                    <input
                      type="number"
                      value={newVehicle.seats}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, seats: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Type
                    </label>
                    <select
                      value={newVehicle.fuelType}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, fuelType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transmission
                    </label>
                    <select
                      value={newVehicle.transmission}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, transmission: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  {/* Mileage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mileage
                    </label>
                    <input
                      type="text"
                      value={newVehicle.mileage}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, mileage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newVehicle.location}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Add a feature and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleFeatureAdd(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newVehicle.features.map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                        {feature}
                        <button 
                          type="button" 
                          onClick={() => handleFeatureRemove(feature)}
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
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Vehicle Modal */}
        {showEditModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full">
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
                      onChange={(e) => setSelectedVehicle(prev => ({ ...prev, name: e.target.value }))}
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
                      onChange={(e) => setSelectedVehicle(prev => ({ ...prev, pricePerDay: parseFloat(e.target.value) }))}
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
                      onChange={(e) => setSelectedVehicle(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Availability */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <select
                      value={selectedVehicle.isAvailable}
                      onChange={(e) => setSelectedVehicle(prev => ({ ...prev, isAvailable: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={true}>Available</option>
                      <option value={false}>Unavailable</option>
                    </select>
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