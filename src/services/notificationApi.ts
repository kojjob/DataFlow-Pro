import api from './api';
import { NotificationType } from '../contexts/NotificationContext';

export interface NotificationCreateRequest {
  type: NotificationType;
  severity?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  details?: Record<string, any>;
  action_url?: string;
  action_label?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  persistent?: boolean;
  show_browser?: boolean;
  play_sound?: boolean;
  priority?: number;
  expires_at?: string;
}

export interface NotificationResponse {
  id: string;
  user_id: number;
  organization_id?: number;
  type: NotificationType;
  severity: 'info' | 'success' | 'warning' | 'error';
  status: 'unread' | 'read' | 'archived';
  title: string;
  message: string;
  details?: Record<string, any>;
  action_url?: string;
  action_label?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  created_at: string;
  read_at?: string;
  archived_at?: string;
  persistent: boolean;
  show_browser: boolean;
  play_sound: boolean;
  priority: number;
  expires_at?: string;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  total: number;
  unread_count: number;
  page: number;
  page_size: number;
}

class NotificationAPI {
  private baseUrl = '/api/v1/notifications';
  private ws: WebSocket | null = null;
  private userId: number | null = null;

  // Initialize WebSocket connection for real-time notifications
  connectWebSocket(userId: number, onMessage: (notification: any) => void) {
    this.userId = userId;
    const wsUrl = `ws://localhost:8000${this.baseUrl}/ws/${userId}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('Connected to notification WebSocket');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from notification WebSocket');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (this.userId) {
          this.connectWebSocket(this.userId, onMessage);
        }
      }, 3000);
    };
  }

  // Disconnect WebSocket
  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.userId = null;
  }

  // Create a new notification
  async createNotification(data: NotificationCreateRequest): Promise<NotificationResponse> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  // Get notifications for current user
  async getNotifications(params?: {
    page?: number;
    page_size?: number;
    status?: 'unread' | 'read' | 'archived';
    type?: NotificationType;
  }): Promise<NotificationListResponse> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  // Get single notification
  async getNotification(id: string): Promise<NotificationResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<NotificationResponse> {
    const response = await api.put(`${this.baseUrl}/${id}/read`);
    return response.data;
  }

  // Mark multiple notifications as read
  async markMultipleAsRead(notificationIds: string[]): Promise<{ updated_count: number }> {
    const response = await api.post(`${this.baseUrl}/mark-as-read`, {
      notification_ids: notificationIds
    });
    return response.data;
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ updated_count: number }> {
    const response = await api.post(`${this.baseUrl}/mark-all-as-read`);
    return response.data;
  }

  // Archive notification
  async archiveNotification(id: string): Promise<NotificationResponse> {
    const response = await api.put(`${this.baseUrl}/${id}/archive`);
    return response.data;
  }

  // Delete notification
  async deleteNotification(id: string): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<{ deleted_count: number }> {
    const response = await api.delete(`${this.baseUrl}/clear-all`);
    return response.data;
  }

  // Bulk create notifications (for admin/system use)
  async bulkCreateNotifications(data: {
    notifications: NotificationCreateRequest[];
    target_users?: number[];
    target_organization_id?: number;
  }): Promise<{ created_count: number; target_users_count: number }> {
    const response = await api.post(`${this.baseUrl}/bulk`, data);
    return response.data;
  }
}

export default new NotificationAPI();