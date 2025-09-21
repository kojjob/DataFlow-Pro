import { NotificationType } from '../contexts/NotificationContext';

export interface SystemNotificationConfig {
  enableBrowserNotifications?: boolean;
  enableSoundNotifications?: boolean;
  notificationPermission?: NotificationPermission;
  soundUrl?: string;
}

export class NotificationService {
  private static instance: NotificationService;
  private config: SystemNotificationConfig = {
    enableBrowserNotifications: true,
    enableSoundNotifications: false,
    soundUrl: '/notification-sound.mp3'
  };

  private constructor() {
    this.requestBrowserPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request browser notification permission
  public async requestBrowserPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.config.notificationPermission = 'granted';
      return true;
    }

    if (Notification.permission === 'denied') {
      this.config.notificationPermission = 'denied';
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.config.notificationPermission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Send browser notification
  public sendBrowserNotification(
    title: string,
    options: NotificationOptions & { type?: NotificationType } = {}
  ): Notification | null {
    if (
      !this.config.enableBrowserNotifications ||
      this.config.notificationPermission !== 'granted' ||
      document.visibilityState === 'visible'
    ) {
      return null;
    }

    const { type, ...notificationOptions } = options;

    const notification = new Notification(title, {
      icon: this.getNotificationIcon(type),
      badge: '/favicon-32x32.png',
      requireInteraction: type === NotificationType.SECURITY || type === NotificationType.BILLING,
      ...notificationOptions
    });

    // Auto-close after 5 seconds unless it requires interaction
    if (!notification.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    return notification;
  }

  // Get appropriate icon for notification type
  private getNotificationIcon(type?: NotificationType): string {
    const iconMap: Record<NotificationType, string> = {
      [NotificationType.SYSTEM]: '/icons/system.png',
      [NotificationType.AUTH]: '/icons/auth.png',
      [NotificationType.DATA]: '/icons/data.png',
      [NotificationType.ETL]: '/icons/etl.png',
      [NotificationType.AI_INSIGHT]: '/icons/ai.png',
      [NotificationType.COLLABORATION]: '/icons/collaboration.png',
      [NotificationType.SECURITY]: '/icons/security.png',
      [NotificationType.PERFORMANCE]: '/icons/performance.png',
      [NotificationType.BILLING]: '/icons/billing.png',
      [NotificationType.USER_ACTION]: '/icons/user.png'
    };

    return type ? iconMap[type] : '/favicon-192x192.png';
  }

  // Play notification sound
  public playNotificationSound(type?: NotificationType): void {
    if (!this.config.enableSoundNotifications) {
      return;
    }

    try {
      const audio = new Audio(this.getSoundUrl(type));
      audio.volume = 0.3;
      audio.play().catch(error => {
        console.warn('Could not play notification sound:', error);
      });
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  }

  // Get sound URL based on notification type
  private getSoundUrl(type?: NotificationType): string {
    const soundMap: Record<NotificationType, string> = {
      [NotificationType.SYSTEM]: '/sounds/system.mp3',
      [NotificationType.AUTH]: '/sounds/auth.mp3',
      [NotificationType.DATA]: '/sounds/data.mp3',
      [NotificationType.ETL]: '/sounds/etl.mp3',
      [NotificationType.AI_INSIGHT]: '/sounds/ai.mp3',
      [NotificationType.COLLABORATION]: '/sounds/collaboration.mp3',
      [NotificationType.SECURITY]: '/sounds/security.mp3',
      [NotificationType.PERFORMANCE]: '/sounds/performance.mp3',
      [NotificationType.BILLING]: '/sounds/billing.mp3',
      [NotificationType.USER_ACTION]: '/sounds/user.mp3'
    };

    return type ? soundMap[type] : this.config.soundUrl || '/sounds/default.mp3';
  }

  // Update configuration
  public updateConfig(newConfig: Partial<SystemNotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  public getConfig(): SystemNotificationConfig {
    return { ...this.config };
  }

  // Check if browser notifications are supported and permitted
  public canShowBrowserNotifications(): boolean {
    return (
      'Notification' in window &&
      this.config.notificationPermission === 'granted' &&
      this.config.enableBrowserNotifications === true
    );
  }

  // Show notification with all configured options
  public showNotification(
    title: string,
    message: string,
    type: NotificationType = NotificationType.SYSTEM,
    options: {
      showBrowser?: boolean;
      playSound?: boolean;
      requireInteraction?: boolean;
      actions?: Array<{ action: string; title: string; icon?: string }>;
    } = {}
  ): void {
    const {
      showBrowser = true,
      playSound = false,
      requireInteraction = false,
      actions = []
    } = options;

    // Show browser notification if enabled and window is not focused
    if (showBrowser && this.canShowBrowserNotifications()) {
      this.sendBrowserNotification(title, {
        body: message,
        type,
        requireInteraction,
        actions: actions.length > 0 ? actions : undefined,
        tag: `dataflow-${type}-${Date.now()}` // Prevent duplicate notifications
      });
    }

    // Play sound if enabled
    if (playSound) {
      this.playNotificationSound(type);
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Predefined notification templates for common scenarios
export const NotificationTemplates = {
  // Authentication notifications
  LOGIN_SUCCESS: (username: string) => ({
    title: 'Welcome Back!',
    message: `Successfully logged in as ${username}`,
    type: NotificationType.AUTH
  }),

  LOGIN_FAILED: (reason: string) => ({
    title: 'Login Failed',
    message: reason,
    type: NotificationType.AUTH
  }),

  // Data processing notifications
  ETL_PIPELINE_STARTED: (pipelineName: string) => ({
    title: 'Pipeline Started',
    message: `ETL pipeline "${pipelineName}" has started processing`,
    type: NotificationType.ETL
  }),

  ETL_PIPELINE_COMPLETED: (pipelineName: string, recordsProcessed: number) => ({
    title: 'Pipeline Completed',
    message: `ETL pipeline "${pipelineName}" completed successfully. ${recordsProcessed} records processed.`,
    type: NotificationType.ETL
  }),

  ETL_PIPELINE_FAILED: (pipelineName: string, error: string) => ({
    title: 'Pipeline Failed',
    message: `ETL pipeline "${pipelineName}" failed: ${error}`,
    type: NotificationType.ETL
  }),

  // AI Insights notifications
  NEW_AI_INSIGHT: (insightType: string, confidence: number) => ({
    title: 'New AI Insight',
    message: `New ${insightType} insight detected with ${Math.round(confidence * 100)}% confidence`,
    type: NotificationType.AI_INSIGHT
  }),

  // Security notifications
  SECURITY_ALERT: (alertType: string) => ({
    title: 'Security Alert',
    message: `Security alert: ${alertType}`,
    type: NotificationType.SECURITY
  }),

  // Performance notifications
  PERFORMANCE_DEGRADATION: (metric: string, value: string) => ({
    title: 'Performance Alert',
    message: `Performance degradation detected: ${metric} at ${value}`,
    type: NotificationType.PERFORMANCE
  }),

  // Collaboration notifications
  NEW_COMMENT: (author: string, workspace: string) => ({
    title: 'New Comment',
    message: `${author} commented in ${workspace}`,
    type: NotificationType.COLLABORATION
  }),

  WORKSPACE_INVITATION: (inviterName: string, workspaceName: string) => ({
    title: 'Workspace Invitation',
    message: `${inviterName} invited you to join "${workspaceName}"`,
    type: NotificationType.COLLABORATION
  }),

  // System notifications
  SYSTEM_MAINTENANCE: (startTime: string, duration: string) => ({
    title: 'Scheduled Maintenance',
    message: `System maintenance scheduled for ${startTime}, estimated duration: ${duration}`,
    type: NotificationType.SYSTEM
  }),

  DATA_EXPORT_READY: (fileName: string) => ({
    title: 'Export Ready',
    message: `Your data export "${fileName}" is ready for download`,
    type: NotificationType.DATA
  })
};

export default NotificationService;