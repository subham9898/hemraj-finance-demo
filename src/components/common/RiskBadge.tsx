import React from 'react';
import { Box, Typography } from '@mui/material';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  riskLevel: RiskLevel;
  size?: 'small' | 'medium' | 'large' | string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ riskLevel, size = 'small' }) => {
  let dotColor = '#10b981'; // Green
  let textColor = '#047857';
  let bgColor = '#f0fdf4';
  let border = '1px solid #d1fae5';

  switch (riskLevel) {
    case 'Low':
      dotColor = '#10b981';
      textColor = '#047857';
      bgColor = '#f0fdf4';
      border = '1px solid #d1fae5';
      break;
    case 'Medium':
      dotColor = '#f59e0b';
      textColor = '#b45309';
      bgColor = '#fffbeb';
      border = '1px solid #fef3c7';
      break;
    case 'High':
      dotColor = '#f97316';
      textColor = '#c2410c';
      bgColor = '#fff7ed';
      border = '1px solid #ffedd5';
      break;
    case 'Critical':
      dotColor = '#ef4444';
      textColor = '#b91c1c';
      bgColor = '#fef2f2';
      border = '1px solid #fee2e2';
      break;
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1,
        py: 0.3,
        borderRadius: '9999px',
        backgroundColor: bgColor,
        border,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: dotColor,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: textColor,
          fontWeight: 600,
          fontSize: '0.725rem',
          lineHeight: 1,
        }}
      >
        {riskLevel} Risk
      </Typography>
    </Box>
  );
};

