import type { Vehicle, VehicleFilters, ApiResponse } from '../types/vehicle';

const API_BASE = 'http://localhost:3000/api';

class ApiService {
  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    const data: ApiResponse<T> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data.data as T;
  }

  // Vehicles
  async getVehicles(filters: VehicleFilters = {}): Promise<Vehicle[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return this.fetchJson<Vehicle[]>(`${API_BASE}/vehicles?${params}`);
  }

  async getVehicle(id: string): Promise<Vehicle> {
    return this.fetchJson<Vehicle>(`${API_BASE}/vehicles/${id}`);
  }

  // Orders
  async createOrder(orderData: any): Promise<any> {
    return this.fetchJson(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
  }

  async getOrders(userId?: string): Promise<any[]> {
    const url = userId ? `${API_BASE}/orders?userId=${userId}` : `${API_BASE}/orders`;
    return this.fetchJson<any[]>(url);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return this.fetchJson(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }

  // Users
  async getUser(id: string): Promise<any> {
    return this.fetchJson(`${API_BASE}/me/${id}`);
  }

  async updateUser(id: string, userData: any): Promise<any> {
    return this.fetchJson(`${API_BASE}/me/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  }

  async getUserOrders(userId: string): Promise<any[]> {
    return this.fetchJson<any[]>(`${API_BASE}/me/${userId}/orders`);
  }
}

export const apiService = new ApiService();