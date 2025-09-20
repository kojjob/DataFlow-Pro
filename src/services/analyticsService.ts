import { apiService } from './api';

export interface KeyMetrics {
  revenue: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  users: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  conversionRate: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  avgSessionDuration: {
    current: number; // in seconds
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  users: number;
  conversions: number;
  sessions?: number;
  pageViews?: number;
  bounceRate?: number;
}

export interface ChannelData {
  channel: string;
  traffic: number; // percentage
  revenue: number; // percentage
  conversions?: number;
  avgOrderValue?: number;
  color: string;
}

export interface ConversionFunnel {
  stage: string;
  value: number;
  percentage: number;
  dropoff?: number;
}

export interface GeographicData {
  country: string;
  users: number;
  revenue: number;
  sessions?: number;
  avgSessionDuration?: number;
  conversionRate?: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalUsers: number;
  avgConversionRate: number;
  topChannel: string;
  topCountry: string;
  periodComparison: 'better' | 'worse' | 'same';
}

export const analyticsService = {
  // Get key performance metrics
  getKeyMetrics: async (period: string = '30d'): Promise<KeyMetrics> => {
    try {
      const response = await apiService.get<KeyMetrics>(`/api/v1/analytics/metrics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching key metrics:', error);
      // Return mock data for development
      return getMockKeyMetrics();
    }
  },

  // Get time series data for charts
  getTimeSeriesData: async (period: string = '30d', metric: string = 'revenue'): Promise<TimeSeriesData[]> => {
    try {
      const response = await apiService.get<TimeSeriesData[]>(
        `/api/v1/analytics/timeseries?period=${period}&metric=${metric}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching time series data:', error);
      return getMockTimeSeriesData();
    }
  },

  // Get channel analytics
  getChannelAnalytics: async (period: string = '30d'): Promise<ChannelData[]> => {
    try {
      const response = await apiService.get<ChannelData[]>(`/api/v1/analytics/channels?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching channel analytics:', error);
      return getMockChannelData();
    }
  },

  // Get conversion funnel data
  getConversionFunnel: async (period: string = '30d'): Promise<ConversionFunnel[]> => {
    try {
      const response = await apiService.get<ConversionFunnel[]>(`/api/v1/analytics/funnel?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversion funnel:', error);
      return getMockConversionFunnel();
    }
  },

  // Get geographic distribution data
  getGeographicData: async (period: string = '30d'): Promise<GeographicData[]> => {
    try {
      const response = await apiService.get<GeographicData[]>(`/api/v1/analytics/geographic?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching geographic data:', error);
      return getMockGeographicData();
    }
  },

  // Get analytics summary
  getAnalyticsSummary: async (period: string = '30d'): Promise<AnalyticsSummary> => {
    try {
      const response = await apiService.get<AnalyticsSummary>(`/api/v1/analytics/summary?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      return {
        totalRevenue: 2456789,
        totalUsers: 45678,
        avgConversionRate: 3.45,
        topChannel: 'Organic Search',
        topCountry: 'United States',
        periodComparison: 'better',
      };
    }
  },

  // Export analytics data
  exportAnalytics: async (format: 'pdf' | 'csv' | 'excel', period: string = '30d'): Promise<Blob> => {
    try {
      const response = await apiService.get<Blob>(`/api/v1/analytics/export?format=${format}&period=${period}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw error;
    }
  },

  // Real-time analytics updates (WebSocket ready)
  subscribeToRealTimeUpdates: (callback: (data: any) => void) => {
    // WebSocket implementation would go here
    // For now, simulate with interval
    const interval = setInterval(() => {
      callback({
        timestamp: new Date().toISOString(),
        activeUsers: Math.floor(Math.random() * 100) + 50,
        realtimeRevenue: Math.floor(Math.random() * 1000) + 500,
      });
    }, 5000);

    return () => clearInterval(interval);
  },
};

// Mock data functions
function getMockKeyMetrics(): KeyMetrics {
  return {
    revenue: {
      current: 2456789,
      previous: 2234567,
      change: 9.94,
      trend: 'up',
    },
    users: {
      current: 45678,
      previous: 42345,
      change: 7.87,
      trend: 'up',
    },
    conversionRate: {
      current: 3.45,
      previous: 3.21,
      change: 7.48,
      trend: 'up',
    },
    avgSessionDuration: {
      current: 245, // seconds
      previous: 230,
      change: 6.52,
      trend: 'up',
    },
  };
}

function getMockTimeSeriesData(): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(80000 + Math.random() * 40000 + (29 - i) * 1000),
      users: Math.floor(2000 + Math.random() * 500 + (29 - i) * 10),
      conversions: Math.floor(50 + Math.random() * 30 + (29 - i) * 1),
      sessions: Math.floor(3000 + Math.random() * 1000 + (29 - i) * 20),
      pageViews: Math.floor(10000 + Math.random() * 5000 + (29 - i) * 100),
      bounceRate: parseFloat((40 + Math.random() * 20).toFixed(2)),
    });
  }

  return data;
}

function getMockChannelData(): ChannelData[] {
  return [
    {
      channel: 'Organic Search',
      traffic: 35,
      revenue: 45,
      conversions: 280,
      avgOrderValue: 125,
      color: '#4CAF50',
    },
    {
      channel: 'Paid Search',
      traffic: 25,
      revenue: 30,
      conversions: 200,
      avgOrderValue: 110,
      color: '#2196F3',
    },
    {
      channel: 'Social Media',
      traffic: 20,
      revenue: 15,
      conversions: 120,
      avgOrderValue: 95,
      color: '#FF9800',
    },
    {
      channel: 'Direct',
      traffic: 15,
      revenue: 8,
      conversions: 80,
      avgOrderValue: 150,
      color: '#9C27B0',
    },
    {
      channel: 'Email',
      traffic: 5,
      revenue: 2,
      conversions: 40,
      avgOrderValue: 200,
      color: '#00BCD4',
    },
  ];
}

function getMockConversionFunnel(): ConversionFunnel[] {
  return [
    {
      stage: 'Visitors',
      value: 10000,
      percentage: 100,
      dropoff: 0,
    },
    {
      stage: 'Sign Ups',
      value: 3000,
      percentage: 30,
      dropoff: 70,
    },
    {
      stage: 'Active Users',
      value: 2000,
      percentage: 20,
      dropoff: 33.33,
    },
    {
      stage: 'Paid Users',
      value: 500,
      percentage: 5,
      dropoff: 75,
    },
  ];
}

function getMockGeographicData(): GeographicData[] {
  return [
    {
      country: 'United States',
      users: 12345,
      revenue: 456789,
      sessions: 23456,
      avgSessionDuration: 256,
      conversionRate: 3.8,
    },
    {
      country: 'United Kingdom',
      users: 8765,
      revenue: 234567,
      sessions: 15678,
      avgSessionDuration: 234,
      conversionRate: 3.5,
    },
    {
      country: 'Canada',
      users: 6543,
      revenue: 187654,
      sessions: 12345,
      avgSessionDuration: 245,
      conversionRate: 3.6,
    },
    {
      country: 'Australia',
      users: 4321,
      revenue: 123456,
      sessions: 8765,
      avgSessionDuration: 267,
      conversionRate: 3.9,
    },
    {
      country: 'Germany',
      users: 3210,
      revenue: 98765,
      sessions: 6543,
      avgSessionDuration: 223,
      conversionRate: 3.2,
    },
  ];
}