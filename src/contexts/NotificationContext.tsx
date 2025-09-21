import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor, Stack, Box, IconButton } from '@mui/material';

export interface Notification {
  id: string;
  message: string;
  severity: AlertColor;
  type: NotificationType;
  timestamp: Date;
  persistent?: boolean;
  autoHideDuration?: number;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  read?: boolean;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'text' | 'outlined' | 'contained';
}

export enum NotificationType {
  SYSTEM = 'system',
  AUTH = 'auth',
  DATA = 'data',
  ETL = 'etl',
  AI_INSIGHT = 'ai_insight',
  COLLABORATION = 'collaboration',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  BILLING = 'billing',
  USER_ACTION = 'user_action'
}

interface NotificationContextType {
  notifications: Notification[];
  activeNotification: Notification | null;
  unreadCount: number;
  showNotification: (
    message: string,
    severity?: AlertColor,
    type?: NotificationType,
    options?: Partial<Notification>
  ) => string;
  hideNotification: (id?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
  defaultAutoHideDuration?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 100,
  defaultAutoHideDuration = 6000
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  // Generate unique notification ID
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Show notification function
  const showNotification = useCallback((
    message: string,
    severity: AlertColor = 'info',
    type: NotificationType = NotificationType.SYSTEM,
    options: Partial<Notification> = {}
  ): string => {
    const id = generateId();
    const notification: Notification = {
      id,
      message,
      severity,
      type,
      timestamp: new Date(),
      autoHideDuration: defaultAutoHideDuration,
      read: false,
      ...options
    };

    setNotifications(prev => {
      const updated = [notification, ...prev];
      // Limit notifications to maxNotifications
      return updated.slice(0, maxNotifications);
    });

    // Set as active notification for toast display
    if (!notification.persistent) {
      setActiveNotification(notification);
    }

    return id;
  }, [generateId, defaultAutoHideDuration, maxNotifications]);

  // Hide active notification
  const hideNotification = useCallback((id?: string) => {
    if (id) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
    setActiveNotification(null);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Clear specific notification
  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (activeNotification?.id === id) {
      setActiveNotification(null);
    }
  }, [activeNotification]);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setActiveNotification(null);
  }, []);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: NotificationType) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Auto-hide handler for active notification
  const handleActiveNotificationClose = useCallback((
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setActiveNotification(null);
  }, []);

  // Auto-hide timer for active notification
  useEffect(() => {
    if (activeNotification && !activeNotification.persistent) {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, activeNotification.autoHideDuration || defaultAutoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [activeNotification, defaultAutoHideDuration]);

  const contextValue: NotificationContextType = {
    notifications,
    activeNotification,
    unreadCount,
    showNotification,
    hideNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getNotificationsByType
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      {/* Active notification toast */}
      {activeNotification && (
        <Snackbar
          open={true}
          autoHideDuration={activeNotification.persistent ? null : activeNotification.autoHideDuration}
          onClose={handleActiveNotificationClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleActiveNotificationClose}
            severity={activeNotification.severity}
            sx={{
              width: '100%',
              '& .MuiAlert-action': {
                alignItems: 'flex-start'
              }
            }}
            variant="filled"
            action={
              activeNotification.actions && (
                <Stack direction="row" spacing={1} sx={{ ml: 1 }}>
                  {activeNotification.actions.map((action, index) => (
                    <IconButton
                      key={index}
                      size="small"
                      onClick={() => {
                        action.action();
                        if (!activeNotification.persistent) {
                          setActiveNotification(null);
                        }
                      }}
                      sx={{ color: 'inherit' }}
                    >
                      {action.label}
                    </IconButton>
                  ))}
                </Stack>
              )
            }
          >
            <Box>
              <Box component="span" sx={{ fontWeight: 'medium' }}>
                {activeNotification.message}
              </Box>
              {activeNotification.metadata?.details && (
                <Box component="div" sx={{ fontSize: '0.875rem', opacity: 0.9, mt: 0.5 }}>
                  {activeNotification.metadata.details}
                </Box>
              )}
            </Box>
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;