import { useNotification, NotificationType } from '../contexts/NotificationContext';
import { NotificationTemplates, notificationService } from '../services/notificationService';

/**
 * Custom hook for system-wide notification patterns
 * Provides easy-to-use functions for common notification scenarios
 */
export const useSystemNotifications = () => {
  const { showNotification } = useNotification();

  // Success notifications
  const showSuccess = (message: string, options?: {
    type?: NotificationType;
    showBrowser?: boolean;
    details?: string;
  }) => {
    const { type = NotificationType.SYSTEM, showBrowser = false, details } = options || {};

    showNotification(
      message,
      'success',
      type,
      {
        persistent: false,
        autoHideDuration: 4000,
        metadata: details ? { details } : undefined
      }
    );

    if (showBrowser) {
      notificationService.showNotification(
        'Success',
        message,
        type,
        { showBrowser: true, playSound: false }
      );
    }
  };

  // Error notifications
  const showError = (message: string, options?: {
    type?: NotificationType;
    showBrowser?: boolean;
    error?: string;
    persistent?: boolean;
  }) => {
    const {
      type = NotificationType.SYSTEM,
      showBrowser = false,
      error,
      persistent = false
    } = options || {};

    showNotification(
      message,
      'error',
      type,
      {
        persistent,
        autoHideDuration: persistent ? undefined : 6000,
        metadata: {
          timestamp: new Date().toISOString(),
          error: error || 'Unknown error'
        }
      }
    );

    if (showBrowser) {
      notificationService.showNotification(
        'Error',
        message,
        type,
        { showBrowser: true, playSound: false }
      );
    }
  };

  // Warning notifications
  const showWarning = (message: string, options?: {
    type?: NotificationType;
    showBrowser?: boolean;
    details?: string;
  }) => {
    const { type = NotificationType.SYSTEM, showBrowser = false, details } = options || {};

    showNotification(
      message,
      'warning',
      type,
      {
        persistent: false,
        autoHideDuration: 5000,
        metadata: details ? { details } : undefined
      }
    );

    if (showBrowser) {
      notificationService.showNotification(
        'Warning',
        message,
        type,
        { showBrowser: true, playSound: false }
      );
    }
  };

  // Info notifications
  const showInfo = (message: string, options?: {
    type?: NotificationType;
    showBrowser?: boolean;
    details?: string;
  }) => {
    const { type = NotificationType.SYSTEM, showBrowser = false, details } = options || {};

    showNotification(
      message,
      'info',
      type,
      {
        persistent: false,
        autoHideDuration: 4000,
        metadata: details ? { details } : undefined
      }
    );

    if (showBrowser) {
      notificationService.showNotification(
        'Information',
        message,
        type,
        { showBrowser: true, playSound: false }
      );
    }
  };

  // ETL Pipeline notifications
  const showETLNotification = (pipelineName: string, status: 'started' | 'completed' | 'failed', options?: {
    recordsProcessed?: number;
    error?: string;
    showBrowser?: boolean;
  }) => {
    const { recordsProcessed, error, showBrowser = true } = options || {};

    let template;
    let severity: 'success' | 'error' | 'info' = 'info';

    switch (status) {
      case 'started':
        template = NotificationTemplates.ETL_PIPELINE_STARTED(pipelineName);
        severity = 'info';
        break;
      case 'completed':
        template = NotificationTemplates.ETL_PIPELINE_COMPLETED(pipelineName, recordsProcessed || 0);
        severity = 'success';
        break;
      case 'failed':
        template = NotificationTemplates.ETL_PIPELINE_FAILED(pipelineName, error || 'Unknown error');
        severity = 'error';
        break;
    }

    showNotification(
      template.message,
      severity,
      template.type,
      {
        persistent: status === 'failed',
        autoHideDuration: status === 'failed' ? undefined : 5000,
        metadata: {
          pipelineName,
          status,
          recordsProcessed,
          error,
          timestamp: new Date().toISOString()
        }
      }
    );

    if (showBrowser) {
      notificationService.showNotification(
        template.title,
        template.message,
        template.type,
        { showBrowser: true, playSound: status === 'failed' }
      );
    }
  };

  // AI Insight notifications
  const showAIInsight = (insightType: string, confidence: number, options?: {
    showBrowser?: boolean;
    details?: string;
  }) => {
    const { showBrowser = true, details } = options || {};
    const template = NotificationTemplates.NEW_AI_INSIGHT(insightType, confidence);

    showNotification(
      template.message,
      'info',
      template.type,
      {
        persistent: false,
        autoHideDuration: 6000,
        metadata: {
          insightType,
          confidence,
          details,
          timestamp: new Date().toISOString()
        }
      }
    );

    if (showBrowser) {
      notificationService.showNotification(
        template.title,
        template.message,
        template.type,
        { showBrowser: true, playSound: false }
      );
    }
  };

  // Security alert notifications
  const showSecurityAlert = (alertType: string, options?: {
    showBrowser?: boolean;
    urgent?: boolean;
    details?: string;
  }) => {
    const { showBrowser = true, urgent = false, details } = options || {};
    const template = NotificationTemplates.SECURITY_ALERT(alertType);

    showNotification(
      template.message,
      'error',
      template.type,
      {
        persistent: urgent,
        autoHideDuration: urgent ? undefined : 8000,
        metadata: {
          alertType,
          urgent,
          details,
          timestamp: new Date().toISOString()
        }
      }
    );

    if (showBrowser) {
      notificationService.showNotification(
        template.title,
        template.message,
        template.type,
        { showBrowser: true, playSound: urgent }
      );
    }
  };

  // Performance alert notifications
  const showPerformanceAlert = (metric: string, value: string, options?: {
    showBrowser?: boolean;
    critical?: boolean;
  }) => {
    const { showBrowser = true, critical = false } = options || {};
    const template = NotificationTemplates.PERFORMANCE_DEGRADATION(metric, value);

    showNotification(
      template.message,
      critical ? 'error' : 'warning',
      template.type,
      {
        persistent: critical,
        autoHideDuration: critical ? undefined : 6000,
        metadata: {
          metric,
          value,
          critical,
          timestamp: new Date().toISOString()
        }
      }
    );

    if (showBrowser) {
      notificationService.showNotification(
        template.title,
        template.message,
        template.type,
        { showBrowser: true, playSound: critical }
      );
    }
  };

  // Collaboration notifications
  const showCollaborationNotification = (type: 'comment' | 'invitation', data: {
    author?: string;
    workspace?: string;
    inviterName?: string;
    workspaceName?: string;
  }, options?: {
    showBrowser?: boolean;
  }) => {
    const { showBrowser = true } = options || {};

    let template;
    if (type === 'comment' && data.author && data.workspace) {
      template = NotificationTemplates.NEW_COMMENT(data.author, data.workspace);
    } else if (type === 'invitation' && data.inviterName && data.workspaceName) {
      template = NotificationTemplates.WORKSPACE_INVITATION(data.inviterName, data.workspaceName);
    } else {
      throw new Error('Invalid collaboration notification data');
    }

    showNotification(
      template.message,
      'info',
      template.type,
      {
        persistent: false,
        autoHideDuration: 5000,
        metadata: {
          type,
          ...data,
          timestamp: new Date().toISOString()
        }
      }
    );

    if (showBrowser) {
      notificationService.showNotification(
        template.title,
        template.message,
        template.type,
        { showBrowser: true, playSound: false }
      );
    }
  };

  // Data export notifications
  const showDataExportReady = (fileName: string, options?: {
    showBrowser?: boolean;
    downloadUrl?: string;
  }) => {
    const { showBrowser = true, downloadUrl } = options || {};
    const template = NotificationTemplates.DATA_EXPORT_READY(fileName);

    showNotification(
      template.message,
      'success',
      template.type,
      {
        persistent: false,
        autoHideDuration: 8000,
        actions: downloadUrl ? [{
          label: 'Download',
          action: () => window.open(downloadUrl, '_blank')
        }] : undefined,
        metadata: {
          fileName,
          downloadUrl,
          timestamp: new Date().toISOString()
        }
      }
    );

    if (showBrowser) {
      notificationService.showNotification(
        template.title,
        template.message,
        template.type,
        { showBrowser: true, playSound: false }
      );
    }
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showETLNotification,
    showAIInsight,
    showSecurityAlert,
    showPerformanceAlert,
    showCollaborationNotification,
    showDataExportReady
  };
};

export default useSystemNotifications;