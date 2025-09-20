import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { TrendingUp, TrendingDown, Warning, CheckCircle, Refresh } from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState([
    { label: 'CPU Usage', value: 67, color: '#667eea', trend: 'up', status: 'normal', unit: '%' },
    { label: 'Memory', value: 82, color: '#764ba2', trend: 'down', status: 'warning', unit: '%' },
    { label: 'Storage', value: 45, color: '#f093fb', trend: 'up', status: 'normal', unit: '%' },
    { label: 'Network I/O', value: 91, color: '#4facfe', trend: 'up', status: 'good', unit: 'Mbps' }
  ]);

  const [efficiencyScore, setEfficiencyScore] = useState(89);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 4)),
        trend: Math.random() > 0.5 ? 'up' : 'down'
      })));

      setEfficiencyScore(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 3)));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshMetrics = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.floor(Math.random() * 100),
        trend: Math.random() > 0.5 ? 'up' : 'down',
        status: metric.value > 80 ? 'warning' : metric.value > 95 ? 'critical' : 'normal'
      })));
      setEfficiencyScore(Math.floor(Math.random() * 40) + 60);
      setIsLoading(false);
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'critical': return '#f44336';
      default: return '#667eea';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle sx={{ fontSize: 16 }} />;
      case 'warning': return <Warning sx={{ fontSize: 16 }} />;
      case 'critical': return <Warning sx={{ fontSize: 16 }} />;
      default: return <CheckCircle sx={{ fontSize: 16 }} />;
    }
  };

  const data = {
    labels: ['Efficiency', 'Remaining'],
    datasets: [
      {
        data: [efficiencyScore, 100 - efficiencyScore],
        backgroundColor: ['#667eea', '#f0f0f0'],
        borderWidth: 0,
        cutout: '75%'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            if (context.label === 'Efficiency') {
              return `System Efficiency: ${efficiencyScore.toFixed(1)}%`;
            }
            return '';
          }
        }
      }
    },
    layout: {
      padding: 0
    }
  };

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '16px 20px 20px 20px'
    }}>
      {/* Header with refresh button */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2.5,
        width: '100%'
      }}>
        <Typography variant="subtitle2" sx={{
          color: '#667eea',
          fontWeight: 'bold',
          fontSize: '0.85rem'
        }}>
          System Overview
        </Typography>
        <IconButton
          size="small"
          onClick={refreshMetrics}
          disabled={isLoading}
          sx={{
            backgroundColor: 'rgba(102, 126, 234, 0.08)',
            '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.16)' },
            '&:disabled': { backgroundColor: 'rgba(102, 126, 234, 0.05)' }
          }}
        >
          <Refresh
            sx={{
              fontSize: 18,
              color: '#667eea',
              animation: isLoading ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
        </IconButton>
      </Box>

      {/* Efficiency Score - Centered */}
      <Box sx={{
        position: 'relative',
        height: 110,
        width: 110,
        mb: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Doughnut data={data} options={options} />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" sx={{
            fontWeight: 'bold',
            color: '#667eea',
            fontSize: '1.4rem',
            lineHeight: 1.1
          }}>
            {efficiencyScore.toFixed(0)}%
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{
            fontSize: '0.6rem',
            fontWeight: 500
          }}>
            Efficiency
          </Typography>
        </Box>
      </Box>

      {/* Status Chip */}
      <Box sx={{ mb: 2.5 }}>
        <Chip
          label={efficiencyScore > 85 ? 'Excellent' : efficiencyScore > 70 ? 'Good' : 'Needs Attention'}
          size="small"
          sx={{
            backgroundColor: efficiencyScore > 85 ? '#4caf50' : efficiencyScore > 70 ? '#ff9800' : '#f44336',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            height: 22,
            '& .MuiChip-label': {
              px: 1.5
            }
          }}
        />
      </Box>

      {/* Individual Metrics - Enhanced Layout */}
      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {metrics.map((metric, index) => (
          <Box key={index} sx={{
            p: 1.5,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(102, 126, 234, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 40,
            boxShadow: '0 1px 3px rgba(102, 126, 234, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 2px 6px rgba(102, 126, 234, 0.15)',
              transform: 'translateY(-1px)',
              transition: 'all 0.2s ease'
            }
          }}>
            {/* Metric Label and Icon */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
              minWidth: 0,
              maxWidth: '60%'
            }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  letterSpacing: '0.01em'
                }}
              >
                {metric.label}
              </Typography>
              <Box sx={{
                color: getStatusColor(metric.status),
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                ml: 0.5
              }}>
                {getStatusIcon(metric.status)}
              </Box>
            </Box>

            {/* Value and Trend */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              flexShrink: 0,
              minWidth: 'fit-content',
              maxWidth: '40%'
            }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '0.78rem',
                  color: '#1a237e',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em'
                }}
              >
                {metric.value.toFixed(0)}{metric.unit}
              </Typography>
              {metric.trend === 'up' ? (
                <TrendingUp sx={{ fontSize: 14, color: '#4caf50' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 14, color: '#f44336' }} />
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PerformanceMetrics;