import type {
  Vehicle,
  CreateVehicleInput,
  Order,
  CreateOrderInput,
  User,
  UpdateUserInput,
  PaymentInitiationData,
  PaymentInitiationResponse,
  CartItem,
} from "../types/vehicle";

const API_BASE = "http://localhost:3000/api";

class ApiService {
  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    console.log("🚀 Making API request to:", url);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data.success && data.success !== undefined) {
        throw new Error(data.error || data.message || "API request failed");
      }

      console.log("✅ API request successful");
      return data;
    } catch (error) {
      console.error("💥 Fetch error:", error);
      throw error;
    }
  }

  async initiateChapaPayment(
    paymentData: PaymentInitiationData
  ): Promise<PaymentInitiationResponse> {
    try {
      console.log("💰 Initiating Chapa payment:", paymentData);

      const response = await fetch(`${API_BASE}/payment/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Payment initialization failed"
        );
      }

      return result;
    } catch (error) {
      console.error("💥 Payment initiation error:", error);
      throw error;
    }
  }

  async verifyChapaPayment(txRef: string): Promise<PaymentInitiationResponse> {
    try {
      console.log("🔍 Verifying payment:", txRef);

      const response = await fetch(`${API_BASE}/payment/verify/${txRef}`);

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      return await response.json();
    } catch (error) {
      console.error("💥 Payment verification error:", error);
      throw error;
    }
  }

  private convertUserSessionToUser(userSession: any): User {
    return {
      id: userSession.id,
      name: userSession.name,
      email: userSession.email,
      emailVerified: userSession.emailVerified,
      image: userSession.image,
      phone: userSession.phone,

      role: userSession.role as any,
      createdAt: userSession.createdAt,
      updatedAt: userSession.updatedAt,
    };
  }

  async processCheckoutWithChapa(checkoutData: {
    userInfo: any;
    cartItems: CartItem[];
    totalAmount: number;
    rentalPeriod: {
      startDate: string;
      endDate: string;
      totalDays: number;
    };
  }): Promise<PaymentInitiationResponse> {
    try {
      const { userInfo, cartItems, totalAmount, rentalPeriod } = checkoutData;

      console.log("🔄 Processing checkout with user info:", userInfo);

      const user: User = this.convertUserSessionToUser(userInfo);

      if (!user.phone) {
        throw new Error("Phone number is required for payment");
      }

      const paymentData: PaymentInitiationData = {
        amount: totalAmount,
        email: user.email,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ").slice(1).join(" ") || user.name,
        phoneNumber: user.phone,
        checkoutData: {
          userInfo: user,
          cartItems,
          totalAmount,
          rentalPeriod,
        },
      };

      console.log("📤 Sending payment data to backend:", paymentData);

      return await this.initiateChapaPayment(paymentData);
    } catch (error) {
      console.error("💥 Checkout process error:", error);
      throw error;
    }
  }

  async getVehicles(): Promise<Vehicle[]> {
    const url = `${API_BASE}/vehicles`;
    const response = await this.fetchJson<{
      success: boolean;
      data: Vehicle[];
    }>(url);
    return response.data;
  }

  async getVehicle(id: string): Promise<Vehicle> {
    const url = `${API_BASE}/vehicles/${id}`;
    const response = await this.fetchJson<{ success: boolean; data: Vehicle }>(
      url
    );
    return response.data;
  }

  async createVehicle(vehicleData: CreateVehicleInput): Promise<Vehicle> {
    const dataToSend = {
      name: vehicleData.name || "",
      type: vehicleData.type || "SEDAN",
      brand: vehicleData.brand || "",
      model: vehicleData.model || "",
      year: vehicleData.year || new Date().getFullYear(),
      pricePerDay: vehicleData.pricePerDay || 0,
      image: vehicleData.image || "",
      images: vehicleData.images || [],
      seats: vehicleData.seats || 5,
      fuelType: vehicleData.fuelType || "Gasoline",
      transmission: vehicleData.transmission || "Automatic",
      mileage: vehicleData.mileage || "Unlimited",
      features: vehicleData.features || [],
      location: vehicleData.location || null,
    };

    console.log("📤 Sending vehicle data:", dataToSend);

    return this.fetchJson<Vehicle>(`${API_BASE}/vehicles`, {
      method: "POST",
      body: JSON.stringify(dataToSend),
    });
  }

  async updateVehicle(
    id: string,
    vehicleData: Partial<Vehicle>
  ): Promise<Vehicle> {
    return this.fetchJson<Vehicle>(`${API_BASE}/vehicles/${id}`, {
      method: "PUT",
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id: string): Promise<void> {
    await this.fetchJson(`${API_BASE}/vehicles/${id}`, {
      method: "DELETE",
    });
  }

  async getOrders(userId?: string): Promise<Order[]> {
    const url = userId
      ? `${API_BASE}/orders?userId=${userId}`
      : `${API_BASE}/orders`;
    return this.fetchJson<Order[]>(url);
  }

  async getOrder(id: string): Promise<Order> {
    return this.fetchJson<Order>(`${API_BASE}/orders/${id}`);
  }

  async createOrder(orderData: CreateOrderInput): Promise<Order> {
    return this.fetchJson<Order>(`${API_BASE}/orders`, {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return this.fetchJson<Order>(`${API_BASE}/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async cancelOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, "CANCELLED");
  }

  async completeOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, "COMPLETED");
  }

  async getUser(id: string): Promise<User> {
    return this.fetchJson<User>(`${API_BASE}/me/${id}`);
  }

  async updateUser(id: string, userData: UpdateUserInput): Promise<User> {
    return this.fetchJson<User>(`${API_BASE}/me/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.fetchJson<Order[]>(`${API_BASE}/me/${userId}/orders`);
  }

  async checkVehicleAvailability(
    vehicleId: string,
    startDate: string,
    endDate: string
  ): Promise<boolean> {
    try {
      const orders = await this.getOrders();
      const conflictingOrders = orders.filter(
        (order) =>
          order.vehicleId === vehicleId &&
          order.status !== "CANCELLED" &&
          order.status !== "COMPLETED"
      );

      const start = new Date(startDate);
      const end = new Date(endDate);

      for (const order of conflictingOrders) {
        const orderStart = new Date(order.startDate);
        const orderEnd = new Date(order.endDate);

        if (start < orderEnd && end > orderStart) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error checking vehicle availability:", error);
      return false;
    }
  }

  calculateRentalPrice(
    pricePerDay: number,
    startDate: string,
    endDate: string
  ): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return pricePerDay * days;
  }

  async searchVehicles(filters: {
    type?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    seats?: number;
    fuelType?: string;
    transmission?: string;
  }): Promise<Vehicle[]> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    return this.fetchJson<Vehicle[]>(`${API_BASE}/vehicles?${params}`);
  }
}

export const apiService = new ApiService();
