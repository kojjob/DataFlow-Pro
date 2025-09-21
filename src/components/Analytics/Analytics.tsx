import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  SelectChangeEvent,
} from '@mui/material';
import {
  Refresh,
  People,
  AttachMoney,
  ShowChart,
  Download,
  ArrowUpward,
  ArrowDownward,
  Timeline,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  analyticsService,
  KeyMetrics,
  TimeSeriesData,
  ChannelData,
  ConversionFunnel,
  GeographicData,
} from '../../services/analyticsService';

const Analytics: React.FC = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  // Data states
  const [keyMetrics, setKeyMetrics] = useState<KeyMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>([]);
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);

  // Fetch all analytics data
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const [metrics, timeSeries, channels, funnel, geographic] = await Promise.all([
        analyticsService.getKeyMetrics(dateRange),
        analyticsService.getTimeSeriesData(dateRange, selectedMetric),
        analyticsService.getChannelAnalytics(dateRange),
        analyticsService.getConversionFunnel(dateRange),
        analyticsService.getGeographicData(dateRange),
      ]);

      setKeyMetrics(metrics);
      setTimeSeriesData(timeSeries);
      setChannelData(channels);
      setConversionFunnel(funnel);
      setGeographicData(geographic);
    } catch (err) {
      setError('Error loading analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedMetric]);

  // Format numbers
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatCurrency = (num: number): string => {
    return `$${num.toLocaleString()}`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(2)}%`;
  };

  // Handle date range change
  const handleDateRangeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateRangeClose = (range?: string) => {
    setAnchorEl(null);
    if (range) {
      setDateRange(range);
    }
  };

  // Handle export
  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchor(event.currentTarget);
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    setExportAnchor(null);
    try {
      const blob = await analyticsService.exportAnalytics(format, dateRange);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${dateRange}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Render metric card
  const renderMetricCard = (title: string, value: string, change: number, trend: 'up' | 'down' | 'stable', icon: React.ReactNode) => {
    const isPositive = trend === 'up';
    const TrendIcon = isPositive ? ArrowUpward : ArrowDownward;
    const color = isPositive ? 'success.main' : 'error.main';

    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon}
            <Typography variant="subtitle2" color="text.secondary" sx={{ ml: 1 }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h4" gutterBottom>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendIcon sx={{ fontSize: 16, color }} />
            <Typography variant="body2" sx={{ color }}>
              {change > 0 ? '+' : ''}{change}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              vs last period
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Error loading analytics
        </Typography>
        <Button variant="contained" onClick={fetchAnalytics}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive data analysis and insights
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportClick}
          >
            Export
          </Button>
          <Menu
            anchorEl={exportAnchor}
            open={Boolean(exportAnchor)}
            onClose={() => setExportAnchor(null)}
          >
            <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
            <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
            <MenuItem onClick={() => handleExport('excel')}>Export as Excel</MenuItem>
          </Menu>

          <Button
            variant="outlined"
            onClick={handleDateRangeClick}
          >
            Last {dateRange === '7d' ? '7 Days' : dateRange === '30d' ? '30 Days' : '90 Days'}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleDateRangeClose()}
          >
            <MenuItem onClick={() => handleDateRangeClose('7d')}>Last 7 Days</MenuItem>
            <MenuItem onClick={() => handleDateRangeClose('30d')}>Last 30 Days</MenuItem>
            <MenuItem onClick={() => handleDateRangeClose('90d')}>Last 90 Days</MenuItem>
          </Menu>

          <IconButton onClick={fetchAnalytics} color="primary" aria-label="refresh">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Key Metrics Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Key Metrics
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? (
              <Card><CardContent><CircularProgress /></CardContent></Card>
            ) : keyMetrics && (
              renderMetricCard(
                'Revenue',
                formatCurrency(keyMetrics.revenue.current),
                keyMetrics.revenue.change,
                keyMetrics.revenue.trend,
                <AttachMoney color="primary" />
              )
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? (
              <Card><CardContent><CircularProgress /></CardContent></Card>
            ) : keyMetrics && (
              renderMetricCard(
                'Total Users',
                formatNumber(keyMetrics.users.current),
                keyMetrics.users.change,
                keyMetrics.users.trend,
                <People color="primary" />
              )
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? (
              <Card><CardContent><CircularProgress /></CardContent></Card>
            ) : keyMetrics && (
              renderMetricCard(
                'Conversion Rate',
                formatPercentage(keyMetrics.conversionRate.current),
                keyMetrics.conversionRate.change,
                keyMetrics.conversionRate.trend,
                <ShowChart color="primary" />
              )
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? (
              <Card><CardContent><CircularProgress /></CardContent></Card>
            ) : keyMetrics && (
              renderMetricCard(
                'Avg Session Duration',
                formatDuration(keyMetrics.avgSessionDuration.current),
                keyMetrics.avgSessionDuration.change,
                keyMetrics.avgSessionDuration.trend,
                <Timeline color="primary" />
              )
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Revenue Trends */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Revenue Trends</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="metric-select-label">Select Metric</InputLabel>
                    <Select
                      labelId="metric-select-label"
                      value={selectedMetric}
                      label="Select Metric"
                      onChange={(e: SelectChangeEvent) => setSelectedMetric(e.target.value)}
                    >
                      <MenuItem value="revenue">Revenue</MenuItem>
                      <MenuItem value="users">Users</MenuItem>
                      <MenuItem value="conversions">Conversions</MenuItem>
                      <MenuItem value="sessions">Sessions</MenuItem>
                    </Select>
                  </FormControl>
                  <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)}>
                    <Tab label="Daily" />
                    <Tab label="Weekly" />
                    <Tab label="Monthly" />
                  </Tabs>
                </Box>
              </Box>
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#667eea"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Channel Performance */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Channel Performance
              </Typography>
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={channelData as any}
                        dataKey="traffic"
                        nameKey="channel"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 2 }}>
                    {channelData.map((channel) => (
                      <Box key={channel.channel} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 12, height: 12, bgcolor: channel.color, borderRadius: '50%' }} />
                          <Typography variant="body2">{channel.channel}</Typography>
                        </Box>
                        <Typography variant="body2">{channel.traffic}%</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Conversion Funnel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Conversion Funnel
              </Typography>
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {conversionFunnel.map((stage, index) => (
                    <Box key={stage.stage} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{stage.stage}</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="body2">{formatNumber(stage.value)}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stage.percentage}%
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={stage.percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: index === 0 ? 'primary.main' : index === 1 ? 'info.main' : index === 2 ? 'warning.main' : 'success.main',
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Geographic Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Geographic Distribution
              </Typography>
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Country</TableCell>
                        <TableCell align="right">Users</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {geographicData.map((country) => (
                        <TableRow key={country.country}>
                          <TableCell>{country.country}</TableCell>
                          <TableCell align="right">{formatNumber(country.users)} users</TableCell>
                          <TableCell align="right">{formatCurrency(country.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;