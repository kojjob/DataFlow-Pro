import React from 'react';
import { Box, Typography } from '@mui/material';

const UserActivityHeatmap: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate random activity data
  const generateActivityData = () => {
    return days.map(day =>
      hours.map(hour => {
        // Simulate realistic patterns (higher activity during business hours)
        const baseActivity = hour >= 9 && hour <= 17 ? 60 : 20;
        const variance = Math.random() * 40;
        return Math.min(100, baseActivity + variance);
      })
    );
  };

  const activityData = generateActivityData();

  const getColor = (value: number) => {
    const opacity = value / 100;
    const baseColor = '102, 126, 234'; // RGB for #667eea
    return `rgba(${baseColor}, ${opacity})`;
  };

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Hour labels */}
      <Box sx={{ display: 'flex', mb: 1, pl: 5 }}>
        {hours.map((hour, index) => (
          index % 3 === 0 && (
            <Typography
              key={hour}
              variant="caption"
              sx={{ width: 36, textAlign: 'center', color: 'text.secondary' }}
            >
              {hour}h
            </Typography>
          )
        ))}
      </Box>

      {/* Heatmap grid */}
      {days.map((day, dayIndex) => (
        <Box key={day} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography
            variant="caption"
            sx={{ width: 40, color: 'text.secondary', fontSize: '0.75rem' }}
          >
            {day}
          </Typography>
          {activityData[dayIndex].map((value, hourIndex) => (
            <Box
              key={`${day}-${hourIndex}`}
              sx={{
                width: 12,
                height: 20,
                backgroundColor: getColor(value),
                border: '1px solid #fff',
                borderRadius: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.2)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  zIndex: 10,
                  position: 'relative'
                }
              }}
              title={`${day} ${hourIndex}:00 - Activity: ${Math.round(value)}%`}
            />
          ))}
        </Box>
      ))}

      {/* Legend */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>
          Low
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[20, 40, 60, 80, 100].map(value => (
            <Box
              key={value}
              sx={{
                width: 20,
                height: 10,
                backgroundColor: getColor(value),
                border: '1px solid #ddd'
              }}
            />
          ))}
        </Box>
        <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
          High
        </Typography>
      </Box>
    </Box>
  );
};

export default UserActivityHeatmap;