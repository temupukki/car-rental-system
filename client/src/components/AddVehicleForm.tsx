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
  Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
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
    toast.info('Field updated', {
      description: `${field} has been updated.`,
      duration: 1500,
    });
  };

  const handleAddFeature = (feature: string) => {
    if (!feature.trim()) {
      toast.warning('Empty Feature', {
        description: 'Please enter a feature name.',
        duration: 3000,
      });
      return;
    }

    if (formData.features.includes(feature)) {
      toast.info('Feature Already Added', {
        description: `${feature} is already in the list.`,
        duration: 3000,
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      features: [...prev.features, feature]
    }));
    
    toast.success('Feature Added', {
      description: `${feature} has been added to features.`,
      duration: 3000,
    });
    
    setCustomFeature('');
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
    
    toast.info('Feature Removed', {
      description: `${featureToRemove} has been removed from features.`,
      duration: 3000,
    });
  };

  const handleAddCommonFeature = (feature: string) => {
    if (formData.features.includes(feature)) {
      handleRemoveFeature(feature);
    } else {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
      
      toast.success('Feature Added', {
        description: `${feature} has been added to features.`,
        duration: 3000,
      });
    }
  };

  const handleImageUrlValidation = (url: string, field: 'image' | 'images') => {
    if (!url.trim()) return;

    // Simple URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      toast.warning('Invalid URL', {
        description: 'Please enter a valid image URL.',
        duration: 4000,
      });
      return false;
    }

    toast.success('URL Validated', {
      description: 'Image URL format looks good!',
      duration: 2000,
    });
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitToast = toast.loading('Validating vehicle information...', {
      duration: Infinity,
    });

    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.brand || !formData.model || !formData.image) {
        toast.dismiss(submitToast);
        toast.error('Missing Required Fields', {
          description: 'Please fill in all required fields (Name, Brand, Model, Main Image).',
          duration: 5000,
        });
        throw new Error('Please fill in all required fields');
      }

      if (formData.pricePerDay <= 0) {
        toast.dismiss(submitToast);
        toast.error('Invalid Price', {
          description: 'Price per day must be greater than 0.',
          duration: 5000,
        });
        throw new Error('Price per day must be greater than 0');
      }

      if (formData.year < 2000 || formData.year > new Date().getFullYear() + 1) {
        toast.dismiss(submitToast);
        toast.error('Invalid Year', {
          description: `Year must be between 2000 and ${new Date().getFullYear() + 1}.`,
          duration: 5000,
        });
        throw new Error('Invalid year');
      }

      // Validate image URLs
      if (!handleImageUrlValidation(formData.image, 'image')) {
        throw new Error('Invalid main image URL');
      }

      formData.images.forEach((url, index) => {
        if (!handleImageUrlValidation(url, 'images')) {
          throw new Error(`Invalid additional image URL at position ${index + 1}`);
        }
      });

      toast.dismiss(submitToast);
      toast.loading('Adding vehicle to database...', {
        id: submitToast,
      });

      // Ensure we have at least one image
      const images = formData.images.length > 0 ? formData.images : [formData.image];

      const vehicleData: CreateVehicleInput = {
        ...formData,
        images,
        mileage: formData.mileage || 'Unlimited'
      };

      const result = await apiService.createVehicle(vehicleData);
      
      toast.dismiss(submitToast);
      toast.success('🎉 Vehicle Added Successfully!', {
        description: `${result.name} has been added to your rental fleet.`,
        duration: 6000,
        action: {
          label: 'View Details',
          onClick: () => console.log('View vehicle details:', result.id)
        }
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
      
      toast.error('❌ Failed to Add Vehicle', {
        description: errorMessage,
        duration: 6000,
        action: {
          label: 'Try Again',
          onClick: () => handleSubmit(e)
        }
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
    
    toast.info('Form Cleared', {
      description: 'All form fields have been reset.',
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
      
      toast.success('URL Pasted', {
        description: 'Image URL has been pasted from clipboard.',
        duration: 3000,
      });
    } catch (err) {
      toast.error('Clipboard Access Failed', {
        description: 'Unable to read from clipboard.',
        duration: 4000,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`
          shadow-2xl border-0
          ${theme === 'light' 
            ? 'bg-white/95 border-gray-200' 
            : 'bg-gray-800/95 border-gray-700'
          }
        `}>
          <CardHeader className="text-center pb-4">
            <CardTitle className={`
              text-3xl font-bold flex items-center justify-center gap-3
              ${theme === 'light' ? 'text-gray-800' : 'text-white'}
            `}>
              <Car className="w-8 h-8" />
              Add New Vehicle
            </CardTitle>
            <p className={`
              mt-2
              ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
            `}>
              Add a new vehicle to your rental fleet
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">
                    Vehicle Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Toyota Camry 2023"
                    className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="font-semibold">
                    Vehicle Type *
                  </Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: VehicleType) => handleInputChange('type', value)}
                  >
                    <SelectTrigger className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}>
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
                <div className="space-y-2">
                  <Label htmlFor="brand" className="font-semibold">
                    Brand *
                  </Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="e.g., Toyota"
                    className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model" className="font-semibold">
                    Model *
                  </Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., Camry"
                    className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
                    required
                  />
                </div>

                <div className="space-y-2">
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
                    className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
                    required
                  />
                </div>
              </div>

              {/* Pricing & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay" className="font-semibold">
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
                    className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="font-semibold">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Downtown Branch"
                    className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
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
                    className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelType" className="font-semibold">
                    Fuel Type *
                  </Label>
                  <Select 
                    value={formData.fuelType} 
                    onValueChange={(value) => handleInputChange('fuelType', value)}
                  >
                    <SelectTrigger className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}>
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

                <div className="space-y-2">
                  <Label htmlFor="transmission" className="font-semibold">
                    Transmission *
                  </Label>
                  <Select 
                    value={formData.transmission} 
                    onValueChange={(value) => handleInputChange('transmission', value)}
                  >
                    <SelectTrigger className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}>
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

                <div className="space-y-2">
                  <Label htmlFor="mileage" className="font-semibold">
                    Mileage Policy
                  </Label>
                  <Input
                    id="mileage"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    placeholder="e.g., Unlimited"
                    className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <Label className="font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Images
                </Label>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="mainImage" className="text-sm">
                      Main Image URL *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="mainImage"
                        value={formData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        placeholder="https://example.com/car-image.jpg"
                        className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePasteImageUrl('image')}
                      >
                        Paste
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalImages" className="text-sm">
                      Additional Image URLs (one per line)
                    </Label>
                    <Textarea
                      id="additionalImages"
                      value={formData.images.join('\n')}
                      onChange={(e) => handleInputChange('images', e.target.value.split('\n').filter(url => url.trim()))}
                      placeholder="https://example.com/car-image-2.jpg&#10;https://example.com/car-image-3.jpg"
                      rows={3}
                      className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <Label className="font-semibold">Features</Label>
                
                <div className="space-y-3">
                  {/* Custom Feature Input */}
                  <div className="flex gap-2">
                    <Input
                      value={customFeature}
                      onChange={(e) => setCustomFeature(e.target.value)}
                      placeholder="Add a custom feature"
                      className={theme === 'light' ? 'bg-white' : 'bg-gray-700'}
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
                    <Label className="text-sm text-gray-500 mb-2 block">
                      Common Features (Click to add/remove):
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {commonFeatures.map(feature => (
                        <Button
                          key={feature}
                          type="button"
                          variant={formData.features.includes(feature) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAddCommonFeature(feature)}
                          className="text-xs"
                        >
                          {feature}
                          {formData.features.includes(feature) && (
                            <X className="w-3 h-3 ml-1" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Features */}
                  {formData.features.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Selected Features ({formData.features.length}):</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map(feature => (
                          <div
                            key={feature}
                            className={`
                              inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                              ${theme === 'light'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-blue-900/50 text-blue-200 border border-blue-700'
                              }
                            `}
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(feature)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearForm}
                  disabled={loading}
                >
                  Clear Form
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      toast.info('Form Preview', {
                        description: 'Preview functionality coming soon!',
                        duration: 3000,
                      });
                    }}
                    disabled={loading}
                  >
                    Preview
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="min-w-[150px]"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Adding Vehicle...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
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