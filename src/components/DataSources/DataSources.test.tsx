import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataSources from './DataSources';
import api from '../../services/api';

// Mock the API
jest.mock('../../services/api');

describe('DataSources Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Data Source List', () => {
    it('should display list of connected data sources', async () => {
      const mockDataSources = [
        {
          id: 1,
          source_type: 'salesforce',
          source_name: 'Production Salesforce',
          status: 'connected',
          created_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 2,
          source_type: 'hubspot',
          source_name: 'Marketing HubSpot',
          status: 'connected',
          created_at: '2024-01-15T11:00:00Z',
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockDataSources });

      render(<DataSources />);

      await waitFor(() => {
        expect(screen.getByText('Production Salesforce')).toBeInTheDocument();
        expect(screen.getByText('Marketing HubSpot')).toBeInTheDocument();
      });
    });

    it('should show empty state when no data sources are connected', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

      render(<DataSources />);

      await waitFor(() => {
        expect(screen.getByText('No data sources connected')).toBeInTheDocument();
        expect(screen.getByText('Connect your first data source to start importing data')).toBeInTheDocument();
      });
    });

    it('should display connection status indicators', async () => {
      const mockDataSources = [
        {
          id: 1,
          source_type: 'salesforce',
          source_name: 'Salesforce',
          status: 'connected',
        },
        {
          id: 2,
          source_type: 'hubspot',
          source_name: 'HubSpot',
          status: 'error',
        },
        {
          id: 3,
          source_type: 'google_analytics',
          source_name: 'GA',
          status: 'retrying',
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockDataSources });

      render(<DataSources />);

      await waitFor(() => {
        expect(screen.getByTestId('status-connected')).toHaveClass('status-connected');
        expect(screen.getByTestId('status-error')).toHaveClass('status-error');
        expect(screen.getByTestId('status-retrying')).toHaveClass('status-retrying');
      });
    });
  });

  describe('OAuth Connection Flow', () => {
    it('should display available data source providers', () => {
      render(<DataSources />);

      const addButton = screen.getByRole('button', { name: /add data source/i });
      fireEvent.click(addButton);

      // CRM Systems
      expect(screen.getByText('Salesforce')).toBeInTheDocument();
      expect(screen.getByText('HubSpot')).toBeInTheDocument();
      expect(screen.getByText('Microsoft Dynamics 365')).toBeInTheDocument();
      expect(screen.getByText('Pipedrive')).toBeInTheDocument();

      // Analytics Platforms
      expect(screen.getByText('Google Analytics')).toBeInTheDocument();
      expect(screen.getByText('Mixpanel')).toBeInTheDocument();
      expect(screen.getByText('Amplitude')).toBeInTheDocument();

      // Marketing Tools
      expect(screen.getByText('Mailchimp')).toBeInTheDocument();
      expect(screen.getByText('Marketo')).toBeInTheDocument();

      // Databases
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
      expect(screen.getByText('MySQL')).toBeInTheDocument();
      expect(screen.getByText('MongoDB')).toBeInTheDocument();

      // Cloud Storage
      expect(screen.getByText('AWS S3')).toBeInTheDocument();
      expect(screen.getByText('Google Cloud Storage')).toBeInTheDocument();

      // E-commerce
      expect(screen.getByText('Shopify')).toBeInTheDocument();
      expect(screen.getByText('Stripe')).toBeInTheDocument();

      // Social Media
      expect(screen.getByText('Facebook Ads')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });

    it('should initiate OAuth flow when clicking connect for Salesforce', async () => {
      const mockAuthUrl = 'https://login.salesforce.com/oauth/authorize?client_id=123';
      const mockState = 'random_state_token';

      (api.get as jest.Mock).mockResolvedValueOnce({
        data: {
          authorization_url: mockAuthUrl,
          state: mockState,
        },
      });

      // Mock window.open
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation();

      render(<DataSources />);

      const addButton = screen.getByRole('button', { name: /add data source/i });
      fireEvent.click(addButton);

      const salesforceButton = screen.getByRole('button', { name: /connect salesforce/i });
      fireEvent.click(salesforceButton);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith(
          '/api/v1/data-sources/oauth/salesforce/authorize',
          expect.objectContaining({
            params: expect.objectContaining({
              organization_id: expect.any(Number),
            }),
          })
        );
        expect(windowOpenSpy).toHaveBeenCalledWith(mockAuthUrl, '_blank');
      });
    });

    it('should initiate OAuth flow for HubSpot', async () => {
      const mockAuthUrl = 'https://app.hubspot.com/oauth/authorize?client_id=456';
      const mockState = 'hubspot_state_token';

      (api.get as jest.Mock).mockResolvedValueOnce({
        data: {
          authorization_url: mockAuthUrl,
          state: mockState,
        },
      });

      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation();

      render(<DataSources />);

      const addButton = screen.getByRole('button', { name: /add data source/i });
      fireEvent.click(addButton);

      const hubspotButton = screen.getByRole('button', { name: /connect hubspot/i });
      fireEvent.click(hubspotButton);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith(
          '/api/v1/data-sources/oauth/hubspot/authorize',
          expect.any(Object)
        );
        expect(windowOpenSpy).toHaveBeenCalledWith(mockAuthUrl, '_blank');
      });
    });

    it('should initiate OAuth flow for Google Analytics', async () => {
      const mockAuthUrl = 'https://accounts.google.com/oauth/authorize?client_id=789';
      const mockState = 'google_state_token';

      (api.get as jest.Mock).mockResolvedValueOnce({
        data: {
          authorization_url: mockAuthUrl,
          state: mockState,
        },
      });

      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation();

      render(<DataSources />);

      const addButton = screen.getByRole('button', { name: /add data source/i });
      fireEvent.click(addButton);

      const googleButton = screen.getByRole('button', { name: /connect google analytics/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith(
          '/api/v1/data-sources/oauth/google-analytics/authorize',
          expect.any(Object)
        );
        expect(windowOpenSpy).toHaveBeenCalledWith(mockAuthUrl, '_blank');
      });
    });

    it('should handle OAuth errors gracefully', async () => {
      (api.get as jest.Mock).mockRejectedValueOnce(new Error('OAuth initialization failed'));

      render(<DataSources />);

      const addButton = screen.getByRole('button', { name: /add data source/i });
      fireEvent.click(addButton);

      const salesforceButton = screen.getByRole('button', { name: /connect salesforce/i });
      fireEvent.click(salesforceButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to initiate connection/i)).toBeInTheDocument();
      });
    });
  });

  describe('Connection Testing', () => {
    it('should test data source connection', async () => {
      const mockDataSources = [
        {
          id: 1,
          source_type: 'salesforce',
          source_name: 'Salesforce',
          status: 'connected',
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockDataSources });
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: {
          status: 'success',
          message: 'Successfully connected to salesforce',
          test_results: {
            connected: true,
            api_version: 'v57.0',
          },
        },
      });

      render(<DataSources />);

      await waitFor(() => {
        const testButton = screen.getByRole('button', { name: /test connection/i });
        fireEvent.click(testButton);
      });

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/api/v1/data-sources/1/test-connection');
        expect(screen.getByText(/Successfully connected/i)).toBeInTheDocument();
      });
    });

    it('should handle connection test failures', async () => {
      const mockDataSources = [
        {
          id: 1,
          source_type: 'salesforce',
          source_name: 'Salesforce',
          status: 'error',
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockDataSources });
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: {
          status: 'error',
          message: 'Connection failed: Invalid credentials',
        },
      });

      render(<DataSources />);

      await waitFor(() => {
        const testButton = screen.getByRole('button', { name: /test connection/i });
        fireEvent.click(testButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Source Management', () => {
    it('should delete a data source', async () => {
      const mockDataSources = [
        {
          id: 1,
          source_type: 'salesforce',
          source_name: 'Salesforce',
          status: 'connected',
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockDataSources });
      (api.delete as jest.Mock).mockResolvedValueOnce({
        data: { message: 'Data source deleted successfully' },
      });

      render(<DataSources />);

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
      });

      // Confirm deletion in modal
      const confirmButton = screen.getByRole('button', { name: /confirm delete/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith('/api/v1/data-sources/1');
        expect(screen.getByText(/deleted successfully/i)).toBeInTheDocument();
      });
    });

    it('should refresh tokens for a data source', async () => {
      const mockDataSources = [
        {
          id: 1,
          source_type: 'salesforce',
          source_name: 'Salesforce',
          status: 'connected',
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockDataSources });
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: {
          message: 'Token refreshed successfully',
          expires_at: '2024-01-16T10:00:00Z',
        },
      });

      render(<DataSources />);

      await waitFor(() => {
        const refreshButton = screen.getByRole('button', { name: /refresh token/i });
        fireEvent.click(refreshButton);
      });

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/api/v1/data-sources/1/refresh-token');
        expect(screen.getByText(/Token refreshed/i)).toBeInTheDocument();
      });
    });

    it('should update data source status', async () => {
      const mockDataSources = [
        {
          id: 1,
          source_type: 'salesforce',
          source_name: 'Salesforce',
          status: 'connected',
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockDataSources });
      (api.put as jest.Mock).mockResolvedValueOnce({
        data: {
          id: 1,
          status: 'paused',
        },
      });

      render(<DataSources />);

      await waitFor(() => {
        const pauseButton = screen.getByRole('button', { name: /pause/i });
        fireEvent.click(pauseButton);
      });

      await waitFor(() => {
        expect(api.put).toHaveBeenCalledWith(
          '/api/v1/data-sources/1/status',
          { status: 'paused' }
        );
        expect(screen.getByTestId('status-paused')).toBeInTheDocument();
      });
    });
  });
});