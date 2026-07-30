import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

export interface MonoTextProps extends TypographyProps {
  fontWeight?: number | string;
}

export const MonoText: React.FC<MonoTextProps> = ({ children, fontWeight, sx, ...props }) => {
  return (
    <Typography
      {...props}
      sx={{
        fontFamily: "'IBM Plex Mono', 'Roboto Mono', monospace",
        letterSpacing: '-0.015em',
        ...(fontWeight ? { fontWeight } : {}),
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};
