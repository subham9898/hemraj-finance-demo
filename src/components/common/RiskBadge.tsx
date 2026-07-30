import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import ShieldIcon from '@mui/icons-material/Shield';
import { RiskLevel } from '../../types';

interface RiskBadgeProps extends Omit<ChipProps, 'color'> {
  riskLevel: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ riskLevel, size = 'small', sx, ...props }) => {
  let color = '#16a34a';
  let bgColor = '#ecfdf5';
  let borderColor = '#b9f6ca';
  let IconComponent = CheckCircleIcon;

  switch (riskLevel) {
    case 'Low':
      color = '#16a34a';
      bgColor = '#ecfdf5';
      borderColor = '#a7f3d0';
      IconComponent = CheckCircleIcon;
      break;
    case 'Medium':
      color = '#d97706';
      bgColor = '#fffbeb';
      borderColor = '#fde68a';
      IconComponent = ShieldIcon;
      break;
    case 'High':
      color = '#ea580c';
      bgColor = '#fff7ed';
      borderColor = '#ffedd5';
      IconComponent = WarningAmberIcon;
      break;
    case 'Critical':
      color = '#dc2626';
      bgColor = '#fef2f2';
      borderColor = '#fecaca';
      IconComponent = ErrorIcon;
      break;
  }

  return (
    <Chip
      {...props}
      size={size}
      icon={<IconComponent style={{ fontSize: size === 'small' ? 14 : 16, color }} />}
      label={`${riskLevel} Risk`}
      sx={{
        color,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        fontWeight: 600,
        borderRadius: '6px',
        ...sx,
      }}
    />
  );
};
