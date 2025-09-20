import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Chip,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics,
  CloudUpload,
  Storage,
  Group,
  Settings,
  Notifications,
  ExitToApp,
  Person,
  Menu as MenuIcon,
  TrendingUp,
  Timeline,
  Assessment,
  AutoGraph,
  Insights
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import { authService } from '../../services/authService';

const drawerWidth = 280;

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const menuItems = [
    {
      section: 'MAIN',
      items: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', badge: null },
        { text: 'Analytics', icon: <Analytics />, path: '/analytics', badge: 'New' },
        { text: 'AI Insights', icon: <Insights />, path: '/insights', badge: '3' },
      ]
    },
    {
      section: 'DATA',
      items: [
        { text: 'Data Sources', icon: <Storage />, path: '/sources', badge: null },
        { text: 'ETL Pipelines', icon: <AutoGraph />, path: '/etl', badge: '2' },
        { text: 'File Upload', icon: <CloudUpload />, path: '/upload', badge: null },
      ]
    },
    {
      section: 'REPORTS',
      items: [
        { text: 'Performance', icon: <Timeline />, path: '/performance', badge: null },
        { text: 'Predictive', icon: <TrendingUp />, path: '/predictive', badge: null },
        { text: 'Custom Reports', icon: <Assessment />, path: '/reports', badge: null },
      ]
    },
    {
      section: 'WORKSPACE',
      items: [
        { text: 'Team', icon: <Group />, path: '/team', badge: null },
        { text: 'Settings', icon: <Settings />, path: '/settings', badge: null },
      ]
    }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1a237e' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          DataFlow Pro
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Enterprise Analytics Platform
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
        {menuItems.map((section, sectionIndex) => (
          <Box key={sectionIndex}>
            <Typography
              variant="caption"
              sx={{
                px: 3,
                py: 1,
                display: 'block',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 'bold',
                letterSpacing: 1
              }}
            >
              {section.section}
            </Typography>
            <List sx={{ py: 0 }}>
              {section.items.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      mx: 2,
                      borderRadius: 2,
                      mb: 0.5,
                      color: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiListItemIcon-root': {
                          color: '#667eea'
                        }
                      },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(102, 126, 234, 0.2)',
                        '& .MuiListItemIcon-root': {
                          color: '#667eea'
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: item.badge === 'New' ? '#4caf50' : '#ff9800',
                          color: 'white'
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* Upgrade Section */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            textAlign: 'center'
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
            Upgrade to Pro
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mb: 2 }}>
            Unlock all features and get unlimited access
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            Upgrade Now
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#f5f5f5',
              borderRadius: 2,
              px: 2,
              py: 1,
              maxWidth: 400
            }}
          >
            <input
              type="text"
              placeholder="Search dashboards, data, insights..."
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '14px'
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Right side icons */}
          <IconButton
            size="large"
            color="inherit"
            onClick={handleNotificationOpen}
          >
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar
              sx={{
                bgcolor: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                width: 35,
                height: 35
              }}
            >
              JD
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          bgcolor: '#f5f7fa',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto'
        }}
      >
        {children || <Dashboard />}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 250, mt: 1.5 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            John Doe
          </Typography>
          <Typography variant="body2" color="text.secondary">
            john.doe@dataflow.com
          </Typography>
          <Chip
            label="Admin"
            size="small"
            sx={{ mt: 1, bgcolor: '#667eea', color: 'white' }}
          />
        </Box>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Account Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={async () => {
          handleMenuClose();
          await authService.logout();
          navigate('/login');
        }}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: { width: 350, mt: 1.5, maxHeight: 400 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        <List sx={{ py: 0 }}>
          {[
            {
              title: 'New AI Insight Available',
              description: 'Revenue prediction model completed',
              time: '5 min ago',
              color: '#4caf50'
            },
            {
              title: 'ETL Pipeline Completed',
              description: 'Sales data pipeline finished processing',
              time: '1 hour ago',
              color: '#2196f3'
            },
            {
              title: 'Alert: Anomaly Detected',
              description: 'Unusual pattern in user engagement',
              time: '2 hours ago',
              color: '#ff9800'
            },
            {
              title: 'Report Generated',
              description: 'Monthly analytics report is ready',
              time: '3 hours ago',
              color: '#9c27b0'
            }
          ].map((notification, index) => (
            <ListItem
              key={index}
              sx={{
                borderLeft: `3px solid ${notification.color}`,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.description}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.disabled' }}>
                  {notification.time}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button size="small">View All Notifications</Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default AppLayout;