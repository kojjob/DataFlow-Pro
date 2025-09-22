import { apiService } from './api';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'user' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface RegisterData {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const authService = {
  async register(data: RegisterData): Promise<User> {
    const response = await apiService.post<User>('/api/v1/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthToken> {
    // Convert to form data for OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await apiService.post<AuthToken>('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Store token in localStorage
    localStorage.setItem('token', response.data.access_token);

    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/api/v1/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiService.post('/api/v1/auth/logout');
    } catch (error) {
      // Ignore errors from logout endpoint
      console.warn('Logout endpoint failed:', error);
    } finally {
      // Always remove token from localStorage
      localStorage.removeItem('token');
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiService.post('/api/v1/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  async updateProfile(data: Partial<Pick<User, 'full_name' | 'avatar_url'>>): Promise<User> {
    const response = await apiService.put<User>('/api/v1/auth/me', data);
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};

export default authService;