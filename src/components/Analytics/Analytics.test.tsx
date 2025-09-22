import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Analytics from './Analytics';
import { analyticsService } from '../../services/analyticsService';

// Mock the Analytics service
jest.mock('../../services/analyticsService');

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
  PieChart: ({ children, ...props }: any) => <div data-testid="pie-chart" {...props}>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  AreaChart: ({ children, ...props }: any) => <div data-testid="area-chart" {...props}>{children}</div>,
  Area: () => null,
  RadialBarChart: ({ children, ...props }: any) => <div data-testid="radial-bar-chart" {...props}>{children}</div>,
  RadialBar: () => null,
}));

describe('Analytics Component', () => {
  const mockMetrics = {
    revenue: {
      current: 2456789,
      previous: 2234567,
      change: 9.94,
      trend: 'up' as const,
    },
    users: {
      current: 45678,
      previous: 42345,
      change: 7.87,
      trend: 'up' as const,
    },
    conversionRate: {
      current: 3.45,
      previous: 3.21,
      change: 7.48,
      trend: 'up' as const,
    },
    avgSessionDuration: {
      current: 245,
      previous: 230,
      change: 6.52,
      trend: 'up' as const,
    },
  };

  const mockTimeSeriesData = [
    { date: '2024-01-01', revenue: 95000, users: 2100, conversions: 65 },
    { date: '2024-01-02', revenue: 98000, users: 2200, conversions: 68 },
    { date: '2024-01-03', revenue: 102000, users: 2350, conversions: 72 },
    { date: '2024-01-04', revenue: 105000, users: 2400, conversions: 75 },
    { date: '2024-01-05', revenue: 110000, users: 2500, conversions: 78 },
  ];

  const mockChannelData = [
    { channel: 'Organic Search', traffic: 35, revenue: 45, color: '#4CAF50' },
    { channel: 'Paid Search', traffic: 25, revenue: 30, color: '#2196F3' },
    { channel: 'Social Media', traffic: 20, revenue: 15, color: '#FF9800' },
    { channel: 'Direct', traffic: 15, revenue: 8, color: '#9C27B0' },
    { channel: 'Email', traffic: 5, revenue: 2, color: '#00BCD4' },
  ];

  const mockConversionFunnel = [
    { stage: 'Visitors', value: 10000, percentage: 100 },
    { stage: 'Sign Ups', value: 3000, percentage: 30 },
    { stage: 'Active Users', value: 2000, percentage: 20 },
    { stage: 'Paid Users', value: 500, percentage: 5 },
  ];

  const mockGeographicData = [
    { country: 'United States', users: 12345, revenue: 456789 },
    { country: 'United Kingdom', users: 8765, revenue: 234567 },
    { country: 'Canada', users: 6543, revenue: 187654 },
    { country: 'Australia', users: 4321, revenue: 123456 },
    { country: 'Germany', users: 3210, revenue: 98765 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (analyticsService.getKeyMetrics as jest.Mock).mockResolvedValue(mockMetrics);
    (analyticsService.getTimeSeriesData as jest.Mock).mockResolvedValue(mockTimeSeriesData);
    (analyticsService.getChannelAnalytics as jest.Mock).mockResolvedValue(mockChannelData);
    (analyticsService.getConversionFunnel as jest.Mock).mockResolvedValue(mockConversionFunnel);
    (analyticsService.getGeographicData as jest.Mock).mockResolvedValue(mockGeographicData);
  });

  describe('Component Rendering', () => {
    test('renders Analytics dashboard with main sections', async () => {
      render(<Analytics />);

      expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
      expect(screen.getByText(/Comprehensive data analysis/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Key Metrics')).toBeInTheDocument();
        expect(screen.getByText('Revenue Trends')).toBeInTheDocument();
        expect(screen.getByText('Channel Performance')).toBeInTheDocument();
        expect(screen.getByText('Conversion Funnel')).toBeInTheDocument();
      });
    });

    test('displays loading state initially', () => {
      render(<Analytics />);
      // 4 metric cards + 4 chart sections = 8 progress bars
      expect(screen.getAllByRole('progressbar')).toHaveLength(8);
    });

    test('renders date range selector and refresh button', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /last 30 days/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
      });
    });
  });

  describe('Key Metrics Section', () => {
    test('displays all key metrics with values', async () => {
      render(<Analytics />);

      await waitFor(() => {
        // Check for metric values specifically
        expect(screen.getByText('$2,456,789')).toBeInTheDocument();
        expect(screen.getByText('+9.94%')).toBeInTheDocument();

        expect(screen.getByText('Total Users')).toBeInTheDocument();
        expect(screen.getByText('45,678')).toBeInTheDocument();
        expect(screen.getByText('+7.87%')).toBeInTheDocument();

        expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
        expect(screen.getByText('3.45%')).toBeInTheDocument();

        expect(screen.getByText('Avg Session Duration')).toBeInTheDocument();
        expect(screen.getByText('4m 5s')).toBeInTheDocument();
      });
    });

    test('shows comparison with previous period', async () => {
      render(<Analytics />);

      await waitFor(() => {
        const compareButtons = screen.getAllByText(/vs last period/i);
        expect(compareButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Revenue Trends Section', () => {
    test('displays revenue trend chart', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      });
    });

    test('allows metric selection for trends', async () => {
      render(<Analytics />);

      await waitFor(() => {
        const metricSelector = screen.getByLabelText(/select metric/i);
        expect(metricSelector).toBeInTheDocument();
      });

      const selector = screen.getByLabelText(/select metric/i);
      fireEvent.mouseDown(selector);

      const options = await screen.findAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });

    test('displays time period tabs', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /daily/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /weekly/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /monthly/i })).toBeInTheDocument();
      });
    });
  });

  describe('Channel Performance Section', () => {
    test('displays channel distribution pie chart', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      });
    });

    test('shows channel performance table', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText('Organic Search')).toBeInTheDocument();
        expect(screen.getByText('35%')).toBeInTheDocument(); // traffic percentage

        expect(screen.getByText('Paid Search')).toBeInTheDocument();
        expect(screen.getByText('25%')).toBeInTheDocument();
      });
    });

  });

  describe('Conversion Funnel Section', () => {
    test('displays funnel visualization', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText('Visitors')).toBeInTheDocument();
        expect(screen.getByText('10,000')).toBeInTheDocument();

        expect(screen.getByText('Sign Ups')).toBeInTheDocument();
        expect(screen.getByText('3,000')).toBeInTheDocument();

        expect(screen.getByText('Active Users')).toBeInTheDocument();
        expect(screen.getByText('Paid Users')).toBeInTheDocument();
      });
    });

    test('shows conversion percentages between stages', async () => {
      render(<Analytics />);

      await waitFor(() => {
        // Check that conversion funnel is rendered
        expect(screen.getByText('Conversion Funnel')).toBeInTheDocument();
      });

      // Wait a bit for the data to load
      await waitFor(() => {
        // Check for funnel stages and percentages
        expect(screen.getByText('100%')).toBeInTheDocument(); // Visitors
        const thirtyPercents = screen.queryAllByText('30%');
        expect(thirtyPercents.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Geographic Distribution', () => {
    test('displays geographic data', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText('Geographic Distribution')).toBeInTheDocument();
        expect(screen.getByText('United States')).toBeInTheDocument();
        expect(screen.getByText('12,345 users')).toBeInTheDocument();
      });
    });

    test('shows top countries by users', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText('United Kingdom')).toBeInTheDocument();
        expect(screen.getByText('Canada')).toBeInTheDocument();
        expect(screen.getByText('Australia')).toBeInTheDocument();
        expect(screen.getByText('Germany')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    test('refreshes data when refresh button is clicked', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);

      expect(analyticsService.getKeyMetrics).toHaveBeenCalledTimes(2);
      expect(analyticsService.getTimeSeriesData).toHaveBeenCalledTimes(2);
    });

    test('changes date range when selector is changed', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /last 30 days/i })).toBeInTheDocument();
      });

      const dateRangeButton = screen.getByRole('button', { name: /last 30 days/i });
      fireEvent.click(dateRangeButton);

      const menu = await screen.findByRole('menu');
      const sevenDaysOption = within(menu).getByText('Last 7 Days');
      fireEvent.click(sevenDaysOption);

      expect(analyticsService.getKeyMetrics).toHaveBeenCalledWith('7d');
      expect(analyticsService.getTimeSeriesData).toHaveBeenCalledWith('7d', 'revenue');
    });
  });

  describe('Export Functionality', () => {
    test('renders export button', async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
      });
    });

    test('shows export options when clicked', async () => {
      render(<Analytics />);

      await waitFor(() => {
        const exportButton = screen.getByRole('button', { name: /export/i });
        fireEvent.click(exportButton);
      });

      expect(await screen.findByText('Export as PDF')).toBeInTheDocument();
      expect(screen.getByText('Export as CSV')).toBeInTheDocument();
      expect(screen.getByText('Export as Excel')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('displays error message when API call fails', async () => {
      const errorMessage = 'Failed to load analytics data';
      (analyticsService.getKeyMetrics as jest.Mock).mockRejectedValue(new Error(errorMessage));

      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading analytics/i)).toBeInTheDocument();
      });
    });

    test('shows retry button on error', async () => {
      (analyticsService.getKeyMetrics as jest.Mock).mockRejectedValue(new Error('API Error'));

      render(<Analytics />);

      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
      });
    });
  });
});