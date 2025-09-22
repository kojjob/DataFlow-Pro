import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
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
  CircularProgress,
  Tooltip,
  Snackbar,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Clear,
  Description,
  InsertDriveFile,
  Download,
  Preview,
  Refresh,
  FolderOpen,
  Storage,
  TableChart,
  Assessment,
  Transform,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadService, UploadedFile, UploadProgress } from '../../services/uploadService';

// TypeScript interfaces
interface FileWithProgress {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'validating';
  error?: string;
  validationError?: string;
  processingOptions?: string[];
  uploadedData?: any;
}

interface SupportedFormat {
  category: string;
  formats: string[];
  icon: React.ReactNode;
  color: string;
  maxSize: number;
}

const SUPPORTED_FORMATS: SupportedFormat[] = [
  {
    category: 'Spreadsheets',
    formats: ['csv', 'xlsx', 'xls', 'xlsm', 'tsv'],
    icon: <TableChart />,
    color: '#4CAF50',
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  {
    category: 'Data',
    formats: ['json', 'xml'],
    icon: <Storage />,
    color: '#2196F3',
    maxSize: 100 * 1024 * 1024,
  },
  {
    category: 'Text',
    formats: ['txt', 'log'],
    icon: <Description />,
    color: '#FF9800',
    maxSize: 100 * 1024 * 1024,
  },
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const EnhancedFileUpload: React.FC = () => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploadHistory, setUploadHistory] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileWithProgress | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Load upload history on component mount
  useEffect(() => {
    loadUploadHistory();
  }, []);

  const loadUploadHistory = async () => {
    try {
      const history = await uploadService.getUploadHistory();
      setUploadHistory(history);
    } catch (error) {
      console.error('Failed to load upload history:', error);
    }
  };

  // File validation
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds 100MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
      };
    }

    // Check file type
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isSupported = SUPPORTED_FORMATS.some(format =>
      format.formats.includes(extension)
    );

    if (!isSupported) {
      return {
        valid: false,
        error: `Unsupported file type (.${extension}). See supported formats below.`,
      };
    }

    return { valid: true };
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if we're leaving the drop zone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  // File input change handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  // Add files to the upload queue
  const addFiles = (newFiles: File[]) => {
    const processedFiles: FileWithProgress[] = newFiles.map((file) => {
      const validation = validateFile(file);
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        file: file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        progress: 0,
        status: validation.valid ? 'pending' : 'error',
        validationError: validation.error,
      } as FileWithProgress;
    });

    setFiles((prev) => [...prev, ...processedFiles]);

    // Show notification for validation errors
    const invalidFiles = processedFiles.filter(f => f.status === 'error');
    if (invalidFiles.length > 0) {
      showNotification(
        `${invalidFiles.length} file(s) could not be added due to validation errors`,
        'warning'
      );
    }
  };

  // Upload files
  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      showNotification('No valid files to upload', 'warning');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of pendingFiles) {
      try {
        // Update status to uploading
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
          )
        );

        // Upload file
        const result = await uploadService.uploadFile(file.file, {
          onProgress: (progress: UploadProgress) => {
            setFiles(prev =>
              prev.map(f =>
                f.id === file.id ? { ...f, progress: progress.percentage } : f
              )
            );
          },
          onComplete: (response) => {
            setFiles(prev =>
              prev.map(f =>
                f.id === file.id
                  ? {
                      ...f,
                      status: 'success',
                      progress: 100,
                      uploadedData: response,
                      processingOptions: ['Process with ETL Pipeline', 'Create Dashboard', 'Run Analysis'],
                    }
                  : f
              )
            );
            successCount++;
          },
          onError: (error: Error) => {
            setFiles(prev =>
              prev.map(f =>
                f.id === file.id
                  ? { ...f, status: 'error', error: error.message }
                  : f
              )
            );
            errorCount++;
          },
        });
      } catch (error: any) {
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id
              ? { ...f, status: 'error', error: error.message || 'Upload failed' }
              : f
          )
        );
        errorCount++;
      }
    }

    setLoading(false);
    loadUploadHistory(); // Refresh history

    // Show summary notification
    if (successCount > 0 && errorCount === 0) {
      showNotification(`Successfully uploaded ${successCount} file(s)`, 'success');
    } else if (successCount > 0 && errorCount > 0) {
      showNotification(
        `Uploaded ${successCount} file(s), ${errorCount} failed`,
        'warning'
      );
    } else if (errorCount > 0) {
      showNotification(`Failed to upload ${errorCount} file(s)`, 'error');
    }
  };

  // Retry failed upload
  const retryUpload = (fileId: string) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === fileId
          ? { ...f, status: 'pending', error: undefined, progress: 0 }
          : f
      )
    );
  };

  // Remove file from queue
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Clear all files
  const clearAllFiles = () => {
    setFiles([]);
  };

  // Preview CSV file
  const handlePreview = async (file: FileWithProgress) => {
    if (file.name && file.name.toLowerCase().endsWith('.csv')) {
      try {
        const data = await uploadService.parseCSVPreview(file.file);
        setPreviewData(data);
        setSelectedFile(file);
      } catch (error) {
        showNotification('Failed to preview file', 'error');
      }
    }
  };

  // Download file from history
  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const blob = await uploadService.downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showNotification('File downloaded successfully', 'success');
    } catch (error) {
      showNotification('Failed to download file', 'error');
    }
  };

  // Delete file from history
  const handleDelete = async (fileId: string) => {
    try {
      await uploadService.deleteFile(fileId);
      loadUploadHistory();
      showNotification('File deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete file', 'error');
    }
  };

  // Show notification helper
  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (fileName?: string) => {
    if (!fileName) return <InsertDriveFile />;
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const format = SUPPORTED_FORMATS.find(f => f.formats.includes(ext));
    return format?.icon || <InsertDriveFile />;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'uploading':
      case 'validating':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          File Upload Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload your data files for analysis and processing
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Upload Area */}
        <Box sx={{ flex: 2 }}>
          <Card>
            <CardContent>
              {/* Drag and Drop Zone */}
              <Paper
                ref={dropZoneRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: `3px dashed ${isDragging ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: isDragging ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept=".csv,.xlsx,.xls,.xlsm,.tsv,.json,.xml,.txt,.log"
                  aria-label="File input"
                />

                <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  or click to browse your files
                </Typography>

                {/* Supported Formats */}
                <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                  {SUPPORTED_FORMATS.map((format) => (
                    <Tooltip key={format.category} title={format.formats.join(', ')}>
                      <Chip
                        icon={React.cloneElement(format.icon as React.ReactElement)}
                        label={format.category}
                        size="small"
                        sx={{
                          backgroundColor: alpha(format.color, 0.1),
                          color: format.color,
                          '& .MuiChip-icon': {
                            color: format.color,
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
                <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                  Maximum file size: 100MB
                </Typography>
              </Paper>

              {/* File Queue */}
              {files.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Files to Upload ({files.length})</Typography>
                    <Box>
                      <Button
                        size="small"
                        onClick={clearAllFiles}
                        startIcon={<Clear />}
                        sx={{ mr: 1 }}
                      >
                        Clear All
                      </Button>
                      <Button
                        variant="contained"
                        onClick={uploadFiles}
                        disabled={loading || files.every(f => f.status !== 'pending')}
                        startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
                      >
                        {loading ? 'Uploading...' : 'Upload All'}
                      </Button>
                    </Box>
                  </Box>

                  <List>
                    <AnimatePresence>
                      {files.map((file) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ListItem
                            sx={{
                              mb: 1,
                              backgroundColor: alpha(theme.palette.background.paper, 0.8),
                              borderRadius: 1,
                              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            }}
                          >
                            <ListItemIcon>{getFileIcon(file.name)}</ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                    {file.name}
                                  </Typography>
                                  <Chip
                                    label={file.status}
                                    size="small"
                                    color={getStatusColor(file.status)}
                                  />
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatFileSize(file.size)}
                                  </Typography>
                                  {file.validationError && (
                                    <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                                      {file.validationError}
                                    </Alert>
                                  )}
                                  {file.error && (
                                    <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                                      {file.error}
                                    </Alert>
                                  )}
                                  {(file.status === 'uploading' || file.status === 'validating') && (
                                    <LinearProgress
                                      variant="determinate"
                                      value={file.progress}
                                      sx={{ mt: 1 }}
                                    />
                                  )}
                                  {file.status === 'success' && file.processingOptions && (
                                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                      {file.processingOptions.map((option) => (
                                        <Chip
                                          key={option}
                                          label={option}
                                          size="small"
                                          onClick={() => console.log('Process:', option)}
                                          clickable
                                          color="primary"
                                          variant="outlined"
                                        />
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              {file.status === 'error' && (
                                <IconButton
                                  edge="end"
                                  aria-label="retry"
                                  onClick={() => retryUpload(file.id)}
                                  sx={{ mr: 1 }}
                                >
                                  <Refresh />
                                </IconButton>
                              )}
                              {file.name && file.name.toLowerCase().endsWith('.csv') && file.status === 'success' && (
                                <IconButton
                                  edge="end"
                                  aria-label="preview"
                                  onClick={() => handlePreview(file)}
                                  sx={{ mr: 1 }}
                                >
                                  <Preview />
                                </IconButton>
                              )}
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => removeFile(file.id)}
                              >
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Upload History */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Upload History</Typography>
                <IconButton onClick={() => setShowHistory(!showHistory)} size="small">
                  <FolderOpen />
                </IconButton>
              </Box>

              <Collapse in={showHistory}>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {uploadHistory.slice(0, 10).map((file) => (
                    <ListItem key={file.id} divider>
                      <ListItemIcon>{getFileIcon(file.filename)}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" noWrap>
                            {file.filename}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {new Date(file.uploadDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatFileSize(file.size)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="download"
                          onClick={() => handleDownload(file.id, file.filename)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <Download />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(file.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  {uploadHistory.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No files uploaded yet
                    </Typography>
                  )}
                </List>
              </Collapse>
            </CardContent>
          </Card>

          {/* Processing Options Info */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                After Upload
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Transform color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="ETL Pipeline"
                    secondary="Transform and clean your data"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Assessment color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Create Dashboard"
                    secondary="Visualize your data instantly"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Storage color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Run Analysis"
                    secondary="Get AI-powered insights"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={!!selectedFile && previewData.length > 0}
        onClose={() => {
          setSelectedFile(null);
          setPreviewData([]);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Preview: {selectedFile?.name}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {previewData.length > 0 &&
                    Object.keys(previewData[0]).map((key) => (
                      <TableCell key={key}>{key}</TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData.slice(0, 5).map((row, index) => (
                  <TableRow key={index}>
                    {row && Object.values(row).map((value, cellIndex) => (
                      <TableCell key={cellIndex}>{String(value ?? '')}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
            Showing first 5 rows
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setSelectedFile(null);
            setPreviewData([]);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnhancedFileUpload;