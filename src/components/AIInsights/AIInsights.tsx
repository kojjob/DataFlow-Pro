import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Paper,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  TrendingDown,
  Warning,
  Timeline,
  Lightbulb,
  Download,
  Close,
  ArrowDownward,
  AutoGraph,
  TrendingFlat,
  Speed,
  Security,
  AttachMoney,
  People,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  aiInsightsService,
  Anomaly,
  Prediction,
  Recommendation,
  TrendData,
  InsightSummary,
} from '../../services/aiInsightsService';

const AIInsights: React.FC = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Data states
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [summary, setSummary] = useState<InsightSummary | null>(null);

  // UI states
  const [periodAnchor, setPeriodAnchor] = useState<null | HTMLElement>(null);
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [realTimeConnected] = useState(true);

  // Fetch all insights data
  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const [anomaliesData, predictionsData, recommendationsData, trendsData, summaryData] = await Promise.all([
        aiInsightsService.getAnomalies(selectedPeriod),
        aiInsightsService.getPredictions(selectedPeriod),
        aiInsightsService.getRecommendations(),
        aiInsightsService.getTrendAnalysis(selectedMetric, selectedPeriod),
        aiInsightsService.getInsightsSummary(),
      ]);

      setAnomalies(anomaliesData);
      setPredictions(predictionsData);
      setRecommendations(recommendationsData);
      setTrendData(trendsData);
      setSummary(summaryData);
    } catch (err) {
      setError('Failed to load insights data');
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [selectedPeriod, selectedMetric]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setPeriodAnchor(null);
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'json') => {
    try {
      const blob = await aiInsightsService.exportInsights(format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-insights-${new Date().toISOString()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExportAnchor(null);
  };

  const handleImplementRecommendation = async (recommendationId: string) => {
    try {
      const result = await aiInsightsService.implementRecommendation(recommendationId);
      if (result.success) {
        // Refresh recommendations
        const updatedRecommendations = await aiInsightsService.getRecommendations();
        setRecommendations(updatedRecommendations);
      }
    } catch (err) {
      console.error('Failed to implement recommendation:', err);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getImpactIcon = (category: string) => {
    switch (category) {
      case 'revenue':
        return <AttachMoney />;
      case 'performance':
        return <Speed />;
      case 'security':
        return <Security />;
      case 'user-experience':
        return <People />;
      default:
        return <Lightbulb />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ color: '#4caf50' }} />;
      case 'down':
        return <TrendingDown sx={{ color: '#f44336' }} />;
      default:
        return <TrendingFlat sx={{ color: '#ff9800' }} />;
    }
  };

  const periodOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  if (error && anomalies.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchInsights}>
              Retry
            </Button>
          }
        >
          Error loading anomalies: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              AI Insights Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Powered by advanced machine learning algorithms
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Real-time indicator */}
            <Chip
              label="Real-time"
              color={realTimeConnected ? 'success' : 'default'}
              size="small"
              icon={
                <Box
                  data-testid="real-time-indicator"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: realTimeConnected ? 'green' : 'gray',
                    mr: 0.5,
                  }}
                />
              }
            />

            {/* Period selector */}
            <Button
              variant="outlined"
              onClick={(e) => setPeriodAnchor(e.currentTarget)}
              endIcon={<ArrowDownward />}
            >
              {periodOptions.find((p) => p.value === selectedPeriod)?.label}
            </Button>
            <Menu
              anchorEl={periodAnchor}
              open={Boolean(periodAnchor)}
              onClose={() => setPeriodAnchor(null)}
            >
              {periodOptions.map((option) => (
                <MenuItem key={option.value} onClick={() => handlePeriodChange(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
            </Menu>

            {/* Refresh button */}
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchInsights}>
              Refresh
            </Button>

            {/* Export button */}
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={(e) => setExportAnchor(e.currentTarget)}
            >
              Export Insights
            </Button>
            <Menu
              anchorEl={exportAnchor}
              open={Boolean(exportAnchor)}
              onClose={() => setExportAnchor(null)}
            >
              <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
              <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
              <MenuItem onClick={() => handleExport('json')}>Export as JSON</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Summary Cards */}
        {summary && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {summary.totalAnomalies}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Anomalies
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="error">
                  {summary.criticalIssues}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Critical Issues
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success">
                  {summary.predictionsCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Predictions
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <LinearProgress
                  variant="determinate"
                  value={summary.overallHealth}
                  sx={{ mb: 1 }}
                  color={summary.overallHealth > 70 ? 'success' : summary.overallHealth > 40 ? 'warning' : 'error'}
                />
                <Typography variant="body2" color="text.secondary">
                  System Health: {summary.overallHealth}%
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Anomaly Detection Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="warning" />
                Anomaly Detection
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Stack spacing={2}>
                  {anomalies.map((anomaly) => (
                    <Paper
                      key={anomaly.id}
                      sx={{
                        p: 2,
                        borderLeft: 4,
                        borderColor: getSeverityColor(anomaly.severity) + '.main',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip
                              label={anomaly.severity}
                              color={getSeverityColor(anomaly.severity) as any}
                              size="small"
                            />
                            <Chip label={anomaly.metric} size="small" variant="outlined" />
                          </Box>
                          <Typography variant="body2" gutterBottom>
                            {anomaly.description}
                          </Typography>
                          <Typography variant="h6" color={anomaly.deviation > 0 ? 'error' : 'warning'}>
                            {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}%
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          onClick={() => setSelectedAnomaly(anomaly)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Predictive Analytics Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoGraph color="primary" />
                Predictive Analytics
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Stack spacing={2}>
                  {predictions.map((prediction) => (
                    <Paper key={prediction.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {prediction.metric}
                        </Typography>
                        {getTrendIcon(prediction.trend)}
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {prediction.period}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
                        <Typography variant="h5">
                          {typeof prediction.predictedValue === 'number'
                            ? prediction.predictedValue.toLocaleString()
                            : prediction.predictedValue}
                        </Typography>
                        <Chip
                          label={`${prediction.confidence}% confidence`}
                          size="small"
                          color={prediction.confidence > 80 ? 'success' : 'warning'}
                        />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Contributing factors:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {prediction.factors.map((factor, index) => (
                            <Chip key={index} label={factor} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Recommendations Section */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lightbulb color="warning" />
                AI Recommendations
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {recommendations.map((rec) => (
                    <Grid size={{ xs: 12, md: 6 }} key={rec.id}>
                      <Paper
                        data-testid="recommendation-card"
                        sx={{
                          p: 2,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getImpactIcon(rec.category)}
                            <Typography variant="subtitle1" fontWeight="medium">
                              {rec.title}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${rec.impact} impact`}
                            size="small"
                            color={rec.impact === 'high' ? 'error' : rec.impact === 'medium' ? 'warning' : 'default'}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                          {rec.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="success.main" fontWeight="medium">
                            {rec.estimatedImpact}
                          </Typography>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleImplementRecommendation(rec.id)}
                          >
                            Implement
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Trend Analysis Section */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timeline color="info" />
                  Trend Analysis
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="metric-select-label">Select Metric</InputLabel>
                  <Select
                    labelId="metric-select-label"
                    value={selectedMetric}
                    label="Select Metric"
                    onChange={(e: SelectChangeEvent) => setSelectedMetric(e.target.value)}
                  >
                    <MenuItem value="revenue">Revenue</MenuItem>
                    <MenuItem value="users">Users</MenuItem>
                    <MenuItem value="conversion">Conversion Rate</MenuItem>
                    <MenuItem value="orders">Orders</MenuItem>
                    <MenuItem value="pageViews">Page Views</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
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
      </Grid>

      {/* Anomaly Details Dialog */}
      <Dialog
        open={Boolean(selectedAnomaly)}
        onClose={() => setSelectedAnomaly(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedAnomaly && (
          <>
            <DialogTitle>
              Anomaly Details
              <IconButton
                sx={{ position: 'absolute', right: 8, top: 8 }}
                onClick={() => setSelectedAnomaly(null)}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Metric
                  </Typography>
                  <Typography variant="body1">{selectedAnomaly.metric}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Severity
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedAnomaly.severity}
                      color={getSeverityColor(selectedAnomaly.severity) as any}
                      size="small"
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">{selectedAnomaly.description}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Current Value
                  </Typography>
                  <Typography variant="body1">{selectedAnomaly.value.toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Expected Value:
                  </Typography>
                  <Typography variant="body1">{selectedAnomaly.expectedValue.toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Deviation
                  </Typography>
                  <Typography
                    variant="h6"
                    color={selectedAnomaly.deviation > 0 ? 'error' : 'warning'}
                  >
                    {selectedAnomaly.deviation > 0 ? '+' : ''}{selectedAnomaly.deviation}%
                  </Typography>
                </Box>
                {selectedAnomaly.affectedResources && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Affected Resources
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {selectedAnomaly.affectedResources.map((resource, index) => (
                        <Chip key={index} label={resource} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedAnomaly(null)}>Close</Button>
              <Button
                variant="contained"
                onClick={() => {
                  aiInsightsService.dismissAnomaly(selectedAnomaly.id);
                  setSelectedAnomaly(null);
                  fetchInsights();
                }}
              >
                Dismiss Anomaly
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AIInsights;