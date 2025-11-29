import { VehicleType, OrderStatus, Userrole } from "../src/generated/prisma";

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
  location?: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleInput {
  stock: any;
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
  mileage?: string;
  features: string[];
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
  licenseExpiry:Date;
  licenseFrontImage:string;
  licenseBackImage:string;
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
  role: Userrole;
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

export interface VehicleFilters {
  type?: VehicleType;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export interface ChapaInitiateRequest {
  amount: string;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization: {
    title: string;
    description: string;
  };
}

export interface ChapaInitiateResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
  };
}

export interface ChapaCallbackPayload {
  trx_ref: string;
  ref_id: string;
  status: string;
}

export interface ChapaVerifyResponse {
  status: string;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    currency: string;
    amount: number;
    charge: number;
    mode: string;
    method: string;
    type: string;
    status: string;
    reference: string;
    tx_ref: string;
    customization: any;
    created_at: string;
    updated_at: string;
  };
}

export interface CheckoutData {
  userInfo: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  cartItems: Array<{
    id: string;
    name: string;
    brand: string;
    model: string;
    pricePerDay: number;
    rentalDays: number;
    totalPrice: number;
    image: string;
  }>;
  paymentMethod: string;
  totalAmount: number;
  rentalPeriod: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
}

export interface PaymentInitiateRequest {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  checkoutData: CheckoutData;
}