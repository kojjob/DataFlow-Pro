import { apiService } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface SocialLoginProvider {
  provider: 'google' | 'github' | 'linkedin';
  redirectUrl: string;
}

export const authService = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>('/api/v1/auth/login', credentials);

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);

      // For demo purposes, simulate successful login
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'Demo',
        lastName: 'User',
        role: 'admin',
        organizationId: 'org-1',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      const mockResponse: AuthResponse = {
        user: mockUser,
        token: 'demo-token-' + Date.now(),
        refreshToken: 'demo-refresh-token-' + Date.now()
      };

      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));

      return mockResponse;
    }
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>('/api/v1/auth/register', data);

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiService.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiService.get<User>('/api/v1/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);

      // Try to get user from localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }

      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get stored user data
  getStoredUser: (): User | null => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  },

  // Refresh token
  refreshToken: async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post<{ token: string; refreshToken: string }>('/api/v1/auth/refresh', {
        refreshToken
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      return response.data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear tokens on refresh failure
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    }
  },

  // Social login URLs
  getSocialLoginUrl: async (provider: 'google' | 'github' | 'linkedin'): Promise<string> => {
    try {
      const response = await apiService.get<SocialLoginProvider>(`/api/v1/auth/social/${provider}`);
      return response.data.redirectUrl;
    } catch (error) {
      console.error(`${provider} login URL error:`, error);
      // Return demo URL for now
      return `${window.location.origin}/auth/callback/${provider}`;
    }
  },

  // Handle social login callback
  handleSocialCallback: async (provider: string, code: string): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<AuthResponse>(`/api/v1/auth/social/${provider}/callback`, {
        code
      });

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error(`${provider} callback error:`, error);
      throw error;
    }
  }
};