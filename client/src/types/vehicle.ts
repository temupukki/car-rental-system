export type VehicleType = 'SEDAN' | 'SUV' | 'LUXURY' | 'SPORTS' | 'COMPACT' | 'VAN';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type UserRole = 'USER' | 'ADMIN';

export interface Vehicle {
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
  isAvailable: boolean;
  location?: string | null;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleInput {
  name: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  image: string;
  images?: string[];
  seats: number;
  fuelType: string;
  transmission: string;
  mileage?: string;
  features?: string[];
  location?: string;
}

export interface VehicleFilters {
  type?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export interface Order {
  id: string;
  userId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLicense?: string;
  pickupLocation: string;
  dropoffLocation: string;
  createdAt: Date;
  updatedAt: Date;
  vehicle?: Vehicle;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateOrderInput {
  userId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerLicense?: string;
  pickupLocation: string;
  dropoffLocation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  phone?: string;
  licenseNumber?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  licenseNumber?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}