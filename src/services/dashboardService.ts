import { apiService } from './api';

export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number;
  activeUsers: number;
  usersChange: number;
  conversionRate: number;
  conversionChange: number;
  salesToday: number;
  salesChange: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }>;
}

export interface PerformanceData {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

export interface RevenueBreakdown {
  categories: string[];
  values: number[];
}

export interface UserActivity {
  dates: string[];
  activities: number[][];
}

export const dashboardService = {
  // Get dashboard metrics
  getMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const response = await apiService.get<DashboardMetrics>('/api/v1/dashboards/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      // Return mock data as fallback
      return {
        totalRevenue: 2847650,
        revenueChange: 12.5,
        activeUsers: 15420,
        usersChange: 8.3,
        conversionRate: 3.24,
        conversionChange: -2.1,
        salesToday: 45320,
        salesChange: 15.7
      };
    }
  },

  // Get financial chart data
  getFinancialData: async (period: string = 'month'): Promise<ChartData> => {
    try {
      const response = await apiService.get<ChartData>(`/api/v1/dashboards/financial?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial data:', error);
      // Return mock data as fallback
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return {
        labels: months,
        datasets: [
          {
            label: 'Revenue',
            data: [65000, 78000, 85000, 92000, 88000, 95000],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            fill: true
          },
          {
            label: 'Profit',
            data: [35000, 42000, 48000, 52000, 49000, 55000],
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true
          }
        ]
      };
    }
  },

  // Get performance metrics
  getPerformanceData: async (): Promise<PerformanceData> => {
    try {
      const response = await apiService.get<PerformanceData>('/api/v1/dashboards/performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching performance data:', error);
      return {
        cpu: 67,
        memory: 84,
        storage: 45,
        network: 92
      };
    }
  },

  // Get revenue breakdown
  getRevenueBreakdown: async (): Promise<RevenueBreakdown> => {
    try {
      const response = await apiService.get<RevenueBreakdown>('/api/v1/dashboards/revenue-breakdown');
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue breakdown:', error);
      return {
        categories: ['Subscription', 'Professional Services', 'Enterprise', 'Marketplace'],
        values: [45, 25, 20, 10]
      };
    }
  },

  // Get user activity heatmap data
  getUserActivity: async (): Promise<UserActivity> => {
    try {
      const response = await apiService.get<UserActivity>('/api/v1/dashboards/user-activity');
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      const dates = [];
      const activities = [];

      // Generate mock 7x24 grid (7 days, 24 hours)
      for (let day = 0; day < 7; day++) {
        const dayData = [];
        for (let hour = 0; hour < 24; hour++) {
          dayData.push(Math.floor(Math.random() * 100));
        }
        activities.push(dayData);
      }

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.unshift(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }

      return { dates, activities };
    }
  }
};