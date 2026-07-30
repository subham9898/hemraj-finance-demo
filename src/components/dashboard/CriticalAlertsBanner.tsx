import React, { useState } from 'react';
import { Box, Paper, Stack, Typography, Button, IconButton, Chip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface CriticalAlertsBannerProps {
  onReviewHighRisk: () => void;
  onOpenCfoBrief: () => void;
}

export const CriticalAlertsBanner: React.FC<CriticalAlertsBannerProps> = ({
  onReviewHighRisk,
  onOpenCfoBrief,
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '10px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        position: 'relative',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              minWidth: 34,
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 0.25,
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              <Chip
                label="CRITICAL ACTION REQUIRED"
                size="small"
                sx={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  height: 20,
                  borderRadius: '4px',
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#991b1b', fontSize: '0.875rem' }}>
                ₹1.24 Cr Receivables Overdue &gt; 45 Days Across 3 High-Risk Accounts
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#7f1d1d', fontSize: '0.775rem', display: 'block' }}>
              Reliance Logistics & Zenith Global require immediate intervention to prevent Q3 cash flow deficit. ₹42L vendor commitments due in 5 days.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
          <Button
            size="small"
            variant="contained"
            onClick={onReviewHighRisk}
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            sx={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'none',
              px: 1.75,
              py: 0.6,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#b91c1c',
                boxShadow: 'none',
              },
            }}
          >
            Review High-Risk Debtors
          </Button>

          <Button
            size="small"
            variant="outlined"
            onClick={onOpenCfoBrief}
            startIcon={<AutoAwesomeIcon sx={{ fontSize: 14, color: '#991b1b' }} />}
            sx={{
              borderColor: '#fca5a5',
              color: '#7f1d1d',
              backgroundColor: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              px: 1.5,
              py: 0.6,
              '&:hover': {
                borderColor: '#dc2626',
                backgroundColor: '#fef2f2',
              },
            }}
          >
            AI CFO Analysis
          </Button>

          <IconButton
            size="small"
            onClick={() => setVisible(false)}
            sx={{ color: '#991b1b', '&:hover': { backgroundColor: '#fee2e2' } }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
};
