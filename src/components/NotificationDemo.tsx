import React from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip
} from '@mui/material';
import { useSystemNotifications } from '../hooks/useSystemNotifications';
import { NotificationType } from '../contexts/NotificationContext';

/**
 * Demo component to test the comprehensive notification system
 * This component provides buttons to trigger different types of notifications
 */
const NotificationDemo: React.FC = () => {
  const {
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
  } = useSystemNotifications();

  const basicNotifications = [
    {
      title: 'Success Notification',
      color: 'success' as const,
      action: () => showSuccess('Operation completed successfully!', {
        type: NotificationType.SYSTEM,
        showBrowser: true,
        details: 'All systems are functioning normally'
      })
    },
    {
      title: 'Error Notification',
      color: 'error' as const,
      action: () => showError('Something went wrong!', {
        type: NotificationType.SYSTEM,
        showBrowser: true,
        error: 'Network connection failed',
        persistent: false
      })
    },
    {
      title: 'Warning Notification',
      color: 'warning' as const,
      action: () => showWarning('Please check your configuration', {
        type: NotificationType.SYSTEM,
        showBrowser: true,
        details: 'Some settings may need attention'
      })
    },
    {
      title: 'Info Notification',
      color: 'info' as const,
      action: () => showInfo('New features are available', {
        type: NotificationType.SYSTEM,
        showBrowser: true,
        details: 'Check out the latest updates'
      })
    }
  ];

  const systemNotifications = [
    {
      title: 'ETL Pipeline Started',
      action: () => showETLNotification('Sales Data Pipeline', 'started', {
        showBrowser: true
      })
    },
    {
      title: 'ETL Pipeline Completed',
      action: () => showETLNotification('Sales Data Pipeline', 'completed', {
        recordsProcessed: 1250,
        showBrowser: true
      })
    },
    {
      title: 'ETL Pipeline Failed',
      action: () => showETLNotification('Sales Data Pipeline', 'failed', {
        error: 'Connection timeout to data source',
        showBrowser: true
      })
    },
    {
      title: 'AI Insight Generated',
      action: () => showAIInsight('Revenue Prediction', 0.92, {
        showBrowser: true,
        details: 'High confidence prediction based on historical data'
      })
    },
    {
      title: 'Security Alert',
      action: () => showSecurityAlert('Unusual login activity detected', {
        showBrowser: true,
        urgent: true,
        details: 'Multiple failed login attempts from unknown IP'
      })
    },
    {
      title: 'Performance Alert',
      action: () => showPerformanceAlert('Response Time', '2.5 seconds', {
        showBrowser: true,
        critical: true
      })
    },
    {
      title: 'New Comment',
      action: () => showCollaborationNotification('comment', {
        author: 'John Doe',
        workspace: 'Analytics Dashboard'
      }, {
        showBrowser: true
      })
    },
    {
      title: 'Workspace Invitation',
      action: () => showCollaborationNotification('invitation', {
        inviterName: 'Jane Smith',
        workspaceName: 'Data Science Team'
      }, {
        showBrowser: true
      })
    },
    {
      title: 'Data Export Ready',
      action: () => showDataExportReady('monthly_report_2024.csv', {
        showBrowser: true,
        downloadUrl: '/downloads/monthly_report_2024.csv'
      })
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Notification System Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Test the comprehensive notification system with different types and configurations.
        Check the notification center in the top bar to see all notifications.
      </Typography>

      {/* Basic Notifications */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Basic Notifications
        </Typography>
        <Grid container spacing={2}>
          {basicNotifications.map((notification, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {notification.title}
                  </Typography>
                  <Chip
                    label={notification.color.toUpperCase()}
                    color={notification.color}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color={notification.color}
                    onClick={notification.action}
                  >
                    Show Notification
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* System Notifications */}
      <Box>
        <Typography variant="h6" gutterBottom>
          System Notifications
        </Typography>
        <Grid container spacing={2}>
          {systemNotifications.map((notification, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" component="div">
                    {notification.title}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={notification.action}
                  >
                    Trigger
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Instructions */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Testing Instructions
        </Typography>
        <Typography variant="body2" component="div">
          <ul>
            <li>Click any button above to trigger a notification</li>
            <li>Check the notification center icon in the top navigation bar</li>
            <li>Browser notifications will appear if you grant permission</li>
            <li>Try different notification types to see filtering and categorization</li>
            <li>Use the search and filter features in the notification center</li>
            <li>Test marking notifications as read/unread</li>
          </ul>
        </Typography>
      </Box>
    </Box>
  );
};

export default NotificationDemo;