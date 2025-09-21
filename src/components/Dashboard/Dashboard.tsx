import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  LinearProgress,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  ShoppingCart,
  Timeline,
  Refresh,
  MoreVert
} from '@mui/icons-material';
import CountUp from 'react-countup';
import FinancialChart from './FinancialChart';
import PerformanceMetrics from './PerformanceMetrics';
import RevenueChart from './RevenueChart';
import UserActivityHeatmap from './UserActivityHeatmap';
import { dashboardService, DashboardMetrics } from '../../services/dashboardService';
import './Dashboard.css';

interface MetricCard {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  prefix?: string;
  suffix?: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [metricsData, setMetricsData] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getMetrics();
      setMetricsData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard metrics. Using demo data.');
      setShowError(true);
      // Use fallback data that's returned by the service
      const fallbackData = await dashboardService.getMetrics();
      setMetricsData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const metrics: MetricCard[] = metricsData ? [
    {
      title: 'Total Revenue',
      value: metricsData.totalRevenue,
      change: metricsData.revenueChange,
      icon: <AttachMoney />,
      color: '#4caf50',
      prefix: '$'
    },
    {
      title: 'Active Users',
      value: metricsData.activeUsers,
      change: metricsData.usersChange,
      icon: <People />,
      color: '#2196f3',
      suffix: ''
    },
    {
      title: 'Conversion Rate',
      value: metricsData.conversionRate,
      change: metricsData.conversionChange,
      icon: <TrendingUp />,
      color: '#ff9800',
      suffix: '%'
    },
    {
      title: 'Sales Today',
      value: metricsData.salesToday,
      change: metricsData.salesChange,
      icon: <ShoppingCart />,
      color: '#9c27b0',
      prefix: '$'
    }
  ] : [];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{
      maxWidth: '1400px',
      mx: 'auto',
      p: { xs: 2, sm: 3, md: 4 },
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* Header */}
      <Box sx={{
        mb: 4,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#1a237e',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Enterprise Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: { xs: 2, sm: 0 } }}>
            Welcome back! Here's your business performance overview
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadDashboardData}
            size="medium"
          >
            Refresh
          </Button>
          <Button variant="contained" color="primary" size="medium">
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Period Selector */}
      <Box sx={{
        mb: 4,
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        p: 3,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h6" sx={{ mr: 2, minWidth: 'fit-content', alignSelf: 'center' }}>
          Time Period:
        </Typography>
        {['day', 'week', 'month', 'quarter', 'year'].map((period) => (
          <Chip
            key={period}
            label={period.charAt(0).toUpperCase() + period.slice(1)}
            onClick={() => setSelectedPeriod(period)}
            color={selectedPeriod === period ? 'primary' : 'default'}
            variant={selectedPeriod === period ? 'filled' : 'outlined'}
            sx={{
              fontWeight: selectedPeriod === period ? 'bold' : 'normal',
              '&:hover': { backgroundColor: selectedPeriod === period ? undefined : 'rgba(0,0,0,0.04)' }
            }}
          />
        ))}
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {metrics.map((metric, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'visible',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minHeight: '140px',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                        {metric.title}
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {loading ? (
                          <LinearProgress color="inherit" sx={{ width: 100 }} />
                        ) : (
                          <>
                            {metric.prefix}
                            <CountUp
                              end={metric.value}
                              duration={2}
                              separator=","
                              decimals={metric.suffix === '%' ? 2 : 0}
                            />
                            {metric.suffix}
                          </>
                        )}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {metric.change > 0 ? (
                          <TrendingUp sx={{ fontSize: 16, color: '#4caf50' }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />
                        )}
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          {Math.abs(metric.change)}% from last {selectedPeriod}
                        </Typography>
                      </Box>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        width: 56,
                        height: 56
                      }}
                    >
                      {metric.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box>
            <Typography variant="h4" sx={{
              fontWeight: 'bold',
              color: '#1a237e',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}>
              Analytics Overview
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5 }}>
              Comprehensive insights and performance metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Export Charts
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
              }}
            >
              Customize View
            </Button>
          </Box>
        </Box>

        {/* Main Chart Row */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          {/* Financial Overview Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Paper sx={{
                p: { xs: 3, sm: 4 },
                height: { xs: '400px', sm: '480px' },
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{
                      fontWeight: 'bold',
                      color: '#1a237e',
                      mb: 0.5
                    }}>
                      Financial Overview
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                      Revenue trends, financial metrics, and growth patterns
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={handleMenuClick}
                    sx={{
                      ml: 2,
                      backgroundColor: 'rgba(102, 126, 234, 0.08)',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.16)'
                      }
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
                <Box sx={{ height: 'calc(100% - 60px)', width: '100%' }}>
                  <FinancialChart period={selectedPeriod} />
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Performance Metrics */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Paper sx={{
                p: { xs: 3, sm: 4 },
                height: { xs: '400px', sm: '480px' },
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    color: '#1a237e',
                    mb: 0.5
                  }}>
                    Performance Metrics
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                    Key performance indicators and success metrics
                  </Typography>
                </Box>
                <Box sx={{ height: 'calc(100% - 60px)', width: '100%' }}>
                  <PerformanceMetrics />
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Secondary Charts Row */}
        <Grid container spacing={4}>
          {/* Revenue Breakdown */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Paper sx={{
                p: { xs: 3, sm: 4 },
                height: { xs: '350px', sm: '400px' },
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    color: '#1a237e',
                    mb: 0.5
                  }}>
                    Revenue by Category
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                    Revenue distribution and category performance analysis
                  </Typography>
                </Box>
                <Box sx={{ height: 'calc(100% - 60px)', width: '100%' }}>
                  <RevenueChart />
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* User Activity Heatmap */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Paper sx={{
                p: { xs: 3, sm: 4 },
                height: { xs: '350px', sm: '400px' },
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    color: '#1a237e',
                    mb: 0.5
                  }}>
                    User Activity Heatmap
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                    User engagement patterns and behavioral insights
                  </Typography>
                </Box>
                <Box sx={{ height: 'calc(100% - 60px)', width: '100%' }}>
                  <UserActivityHeatmap />
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* Real-time Alerts Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box>
            <Typography variant="h4" sx={{
              fontWeight: 'bold',
              color: '#1a237e',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}>
              Real-time Alerts
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5 }}>
              Live system notifications and important updates
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            View All Alerts
          </Button>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Paper sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 4 }}>
                <Alert
                  severity="success"
                  icon={<TrendingUp />}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    backgroundColor: 'rgba(76, 175, 80, 0.04)',
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem',
                      color: '#4caf50'
                    },
                    '& .MuiAlert-message': {
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#1b5e20',
                      lineHeight: 1.6
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.08)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Revenue exceeded daily target by 23% - $45,320 achieved
                </Alert>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <Alert
                  severity="warning"
                  icon={<People />}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid rgba(255, 152, 0, 0.2)',
                    backgroundColor: 'rgba(255, 152, 0, 0.04)',
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem',
                      color: '#ff9800'
                    },
                    '& .MuiAlert-message': {
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#e65100',
                      lineHeight: 1.6
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.08)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  User engagement dropping in European region - investigate potential issues
                </Alert>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <Alert
                  severity="info"
                  icon={<Timeline />}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid rgba(33, 150, 243, 0.2)',
                    backgroundColor: 'rgba(33, 150, 243, 0.04)',
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem',
                      color: '#2196f3'
                    },
                    '& .MuiAlert-message': {
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#0d47a1',
                      lineHeight: 1.6
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.08)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Predictive model suggests 15% growth opportunity in Q2 - View recommendations
                </Alert>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Download CSV</MenuItem>
        <MenuItem onClick={handleMenuClose}>Print Chart</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share Dashboard</MenuItem>
      </Menu>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;