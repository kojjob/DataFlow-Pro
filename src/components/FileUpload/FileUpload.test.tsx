import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from './FileUpload';
import { uploadService } from '../../services/uploadService';

// Mock the upload service
jest.mock('../../services/uploadService', () => ({
  uploadService: {
    validateFile: jest.fn((file) => {
      if (file.type === 'application/pdf') {
        return { valid: false, error: 'Unsupported file type' };
      }
      if (file.size > 100 * 1024 * 1024) {
        return { valid: false, error: 'File size exceeds 100MB limit' };
      }
      return { valid: true };
    }),
    uploadFile: jest.fn(),
    getUploadHistory: jest.fn().mockResolvedValue([]),
    downloadFile: jest.fn(),
    deleteFile: jest.fn(),
    parseCSVPreview: jest.fn().mockResolvedValue([
      { col1: 'val1', col2: 'val2' }
    ]),
  }
}));

describe('FileUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the file upload component', () => {
      render(<FileUpload />);
      expect(screen.getByText('File Upload')).toBeInTheDocument();
      expect(screen.getByText(/Upload and ingest data files/i)).toBeInTheDocument();
    });

    it('should render the drop zone area', () => {
      render(<FileUpload />);
      expect(screen.getByText(/Drag and drop files here/i)).toBeInTheDocument();
      expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
    });

    it('should display supported file formats', () => {
      render(<FileUpload />);
      expect(screen.getByText(/CSV/i)).toBeInTheDocument();
      expect(screen.getByText(/Excel/i)).toBeInTheDocument();
      expect(screen.getByText(/JSON/i)).toBeInTheDocument();
      expect(screen.getByText(/XML/i)).toBeInTheDocument();
    });

    it('should show upload history section', () => {
      render(<FileUpload />);
      expect(screen.getByText('Upload History')).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should handle file selection through click', async () => {
      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument();
      });
    });

    it('should handle multiple file selection', async () => {
      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const files = [
        new File(['test1'], 'test1.csv', { type: 'text/csv' }),
        new File(['test2'], 'test2.json', { type: 'application/json' })
      ];

      fireEvent.change(input, { target: { files } });

      await waitFor(() => {
        expect(screen.getByText('test1.csv')).toBeInTheDocument();
        expect(screen.getByText('test2.json')).toBeInTheDocument();
      });
    });

    it('should reject unsupported file types', async () => {
      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Unsupported file type/i)).toBeInTheDocument();
      });
    });

    it('should enforce file size limit', async () => {
      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const largeFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large.csv', { type: 'text/csv' });
      Object.defineProperty(largeFile, 'size', { value: 101 * 1024 * 1024 });

      fireEvent.change(input, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(screen.getByText(/File size exceeds 100MB limit/i)).toBeInTheDocument();
      });
    });
  });

  describe('Drag and Drop', () => {
    it('should handle drag over event', () => {
      render(<FileUpload />);
      const dropZone = screen.getByTestId('drop-zone');

      fireEvent.dragOver(dropZone);

      expect(dropZone).toHaveClass('drag-active');
    });

    it('should handle drop event with valid files', async () => {
      render(<FileUpload />);
      const dropZone = screen.getByTestId('drop-zone');
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });

      fireEvent.drop(dropZone, {
        dataTransfer: { files: [file] }
      });

      await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument();
      });
    });

    it('should reset drag state on drag leave', () => {
      render(<FileUpload />);
      const dropZone = screen.getByTestId('drop-zone');

      fireEvent.dragOver(dropZone);
      expect(dropZone).toHaveClass('drag-active');

      fireEvent.dragLeave(dropZone);
      expect(dropZone).not.toHaveClass('drag-active');
    });
  });

  describe('File Upload Process', () => {
    it('should upload selected files when upload button is clicked', async () => {
      const mockUpload = jest.fn().mockResolvedValue({ success: true, id: '123' });
      (uploadService.uploadFile as jest.Mock) = mockUpload;

      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument();
      });

      const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(mockUpload).toHaveBeenCalledWith(file, expect.any(Object));
      });
    });

    it('should show progress during upload', async () => {
      const mockUpload = jest.fn().mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      );
      (uploadService.uploadFile as jest.Mock) = mockUpload;

      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument();
      });

      const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
      fireEvent.click(uploadButton);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle upload errors gracefully', async () => {
      const mockUpload = jest.fn().mockRejectedValue(new Error('Upload failed'));
      (uploadService.uploadFile as jest.Mock) = mockUpload;

      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument();
      });

      const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
      });
    });

    it('should allow retry on failed uploads', async () => {
      const mockUpload = jest.fn()
        .mockRejectedValueOnce(new Error('Upload failed'))
        .mockResolvedValueOnce({ success: true, id: '123' });
      (uploadService.uploadFile as jest.Mock) = mockUpload;

      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument();
      });

      const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /Retry/i });
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(mockUpload).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('File Management', () => {
    it('should allow removing files from queue before upload', async () => {
      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument();
      });

      const removeButton = screen.getByTestId('remove-file-test.csv');
      fireEvent.click(removeButton);

      expect(screen.queryByText('test.csv')).not.toBeInTheDocument();
    });

    it('should clear all files when clear button is clicked', async () => {
      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const files = [
        new File(['test1'], 'test1.csv', { type: 'text/csv' }),
        new File(['test2'], 'test2.json', { type: 'application/json' })
      ];

      fireEvent.change(input, { target: { files } });

      await waitFor(() => {
        expect(screen.getByText('test1.csv')).toBeInTheDocument();
        expect(screen.getByText('test2.json')).toBeInTheDocument();
      });

      const clearButton = screen.getByRole('button', { name: /Clear All/i });
      fireEvent.click(clearButton);

      expect(screen.queryByText('test1.csv')).not.toBeInTheDocument();
      expect(screen.queryByText('test2.json')).not.toBeInTheDocument();
    });

    it('should display file preview for supported types', async () => {
      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const file = new File(['col1,col2\nval1,val2'], 'test.csv', { type: 'text/csv' });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('test.csv')).toBeInTheDocument();
      });

      const previewButton = screen.getByTestId('preview-test.csv');
      fireEvent.click(previewButton);

      await waitFor(() => {
        expect(screen.getByText(/col1/i)).toBeInTheDocument();
        expect(screen.getByText(/col2/i)).toBeInTheDocument();
      });
    });
  });

  describe('Upload History', () => {
    it('should display upload history', async () => {
      const mockHistory = [
        { id: '1', filename: 'data1.csv', size: 1024, uploadDate: '2024-01-01', status: 'success' },
        { id: '2', filename: 'data2.json', size: 2048, uploadDate: '2024-01-02', status: 'success' }
      ];
      (uploadService.getUploadHistory as jest.Mock) = jest.fn().mockResolvedValue(mockHistory);

      render(<FileUpload />);

      await waitFor(() => {
        expect(screen.getByText('data1.csv')).toBeInTheDocument();
        expect(screen.getByText('data2.json')).toBeInTheDocument();
      });
    });

    it('should allow downloading uploaded files', async () => {
      const mockHistory = [
        { id: '1', filename: 'data1.csv', size: 1024, uploadDate: '2024-01-01', status: 'success' }
      ];
      (uploadService.getUploadHistory as jest.Mock) = jest.fn().mockResolvedValue(mockHistory);
      const mockDownload = jest.fn();
      (uploadService.downloadFile as jest.Mock) = mockDownload;

      render(<FileUpload />);

      await waitFor(() => {
        expect(screen.getByText('data1.csv')).toBeInTheDocument();
      });

      const downloadButton = screen.getByTestId('download-1');
      fireEvent.click(downloadButton);

      expect(mockDownload).toHaveBeenCalledWith('1');
    });

    it('should allow deleting uploaded files', async () => {
      const mockHistory = [
        { id: '1', filename: 'data1.csv', size: 1024, uploadDate: '2024-01-01', status: 'success' }
      ];
      (uploadService.getUploadHistory as jest.Mock) = jest.fn().mockResolvedValue(mockHistory);
      const mockDelete = jest.fn().mockResolvedValue({ success: true });
      (uploadService.deleteFile as jest.Mock) = mockDelete;

      render(<FileUpload />);

      await waitFor(() => {
        expect(screen.getByText('data1.csv')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId('delete-1');
      fireEvent.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /Confirm/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Data Processing Options', () => {
    it('should show processing options after upload', async () => {
      const mockUpload = jest.fn().mockResolvedValue({ success: true, id: '123' });
      (uploadService.uploadFile as jest.Mock) = mockUpload;

      render(<FileUpload />);
      const input = screen.getByTestId('file-input');
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });

      fireEvent.change(input, { target: { files: [file] } });
      const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText(/Process with ETL Pipeline/i)).toBeInTheDocument();
        expect(screen.getByText(/Create Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Run Analysis/i)).toBeInTheDocument();
      });
    });
  });
});