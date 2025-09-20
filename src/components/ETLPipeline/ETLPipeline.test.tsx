import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ETLPipeline from './ETLPipeline';
import api from '../../services/api';

// Mock the API module
jest.mock('../../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('ETLPipeline Component', () => {
  const mockPipelines = [
    {
      id: 1,
      name: 'Sales Data Pipeline',
      organization_id: 1,
      source_id: 1,
      destination_config: { type: 'data_warehouse', host: 'localhost' },
      transformation_rules: {
        field_mapping: { lead_name: 'customer_name' },
        filters: [{ field: 'status', operator: 'equals', value: 'active' }]
      },
      schedule: '0 */6 * * *',
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      name: 'Marketing Analytics Pipeline',
      organization_id: 1,
      source_id: 2,
      destination_config: { type: 'analytics_db' },
      transformation_rules: { field_mapping: {} },
      schedule: '0 0 * * *',
      status: 'inactive',
      created_at: '2024-01-14T10:00:00Z',
      updated_at: '2024-01-14T10:00:00Z'
    }
  ];

  const mockDataSources = [
    { id: 1, name: 'Salesforce CRM', source_type: 'salesforce' },
    { id: 2, name: 'HubSpot', source_type: 'hubspot' },
    { id: 3, name: 'Google Analytics', source_type: 'google_analytics' }
  ];

  const mockPipelineRuns = [
    {
      run_id: 'run-123',
      pipeline_id: 1,
      status: 'completed',
      started_at: '2024-01-15T09:00:00Z',
      finished_at: '2024-01-15T09:15:00Z',
      run_metadata: { records_processed: 1000 }
    },
    {
      run_id: 'run-124',
      pipeline_id: 1,
      status: 'running',
      started_at: '2024-01-15T15:00:00Z',
      finished_at: null,
      run_metadata: {}
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.get.mockImplementation((url) => {
      if (url === '/api/v1/etl/pipelines') {
        return Promise.resolve({ data: mockPipelines });
      }
      if (url === '/api/v1/data-sources') {
        return Promise.resolve({ data: mockDataSources });
      }
      if (url.includes('/runs')) {
        return Promise.resolve({ data: mockPipelineRuns });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  describe('Pipeline List Display', () => {
    test('displays list of pipelines on load', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        expect(screen.getByText('Sales Data Pipeline')).toBeInTheDocument();
        expect(screen.getByText('Marketing Analytics Pipeline')).toBeInTheDocument();
      });
    });

    test('shows pipeline status indicators', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        expect(screen.getByTestId('status-active')).toBeInTheDocument();
        expect(screen.getByTestId('status-inactive')).toBeInTheDocument();
      });
    });

    test('displays empty state when no pipelines exist', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: [] });
      render(<ETLPipeline />);

      await waitFor(() => {
        expect(screen.getByText(/No ETL pipelines configured/i)).toBeInTheDocument();
        expect(screen.getByText(/Create your first pipeline/i)).toBeInTheDocument();
      });
    });

    test('handles API errors gracefully', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('API Error'));
      render(<ETLPipeline />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch pipelines/i)).toBeInTheDocument();
      });
    });
  });

  describe('Pipeline Creation', () => {
    test('opens create pipeline modal on button click', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create Pipeline/i });
        fireEvent.click(createButton);
      });

      expect(screen.getByText(/Create New ETL Pipeline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Pipeline Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Data Source/i)).toBeInTheDocument();
    });

    test('validates required fields in create form', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create Pipeline/i });
        fireEvent.click(createButton);
      });

      const submitButton = screen.getByRole('button', { name: /Save Pipeline/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Pipeline name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Data source is required/i)).toBeInTheDocument();
      });
    });

    test('creates new pipeline successfully', async () => {
      mockedApi.post.mockResolvedValueOnce({
        data: {
          id: 3,
          name: 'New Test Pipeline',
          status: 'active',
          ...mockPipelines[0]
        }
      });

      render(<ETLPipeline />);

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create Pipeline/i });
        fireEvent.click(createButton);
      });

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/Pipeline Name/i), {
        target: { value: 'New Test Pipeline' }
      });

      fireEvent.change(screen.getByLabelText(/Data Source/i), {
        target: { value: '1' }
      });

      fireEvent.change(screen.getByLabelText(/Schedule/i), {
        target: { value: '0 */12 * * *' }
      });

      const submitButton = screen.getByRole('button', { name: /Save Pipeline/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedApi.post).toHaveBeenCalledWith(
          '/api/v1/etl/pipelines',
          expect.objectContaining({
            name: 'New Test Pipeline',
            source_id: 1
          })
        );
      });
    });
  });

  describe('Pipeline Actions', () => {
    test('runs pipeline manually', async () => {
      mockedApi.post.mockResolvedValueOnce({
        data: {
          run_id: 'run-125',
          status: 'running'
        }
      });

      render(<ETLPipeline />);

      await waitFor(() => {
        const runButtons = screen.getAllByRole('button', { name: /Run Now/i });
        fireEvent.click(runButtons[0]);
      });

      expect(mockedApi.post).toHaveBeenCalledWith('/api/v1/etl/pipelines/1/run');
      expect(screen.getByText(/Pipeline run started/i)).toBeInTheDocument();
    });

    test('pauses active pipeline', async () => {
      mockedApi.post.mockResolvedValueOnce({
        data: { ...mockPipelines[0], status: 'inactive' }
      });

      render(<ETLPipeline />);

      await waitFor(() => {
        const pauseButtons = screen.getAllByRole('button', { name: /Pause/i });
        fireEvent.click(pauseButtons[0]);
      });

      expect(mockedApi.post).toHaveBeenCalledWith('/api/v1/etl/pipelines/1/pause');
    });

    test('resumes inactive pipeline', async () => {
      mockedApi.post.mockResolvedValueOnce({
        data: { ...mockPipelines[1], status: 'active' }
      });

      render(<ETLPipeline />);

      await waitFor(() => {
        const resumeButtons = screen.getAllByRole('button', { name: /Resume/i });
        fireEvent.click(resumeButtons[0]);
      });

      expect(mockedApi.post).toHaveBeenCalledWith('/api/v1/etl/pipelines/2/resume');
    });

    test('deletes pipeline with confirmation', async () => {
      mockedApi.delete.mockResolvedValueOnce({ data: { message: 'Deleted' } });

      render(<ETLPipeline />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
        fireEvent.click(deleteButtons[0]);
      });

      // Confirm deletion
      expect(screen.getByText(/Are you sure you want to delete this pipeline?/i)).toBeInTheDocument();

      const confirmButton = screen.getByRole('button', { name: /Confirm Delete/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockedApi.delete).toHaveBeenCalledWith('/api/v1/etl/pipelines/1');
      });
    });
  });

  describe('Pipeline Details View', () => {
    test('shows pipeline run history', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        const viewButtons = screen.getAllByRole('button', { name: /View Runs/i });
        fireEvent.click(viewButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByText(/Pipeline Run History/i)).toBeInTheDocument();
        expect(screen.getByText('run-123')).toBeInTheDocument();
        expect(screen.getByText('run-124')).toBeInTheDocument();
      });
    });

    test('displays run status correctly', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        const viewButtons = screen.getAllByRole('button', { name: /View Runs/i });
        fireEvent.click(viewButtons[0]);
      });

      await waitFor(() => {
        expect(screen.getByTestId('run-status-completed')).toBeInTheDocument();
        expect(screen.getByTestId('run-status-running')).toBeInTheDocument();
      });
    });
  });

  describe('Pipeline Editing', () => {
    test('opens edit modal with existing data', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        const editButtons = screen.getAllByRole('button', { name: /Edit/i });
        fireEvent.click(editButtons[0]);
      });

      const nameInput = screen.getByLabelText(/Pipeline Name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('Sales Data Pipeline');

      const scheduleInput = screen.getByLabelText(/Schedule/i) as HTMLInputElement;
      expect(scheduleInput.value).toBe('0 */6 * * *');
    });

    test('updates pipeline successfully', async () => {
      mockedApi.put.mockResolvedValueOnce({
        data: {
          ...mockPipelines[0],
          name: 'Updated Pipeline Name'
        }
      });

      render(<ETLPipeline />);

      await waitFor(() => {
        const editButtons = screen.getAllByRole('button', { name: /Edit/i });
        fireEvent.click(editButtons[0]);
      });

      // Update the name
      fireEvent.change(screen.getByLabelText(/Pipeline Name/i), {
        target: { value: 'Updated Pipeline Name' }
      });

      const saveButton = screen.getByRole('button', { name: /Save Changes/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockedApi.put).toHaveBeenCalledWith(
          '/api/v1/etl/pipelines/1',
          expect.objectContaining({
            name: 'Updated Pipeline Name'
          })
        );
      });
    });
  });

  describe('Transformation Rules', () => {
    test('displays transformation rules configuration', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        const configButtons = screen.getAllByRole('button', { name: /Configure Rules/i });
        fireEvent.click(configButtons[0]);
      });

      expect(screen.getByText(/Transformation Rules/i)).toBeInTheDocument();
      expect(screen.getByText(/Field Mapping/i)).toBeInTheDocument();
      expect(screen.getByText(/Filters/i)).toBeInTheDocument();
    });

    test('adds new field mapping', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        const configButtons = screen.getAllByRole('button', { name: /Configure Rules/i });
        fireEvent.click(configButtons[0]);
      });

      const addMappingButton = screen.getByRole('button', { name: /Add Mapping/i });
      fireEvent.click(addMappingButton);

      // Fill in mapping fields
      const sourceFields = screen.getAllByPlaceholderText(/Source Field/i);
      const targetFields = screen.getAllByPlaceholderText(/Target Field/i);

      fireEvent.change(sourceFields[sourceFields.length - 1], {
        target: { value: 'customer_id' }
      });

      fireEvent.change(targetFields[targetFields.length - 1], {
        target: { value: 'client_id' }
      });

      expect(sourceFields[sourceFields.length - 1]).toHaveValue('customer_id');
      expect(targetFields[targetFields.length - 1]).toHaveValue('client_id');
    });

    test('validates transformation rules before saving', async () => {
      mockedApi.post.mockResolvedValueOnce({
        data: {
          is_valid: false,
          errors: ['Invalid filter operator']
        }
      });

      render(<ETLPipeline />);

      await waitFor(() => {
        const configButtons = screen.getAllByRole('button', { name: /Configure Rules/i });
        fireEvent.click(configButtons[0]);
      });

      const validateButton = screen.getByRole('button', { name: /Validate Rules/i });
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid filter operator/i)).toBeInTheDocument();
      });
    });
  });

  describe('Schedule Configuration', () => {
    test('displays schedule presets', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create Pipeline/i });
        fireEvent.click(createButton);
      });

      expect(screen.getByText(/Every Hour/i)).toBeInTheDocument();
      expect(screen.getByText(/Every 6 Hours/i)).toBeInTheDocument();
      expect(screen.getByText(/Daily at Midnight/i)).toBeInTheDocument();
      expect(screen.getByText(/Weekly/i)).toBeInTheDocument();
    });

    test('selects schedule preset', async () => {
      render(<ETLPipeline />);

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create Pipeline/i });
        fireEvent.click(createButton);
      });

      const dailyPreset = screen.getByText(/Daily at Midnight/i);
      fireEvent.click(dailyPreset);

      const scheduleInput = screen.getByLabelText(/Schedule/i) as HTMLInputElement;
      expect(scheduleInput.value).toBe('0 0 * * *');
    });
  });
});