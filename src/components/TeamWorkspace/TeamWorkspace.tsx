import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  AvatarGroup,
  Chip,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Paper,
  Divider,
  Badge,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Group,
  Add,
  MoreVert,
  Comment,
  Share,
  Edit,
  PersonAdd,
  Task,
  Description,
  Dashboard,
  Timeline,
  Send,
  AttachFile,
  VideoCall,
  Search,
  FilterList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  lastActive: string;
}

interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  type: 'dashboard' | 'report' | 'pipeline' | 'analysis';
  status: 'active' | 'archived' | 'draft';
  owner: TeamMember;
  members: TeamMember[];
  lastModified: string;
  progress: number;
  tags: string[];
}

interface Activity {
  id: string;
  user: TeamMember;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'comment' | 'share';
}

interface Comment {
  id: string;
  user: TeamMember;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

const TeamWorkspace: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedProject, setSelectedProject] = useState<WorkspaceProject | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [projectMenuAnchor, setProjectMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  // Ref to track timeout for cleanup
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadWorkspaceData();

    // Cleanup function for any pending timeouts or intervals
    return () => {
      // Clear any pending timeout when component unmounts
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, []);

  const loadWorkspaceData = async () => {
    // Clear any existing timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    setLoading(true);
    // Simulate API calls
    loadTimeoutRef.current = setTimeout(() => {
      setTeamMembers(getMockTeamMembers());
      setProjects(getMockProjects());
      setActivities(getMockActivities());
      setComments(getMockComments());
      setLoading(false);
      loadTimeoutRef.current = null; // Clear ref after completion
    }, 1000);
  };

  const handleInviteMember = () => {
    setInviteDialogOpen(true);
  };

  const handleProjectClick = (project: WorkspaceProject) => {
    setSelectedProject(project);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        user: teamMembers[0], // Current user
        content: newComment,
        timestamp: new Date().toISOString(),
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'error';
      case 'admin': return 'warning';
      case 'editor': return 'primary';
      case 'viewer': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'busy': return '#FF9800';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'dashboard': return <Dashboard />;
      case 'report': return <Description />;
      case 'pipeline': return <Timeline />;
      case 'analysis': return <Task />;
      default: return <Description />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Team Workspace
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Collaborate with your team on projects and insights
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<VideoCall />}
          >
            Start Meeting
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleInviteMember}
          >
            Invite Member
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, val) => setSelectedTab(val)}>
          <Tab label="Projects" icon={<Dashboard />} iconPosition="start" />
          <Tab label="Team" icon={<Group />} iconPosition="start" />
          <Tab label="Activity" icon={<Timeline />} iconPosition="start" />
          <Tab label="Messages" icon={<Comment />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {/* Projects Grid */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search projects..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ flexGrow: 1 }}
              />
              <Button startIcon={<FilterList />} variant="outlined">
                Filter
              </Button>
              <Button startIcon={<Add />} variant="contained">
                New Project
              </Button>
            </Box>

            <Grid container spacing={2}>
              {projects.map((project) => (
                <Grid size={{ xs: 12, md: 6 }} key={project.id}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleProjectClick(project)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getProjectIcon(project.type)}
                            <Typography variant="h6">
                              {project.name}
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={(e) => {
                            e.stopPropagation();
                            setProjectMenuAnchor(e.currentTarget);
                          }}>
                            <MoreVert />
                          </IconButton>
                        </Box>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {project.description}
                        </Typography>

                        <Box sx={{ my: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption">Progress</Typography>
                            <Typography variant="caption">{project.progress}%</Typography>
                          </Box>
                          <Box sx={{ width: '100%', height: 4, bgcolor: 'grey.200', borderRadius: 2 }}>
                            <Box
                              sx={{
                                width: `${project.progress}%`,
                                height: '100%',
                                bgcolor: 'primary.main',
                                borderRadius: 2,
                              }}
                            />
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <AvatarGroup max={3}>
                            {project.members.map((member) => (
                              <Avatar
                                key={member.id}
                                alt={member.name}
                                src={member.avatar}
                                sx={{ width: 24, height: 24 }}
                              />
                            ))}
                          </AvatarGroup>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {project.tags.map((tag) => (
                              <Chip key={tag} label={tag} size="small" />
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Project Details Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            {selectedProject ? (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Project Details
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedProject.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Team Members
                    </Typography>
                    <List dense>
                      {selectedProject.members.map((member) => (
                        <ListItem key={member.id}>
                          <ListItemAvatar>
                            <Badge
                              badgeContent=""
                              sx={{
                                '& .MuiBadge-badge': {
                                  backgroundColor: getStatusColor(member.status),
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                },
                              }}
                            >
                              <Avatar src={member.avatar} sx={{ width: 32, height: 32 }} />
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={member.name}
                            secondary={member.role}
                          />
                          <ListItemSecondaryAction>
                            <Chip
                              label={member.role}
                              size="small"
                              color={getRoleColor(member.role)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      startIcon={<PersonAdd />}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Add Member
                    </Button>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Recent Activity
                    </Typography>
                    <List dense>
                      {activities.slice(0, 3).map((activity) => (
                        <ListItem key={activity.id}>
                          <ListItemAvatar>
                            <Avatar src={activity.user.avatar} sx={{ width: 24, height: 24 }} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${activity.user.name} ${activity.action}`}
                            secondary={activity.timestamp}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button startIcon={<Share />} variant="outlined" fullWidth>
                      Share
                    </Button>
                    <Button startIcon={<Edit />} variant="contained" fullWidth>
                      Edit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Select a project to view details
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {/* Team Members List */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Team Members</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      placeholder="Search members..."
                      size="small"
                      InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                    <Button startIcon={<PersonAdd />} variant="contained">
                      Invite Member
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  {teamMembers.map((member) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={member.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Badge
                              badgeContent=""
                              sx={{
                                '& .MuiBadge-badge': {
                                  backgroundColor: getStatusColor(member.status),
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                },
                              }}
                            >
                              <Avatar src={member.avatar} sx={{ width: 48, height: 48, mr: 2 }} />
                            </Badge>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1">
                                {member.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {member.email}
                              </Typography>
                            </Box>
                            <Chip
                              label={member.role}
                              size="small"
                              color={getRoleColor(member.role)}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Last active: {member.lastActive}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small">
                                <Comment />
                              </IconButton>
                              <IconButton size="small">
                                <VideoCall />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          {/* Activity Feed */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {activities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar src={activity.user.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box>
                              <strong>{activity.user.name}</strong> {activity.action} <strong>{activity.target}</strong>
                            </Box>
                          }
                          secondary={activity.timestamp}
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Activity Stats */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Activity Summary
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Projects Updated" secondary="12 this week" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Comments Added" secondary="45 this week" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Files Shared" secondary="8 this week" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Team Meetings" secondary="3 this week" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 3 && (
        <Grid container spacing={3}>
          {/* Comments Section */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Team Discussion
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <AttachFile />
                      </IconButton>
                    </Box>
                    <Button
                      startIcon={<Send />}
                      variant="contained"
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {comments.map((comment) => (
                  <Box key={comment.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar src={comment.user.avatar} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle2">
                            {comment.user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {comment.timestamp}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                          <Button size="small">Reply</Button>
                          <Button size="small">Like</Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Role"
            fullWidth
            variant="outlined"
            defaultValue="viewer"
          >
            <MenuItem value="viewer">Viewer</MenuItem>
            <MenuItem value="editor">Editor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setInviteDialogOpen(false)}>
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Project Menu */}
      <Menu
        anchorEl={projectMenuAnchor}
        open={Boolean(projectMenuAnchor)}
        onClose={() => setProjectMenuAnchor(null)}
      >
        <MenuItem>Edit Project</MenuItem>
        <MenuItem>Share Project</MenuItem>
        <MenuItem>Duplicate Project</MenuItem>
        <MenuItem>Archive Project</MenuItem>
        <Divider />
        <MenuItem sx={{ color: 'error.main' }}>Delete Project</MenuItem>
      </Menu>
    </Box>
  );
};

// Mock data functions
function getMockTeamMembers(): TeamMember[] {
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'owner',
      status: 'online',
      lastActive: '2 minutes ago',
      avatar: undefined,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'admin',
      status: 'online',
      lastActive: '5 minutes ago',
      avatar: undefined,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'editor',
      status: 'busy',
      lastActive: '1 hour ago',
      avatar: undefined,
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@company.com',
      role: 'viewer',
      status: 'offline',
      lastActive: '2 hours ago',
      avatar: undefined,
    },
  ];
}

function getMockProjects(): WorkspaceProject[] {
  const members = getMockTeamMembers();
  return [
    {
      id: '1',
      name: 'Q4 Sales Dashboard',
      description: 'Comprehensive sales analytics for Q4 2024',
      type: 'dashboard',
      status: 'active',
      owner: members[0],
      members: members.slice(0, 3),
      lastModified: '2 hours ago',
      progress: 75,
      tags: ['Sales', 'Q4'],
    },
    {
      id: '2',
      name: 'Customer Insights Report',
      description: 'Deep dive into customer behavior patterns',
      type: 'report',
      status: 'active',
      owner: members[1],
      members: members.slice(1, 4),
      lastModified: '5 hours ago',
      progress: 60,
      tags: ['Customer', 'Analytics'],
    },
    {
      id: '3',
      name: 'Data Migration Pipeline',
      description: 'ETL pipeline for legacy system migration',
      type: 'pipeline',
      status: 'active',
      owner: members[2],
      members: members.slice(0, 2),
      lastModified: '1 day ago',
      progress: 90,
      tags: ['ETL', 'Migration'],
    },
    {
      id: '4',
      name: 'Revenue Forecast Analysis',
      description: 'AI-powered revenue predictions for 2025',
      type: 'analysis',
      status: 'draft',
      owner: members[0],
      members: members,
      lastModified: '3 days ago',
      progress: 30,
      tags: ['AI', 'Revenue'],
    },
  ];
}

function getMockActivities(): Activity[] {
  const members = getMockTeamMembers();
  return [
    {
      id: '1',
      user: members[0],
      action: 'updated',
      target: 'Q4 Sales Dashboard',
      timestamp: '2 hours ago',
      type: 'update',
    },
    {
      id: '2',
      user: members[1],
      action: 'commented on',
      target: 'Customer Insights Report',
      timestamp: '3 hours ago',
      type: 'comment',
    },
    {
      id: '3',
      user: members[2],
      action: 'shared',
      target: 'Data Migration Pipeline',
      timestamp: '5 hours ago',
      type: 'share',
    },
    {
      id: '4',
      user: members[3],
      action: 'created',
      target: 'Revenue Forecast Analysis',
      timestamp: '1 day ago',
      type: 'create',
    },
    {
      id: '5',
      user: members[0],
      action: 'deleted',
      target: 'Old Marketing Dashboard',
      timestamp: '2 days ago',
      type: 'delete',
    },
  ];
}

function getMockComments(): Comment[] {
  const members = getMockTeamMembers();
  return [
    {
      id: '1',
      user: members[0],
      content: 'Great progress on the Q4 dashboard! The new visualizations really help understand the sales trends.',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      user: members[1],
      content: 'We should schedule a review meeting for the customer insights report. I have some suggestions for additional metrics.',
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      user: members[2],
      content: 'The data migration pipeline is almost complete. Just need to finalize the error handling and logging.',
      timestamp: '1 day ago',
    },
  ];
}

export default TeamWorkspace;