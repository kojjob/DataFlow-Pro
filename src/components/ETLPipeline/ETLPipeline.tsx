import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface DataSource {
  id: number;
  name: string;
  source_type: string;
}

interface Pipeline {
  id: number;
  name: string;
  organization_id: number;
  source_id: number;
  destination_config: any;
  transformation_rules: any;
  schedule: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PipelineRun {
  run_id: string;
  pipeline_id: number;
  status: string;
  started_at: string;
  finished_at: string | null;
  run_metadata: any;
}

const ETLPipeline: React.FC = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRunsModal, setShowRunsModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    source_id: '',
    destination_config: { type: 'data_warehouse' },
    transformation_rules: { field_mapping: {}, filters: [] },
    schedule: ''
  });
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [transformationRules, setTransformationRules] = useState<any>({
    field_mapping: {},
    filters: []
  });

  useEffect(() => {
    fetchPipelines();
    fetchDataSources();
  }, []);

  const fetchPipelines = async () => {
    try {
      const response = await api.get('/api/v1/etl/pipelines?organization_id=1');
      setPipelines(response.data);
    } catch (err) {
      setError('Failed to fetch pipelines');
    }
  };

  const fetchDataSources = async () => {
    try {
      const response = await api.get('/api/v1/data-sources?organization_id=1');
      setDataSources(response.data);
    } catch (err) {
      setError('Failed to fetch data sources');
    }
  };

  const fetchPipelineRuns = async (pipelineId: number) => {
    try {
      const response = await api.get(`/api/v1/etl/pipelines/${pipelineId}/runs`);
      setPipelineRuns(response.data);
    } catch (err) {
      setError('Failed to fetch pipeline runs');
    }
  };

  const handleCreatePipeline = async () => {
    const errors: any = {};
    if (!formData.name) errors.name = 'Pipeline name is required';
    if (!formData.source_id) errors.source_id = 'Data source is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await api.post('/api/v1/etl/pipelines', {
        ...formData,
        source_id: parseInt(formData.source_id),
        organization_id: 1 // Would come from auth context in real app
      });
      setSuccess('Pipeline created successfully');
      setShowCreateModal(false);
      fetchPipelines();
      resetForm();
    } catch (err) {
      setError('Failed to create pipeline');
    }
  };

  const handleUpdatePipeline = async () => {
    if (!selectedPipeline) return;

    try {
      await api.put(`/api/v1/etl/pipelines/${selectedPipeline.id}`, {
        name: formData.name,
        destination_config: formData.destination_config,
        transformation_rules: formData.transformation_rules,
        schedule: formData.schedule
      });
      setSuccess('Pipeline updated successfully');
      setShowEditModal(false);
      fetchPipelines();
      resetForm();
    } catch (err) {
      setError('Failed to update pipeline');
    }
  };

  const handleRunPipeline = async (pipelineId: number) => {
    try {
      await api.post(`/api/v1/etl/pipelines/${pipelineId}/run`);
      setSuccess('Pipeline run started');
      fetchPipelines();
    } catch (err) {
      setError('Failed to run pipeline');
    }
  };

  const handlePausePipeline = async (pipelineId: number) => {
    try {
      await api.post(`/api/v1/etl/pipelines/${pipelineId}/pause`);
      setSuccess('Pipeline paused');
      fetchPipelines();
    } catch (err) {
      setError('Failed to pause pipeline');
    }
  };

  const handleResumePipeline = async (pipelineId: number) => {
    try {
      await api.post(`/api/v1/etl/pipelines/${pipelineId}/resume`);
      setSuccess('Pipeline resumed');
      fetchPipelines();
    } catch (err) {
      setError('Failed to resume pipeline');
    }
  };

  const handleDeletePipeline = async () => {
    if (!selectedPipeline) return;

    try {
      await api.delete(`/api/v1/etl/pipelines/${selectedPipeline.id}`);
      setSuccess('Pipeline deleted successfully');
      setShowDeleteConfirm(false);
      fetchPipelines();
      setSelectedPipeline(null);
    } catch (err) {
      setError('Failed to delete pipeline');
    }
  };

  const handleValidateRules = async () => {
    try {
      const response = await api.post('/api/v1/etl/pipelines/validate', {
        transformation: transformationRules
      });

      if (response.data.is_valid === false && response.data.errors) {
        setError(response.data.errors.join(', '));
      } else {
        setSuccess('Rules are valid');
      }
    } catch (err) {
      setError('Failed to validate rules');
    }
  };

  const openEditModal = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setFormData({
      name: pipeline.name,
      source_id: pipeline.source_id.toString(),
      destination_config: pipeline.destination_config,
      transformation_rules: pipeline.transformation_rules,
      schedule: pipeline.schedule
    });
    setShowEditModal(true);
  };

  const openRunsModal = async (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    await fetchPipelineRuns(pipeline.id);
    setShowRunsModal(true);
  };

  const openRulesModal = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setTransformationRules(pipeline.transformation_rules);
    setShowRulesModal(true);
  };

  const openDeleteConfirm = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      source_id: '',
      destination_config: { type: 'data_warehouse' },
      transformation_rules: { field_mapping: {}, filters: [] },
      schedule: ''
    });
    setValidationErrors({});
  };

  const addFieldMapping = () => {
    setTransformationRules((prev: any) => ({
      ...prev,
      field_mapping: { ...prev.field_mapping, '': '' }
    }));
  };

  const setSchedulePreset = (cron: string) => {
    setFormData({ ...formData, schedule: cron });
  };

  if (pipelines.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No ETL pipelines configured</h3>
          <p className="text-gray-600 mb-6">Create your first pipeline to start processing data</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create Pipeline
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">ETL Pipelines</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          role="button"
        >
          Create Pipeline
        </button>
      </div>

      <div className="grid gap-4">
        {pipelines.map(pipeline => (
          <div key={pipeline.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{pipeline.name}</h3>
                <div className="mt-2">
                  <span
                    data-testid={`status-${pipeline.status}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      pipeline.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {pipeline.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRunPipeline(pipeline.id)}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                role="button"
              >
                Run Now
              </button>
              {pipeline.status === 'active' ? (
                <button
                  onClick={() => handlePausePipeline(pipeline.id)}
                  className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                  role="button"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => handleResumePipeline(pipeline.id)}
                  className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                  role="button"
                >
                  Resume
                </button>
              )}
              <button
                onClick={() => openEditModal(pipeline)}
                className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                role="button"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteConfirm(pipeline)}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                role="button"
              >
                Delete
              </button>
              <button
                onClick={() => openRunsModal(pipeline)}
                className="px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors"
                role="button"
              >
                View Runs
              </button>
              <button
                onClick={() => openRulesModal(pipeline)}
                className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                role="button"
              >
                Configure Rules
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Create New ETL Pipeline</h3>
            </div>
            <div className="p-6 space-y-4">
              <label htmlFor="pipeline-name" className="block text-sm font-medium text-gray-700 mb-1">
                Pipeline Name
              </label>
              <input
                id="pipeline-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter pipeline name"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="data-source" className="block text-sm font-medium text-gray-700 mb-1">
                Data Source
              </label>
              <select
                id="data-source"
                value={formData.source_id}
                onChange={(e) => setFormData({ ...formData, source_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Select a source</option>
                {dataSources.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
              {validationErrors.source_id && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.source_id}</p>
              )}
            </div>
            <div>
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
                Schedule (Cron Expression)
              </label>
              <input
                id="schedule"
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g., 0 */6 * * *"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setSchedulePreset('0 * * * *')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md transition-colors"
                  type="button"
                >
                  Every Hour
                </button>
                <button
                  onClick={() => setSchedulePreset('0 */6 * * *')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md transition-colors"
                  type="button"
                >
                  Every 6 Hours
                </button>
                <button
                  onClick={() => setSchedulePreset('0 0 * * *')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md transition-colors"
                  type="button"
                >
                  Daily at Midnight
                </button>
                <button
                  onClick={() => setSchedulePreset('0 0 * * 0')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md transition-colors"
                  type="button"
                >
                  Weekly
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePipeline}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                role="button"
              >
                Save Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Edit Pipeline</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="edit-pipeline-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Pipeline Name
                </label>
                <input
                  id="edit-pipeline-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="edit-schedule" className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                <input
                  id="edit-schedule"
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePipeline}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  role="button"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Runs Modal */}
      {showRunsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Pipeline Run History</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {pipelineRuns.map(run => (
                  <div key={run.run_id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="font-mono text-sm text-gray-600">{run.run_id}</div>
                      <span
                        data-testid={`run-status-${run.status}`}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          run.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : run.status === 'running'
                            ? 'bg-blue-100 text-blue-800'
                            : run.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {run.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowRunsModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Transformation Rules</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Field Mapping</h4>
                <button
                  onClick={addFieldMapping}
                  className="mb-3 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  role="button"
                >
                  Add Mapping
                </button>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      placeholder="Source Field"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                    <input
                      placeholder="Target Field"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Filters</h4>
                <p className="text-gray-600">Configure data filtering rules</p>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={handleValidateRules}
                  className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                  role="button"
                >
                  Validate Rules
                </button>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Delete Pipeline?
              </h3>
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete this pipeline? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePipeline}
                  className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                  role="button"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ETLPipeline;