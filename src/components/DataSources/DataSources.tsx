import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './DataSources.css';

interface DataSource {
  id: number;
  source_type: string;
  source_name: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

const DataSources: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Hardcoded organization ID for now - should come from auth context
  const organizationId = 1;

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/data-sources', {
        params: { organization_id: organizationId }
      });
      setDataSources(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data sources');
      console.error('Error fetching data sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const initiateOAuthFlow = async (provider: string) => {
    try {
      setConnectingProvider(provider);
      setError(null);

      const response = await api.get(`/api/v1/data-sources/oauth/${provider}/authorize`, {
        params: { organization_id: organizationId }
      });

      const { authorization_url, state } = response.data;

      // Store state in sessionStorage for callback verification
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_provider', provider);

      // Open OAuth authorization URL in new window
      window.open(authorization_url, '_blank');

      // Close the add modal
      setShowAddModal(false);
      setConnectingProvider(null);

      // Show info message
      setError(null);
    } catch (err) {
      setError('Failed to initiate connection');
      console.error('OAuth initiation error:', err);
      setConnectingProvider(null);
    }
  };

  const testConnection = async (dataSourceId: number) => {
    try {
      setTestingConnection(dataSourceId);
      const response = await api.post(`/api/v1/data-sources/${dataSourceId}/test-connection`);

      if (response.data.status === 'success') {
        alert('Successfully connected to ' + response.data.message);
      } else {
        alert('Connection failed: ' + response.data.message);
      }
    } catch (err) {
      alert('Connection failed: Unable to test connection');
      console.error('Connection test error:', err);
    } finally {
      setTestingConnection(null);
    }
  };

  const deleteDataSource = async (dataSourceId: number) => {
    try {
      await api.delete(`/api/v1/data-sources/${dataSourceId}`);
      alert('Data source deleted successfully');
      fetchDataSources(); // Refresh the list
      setDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete data source');
      console.error('Delete error:', err);
    }
  };

  const refreshToken = async (dataSourceId: number) => {
    try {
      const response = await api.post(`/api/v1/data-sources/${dataSourceId}/refresh-token`);
      alert('Token refreshed successfully');
      fetchDataSources(); // Refresh the list
    } catch (err) {
      alert('Failed to refresh token');
      console.error('Token refresh error:', err);
    }
  };

  const updateStatus = async (dataSourceId: number, newStatus: string) => {
    try {
      await api.put(`/api/v1/data-sources/${dataSourceId}/status`, { status: newStatus });
      fetchDataSources(); // Refresh the list
    } catch (err) {
      alert('Failed to update status');
      console.error('Status update error:', err);
    }
  };

  const getStatusClass = (status: string) => {
    return `status-indicator status-${status}`;
  };

  if (loading) {
    return <div className="data-sources-container">Loading...</div>;
  }

  return (
    <div className="data-sources-container">
      <div className="data-sources-header">
        <h2>Data Sources</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add Data Source
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {dataSources.length === 0 ? (
        <div className="empty-state">
          <h3>No data sources connected</h3>
          <p>Connect your first data source to start importing data</p>
        </div>
      ) : (
        <div className="data-sources-list">
          {dataSources.map((source) => (
            <div key={source.id} className="data-source-card">
              <div className="data-source-info">
                <h3>{source.source_name}</h3>
                <p className="source-type">{source.source_type}</p>
                <div
                  className={getStatusClass(source.status)}
                  data-testid={`status-${source.status}`}
                >
                  {source.status}
                </div>
              </div>

              <div className="data-source-actions">
                <button
                  className="btn btn-sm"
                  onClick={() => testConnection(source.id)}
                  disabled={testingConnection === source.id}
                >
                  {testingConnection === source.id ? 'Testing...' : 'Test Connection'}
                </button>

                <button
                  className="btn btn-sm"
                  onClick={() => refreshToken(source.id)}
                >
                  Refresh Token
                </button>

                <button
                  className="btn btn-sm"
                  onClick={() => updateStatus(source.id, source.status === 'paused' ? 'connected' : 'paused')}
                >
                  {source.status === 'paused' ? 'Resume' : 'Pause'}
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setDeleteConfirm(source.id)}
                >
                  Delete
                </button>
              </div>

              {deleteConfirm === source.id && (
                <div className="delete-confirm">
                  <p>Are you sure you want to delete this data source?</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteDataSource(source.id)}
                  >
                    Confirm Delete
                  </button>
                  <button
                    className="btn"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Connect a Data Source</h3>

            <div className="connector-category">
              <h4 className="category-title">CRM Systems</h4>
              <div className="provider-list">
                <div className="provider-card">
                  <h4>Salesforce</h4>
                  <p>Connect your Salesforce CRM data</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('salesforce')}
                    disabled={connectingProvider === 'salesforce'}
                  >
                    {connectingProvider === 'salesforce' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>HubSpot</h4>
                  <p>Import data from HubSpot CRM</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('hubspot')}
                    disabled={connectingProvider === 'hubspot'}
                  >
                    {connectingProvider === 'hubspot' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>Microsoft Dynamics 365</h4>
                  <p>Sync with Dynamics 365 CRM</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('dynamics365')}
                    disabled={connectingProvider === 'dynamics365'}
                  >
                    {connectingProvider === 'dynamics365' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>Pipedrive</h4>
                  <p>Import Pipedrive sales data</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('pipedrive')}
                    disabled={connectingProvider === 'pipedrive'}
                  >
                    {connectingProvider === 'pipedrive' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>

            <div className="connector-category">
              <h4 className="category-title">Analytics Platforms</h4>
              <div className="provider-list">
                <div className="provider-card">
                  <h4>Google Analytics</h4>
                  <p>Website traffic and behavior data</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('google-analytics')}
                    disabled={connectingProvider === 'google-analytics'}
                  >
                    {connectingProvider === 'google-analytics' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>Mixpanel</h4>
                  <p>Product analytics and user tracking</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('mixpanel')}
                    disabled={connectingProvider === 'mixpanel'}
                  >
                    {connectingProvider === 'mixpanel' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>Amplitude</h4>
                  <p>Behavioral analytics platform</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('amplitude')}
                    disabled={connectingProvider === 'amplitude'}
                  >
                    {connectingProvider === 'amplitude' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>

            <div className="connector-category">
              <h4 className="category-title">Marketing Tools</h4>
              <div className="provider-list">
                <div className="provider-card">
                  <h4>Mailchimp</h4>
                  <p>Email marketing campaigns</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('mailchimp')}
                    disabled={connectingProvider === 'mailchimp'}
                  >
                    {connectingProvider === 'mailchimp' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>Marketo</h4>
                  <p>Marketing automation platform</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('marketo')}
                    disabled={connectingProvider === 'marketo'}
                  >
                    {connectingProvider === 'marketo' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>

            <div className="connector-category">
              <h4 className="category-title">Databases</h4>
              <div className="provider-list">
                <div className="provider-card">
                  <h4>PostgreSQL</h4>
                  <p>Connect to PostgreSQL database</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('postgresql')}
                    disabled={connectingProvider === 'postgresql'}
                  >
                    {connectingProvider === 'postgresql' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>MySQL</h4>
                  <p>Connect to MySQL database</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('mysql')}
                    disabled={connectingProvider === 'mysql'}
                  >
                    {connectingProvider === 'mysql' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>MongoDB</h4>
                  <p>Connect to MongoDB database</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('mongodb')}
                    disabled={connectingProvider === 'mongodb'}
                  >
                    {connectingProvider === 'mongodb' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>

            <div className="connector-category">
              <h4 className="category-title">Cloud Storage</h4>
              <div className="provider-list">
                <div className="provider-card">
                  <h4>AWS S3</h4>
                  <p>Amazon S3 bucket data</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('aws-s3')}
                    disabled={connectingProvider === 'aws-s3'}
                  >
                    {connectingProvider === 'aws-s3' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>Google Cloud Storage</h4>
                  <p>GCS bucket data access</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('gcs')}
                    disabled={connectingProvider === 'gcs'}
                  >
                    {connectingProvider === 'gcs' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>

            <div className="connector-category">
              <h4 className="category-title">E-commerce & Payments</h4>
              <div className="provider-list">
                <div className="provider-card">
                  <h4>Shopify</h4>
                  <p>E-commerce and sales data</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('shopify')}
                    disabled={connectingProvider === 'shopify'}
                  >
                    {connectingProvider === 'shopify' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>Stripe</h4>
                  <p>Payment and subscription data</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('stripe')}
                    disabled={connectingProvider === 'stripe'}
                  >
                    {connectingProvider === 'stripe' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>

            <div className="connector-category">
              <h4 className="category-title">Social Media & Advertising</h4>
              <div className="provider-list">
                <div className="provider-card">
                  <h4>Facebook Ads</h4>
                  <p>Facebook advertising metrics</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('facebook-ads')}
                    disabled={connectingProvider === 'facebook-ads'}
                  >
                    {connectingProvider === 'facebook-ads' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                <div className="provider-card">
                  <h4>LinkedIn</h4>
                  <p>LinkedIn analytics and ads</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => initiateOAuthFlow('linkedin')}
                    disabled={connectingProvider === 'linkedin'}
                  >
                    {connectingProvider === 'linkedin' ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => setShowAddModal(false)}
              style={{ marginTop: '20px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSources;