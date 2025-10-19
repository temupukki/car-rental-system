import type { Vehicle, VehicleFilters, ApiResponse, CreateVehicleInput, Order, CreateOrderInput, User, UpdateUserInput } from '../types/vehicle';

// Update this to match your actual backend port
const API_BASE = 'http://localhost:3000/api';

class ApiService {
  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    console.log('🚀 Making API request to:', url);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }
      
      console.log('✅ API request successful');
      return data.data as T;
    } catch (error) {
      console.error('💥 Fetch error:', error);
      throw error;
    }
  }

  // ==================== VEHICLE METHODS ====================

async getVehicles(filters: { type: string | undefined; search: string | undefined; minPrice: number | undefined; maxPrice: number | undefined; }): Promise<Vehicle[]> {
  const url = `${API_BASE}/vehicles`;
  const response = await this.fetchJson<{ success: boolean; data: Vehicle[] }>(url);
  return response.data;
}

async getVehicle(id: string): Promise<Vehicle> {
  const url = `${API_BASE}/vehicles/${id}`;
  const response = await this.fetchJson<{ success: boolean; data: Vehicle }>(url);
  return response.data;
}



  async createVehicle(vehicleData: CreateVehicleInput): Promise<Vehicle> {
    const dataToSend = {
      name: vehicleData.name || '',
      type: vehicleData.type || 'SEDAN',
      brand: vehicleData.brand || '',
      model: vehicleData.model || '',
      year: vehicleData.year || new Date().getFullYear(),
      pricePerDay: vehicleData.pricePerDay || 0,
      image: vehicleData.image || '',
      images: vehicleData.images || [],
      seats: vehicleData.seats || 5,
      fuelType: vehicleData.fuelType || 'Gasoline',
      transmission: vehicleData.transmission || 'Automatic',
      mileage: vehicleData.mileage || 'Unlimited',
      features: vehicleData.features || [],
      location: vehicleData.location || null
    };

    console.log('📤 Sending vehicle data:', dataToSend);

    return this.fetchJson<Vehicle>(`${API_BASE}/vehicles`, {
      method: 'POST',
      body: JSON.stringify(dataToSend)
    });
  }

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.fetchJson<Vehicle>(`${API_BASE}/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData)
    });
  }

  async deleteVehicle(id: string): Promise<void> {
    await this.fetchJson(`${API_BASE}/vehicles/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== ORDER METHODS ====================

  async getOrders(userId?: string): Promise<Order[]> {
    const url = userId ? `${API_BASE}/orders?userId=${userId}` : `${API_BASE}/orders`;
    return this.fetchJson<Order[]>(url);
  }

  async getOrder(id: string): Promise<Order> {
    return this.fetchJson<Order>(`${API_BASE}/orders/${id}`);
  }

  async createOrder(orderData: CreateOrderInput): Promise<Order> {
    return this.fetchJson<Order>(`${API_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return this.fetchJson<Order>(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async cancelOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'CANCELLED');
  }

  async completeOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, 'COMPLETED');
  }

  // ==================== USER METHODS ====================

  async getUser(id: string): Promise<User> {
    return this.fetchJson<User>(`${API_BASE}/me/${id}`);
  }

  async updateUser(id: string, userData: UpdateUserInput): Promise<User> {
    return this.fetchJson<User>(`${API_BASE}/me/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.fetchJson<Order[]>(`${API_BASE}/me/${userId}/orders`);
  }


  // Check vehicle availability
  async checkVehicleAvailability(vehicleId: string, startDate: string, endDate: string): Promise<boolean> {
    try {
      // Get all active orders for this vehicle
      const orders = await this.getOrders();
      const conflictingOrders = orders.filter(order => 
        order.vehicleId === vehicleId && 
        order.status !== 'CANCELLED' && 
        order.status !== 'COMPLETED'
      );
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      for (const order of conflictingOrders) {
        const orderStart = new Date(order.startDate);
        const orderEnd = new Date(order.endDate);
        
        // Check for date overlap
        if (start < orderEnd && end > orderStart) {
          return false; // Vehicle is not available
        }
      }
      
      return true; // Vehicle is available
    } catch (error) {
      console.error('Error checking vehicle availability:', error);
      return false;
    }
  }

  // Calculate rental price
  calculateRentalPrice(pricePerDay: number, startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return pricePerDay * days;
  }

  // Search vehicles with advanced filters
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
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return this.fetchJson<Vehicle[]>(`${API_BASE}/vehicles?${params}`);
  }
}

export const apiService = new ApiService();