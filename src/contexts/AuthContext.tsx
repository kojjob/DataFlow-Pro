import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '../services/auth';
import { useNotification, NotificationType } from './NotificationContext';
import { NotificationTemplates, notificationService } from '../services/notificationService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, username: string, fullName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // If token is invalid, remove it
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await authService.login({ username, password });
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      // Use comprehensive notification system
      const template = NotificationTemplates.LOGIN_SUCCESS(currentUser.full_name || currentUser.username);
      showNotification(
        template.message,
        'success',
        template.type,
        {
          persistent: false,
          autoHideDuration: 4000,
          metadata: {
            userId: currentUser.id,
            loginTime: new Date().toISOString(),
            details: `Logged in as ${currentUser.email}`
          }
        }
      );

      // Show browser notification if user has granted permission
      notificationService.showNotification(
        template.title,
        template.message,
        template.type,
        { showBrowser: true, playSound: false }
      );
    } catch (error) {
      // Error handling is done in the Login component, but we can add a fallback here
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    fullName: string,
    password: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const newUser = await authService.register({
        email,
        username,
        full_name: fullName,
        password,
      });

      // Auto-login after registration
      await authService.login({ username, password });
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      // Use comprehensive notification system
      const template = NotificationTemplates.LOGIN_SUCCESS(fullName);
      showNotification(
        `Welcome to DataFlow Pro, ${fullName}! Your account has been created successfully.`,
        'success',
        NotificationType.AUTH,
        {
          persistent: false,
          autoHideDuration: 5000,
          metadata: {
            userId: currentUser.id,
            registrationTime: new Date().toISOString(),
            details: `Registered and logged in as ${currentUser.email}`
          }
        }
      );

      // Show browser notification for new registration
      notificationService.showNotification(
        'Registration Successful',
        `Welcome to DataFlow Pro, ${fullName}!`,
        NotificationType.AUTH,
        { showBrowser: true, playSound: false }
      );
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);

      // Use comprehensive notification system
      showNotification(
        'You have been logged out successfully.',
        'info',
        NotificationType.AUTH,
        {
          persistent: false,
          autoHideDuration: 3000,
          metadata: {
            logoutTime: new Date().toISOString(),
            details: 'Logout completed successfully'
          }
        }
      );

      // Show browser notification for logout
      notificationService.showNotification(
        'Logged Out',
        'You have been successfully logged out of DataFlow Pro.',
        NotificationType.AUTH,
        { showBrowser: true, playSound: false }
      );
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      setUser(null);

      showNotification(
        'You have been logged out.',
        'warning',
        NotificationType.AUTH,
        {
          persistent: false,
          autoHideDuration: 3000,
          metadata: {
            logoutTime: new Date().toISOString(),
            details: 'Logout completed with errors',
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;