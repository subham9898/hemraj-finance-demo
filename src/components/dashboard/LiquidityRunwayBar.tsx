import React from 'react';
import { Box, Paper, Stack, Typography, LinearProgress, Divider, Tooltip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { MonoText } from '../common/MonoText';
import { formatCurrency } from '../../utils/formatCurrency';

export const LiquidityRunwayBar: React.FC = () => {
  const netCashAmount = 24850000; // ₹2.48 Cr
  const runwayMonths = 8.4;
  const dsoDays = 28;
  const quickRatio = 2.15;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={3}
        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', lg: 'block' }, borderColor: '#f1f5f9' }} />}
        sx={{ alignItems: { xs: 'stretch', lg: 'center' } }}
      >
        {/* Net Cash Reserve Featured */}
        <Box sx={{ flex: 1.2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                backgroundColor: '#f0fdf4',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AccountBalanceWalletIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>
              Primary Liquidity & Net Cash Reserve
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline' }}>
            <MonoText variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              {formatCurrency(netCashAmount, 'full')}
            </MonoText>
            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <TrendingUpIcon sx={{ fontSize: 14 }} /> +18.6% vs Q2
            </Typography>
          </Stack>
        </Box>

        {/* Cash Runway Health */}
        <Box sx={{ flex: 1.2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <HourglassTopIcon sx={{ fontSize: 16, color: '#0284c7' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>
                Estimated Cash Runway
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', fontFamily: "'IBM Plex Mono', monospace" }}>
              {runwayMonths} Months
            </Typography>
          </Stack>

          <Tooltip title="Healthy cash buffer (&gt; 6 months target met)" placement="top">
            <Box sx={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (runwayMonths / 12) * 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0f2fe',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#0284c7',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Tooltip>

          <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              Burn Rate: ~₹29.5L/mo
            </Typography>
            <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 600, fontSize: '0.7rem' }}>
              Target: &gt; 6.0 Months
            </Typography>
          </Stack>
        </Box>

        {/* Key Ratios */}
        <Stack direction="row" spacing={3} sx={{ flex: 1, justifyContent: 'space-around' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: 'block', mb: 0.25 }}>
              Quick Ratio (Liquidity)
            </Typography>
            <MonoText variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {quickRatio}x
            </MonoText>
            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, fontSize: '0.675rem' }}>
              Optimal (&gt; 1.5x)
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: 'block', mb: 0.25 }}>
              Days Sales Outstanding (DSO)
            </Typography>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline' }}>
              <MonoText variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {dsoDays}
              </MonoText>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem' }}>
                days
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, fontSize: '0.675rem' }}>
              -4d improvement
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: 'block', mb: 0.25 }}>
              Reconciliation Efficiency
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'baseline' }}>
              <MonoText variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                94.8%
              </MonoText>
            </Stack>
            <Typography variant="caption" sx={{ color: '#0284c7', fontWeight: 600, fontSize: '0.675rem' }}>
              AI Auto-Matched
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};
