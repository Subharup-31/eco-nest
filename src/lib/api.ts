// API configuration and helper functions for EcoFinds frontend

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api'
  : 'http://localhost:5000/api';

// API response types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{ msg: string; field: string }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth token management
class TokenManager {
  private static TOKEN_KEY = 'ecofinds_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// HTTP client with auth headers
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = TokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Initialize API client
export const api = new ApiClient(API_BASE_URL);
export { TokenManager };

// API service functions
export const authApi = {
  register: (userData: {
    username: string;
    email: string;
    password: string;
    profile?: any;
  }) => api.post('/auth/register', userData),

  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  getCurrentUser: () => api.get('/auth/me'),

  refreshToken: () => api.post('/auth/refresh'),

  logout: () => {
    TokenManager.removeToken();
    return Promise.resolve();
  },
};

export const productsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    sortBy?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return api.get(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => api.get(`/products/${id}`),

  create: (productData: {
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    images: string[];
    tags?: string[];
  }) => api.post('/products', productData),

  update: (id: string, productData: any) => api.put(`/products/${id}`, productData),

  delete: (id: string) => api.delete(`/products/${id}`),

  getMyListings: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return api.get(`/products/user/my-listings${queryString ? `?${queryString}` : ''}`);
  },

  toggleFavorite: (id: string) => api.post(`/products/${id}/favorite`),
};

export const cartApi = {
  get: () => api.get('/cart'),

  addItem: (productId: string, quantity?: number) =>
    api.post('/cart/add', { productId, quantity }),

  updateItem: (itemId: string, quantity: number) =>
    api.put(`/cart/update/${itemId}`, { quantity }),

  removeItem: (itemId: string) => api.delete(`/cart/remove/${itemId}`),

  clear: () => api.delete('/cart/clear'),

  checkout: (data?: {
    shipping?: any;
    paymentMethod?: string;
  }) => api.post('/cart/checkout', data),
};

export const userApi = {
  getProfile: () => api.get('/user/profile'),

  updateProfile: (profileData: {
    username?: string;
    email?: string;
    profile?: any;
  }) => api.put('/user/profile', profileData),

  getOrders: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return api.get(`/user/orders${queryString ? `?${queryString}` : ''}`);
  },

  getOrder: (orderId: string) => api.get(`/user/orders/${orderId}`),

  getSales: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return api.get(`/user/sales${queryString ? `?${queryString}` : ''}`);
  },

  getDashboard: () => api.get('/user/dashboard'),

  getFavorites: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return api.get(`/user/favorites${queryString ? `?${queryString}` : ''}`);
  },
};

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  if (error.message?.includes('401')) {
    // Unauthorized - clear token and redirect to login
    TokenManager.removeToken();
    window.location.href = '/login';
    return;
  }
  
  // Return user-friendly error message
  return error.message || 'An unexpected error occurred';
};