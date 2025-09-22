import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIInsights from './AIInsights';
import { aiInsightsService } from '../../services/aiInsightsService';

// Mock the AI Insights service
jest.mock('../../services/aiInsightsService');

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Chart components
jest.mock('recharts', () => ({
  LineChart: ({ children, ...props }: any) => <div data-testid="line-chart" {...props}>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children, ...props }: any) => <div data-testid="bar-chart" {...props}>{children}</div>,
  Bar: () => null,
  RadarChart: ({ children, ...props }: any) => <div data-testid="radar-chart" {...props}>{children}</div>,
  Radar: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
  Area: () => null,
  AreaChart: ({ children, ...props }: any) => <div data-testid="area-chart" {...props}>{children}</div>,
}));

describe('AIInsights Component', () => {
  const mockAnomalies = [
    {
      id: '1',
      metric: 'Revenue',
      severity: 'high',
      description: 'Unusual 25% spike in revenue detected',
      timestamp: '2024-01-15T10:30:00Z',
      value: 125000,
      expectedValue: 100000,
      deviation: 25,
    },
    {
      id: '2',
      metric: 'User Activity',
      severity: 'medium',
      description: 'Lower than expected user engagement',
      timestamp: '2024-01-15T09:00:00Z',
      value: 850,
      expectedValue: 1200,
      deviation: -29,
    },
  ];

  const mockPredictions = [
    {
      id: '1',
      metric: 'Revenue Forecast',
      period: 'Q2 2024',
      predictedValue: 1500000,
      confidence: 85,
      trend: 'up',
      factors: ['Seasonal trends', 'Marketing campaign impact', 'Market growth'],
    },
    {
      id: '2',
      metric: 'Customer Churn',
      period: 'Next 30 days',
      predictedValue: 120,
      confidence: 78,
      trend: 'down',
      factors: ['Improved support', 'Product updates', 'Loyalty program'],
    },
  ];

  const mockRecommendations = [
    {
      id: '1',
      title: 'Optimize Marketing Spend',
      category: 'revenue',
      impact: 'high',
      description: 'Reallocate 20% of display ad budget to social media campaigns',
      estimatedImpact: '+15% conversion rate',
      priority: 1,
    },
    {
      id: '2',
      title: 'Improve Page Load Speed',
      category: 'performance',
      impact: 'medium',
      description: 'Optimize images and implement lazy loading',
      estimatedImpact: '-2s load time',
      priority: 2,
    },
  ];

  const mockTrendData = [
    { date: '2024-01-01', revenue: 95000, users: 1000, conversion: 3.2 },
    { date: '2024-01-02', revenue: 98000, users: 1050, conversion: 3.3 },
    { date: '2024-01-03', revenue: 102000, users: 1100, conversion: 3.4 },
    { date: '2024-01-04', revenue: 105000, users: 1150, conversion: 3.5 },
    { date: '2024-01-05', revenue: 110000, users: 1200, conversion: 3.6 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (aiInsightsService.getAnomalies as jest.Mock).mockResolvedValue(mockAnomalies);
    (aiInsightsService.getPredictions as jest.Mock).mockResolvedValue(mockPredictions);
    (aiInsightsService.getRecommendations as jest.Mock).mockResolvedValue(mockRecommendations);
    (aiInsightsService.getTrendAnalysis as jest.Mock).mockResolvedValue(mockTrendData);
  });

  describe('Component Rendering', () => {
    test('renders AI Insights dashboard with main sections', async () => {
      render(<AIInsights />);

      expect(screen.getByText('AI Insights Dashboard')).toBeInTheDocument();
      expect(screen.getByText(/Powered by advanced machine learning/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Anomaly Detection')).toBeInTheDocument();
        expect(screen.getByText('Predictive Analytics')).toBeInTheDocument();
        expect(screen.getByText('AI Recommendations')).toBeInTheDocument();
        expect(screen.getByText('Trend Analysis')).toBeInTheDocument();
      });
    });

    test('displays loading state initially', () => {
      render(<AIInsights />);
      expect(screen.getAllByRole('progressbar')).toHaveLength(4); // One for each section
    });

    test('renders refresh button and time period selector', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /last 7 days/i })).toBeInTheDocument();
      });
    });
  });

  describe('Anomaly Detection Section', () => {
    test('displays anomalies with correct severity badges', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        const highSeverityAnomaly = screen.getByText('Unusual 25% spike in revenue detected');
        expect(highSeverityAnomaly).toBeInTheDocument();

        const anomalyCard = highSeverityAnomaly.closest('.MuiPaper-root');
        expect(anomalyCard).toHaveTextContent('high');
        expect(anomalyCard).toHaveTextContent('Revenue');
      });
    });

    test('shows deviation percentages for each anomaly', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByText('+25%')).toBeInTheDocument();
        expect(screen.getByText('-29%')).toBeInTheDocument();
      });
    });

    test('displays "View Details" button for each anomaly', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
        expect(viewDetailsButtons).toHaveLength(2);
      });
    });
  });

  describe('Predictive Analytics Section', () => {
    test('displays predictions with confidence scores', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByText('Revenue Forecast')).toBeInTheDocument();
        expect(screen.getByText('85% confidence')).toBeInTheDocument();
        expect(screen.getByText('Customer Churn')).toBeInTheDocument();
        expect(screen.getByText('78% confidence')).toBeInTheDocument();
      });
    });

    test('shows trend indicators for predictions', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        const revenueCard = screen.getByText('Revenue Forecast').closest('.MuiPaper-root');
        expect(revenueCard).toHaveTextContent('Q2 2024');

        const churnCard = screen.getByText('Customer Churn').closest('.MuiPaper-root');
        expect(churnCard).toHaveTextContent('Next 30 days');
      });
    });

    test('displays contributing factors for each prediction', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByText('Seasonal trends')).toBeInTheDocument();
        expect(screen.getByText('Marketing campaign impact')).toBeInTheDocument();
        expect(screen.getByText('Improved support')).toBeInTheDocument();
      });
    });
  });

  describe('AI Recommendations Section', () => {
    test('displays recommendations with priority ordering', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        const recommendations = screen.getAllByTestId(/recommendation-card/i);
        expect(recommendations[0]).toHaveTextContent('Optimize Marketing Spend');
        expect(recommendations[1]).toHaveTextContent('Improve Page Load Speed');
      });
    });

    test('shows impact badges for recommendations', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByText('high impact')).toBeInTheDocument();
        expect(screen.getByText('medium impact')).toBeInTheDocument();
      });
    });

    test('displays estimated impact for each recommendation', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByText('+15% conversion rate')).toBeInTheDocument();
        expect(screen.getByText('-2s load time')).toBeInTheDocument();
      });
    });

    test('shows "Implement" button for each recommendation', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        const implementButtons = screen.getAllByRole('button', { name: /implement/i });
        expect(implementButtons).toHaveLength(2);
      });
    });
  });

  describe('Trend Analysis Section', () => {
    test('renders trend analysis chart', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      });
    });

    test('displays metric selector for trend analysis', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        const metricSelector = screen.getByLabelText(/select metric/i);
        expect(metricSelector).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    test('refreshes data when refresh button is clicked', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);

      expect(aiInsightsService.getAnomalies).toHaveBeenCalledTimes(2);
      expect(aiInsightsService.getPredictions).toHaveBeenCalledTimes(2);
      expect(aiInsightsService.getRecommendations).toHaveBeenCalledTimes(2);
      expect(aiInsightsService.getTrendAnalysis).toHaveBeenCalledTimes(2);
    });

    test('changes time period when selector is changed', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /last 7 days/i })).toBeInTheDocument();
      });

      const periodButton = screen.getByRole('button', { name: /last 7 days/i });
      fireEvent.click(periodButton);

      const menu = await screen.findByRole('menu');
      const thirtyDaysOption = within(menu).getByText('Last 30 Days');
      fireEvent.click(thirtyDaysOption);

      expect(aiInsightsService.getAnomalies).toHaveBeenCalledWith('30d');
      expect(aiInsightsService.getPredictions).toHaveBeenCalledWith('30d');
    });

    test('opens anomaly details when "View Details" is clicked', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
        expect(viewDetailsButtons[0]).toBeInTheDocument();
      });

      const firstViewButton = screen.getAllByRole('button', { name: /view details/i })[0];
      fireEvent.click(firstViewButton);

      // Check if dialog or expanded view appears
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      expect(screen.getByText(/Expected Value:/i)).toBeInTheDocument();
      expect(screen.getByText('100,000')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('displays error message when API call fails', async () => {
      const errorMessage = 'Failed to load insights';
      (aiInsightsService.getAnomalies as jest.Mock).mockRejectedValue(new Error(errorMessage));

      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading anomalies/i)).toBeInTheDocument();
      });
    });

    test('shows retry button on error', async () => {
      (aiInsightsService.getAnomalies as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<AIInsights />);

      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
      });
    });
  });

  describe('Export Functionality', () => {
    test('renders export button', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /export insights/i })).toBeInTheDocument();
      });
    });

    test('exports data when export button is clicked', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        const exportButton = screen.getByRole('button', { name: /export insights/i });
        fireEvent.click(exportButton);
      });

      // Check if export menu appears
      expect(await screen.findByText('Export as PDF')).toBeInTheDocument();
      expect(screen.getByText('Export as CSV')).toBeInTheDocument();
      expect(screen.getByText('Export as JSON')).toBeInTheDocument();
    });
  });

  describe('Real-time Updates', () => {
    test('shows real-time indicator when connected', async () => {
      render(<AIInsights />);

      await waitFor(() => {
        expect(screen.getByText(/real-time/i)).toBeInTheDocument();
        expect(screen.getByTestId('real-time-indicator')).toHaveStyle({ backgroundColor: 'green' });
      });
    });
  });
});