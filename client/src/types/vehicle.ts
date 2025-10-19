export interface Vehicle {
  id: string;
  name: string;
  type: 'SEDAN' | 'SUV' | 'LUXURY' | 'SPORTS' | 'COMPACT' | 'VAN';
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
  isAvailable: boolean;
  location?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilters {
  type?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}