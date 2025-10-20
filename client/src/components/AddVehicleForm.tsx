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
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from '../services/api';
import type { CreateVehicleInput, VehicleType } from '../types/vehicle';
import { useTheme } from './ThemeContext';
import { toast } from 'sonner';

interface AddVehicleFormProps {
  onVehicleAdded?: (vehicle: any) => void;
}

const fuelTypes = [
  "Gasoline",
  "Diesel", 
  "Electric",
  "Hybrid",
  "Plug-in Hybrid"
];

const transmissionTypes = [
  "Automatic",
  "Manual",
  "CVT"
];

const commonFeatures = [
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

export const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ onVehicleAdded }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('basic');
  
  const [formData, setFormData] = useState<CreateVehicleInput>({
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
  });

  const [customFeature, setCustomFeature] = useState<string>('');

  const handleInputChange = (field: keyof CreateVehicleInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFeature = (feature: string) => {
    if (!feature.trim()) {
      toast.warning('Please enter a feature name');
      return;
    }

    if (formData.features.includes(feature)) {
      return; // Silent fail for duplicates
    }

    setFormData(prev => ({
      ...prev,
      features: [...prev.features, feature]
    }));
    
    setCustomFeature('');
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleAddCommonFeature = (feature: string) => {
    if (formData.features.includes(feature)) {
      handleRemoveFeature(feature);
    } else {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    }
  };

  const validateForm = (): boolean => {
    // Required fields validation
    const requiredFields = ['name', 'brand', 'model', 'image'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof CreateVehicleInput]);
    
    if (missingFields.length > 0) {
      toast.error('Missing required fields', {
        description: `Please fill in: ${missingFields.join(', ')}`
      });
      return false;
    }

    // Price validation
    if (formData.pricePerDay <= 0) {
      toast.error('Invalid price', {
        description: 'Price per day must be greater than 0'
      });
      return false;
    }

    // Year validation
    if (formData.year < 2000 || formData.year > new Date().getFullYear() + 1) {
      toast.error('Invalid year', {
        description: `Year must be between 2000 and ${new Date().getFullYear() + 1}`
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitToast = toast.loading('Adding your vehicle to the fleet...', {
      duration: Infinity,
    });

    setLoading(true);
    
    try {
      // Ensure we have at least one image
      const images = formData.images.length > 0 ? formData.images : [formData.image];

      const vehicleData: CreateVehicleInput = {
        ...formData,
        images,
        mileage: formData.mileage || 'Unlimited'
      };

      const result = await apiService.createVehicle(vehicleData);
      
      toast.dismiss(submitToast);
      toast.success('Vehicle Added Successfully! 🎉', {
        description: `${result.name} is now available for rental.`,
        duration: 5000,
      });

      // Reset form
      setFormData({
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
      });

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

  const handleClearForm = () => {
    setFormData({
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
    });
    setCustomFeature('');
    
    toast.info('Form cleared', {
      description: 'All fields have been reset',
      duration: 3000,
    });
  };

  const handlePasteImageUrl = async (field: 'image' | 'images') => {
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

  const SectionIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className={`
        flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-sm
        ${theme === 'light' 
          ? 'bg-white/80 border border-gray-200' 
          : 'bg-gray-800/80 border border-gray-700'
        }
      `}>
        {['basic', 'specs', 'media', 'features'].map((section, index) => (
          <React.Fragment key={section}>
            <button
              onClick={() => setActiveSection(section)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${activeSection === section
                  ? theme === 'light'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-blue-600 text-white shadow-lg'
                  : theme === 'light'
                    ? 'text-gray-600 hover:text-gray-800'
                    : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
            {index < 3 && (
              <div className={`
                w-1 h-1 rounded-full
                ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

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
          {/* Header with Gradient */}
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
              Expand your rental fleet with a new vehicle
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <SectionIndicator />
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {/* Basic Information */}
                {(activeSection === 'basic') && (
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
                        <Label htmlFor="type" className="font-semibold">
                          Vehicle Type *
                        </Label>
                        <Select 
                          value={formData.type} 
                          onValueChange={(value: VehicleType) => handleInputChange('type', value)}
                        >
                          <SelectTrigger className={`
                            rounded-xl border-2
                            ${theme === 'light' 
                              ? 'bg-white border-gray-200 focus:border-blue-500' 
                              : 'bg-gray-700 border-gray-600 focus:border-blue-500'
                            }
                          `}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SEDAN">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="LUXURY">Luxury</SelectItem>
                            <SelectItem value="SPORTS">Sports</SelectItem>
                            <SelectItem value="COMPACT">Compact</SelectItem>
                            <SelectItem value="VAN">Van</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  </motion.div>
                )}

                {/* Specifications */}
                {(activeSection === 'specs') && (
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

                {/* Media */}
                {(activeSection === 'media') && (
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

                {/* Features */}
                {(activeSection === 'features') && (
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

                        {/* Common Features */}
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

                        {/* Selected Features */}
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
              </AnimatePresence>

              {/* Navigation & Action Buttons */}
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
                  <div className="flex gap-2">
                    {['basic', 'specs', 'media', 'features'].map((section, index) => (
                      <button
                        key={section}
                        type="button"
                        onClick={() => setActiveSection(section)}
                        className={`
                          w-3 h-3 rounded-full transition-all
                          ${activeSection === section
                            ? theme === 'light'
                              ? 'bg-blue-500'
                              : 'bg-blue-400'
                            : theme === 'light'
                              ? 'bg-gray-300'
                              : 'bg-gray-600'
                          }
                        `}
                      />
                    ))}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className={`
                      rounded-xl min-w-[160px] font-semibold text-lg py-3
                      bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
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
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};