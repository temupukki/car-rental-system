import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Car, 
  Upload, 
  Plus, 
  X,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  Shield,
  Zap,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  image: string;
  images: string[];
  seats: number;
  fuelType: string;
  transmission: string;
  mileage: string;
  features: string[];
  location: string;
  stock: number;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

type VehicleType = string;

interface CreateVehicleInput {
  name: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  image: string;
  images: string[];
  seats: number;
  fuelType: string;
  transmission: string;
  mileage: string;
  features: string[];
  location: string;
  stock: number;
  isAvailable?: boolean;
}

interface AddVehicleFormProps {
  onVehicleAdded?: (vehicle: Vehicle) => void;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
}

interface ApiService {
  createVehicle: (data: CreateVehicleInput) => Promise<Vehicle>;
}

const apiService: ApiService = {
  createVehicle: async (data: CreateVehicleInput): Promise<Vehicle> => {
    const response = await fetch('http://localhost:3000/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create vehicle');
    }
    
    return response.json();
  }
};

const ThemeContext = React.createContext<ThemeContextType>({ theme: 'light' });

const useTheme = (): ThemeContextType => {
  return React.useContext(ThemeContext);
};

const fuelTypes: string[] = [
  "Gasoline",
  "Diesel", 
  "Electric",
  "Hybrid",
  "Plug-in Hybrid"
];

const transmissionTypes: string[] = [
  "Automatic",
  "Manual",
  "CVT"
];

const commonVehicleTypes: string[] = [
  'City', 'Vacation', 'Tour', 'Bridal', 'SUV', 'Luxury', 'Sports', 
  'Electric', 'Van', 'Truck', 'Convertible', 'Motorcycle', 'Bus',
  'Minivan', 'Crossover', 'Hatchback', 'Sedan', 'Coupe', 'Wagon'
];

const commonFeatures: string[] = [
  "Air Conditioning",
  "GPS Navigation",
  "Bluetooth",
  "Backup Camera",
  "Leather Seats",
  "Sunroof",
  "Heated Seats",
  "Apple CarPlay",
  "Android Auto",
  "Premium Sound System",
  "Keyless Entry",
  "Push Button Start",
  "All-Wheel Drive",
  "Four-Wheel Drive",
  "Parking Sensors",
  "Lane Assist",
  "Adaptive Cruise Control",
  "Wireless Charging",
  "Panoramic Roof",
  "Third Row Seating"
];

interface StockStatus {
  status: 'out-of-stock' | 'low-stock' | 'in-stock';
  color: string;
  bg: string;
  text: string;
}

export const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ onVehicleAdded }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;
  
  const [formData, setFormData] = useState<CreateVehicleInput>({
    name: '',
    type: '',
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
    stock: 0, // Changed to 0 by default - user must set manually
  });

  const [customFeature, setCustomFeature] = useState<string>('');
  const [customVehicleType, setCustomVehicleType] = useState<string>('');

  const handleInputChange = (field: keyof CreateVehicleInput, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFeature = (feature: string): void => {
    if (!feature.trim()) {
      toast.warning('Please enter a feature name');
      return;
    }

    if (formData.features.includes(feature)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      features: [...prev.features, feature]
    }));
    
    setCustomFeature('');
  };

  const handleRemoveFeature = (featureToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleAddCommonFeature = (feature: string): void => {
    if (formData.features.includes(feature)) {
      handleRemoveFeature(feature);
    } else {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    }
  };

  const handleAddVehicleType = (type: string): void => {
    if (!type.trim()) {
      toast.warning('Please enter a vehicle type');
      return;
    }

    handleInputChange('type', type);
    setCustomVehicleType('');
  };

  const handleRemoveVehicleType = (): void => {
    handleInputChange('type', '');
  };

  const handleAddCommonVehicleType = (type: string): void => {
    handleInputChange('type', type);
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.name.trim() || !formData.brand.trim() || !formData.model.trim() || !formData.type.trim()) {
          toast.error('Missing required fields', {
            description: 'Please fill in vehicle name, brand, model, and type'
          });
          return false;
        }
        if (formData.year < 2000 || formData.year > new Date().getFullYear() + 1) {
          toast.error('Invalid year', {
            description: `Year must be between 2000 and ${new Date().getFullYear() + 1}`
          });
          return false;
        }
        return true;

      case 2: // Specifications
        if (formData.pricePerDay <= 0) {
          toast.error('Invalid price', {
            description: 'Price per day must be greater than 0'
          });
          return false;
        }
        if (formData.seats < 1 || formData.seats > 20) {
          toast.error('Invalid seat count', {
            description: 'Seats must be between 1 and 20'
          });
          return false;
        }
        return true;

      case 3: // Media
        if (!formData.image.trim()) {
          toast.error('Missing main image', {
            description: 'Please provide a main image URL'
          });
          return false;
        }
        return true;

      case 4: // Features
        // Features are optional, so always valid
        return true;

      case 5: // Inventory
        if (formData.stock === undefined || formData.stock < 0) {
          toast.error('Invalid stock quantity', {
            description: 'Stock must be 0 or greater'
          });
          return false;
        }
        // Don't require stock to be > 0 - user can set 0 if they want
        return true;

      default:
        return true;
    }
  };

  const handleNextStep = (): void => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePreviousStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof CreateVehicleInput)[] = ['name', 'brand', 'model', 'image', 'type'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('Missing required fields', {
        description: `Please fill in: ${missingFields.join(', ')}`
      });
      return false;
    }

    if (formData.pricePerDay <= 0) {
      toast.error('Invalid price', {
        description: 'Price per day must be greater than 0'
      });
      return false;
    }

    if (formData.year < 2000 || formData.year > new Date().getFullYear() + 1) {
      toast.error('Invalid year', {
        description: `Year must be between 2000 and ${new Date().getFullYear() + 1}`
      });
      return false;
    }

    if (formData.stock === undefined || formData.stock < 0) {
      toast.error('Invalid stock quantity', {
        description: 'Stock must be 0 or greater'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Additional validation for stock - show warning but allow submission
    if (formData.stock === 0) {
      const userConfirmed = window.confirm(
        'You are setting stock to 0. This vehicle will be marked as unavailable. Do you want to continue?'
      );
      if (!userConfirmed) {
        return;
      }
    }

    const submitToast = toast.loading('Adding your vehicle to the fleet...', {
      duration: Infinity,
    });

    setLoading(true);
    
    try {
      const images = formData.images.length > 0 ? formData.images : [formData.image];

      const vehicleData: CreateVehicleInput = {
        ...formData,
        images,
        mileage: formData.mileage || 'Unlimited',
        stock: formData.stock || 0, // Use the manually set stock
        isAvailable: (formData.stock || 0) > 0 // Set availability based on manual stock
      };

      const result = await apiService.createVehicle(vehicleData);
      
      toast.dismiss(submitToast);
      toast.success('Vehicle Added Successfully! 🎉', {
        description: `${result.name} is now ${result.isAvailable ? 'available' : 'unavailable'} for rental. Stock: ${result.stock} units`,
        duration: 5000,
      });

      setFormData({
        name: '',
        type: '',
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
        stock: 0, // Reset to 0
      });

      setCustomVehicleType('');
      setCurrentStep(1);

      if (onVehicleAdded) {
        onVehicleAdded(result);
      }

    } catch (err) {
      toast.dismiss(submitToast);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add vehicle';
      
      toast.error('Failed to Add Vehicle', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = (): void => {
    setFormData({
      name: '',
      type: '',
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
      stock: 0, // Reset to 0
    });
    setCustomFeature('');
    setCustomVehicleType('');
    setCurrentStep(1);
    
    toast.info('Form cleared', {
      description: 'All fields have been reset',
      duration: 3000,
    });
  };

  const handlePasteImageUrl = async (field: 'image' | 'images'): Promise<void> => {
    try {
      const text = await navigator.clipboard.readText();
      if (field === 'image') {
        setFormData(prev => ({ ...prev, image: text }));
      } else {
        setFormData(prev => ({ ...prev, images: [...prev.images, text] }));
      }
      
      toast.success('URL pasted from clipboard');
    } catch (err) {
      toast.error('Unable to read from clipboard');
    }
  };

  const getStockStatus = (stock: number): StockStatus => {
    if (stock === 0) {
      return { 
        status: 'out-of-stock', 
        color: 'text-red-500', 
        bg: 'bg-red-100', 
        text: 'Out of Stock' 
      };
    } else if (stock <= 3) {
      return { 
        status: 'low-stock', 
        color: 'text-orange-500', 
        bg: 'bg-orange-100', 
        text: 'Low Stock' 
      };
    } else {
      return { 
        status: 'in-stock', 
        color: 'text-green-500', 
        bg: 'bg-green-100', 
        text: 'In Stock' 
      };
    }
  };

  const StepIndicator: React.FC = () => (
    <div className="flex justify-center mb-8">
      <div className={`
        flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-sm
        ${theme === 'light' 
          ? 'bg-white/80 border border-gray-200' 
          : 'bg-gray-800/80 border border-gray-700'
        }
      `}>
        {[1, 2, 3, 4, 5].map((step, index) => (
          <React.Fragment key={step}>
            <button
              onClick={() => setCurrentStep(step)}
              className={`
                flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium transition-all
                ${currentStep >= step
                  ? theme === 'light'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-blue-600 text-white shadow-lg'
                  : theme === 'light'
                    ? 'text-gray-600 hover:text-gray-800 bg-gray-100'
                    : 'text-gray-400 hover:text-white bg-gray-700'
                }
                ${currentStep === step ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
              `}
            >
              {step}
            </button>
            {index < 4 && (
              <div className={`
                w-8 h-1 rounded-full transition-all
                ${currentStep > step
                  ? theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'
                  : theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
                }
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const StepLabels: React.FC = () => (
    <div className="flex justify-between mb-2 px-4">
      {['Basic', 'Specs', 'Media', 'Features', 'Inventory'].map((label, index) => (
        <span
          key={label}
          className={`
            text-xs font-medium transition-all
            ${currentStep === index + 1
              ? theme === 'light' ? 'text-blue-600 font-bold' : 'text-blue-400 font-bold'
              : theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }
          `}
        >
          {label}
        </span>
      ))}
    </div>
  );

  const stockStatus: StockStatus = getStockStatus(formData.stock);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`
          shadow-2xl border-0 overflow-hidden
          ${theme === 'light' 
            ? 'bg-gradient-to-br from-white to-blue-50/30 border-blue-100' 
            : 'bg-gradient-to-br from-gray-800 to-blue-900/20 border-blue-900/30'
          }
        `}>
          <CardHeader className="text-center pb-6 relative overflow-hidden">
            <div className={`
              absolute inset-0 bg-gradient-to-r
              ${theme === 'light' 
                ? 'from-blue-500/5 via-purple-500/5 to-cyan-500/5' 
                : 'from-blue-500/10 via-purple-500/10 to-cyan-500/10'
              }
            `} />
            <CardTitle className={`
              text-3xl font-bold flex items-center justify-center gap-3 relative
              ${theme === 'light' ? 'text-gray-800' : 'text-white'}
            `}>
              <div className={`
                p-3 rounded-2xl
                ${theme === 'light' 
                  ? 'bg-blue-500/10 text-blue-600' 
                  : 'bg-blue-500/20 text-blue-400'
                }
              `}>
                <Car className="w-8 h-8" />
              </div>
              Add New Vehicle
            </CardTitle>
            <p className={`
              mt-3 text-lg relative
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              Step {currentStep} of {totalSteps} - Expand your rental fleet
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-8">
              <StepLabels />
              <StepIndicator />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Information */}
                {(currentStep === 1) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="font-semibold flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          Vehicle Name *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="e.g., Toyota Camry 2023"
                          className={`
                            rounded-xl border-2 transition-all
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-blue-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                            }
                          `}
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="year" className="font-semibold">
                          Year *
                        </Label>
                        <Input
                          id="year"
                          type="number"
                          min="2000"
                          max={new Date().getFullYear() + 1}
                          value={formData.year}
                          onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                          className={`
                            rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-blue-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                            }
                          `}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="brand" className="font-semibold">
                          Brand *
                        </Label>
                        <Input
                          id="brand"
                          value={formData.brand}
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                          placeholder="e.g., Toyota"
                          className={`
                            rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-blue-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                            }
                          `}
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="model" className="font-semibold">
                          Model *
                        </Label>
                        <Input
                          id="model"
                          value={formData.model}
                          onChange={(e) => handleInputChange('model', e.target.value)}
                          placeholder="e.g., Camry"
                          className={`
                            rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-blue-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                            }
                          `}
                          required
                        />
                      </div>
                    </div>

                    {/* Vehicle Type Section - Similar to Features */}
                    <div className="space-y-4">
                      <Label className="font-semibold flex items-center gap-2 text-lg">
                        <Car className="w-5 h-5 text-blue-500" />
                        Vehicle Type *
                      </Label>
                      
                      <div className="space-y-4">
                        {/* Custom Vehicle Type Input */}
                        <div className="flex gap-2">
                          <Input
                            value={customVehicleType}
                            onChange={(e) => setCustomVehicleType(e.target.value)}
                            placeholder="Enter custom vehicle type"
                            className={`
                              rounded-xl border-2
                              ${theme === 'light' 
                                ? 'bg-white border-gray-200 focus:border-blue-500' 
                                : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                              }
                            `}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddVehicleType(customVehicleType);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => handleAddVehicleType(customVehicleType)}
                            className="whitespace-nowrap"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Type
                          </Button>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-3 block">
                            Common Vehicle Types:
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {commonVehicleTypes.map(type => (
                              <Button
                                key={type}
                                type="button"
                                variant={formData.type === type ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleAddCommonVehicleType(type)}
                                className={`
                                  text-xs transition-all
                                  ${formData.type === type 
                                    ? 'bg-blue-500 hover:bg-blue-600' 
                                    : ''
                                  }
                                `}
                              >
                                {type}
                                {formData.type === type && (
                                  <CheckCircle className="w-3 h-3 ml-1" />
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {formData.type && (
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">
                              Selected Vehicle Type:
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`
                                  inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                                  border-2 transition-all cursor-pointer hover:scale-105
                                  ${theme === 'light'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                                    : 'bg-blue-900/50 text-blue-200 border-blue-600 hover:bg-blue-900/70'
                                  }
                                `}
                              >
                                <CheckCircle className="w-4 h-4" />
                                {formData.type}
                                <button
                                  type="button"
                                  onClick={handleRemoveVehicleType}
                                  className={`
                                    hover:scale-110 transition-transform p-1 rounded
                                    ${theme === 'light' 
                                      ? 'hover:bg-red-100 hover:text-red-600' 
                                      : 'hover:bg-red-900/50 hover:text-red-400'
                                    }
                                  `}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </motion.div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Specifications */}
                {(currentStep === 2) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="pricePerDay" className="font-semibold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-green-500" />
                          Price Per Day ($) *
                        </Label>
                        <Input
                          id="pricePerDay"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.pricePerDay}
                          onChange={(e) => handleInputChange('pricePerDay', parseFloat(e.target.value))}
                          placeholder="0.00"
                          className={`
                            rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-green-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-green-500'
                            }
                          `}
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="location" className="font-semibold">
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g., Downtown Branch"
                          className={`
                            rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-blue-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                            }
                          `}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="seats" className="font-semibold">
                          Seats *
                        </Label>
                        <Input
                          id="seats"
                          type="number"
                          min="1"
                          max="20"
                          value={formData.seats}
                          onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                          className={`
                            rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-blue-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                            }
                          `}
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="fuelType" className="font-semibold">
                          Fuel Type *
                        </Label>
                        <Select 
                          value={formData.fuelType} 
                          onValueChange={(value) => handleInputChange('fuelType', value)}
                        >
                          <SelectTrigger className={`
                            rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-blue-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                            }
                          `}>
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fuelTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="transmission" className="font-semibold">
                          Transmission *
                        </Label>
                        <Select 
                          value={formData.transmission} 
                          onValueChange={(value) => handleInputChange('transmission', value)}
                        >
                          <SelectTrigger className={`
                            rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-blue-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                            }
                          `}>
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                          <SelectContent>
                            {transmissionTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="mileage" className="font-semibold">
                          Mileage Policy
                        </Label>
                        <Input
                          id="mileage"
                          value={formData.mileage}
                          onChange={(e) => handleInputChange('mileage', e.target.value)}
                          placeholder="e.g., Unlimited"
                          className={`
                            rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-blue-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                            }
                          `}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Media */}
                {(currentStep === 3) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label className="font-semibold flex items-center gap-2 text-lg">
                        <ImageIcon className="w-5 h-5 text-purple-500" />
                        Vehicle Images
                      </Label>
                      
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="mainImage" className="text-sm font-medium">
                            Main Image URL *
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="mainImage"
                              value={formData.image}
                              onChange={(e) => handleInputChange('image', e.target.value)}
                              placeholder="https://example.com/car-image.jpg"
                              className={`
                                rounded-xl border-2 flex-1
                                ${theme === 'light' 
                                  ? 'bg-white border-gray-200 focus:border-purple-500' 
                                  : 'bg-gray-700 border-gray-600 focus:border-purple-500'
                                }
                              `}
                              required
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handlePasteImageUrl('image')}
                              className="whitespace-nowrap"
                            >
                              Paste
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="additionalImages" className="text-sm font-medium">
                            Additional Image URLs (one per line)
                          </Label>
                          <Textarea
                            id="additionalImages"
                            value={formData.images.join('\n')}
                            onChange={(e) => handleInputChange('images', e.target.value.split('\n').filter(url => url.trim()))}
                            placeholder="https://example.com/car-image-2.jpg&#10;https://example.com/car-image-3.jpg"
                            rows={4}
                            className={`
                              rounded-xl border-2 resize-none
                              ${theme === 'light' 
                                ? 'bg-white border-gray-200 focus:border-purple-500' 
                                : 'bg-gray-700 border-gray-600 focus:border-purple-500'
                              }
                            `}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Features */}
                {(currentStep === 4) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label className="font-semibold flex items-center gap-2 text-lg">
                        <Shield className="w-5 h-5 text-cyan-500" />
                        Vehicle Features
                      </Label>
                      
                      <div className="space-y-4">
                        {/* Custom Feature Input */}
                        <div className="flex gap-2">
                          <Input
                            value={customFeature}
                            onChange={(e) => setCustomFeature(e.target.value)}
                            placeholder="Add a custom feature"
                            className={`
                              rounded-xl border-2
                              ${theme === 'light' 
                                ? 'bg-white border-gray-200 focus:border-cyan-500' 
                                : 'bg-gray-700 border-gray-600 focus:border-cyan-500'
                              }
                            `}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddFeature(customFeature);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => handleAddFeature(customFeature)}
                            className="whitespace-nowrap"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-3 block">
                            Quick Add Features:
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {commonFeatures.map(feature => (
                              <Button
                                key={feature}
                                type="button"
                                variant={formData.features.includes(feature) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleAddCommonFeature(feature)}
                                className={`
                                  text-xs transition-all
                                  ${formData.features.includes(feature) 
                                    ? 'bg-cyan-500 hover:bg-cyan-600' 
                                    : ''
                                  }
                                `}
                              >
                                {feature}
                                {formData.features.includes(feature) && (
                                  <CheckCircle className="w-3 h-3 ml-1" />
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {formData.features.length > 0 && (
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">
                              Selected Features ({formData.features.length})
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {formData.features.map(feature => (
                                <motion.div
                                  key={feature}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className={`
                                    inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm
                                    border transition-all cursor-pointer hover:scale-105
                                    ${theme === 'light'
                                      ? 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100'
                                      : 'bg-cyan-900/50 text-cyan-200 border-cyan-700 hover:bg-cyan-900/70'
                                    }
                                  `}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  {feature}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(feature)}
                                    className={`
                                      hover:scale-110 transition-transform
                                      ${theme === 'light' ? 'hover:text-red-600' : 'hover:text-red-400'}
                                    `}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Inventory */}
                {(currentStep === 5) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <Label className="font-semibold flex items-center gap-2 text-lg">
                        <Package className="w-5 h-5 text-orange-500" />
                        Inventory Management
                      </Label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <Label htmlFor="stock" className="font-semibold flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-500" />
                              Stock Quantity *
                            </Label>
                            <Input
                              id="stock"
                              type="number"
                              min="0"
                              value={formData.stock}
                              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                              placeholder="Enter number of units"
                              className={`
                                rounded-xl border-2 text-lg font-semibold
                                ${theme === 'light' 
                                  ? 'bg-white border-gray-200 focus:border-blue-500' 
                                  : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                                }
                              `}
                              required
                            />
                            <p className={`
                              text-sm
                              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                            `}>
                              Set to 0 if vehicle is currently unavailable
                            </p>
                          </div>

                          <div className={`
                            p-4 rounded-xl border-2 transition-all
                            ${theme === 'light' 
                              ? stockStatus.bg + ' border-gray-200' 
                              : 'bg-gray-800 border-gray-700'
                            }
                          `}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`
                                  p-2 rounded-lg
                                  ${theme === 'light' ? stockStatus.bg : 'bg-gray-700'}
                                `}>
                                  {stockStatus.status === 'out-of-stock' && (
                                    <AlertTriangle className={`w-5 h-5 ${stockStatus.color}`} />
                                  )}
                                  {stockStatus.status === 'low-stock' && (
                                    <AlertCircle className={`w-5 h-5 ${stockStatus.color}`} />
                                  )}
                                  {stockStatus.status === 'in-stock' && (
                                    <CheckCircle className={`w-5 h-5 ${stockStatus.color}`} />
                                  )}
                                </div>
                                <div>
                                  <p className={`font-semibold ${stockStatus.color}`}>
                                    {stockStatus.text}
                                  </p>
                                  <p className={`
                                    text-sm
                                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                                  `}>
                                    {formData.stock} unit{formData.stock !== 1 ? 's' : ''} available
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`
                                  text-2xl font-bold
                                  ${stockStatus.color}
                                `}>
                                  {formData.stock}
                                </p>
                                <p className={`
                                  text-xs
                                  ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                                `}>
                                  units
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className={`
                            p-4 rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-blue-900/20 border-blue-700/30'
                            }
                          `}>
                            <h4 className="font-semibold flex items-center gap-2 mb-3">
                              <Sparkles className="w-4 h-4 text-blue-500" />
                              Stock Guidelines
                            </h4>
                            <ul className={`
                              space-y-2 text-sm
                              ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
                            `}>
                              <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span><strong>0 units:</strong> Vehicle will be marked as unavailable</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span><strong>1-3 units:</strong> Low stock warning</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span><strong>4+ units:</strong> Healthy stock level</span>
                              </li>
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-medium">
                              Quick Stock Actions:
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {[0, 1, 3, 5, 10].map(quantity => (
                                <Button
                                  key={quantity}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleInputChange('stock', quantity)}
                                  className={`
                                    text-xs
                                    ${formData.stock === quantity ? 'bg-blue-500 text-white' : ''}
                                  `}
                                >
                                  Set to {quantity}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              
              <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearForm}
                  disabled={loading}
                  className="rounded-xl"
                >
                  Clear Form
                </Button>
                
                <div className="flex items-center gap-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      disabled={loading}
                      className="rounded-xl"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      disabled={loading}
                      className={`
                        rounded-xl min-w-[120px] font-semibold text-lg py-3
                        bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
                        text-white shadow-lg hover:shadow-xl transition-all
                      `}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className={`
                        rounded-xl min-w-[160px] font-semibold text-lg py-3
                        bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600
                        text-white shadow-lg hover:shadow-xl transition-all
                      `}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Add Vehicle
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};