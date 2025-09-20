import { apiService } from './api';

export interface Anomaly {
  id: string;
  metric: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  value: number;
  expectedValue: number;
  deviation: number;
  category?: string;
  affectedResources?: string[];
}

export interface Prediction {
  id: string;
  metric: string;
  period: string;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
  chartData?: Array<{ date: string; predicted: number; actual?: number }>;
  accuracy?: number;
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'revenue' | 'performance' | 'security' | 'efficiency' | 'user-experience';
  impact: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedImpact: string;
  priority: number;
  actionItems?: string[];
  effort?: 'low' | 'medium' | 'high';
  timeToImplement?: string;
}

export interface TrendData {
  date: string;
  revenue: number;
  users: number;
  conversion: number;
  [key: string]: string | number;
}

export interface InsightSummary {
  totalAnomalies: number;
  criticalIssues: number;
  predictionsCount: number;
  recommendationsCount: number;
  overallHealth: number; // 0-100
}

export const aiInsightsService = {
  // Get detected anomalies
  getAnomalies: async (period: string = '7d'): Promise<Anomaly[]> => {
    try {
      const response = await apiService.get<Anomaly[]>(`/api/v1/insights/anomalies?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching anomalies:', error);
      // Return mock data for development
      return getMockAnomalies();
    }
  },

  // Get predictions
  getPredictions: async (period: string = '7d'): Promise<Prediction[]> => {
    try {
      const response = await apiService.get<Prediction[]>(`/api/v1/insights/predictions?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return getMockPredictions();
    }
  },

  // Get AI recommendations
  getRecommendations: async (category?: string): Promise<Recommendation[]> => {
    try {
      const url = category
        ? `/api/v1/insights/recommendations?category=${category}`
        : '/api/v1/insights/recommendations';
      const response = await apiService.get<Recommendation[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return getMockRecommendations();
    }
  },

  // Get trend analysis data
  getTrendAnalysis: async (metric?: string, period: string = '7d'): Promise<TrendData[]> => {
    try {
      const url = `/api/v1/insights/trends?period=${period}${metric ? `&metric=${metric}` : ''}`;
      const response = await apiService.get<TrendData[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching trend analysis:', error);
      return getMockTrendData();
    }
  },

  // Get insights summary
  getInsightsSummary: async (): Promise<InsightSummary> => {
    try {
      const response = await apiService.get<InsightSummary>('/api/v1/insights/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching insights summary:', error);
      return {
        totalAnomalies: 5,
        criticalIssues: 1,
        predictionsCount: 8,
        recommendationsCount: 12,
        overallHealth: 75,
      };
    }
  },

  // Implement a recommendation
  implementRecommendation: async (recommendationId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(`/api/v1/insights/recommendations/${recommendationId}/implement`);
      return response.data;
    } catch (error) {
      console.error('Error implementing recommendation:', error);
      return { success: false, message: 'Failed to implement recommendation' };
    }
  },

  // Dismiss an anomaly
  dismissAnomaly: async (anomalyId: string, reason?: string): Promise<void> => {
    try {
      await apiService.post(`/api/v1/insights/anomalies/${anomalyId}/dismiss`, { reason });
    } catch (error) {
      console.error('Error dismissing anomaly:', error);
    }
  },

  // Export insights data
  exportInsights: async (format: 'pdf' | 'csv' | 'json'): Promise<Blob> => {
    try {
      const response = await apiService.get<Blob>(`/api/v1/insights/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting insights:', error);
      throw error;
    }
  },
};

// Mock data functions
function getMockAnomalies(): Anomaly[] {
  return [
    {
      id: '1',
      metric: 'Revenue',
      severity: 'high',
      description: 'Unusual 25% spike in revenue detected in the last 4 hours',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      value: 125000,
      expectedValue: 100000,
      deviation: 25,
      category: 'financial',
      affectedResources: ['Payment Gateway', 'Order Processing'],
    },
    {
      id: '2',
      metric: 'User Activity',
      severity: 'medium',
      description: 'Lower than expected user engagement on landing pages',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      value: 850,
      expectedValue: 1200,
      deviation: -29,
      category: 'engagement',
      affectedResources: ['Homepage', 'Product Pages'],
    },
    {
      id: '3',
      metric: 'API Response Time',
      severity: 'critical',
      description: 'API response time increased by 150% in the last hour',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      value: 750,
      expectedValue: 300,
      deviation: 150,
      category: 'performance',
      affectedResources: ['/api/v1/users', '/api/v1/products'],
    },
    {
      id: '4',
      metric: 'Error Rate',
      severity: 'low',
      description: 'Slight increase in 404 errors on documentation pages',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      value: 2.5,
      expectedValue: 1.8,
      deviation: 39,
      category: 'errors',
      affectedResources: ['Documentation'],
    },
  ];
}

function getMockPredictions(): Prediction[] {
  return [
    {
      id: '1',
      metric: 'Revenue Forecast',
      period: 'Q2 2024',
      predictedValue: 1500000,
      confidence: 85,
      trend: 'up',
      factors: ['Seasonal trends', 'Marketing campaign impact', 'Market growth', 'New product launch'],
      chartData: generatePredictionChartData(),
      accuracy: 92,
    },
    {
      id: '2',
      metric: 'Customer Churn',
      period: 'Next 30 days',
      predictedValue: 120,
      confidence: 78,
      trend: 'down',
      factors: ['Improved customer support', 'Product updates', 'Loyalty program', 'Competitive pricing'],
      chartData: generateChurnChartData(),
      accuracy: 88,
    },
    {
      id: '3',
      metric: 'User Growth',
      period: 'Next Quarter',
      predictedValue: 15000,
      confidence: 82,
      trend: 'up',
      factors: ['Organic traffic growth', 'Referral program', 'Content marketing', 'SEO improvements'],
      chartData: generateGrowthChartData(),
      accuracy: 90,
    },
    {
      id: '4',
      metric: 'Server Load',
      period: 'Next 7 days',
      predictedValue: 75,
      confidence: 91,
      trend: 'stable',
      factors: ['Historical patterns', 'Scheduled events', 'User behavior', 'System capacity'],
      accuracy: 94,
    },
  ];
}

function getMockRecommendations(): Recommendation[] {
  return [
    {
      id: '1',
      title: 'Optimize Marketing Spend',
      category: 'revenue',
      impact: 'high',
      description: 'Reallocate 20% of display ad budget to social media campaigns based on conversion analysis',
      estimatedImpact: '+15% conversion rate',
      priority: 1,
      actionItems: [
        'Reduce display ad spend by $10,000/month',
        'Increase Instagram ads by $7,000/month',
        'Increase LinkedIn ads by $3,000/month',
        'A/B test new ad creatives',
      ],
      effort: 'low',
      timeToImplement: '1 week',
    },
    {
      id: '2',
      title: 'Improve Page Load Speed',
      category: 'performance',
      impact: 'medium',
      description: 'Optimize images and implement lazy loading to improve Core Web Vitals',
      estimatedImpact: '-2s load time',
      priority: 2,
      actionItems: [
        'Compress all images above 100KB',
        'Implement WebP format',
        'Enable browser caching',
        'Minimize CSS and JavaScript',
      ],
      effort: 'medium',
      timeToImplement: '2 weeks',
    },
    {
      id: '3',
      title: 'Enhance Security Monitoring',
      category: 'security',
      impact: 'high',
      description: 'Implement advanced threat detection and real-time alerting system',
      estimatedImpact: '60% faster threat detection',
      priority: 3,
      actionItems: [
        'Deploy WAF rules',
        'Set up anomaly detection alerts',
        'Implement rate limiting',
        'Enable audit logging',
      ],
      effort: 'high',
      timeToImplement: '3 weeks',
    },
    {
      id: '4',
      title: 'Personalize User Experience',
      category: 'user-experience',
      impact: 'medium',
      description: 'Implement AI-driven content recommendations based on user behavior',
      estimatedImpact: '+25% engagement',
      priority: 4,
      actionItems: [
        'Track user preferences',
        'Build recommendation engine',
        'Create personalized dashboards',
        'A/B test recommendations',
      ],
      effort: 'high',
      timeToImplement: '4 weeks',
    },
  ];
}

function getMockTrendData(): TrendData[] {
  const data: TrendData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(90000 + Math.random() * 30000 + (29 - i) * 1000),
      users: Math.floor(900 + Math.random() * 300 + (29 - i) * 10),
      conversion: parseFloat((3 + Math.random() * 0.5 + (29 - i) * 0.01).toFixed(2)),
      orders: Math.floor(200 + Math.random() * 50 + (29 - i) * 2),
      pageViews: Math.floor(5000 + Math.random() * 1000 + (29 - i) * 20),
    });
  }

  return data;
}

function generatePredictionChartData() {
  const data = [];
  const today = new Date();

  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    data.push({
      date: date.toISOString().split('T')[0],
      predicted: Math.floor(400000 + Math.random() * 100000 + i * 1000),
      actual: i < 30 ? Math.floor(380000 + Math.random() * 100000) : undefined,
    });
  }

  return data;
}

function generateChurnChartData() {
  const data = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    data.push({
      date: date.toISOString().split('T')[0],
      predicted: Math.floor(120 - i * 0.5 + Math.random() * 10),
      actual: i < 7 ? Math.floor(125 - i * 0.5 + Math.random() * 8) : undefined,
    });
  }

  return data;
}

function generateGrowthChartData() {
  const data = [];
  const today = new Date();

  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    data.push({
      date: date.toISOString().split('T')[0],
      predicted: Math.floor(10000 + i * 50 + Math.random() * 200),
      actual: i < 30 ? Math.floor(9800 + i * 45 + Math.random() * 150) : undefined,
    });
  }

  return data;
}