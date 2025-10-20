export interface PaymentInitiationData {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  checkoutData: CheckoutData;
}

export interface PaymentInitiationResponse {
  success: boolean;
  paymentUrl: string;
  txRef: string;
  message?: string;
}

export interface CheckoutData {
  userInfo: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  cartItems: CartItem[];
  paymentMethod: string;
  totalAmount: number;
  rentalPeriod: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
}

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  model: string;
  pricePerDay: number;
  rentalDays: number;
  totalPrice: number;
  image: string;
  type: string;
  seats: number;
  fuelType: string;
  transmission: string;
  rating: number;
  reviewCount: number;
}