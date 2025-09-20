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
      const response = await api.get('/api/v1/etl/pipelines');
      setPipelines(response.data);
    } catch (err) {
      setError('Failed to fetch pipelines');
    }
  };

  const fetchDataSources = async () => {
    try {
      const response = await api.get('/api/v1/data-sources');
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
      <div className="text-center py-8">
        <p>No ETL pipelines configured</p>
        <p>Create your first pipeline</p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary mt-4"
        >
          Create Pipeline
        </button>
      </div>
    );
  }

  return (
    <div className="etl-pipeline-container">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="flex justify-between mb-4">
        <h2>ETL Pipelines</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
          role="button"
        >
          Create Pipeline
        </button>
      </div>

      <div className="pipeline-list">
        {pipelines.map(pipeline => (
          <div key={pipeline.id} className="pipeline-item border p-4 mb-2 rounded">
            <h3>{pipeline.name}</h3>
            <div data-testid={`status-${pipeline.status}`}>{pipeline.status}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleRunPipeline(pipeline.id)} role="button">
                Run Now
              </button>
              {pipeline.status === 'active' ? (
                <button onClick={() => handlePausePipeline(pipeline.id)} role="button">
                  Pause
                </button>
              ) : (
                <button onClick={() => handleResumePipeline(pipeline.id)} role="button">
                  Resume
                </button>
              )}
              <button onClick={() => openEditModal(pipeline)} role="button">
                Edit
              </button>
              <button onClick={() => openDeleteConfirm(pipeline)} role="button">
                Delete
              </button>
              <button onClick={() => openRunsModal(pipeline)} role="button">
                View Runs
              </button>
              <button onClick={() => openRulesModal(pipeline)} role="button">
                Configure Rules
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New ETL Pipeline</h3>
            <div>
              <label htmlFor="pipeline-name">Pipeline Name</label>
              <input
                id="pipeline-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {validationErrors.name && (
                <div className="error">{validationErrors.name}</div>
              )}
            </div>
            <div>
              <label htmlFor="data-source">Data Source</label>
              <select
                id="data-source"
                value={formData.source_id}
                onChange={(e) => setFormData({ ...formData, source_id: e.target.value })}
              >
                <option value="">Select a source</option>
                {dataSources.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
              {validationErrors.source_id && (
                <div className="error">{validationErrors.source_id}</div>
              )}
            </div>
            <div>
              <label htmlFor="schedule">Schedule</label>
              <input
                id="schedule"
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              />
              <div className="schedule-presets">
                <button onClick={() => setSchedulePreset('0 * * * *')}>
                  Every Hour
                </button>
                <button onClick={() => setSchedulePreset('0 */6 * * *')}>
                  Every 6 Hours
                </button>
                <button onClick={() => setSchedulePreset('0 0 * * *')}>
                  Daily at Midnight
                </button>
                <button onClick={() => setSchedulePreset('0 0 * * 0')}>
                  Weekly
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreatePipeline} role="button">
                Save Pipeline
              </button>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Pipeline</h3>
            <div>
              <label htmlFor="pipeline-name">Pipeline Name</label>
              <input
                id="pipeline-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="schedule">Schedule</label>
              <input
                id="schedule"
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleUpdatePipeline} role="button">
                Save Changes
              </button>
              <button onClick={() => { setShowEditModal(false); resetForm(); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Runs Modal */}
      {showRunsModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Pipeline Run History</h3>
            {pipelineRuns.map(run => (
              <div key={run.run_id}>
                <div>{run.run_id}</div>
                <div data-testid={`run-status-${run.status}`}>{run.status}</div>
              </div>
            ))}
            <button onClick={() => setShowRunsModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Transformation Rules</h3>
            <div>Field Mapping</div>
            <div>Filters</div>
            <button onClick={addFieldMapping} role="button">
              Add Mapping
            </button>
            <div className="mapping-fields">
              <input placeholder="Source Field" />
              <input placeholder="Target Field" />
            </div>
            <button onClick={handleValidateRules} role="button">
              Validate Rules
            </button>
            <button onClick={() => setShowRulesModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this pipeline?</p>
            <button onClick={handleDeletePipeline} role="button">
              Confirm Delete
            </button>
            <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ETLPipeline;