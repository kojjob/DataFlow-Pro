import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Clear,
  Description,
  InsertDriveFile,
  CheckCircle,
  Error,
  Warning,
  Download,
  Preview,
  PlayArrow,
  Dashboard,
  Analytics,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadService, UploadedFile, UploadProgress } from '../../services/uploadService';

interface FileWithProgress extends File {
  id: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploadHistory, setUploadHistory] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; file: File | null }>({
    open: false,
    file: null,
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; fileId: string | null }>({
    open: false,
    fileId: null,
  });
  const [processingOptions, setProcessingOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUploadHistory();
  }, []);

  const loadUploadHistory = async () => {
    try {
      const history = await uploadService.getUploadHistory();
      setUploadHistory(history);
    } catch (error) {
      console.error('Error loading upload history:', error);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setError(null);
    const validatedFiles: FileWithProgress[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      const validation = uploadService.validateFile(file);
      if (validation.valid) {
        validatedFiles.push({
          ...file,
          id: `${file.name}-${Date.now()}`,
          status: 'pending',
        } as FileWithProgress);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (validatedFiles.length > 0) {
      setFiles(prev => [...prev, ...validatedFiles]);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearAll = () => {
    setFiles([]);
    setError(null);
  };

  const uploadFiles = async () => {
    setLoading(true);
    const pendingFiles = files.filter(f => f.status === 'pending');

    for (const file of pendingFiles) {
      try {
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
          )
        );

        await uploadService.uploadFile(file, {
          onProgress: (progress: UploadProgress) => {
            setFiles(prev =>
              prev.map(f =>
                f.id === file.id ? { ...f, progress: progress.percentage } : f
              )
            );
          },
          onComplete: () => {
            setFiles(prev =>
              prev.map(f =>
                f.id === file.id ? { ...f, status: 'success', progress: 100 } : f
              )
            );
            setProcessingOptions(['Process with ETL Pipeline', 'Create Dashboard', 'Run Analysis']);
          },
          onError: (error: Error) => {
            setFiles(prev =>
              prev.map(f =>
                f.id === file.id ? { ...f, status: 'error', error: error.message } : f
              )
            );
          },
        });
      } catch (error: any) {
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, status: 'error', error: error.message } : f
          )
        );
      }
    }

    setLoading(false);
    loadUploadHistory();
  };

  const retryUpload = (fileId: string) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === fileId ? { ...f, status: 'pending', error: undefined } : f
      )
    );
  };

  const handlePreview = async (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      try {
        const data = await uploadService.parseCSVPreview(file);
        setPreviewData(data);
        setPreviewDialog({ open: true, file });
      } catch (error) {
        console.error('Error parsing CSV:', error);
      }
    }
  };

  const handleDownload = async (fileId: string) => {
    try {
      const blob = await uploadService.downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = uploadHistory.find(f => f.id === fileId)?.filename || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async () => {
    if (deleteDialog.fileId) {
      try {
        await uploadService.deleteFile(deleteDialog.fileId);
        setDeleteDialog({ open: false, fileId: null });
        loadUploadHistory();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      return <InsertDriveFile color="success" />;
    } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
      return <Description color="primary" />;
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      return <InsertDriveFile color="warning" />;
    } else if (file.name.endsWith('.xml')) {
      return <Description color="error" />;
    }
    return <InsertDriveFile />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          File Upload
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload and ingest data files for analysis
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Upload Area */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              {/* Drop Zone */}
              <Paper
                data-testid="drop-zone"
                className={dragActive ? 'drag-active' : ''}
                sx={{
                  p: 4,
                  mb: 3,
                  border: '2px dashed',
                  borderColor: dragActive ? 'primary.main' : 'grey.300',
                  backgroundColor: dragActive ? 'action.hover' : 'background.paper',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                  accept=".csv,.json,.xml,.xlsx,.xls"
                  data-testid="file-input"
                />
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drag and drop files here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to browse
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Chip label="CSV" size="small" />
                  <Chip label="Excel" size="small" />
                  <Chip label="JSON" size="small" />
                  <Chip label="XML" size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Maximum file size: 100MB
                </Typography>
              </Paper>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                  {error.includes('File size exceeds') ? 'File size exceeds 100MB limit' :
                   error.includes('Unsupported file type') ? 'Unsupported file type' :
                   error}
                </Alert>
              )}

              {/* File List */}
              {files.length > 0 && (
                <>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Files to Upload</Typography>
                    <Box>
                      <Button
                        startIcon={<Clear />}
                        onClick={clearAll}
                        sx={{ mr: 1 }}
                      >
                        Clear All
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<CloudUpload />}
                        onClick={uploadFiles}
                        disabled={loading || files.every(f => f.status !== 'pending')}
                      >
                        Upload Files
                      </Button>
                    </Box>
                  </Box>

                  <List>
                    <AnimatePresence>
                      {files.map(file => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                        >
                          <ListItem>
                            <ListItemIcon>
                              {getFileIcon(file)}
                            </ListItemIcon>
                            <ListItemText
                              primary={file.name}
                              secondary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption">
                                    {formatFileSize(file.size)}
                                  </Typography>
                                  {file.status === 'success' && (
                                    <Chip
                                      icon={<CheckCircle />}
                                      label="Success"
                                      size="small"
                                      color="success"
                                    />
                                  )}
                                  {file.status === 'error' && (
                                    <Chip
                                      icon={<Error />}
                                      label="Failed"
                                      size="small"
                                      color="error"
                                    />
                                  )}
                                  {file.error && (
                                    <Typography variant="caption" color="error">
                                      {file.error.includes('Upload failed') ? 'Upload failed' : file.error}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                            {file.status === 'uploading' && (
                              <Box sx={{ width: 200, mr: 2 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={file.progress}
                                  role="progressbar"
                                />
                              </Box>
                            )}
                            <ListItemSecondaryAction>
                              {file.status === 'error' && (
                                <Button size="small" onClick={() => retryUpload(file.id)}>
                                  Retry
                                </Button>
                              )}
                              {file.status === 'pending' && (
                                <>
                                  <IconButton
                                    size="small"
                                    onClick={() => handlePreview(file)}
                                    data-testid={`preview-${file.name}`}
                                  >
                                    <Preview />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => removeFile(file.id)}
                                    data-testid={`remove-file-${file.name}`}
                                  >
                                    <Delete />
                                  </IconButton>
                                </>
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </List>
                </>
              )}

              {/* Processing Options */}
              {processingOptions.length > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    What would you like to do with the uploaded data?
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button startIcon={<PlayArrow />} variant="outlined">
                      Process with ETL Pipeline
                    </Button>
                    <Button startIcon={<Dashboard />} variant="outlined">
                      Create Dashboard
                    </Button>
                    <Button startIcon={<Analytics />} variant="outlined">
                      Run Analysis
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upload History */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Upload History</Typography>
                <IconButton onClick={loadUploadHistory}>
                  <Refresh />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {uploadHistory.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No files uploaded yet
                </Typography>
              ) : (
                <List dense>
                  {uploadHistory.map(file => (
                    <ListItem key={file.id}>
                      <ListItemIcon>
                        {file.status === 'success' ? (
                          <CheckCircle color="success" />
                        ) : file.status === 'processing' ? (
                          <CircularProgress size={20} />
                        ) : file.status === 'failed' ? (
                          <Error color="error" />
                        ) : (
                          <Warning color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={file.filename}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {formatFileSize(file.size)}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {new Date(file.uploadDate).toLocaleDateString()}
                            </Typography>
                            {file.errorMessage && (
                              <Typography variant="caption" color="error" display="block">
                                {file.errorMessage}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(file.id)}
                          data-testid={`download-${file.id}`}
                        >
                          <Download />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteDialog({ open: true, fileId: file.id })}
                          data-testid={`delete-${file.id}`}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, file: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          File Preview: {previewDialog.file?.name}
        </DialogTitle>
        <DialogContent>
          {previewData.length > 0 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {Object.keys(previewData[0]).map(key => (
                      <TableCell key={key}>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value: any, idx) => (
                        <TableCell key={idx}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false, file: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, fileId: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, fileId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUpload;