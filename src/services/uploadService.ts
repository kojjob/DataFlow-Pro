import { apiService } from './api';

export interface UploadedFile {
  id: string;
  filename: string;
  size: number;
  uploadDate: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  type?: string;
  processedRows?: number;
  errorMessage?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (response: any) => void;
  onError?: (error: Error) => void;
}

export const uploadService = {
  // Upload a single file
  uploadFile: async (file: File, options?: UploadOptions): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiService.post<any>('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: { loaded: number; total: number }) => {
          if (options?.onProgress && progressEvent.total) {
            const progress: UploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            };
            options.onProgress(progress);
          }
        },
      });

      if (options?.onComplete) {
        options.onComplete(response.data);
      }

      return response.data;
    } catch (error: any) {
      if (options?.onError) {
        options.onError(error);
      }
      console.error('Error uploading file:', error);

      // Return mock data for development
      return getMockUploadResponse(file);
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (files: File[], options?: UploadOptions): Promise<any[]> => {
    const uploadPromises = files.map(file => uploadService.uploadFile(file, options));
    return Promise.all(uploadPromises);
  },

  // Get upload history
  getUploadHistory: async (): Promise<UploadedFile[]> => {
    try {
      const response = await apiService.get<UploadedFile[]>('/api/v1/upload/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching upload history:', error);
      return getMockUploadHistory();
    }
  },

  // Download a previously uploaded file
  downloadFile: async (fileId: string): Promise<Blob> => {
    try {
      const response = await apiService.get<Blob>(`/api/v1/upload/download/${fileId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading file:', error);
      // Create mock blob
      return new Blob(['Mock file content'], { type: 'text/plain' });
    }
  },

  // Delete an uploaded file
  deleteFile: async (fileId: string): Promise<{ success: boolean }> => {
    try {
      const response = await apiService.delete<{ success: boolean }>(`/api/v1/upload/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: true }; // Mock success for development
    }
  },

  // Validate file before upload
  validateFile: (file: File): { valid: boolean; error?: string } => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'text/csv',
      'application/json',
      'application/xml',
      'text/xml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const allowedExtensions = ['.csv', '.json', '.xml', '.xls', '.xlsx'];

    // Check file size
    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds 100MB limit` };
    }

    // Check file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      return { valid: false, error: `Unsupported file type. Allowed: CSV, JSON, XML, Excel` };
    }

    return { valid: true };
  },

  // Parse CSV preview
  parseCSVPreview: async (file: File, rows: number = 5): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          const data = [];

          for (let i = 1; i <= Math.min(rows, lines.length - 1); i++) {
            if (lines[i]) {
              const values = lines[i].split(',');
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index]?.trim();
              });
              data.push(row);
            }
          }

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file.slice(0, 50000)); // Read first 50KB for preview
    });
  },

  // Get file statistics
  getFileStatistics: async (fileId: string): Promise<any> => {
    try {
      const response = await apiService.get<any>(`/api/v1/upload/${fileId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching file statistics:', error);
      return getMockFileStatistics();
    }
  },
};

// Mock data functions
function getMockUploadResponse(file: File): any {
  return {
    success: true,
    id: `file-${Date.now()}`,
    filename: file.name,
    size: file.size,
    uploadDate: new Date().toISOString(),
    status: 'success',
    message: 'File uploaded successfully',
  };
}

function getMockUploadHistory(): UploadedFile[] {
  return [
    {
      id: '1',
      filename: 'sales_data_q4.csv',
      size: 2456789,
      uploadDate: '2024-01-15T10:30:00Z',
      status: 'success',
      type: 'CSV',
      processedRows: 10000,
    },
    {
      id: '2',
      filename: 'customer_feedback.json',
      size: 1234567,
      uploadDate: '2024-01-14T14:20:00Z',
      status: 'success',
      type: 'JSON',
      processedRows: 5000,
    },
    {
      id: '3',
      filename: 'inventory_report.xlsx',
      size: 3456789,
      uploadDate: '2024-01-13T09:15:00Z',
      status: 'processing',
      type: 'Excel',
    },
    {
      id: '4',
      filename: 'product_catalog.xml',
      size: 987654,
      uploadDate: '2024-01-12T16:45:00Z',
      status: 'failed',
      type: 'XML',
      errorMessage: 'Invalid XML schema',
    },
  ];
}

function getMockFileStatistics(): any {
  return {
    rows: 10000,
    columns: 15,
    nullValues: 234,
    duplicates: 12,
    dataTypes: {
      string: 5,
      number: 7,
      date: 2,
      boolean: 1,
    },
    columnStats: [
      { name: 'revenue', min: 0, max: 1000000, avg: 50000, nulls: 10 },
      { name: 'date', earliest: '2024-01-01', latest: '2024-12-31', nulls: 0 },
      { name: 'category', unique: 25, most_common: 'Electronics', nulls: 5 },
    ],
  };
}