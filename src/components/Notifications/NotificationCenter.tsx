import React, { useState, useMemo } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Chip,
  Divider,
  Stack,
  Tooltip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Clear as ClearIcon,
  DoneAll as DoneAllIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
  DataUsage as DataIcon,
  Psychology as AIIcon,
  Group as CollaborationIcon,
  Speed as PerformanceIcon,
  Payment as BillingIcon,
  Person as UserActionIcon,
  Settings as SystemIcon,
  Transform as ETLIcon,
  Login as AuthIcon,
} from '@mui/icons-material';
import { useNotification, Notification, NotificationType } from '../../contexts/NotificationContext';

interface NotificationCenterProps {
  maxDisplayHeight?: number;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  maxDisplayHeight = 400
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getNotificationsByType
  } = useNotification();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    let filtered = filter === 'all' ? notifications : getNotificationsByType(filter);

    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.slice(0, 50); // Limit display to recent 50
  }, [notifications, filter, searchQuery, getNotificationsByType]);

  // Get icon for notification type
  const getNotificationIcon = (type: NotificationType, severity: string) => {
    switch (type) {
      case NotificationType.SECURITY:
        return <SecurityIcon fontSize="small" />;
      case NotificationType.DATA:
        return <DataIcon fontSize="small" />;
      case NotificationType.AI_INSIGHT:
        return <AIIcon fontSize="small" />;
      case NotificationType.COLLABORATION:
        return <CollaborationIcon fontSize="small" />;
      case NotificationType.PERFORMANCE:
        return <PerformanceIcon fontSize="small" />;
      case NotificationType.BILLING:
        return <BillingIcon fontSize="small" />;
      case NotificationType.USER_ACTION:
        return <UserActionIcon fontSize="small" />;
      case NotificationType.ETL:
        return <ETLIcon fontSize="small" />;
      case NotificationType.AUTH:
        return <AuthIcon fontSize="small" />;
      default:
        return <SystemIcon fontSize="small" />;
    }
  };

  // Get color for notification type chip
  const getTypeChipColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SECURITY:
        return 'error';
      case NotificationType.AI_INSIGHT:
        return 'secondary';
      case NotificationType.PERFORMANCE:
        return 'warning';
      case NotificationType.BILLING:
        return 'info';
      case NotificationType.AUTH:
        return 'success';
      default:
        return 'default';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Handle notification-specific actions
    if (notification.actions && notification.actions.length > 0) {
      notification.actions[0].action();
    }
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleClick}
          color="inherit"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: maxDisplayHeight + 200,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" component="h2">
              Notifications
            </Typography>
            <Stack direction="row" spacing={1}>
              {unreadCount > 0 && (
                <Tooltip title="Mark all as read">
                  <IconButton size="small" onClick={markAllAsRead}>
                    <DoneAllIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {notifications.length > 0 && (
                <Tooltip title="Clear all">
                  <IconButton size="small" onClick={clearAllNotifications}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          {/* Search and Filter */}
          <Stack spacing={2}>
            <TextField
              size="small"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <FormControl size="small">
              <InputLabel>Filter by type</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                label="Filter by type"
              >
                <MenuItem value="all">All notifications</MenuItem>
                <MenuItem value={NotificationType.SYSTEM}>System</MenuItem>
                <MenuItem value={NotificationType.AUTH}>Authentication</MenuItem>
                <MenuItem value={NotificationType.DATA}>Data</MenuItem>
                <MenuItem value={NotificationType.ETL}>ETL Pipeline</MenuItem>
                <MenuItem value={NotificationType.AI_INSIGHT}>AI Insights</MenuItem>
                <MenuItem value={NotificationType.COLLABORATION}>Collaboration</MenuItem>
                <MenuItem value={NotificationType.SECURITY}>Security</MenuItem>
                <MenuItem value={NotificationType.PERFORMANCE}>Performance</MenuItem>
                <MenuItem value={NotificationType.BILLING}>Billing</MenuItem>
                <MenuItem value={NotificationType.USER_ACTION}>User Actions</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Notifications List */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: maxDisplayHeight }}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {searchQuery || filter !== 'all' ? 'No matching notifications' : 'No notifications'}
              </Typography>
            </Box>
          ) : (
            <List dense>
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      backgroundColor: !notification.read ? 'action.hover' : 'transparent',
                      padding: 0
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.selected'
                        }
                      }}
                    >
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'transparent' }}>
                        {getNotificationIcon(notification.type, notification.severity)}
                      </Avatar>
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: !notification.read ? 'medium' : 'normal',
                              mb: 0.5
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={notification.type.replace('_', ' ')}
                              size="small"
                              color={getTypeChipColor(notification.type)}
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {notification.timestamp.toLocaleTimeString()}
                            </Typography>
                          </Stack>
                        </Box>
                      }
                    />

                    </ListItemButton>

                    <ListItemSecondaryAction>
                      <Tooltip title="Clear notification">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </Typography>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default NotificationCenter;