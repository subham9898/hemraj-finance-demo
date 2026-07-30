import React from 'react';
import { Box, Paper, Typography, Stack, Tooltip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { MonoText } from '../common/MonoText';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';

export const KpiCards: React.FC = () => {
  const { cfoKPIs } = useFinance();

  const kpis = [
    {
      title: 'Net Cash Reserve Balance',
      isPrimary: true,
      shortValue: formatCurrency(24850000, 'short'),
      fullValue: formatCurrency(24850000, 'full'),
      change: '+18.6%',
      isPositive: true,
      comparison: 'vs Q2 (₹2.09Cr)',
      context: 'Liquid operational reserve buffer',
      status: 'Healthy',
      statusColor: '#059669',
      statusBg: '#f0fdf4',
      sparkline: 'M 0,22 Q 15,18 30,20 T 60,12 T 90,14 T 120,4',
      sparkColor: '#10b981',
      icon: <AccountBalanceWalletIcon sx={{ color: '#0f172a', fontSize: 20 }} />,
    },
    {
      title: 'Total Monthly Inflows (Collected)',
      isPrimary: false,
      shortValue: formatCurrency(cfoKPIs.totalRevenue || 18500000, 'short'),
      fullValue: formatCurrency(cfoKPIs.totalRevenue || 18500000, 'full'),
      change: '+12.4%',
      isPositive: true,
      comparison: 'vs last month (₹1.65Cr)',
      context: 'Collected revenue via NEFT & RTGS',
      status: 'On Target',
      statusColor: '#0284c7',
      statusBg: '#f0f9ff',
      sparkline: 'M 0,20 Q 20,24 40,16 T 80,10 T 120,6',
      sparkColor: '#0284c7',
      icon: <PriceCheckIcon sx={{ color: '#0f172a', fontSize: 20 }} />,
    },
    {
      title: 'Total Monthly Outflows (Vendor/Tax)',
      isPrimary: false,
      shortValue: formatCurrency(11200000, 'short'),
      fullValue: formatCurrency(11200000, 'full'),
      change: '-4.2%',
      isPositive: true,
      comparison: 'vs last month (₹1.17Cr)',
      context: 'Payroll, vendor liabilities & statutory taxes',
      status: 'Controlled',
      statusColor: '#059669',
      statusBg: '#f0fdf4',
      sparkline: 'M 0,10 Q 20,12 40,18 T 80,15 T 120,22',
      sparkColor: '#10b981',
      icon: <MoneyOffIcon sx={{ color: '#0f172a', fontSize: 20 }} />,
    },
    {
      title: 'Outstanding Debtors & Overdue',
      isPrimary: false,
      shortValue: formatCurrency(cfoKPIs.overdueBalances || 7850000, 'short'),
      fullValue: formatCurrency(cfoKPIs.overdueBalances || 7850000, 'full'),
      change: '+8.1%',
      isPositive: false,
      comparison: '7 accounts overdue > 30 days',
      context: 'Receivables requiring active follow-up',
      status: 'Needs Action',
      statusColor: '#dc2626',
      statusBg: '#fef2f2',
      sparkline: 'M 0,16 Q 20,14 40,20 T 80,24 T 120,26',
      sparkColor: '#ef4444',
      icon: <WarningAmberIcon sx={{ color: '#0f172a', fontSize: 20 }} />,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', xl: 'repeat(4, 1fr)' },
        gap: 2,
      }}
    >
      {kpis.map((kpi, idx) => (
        <Paper
          key={idx}
          elevation={0}
          sx={{
            p: 2.25,
            height: '100%',
            backgroundColor: '#ffffff',
            border: kpi.isPrimary ? '2px solid #0f172a' : '1px solid #e2e8f0',
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: kpi.isPrimary ? '#0f172a' : '#cbd5e1',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
            },
          }}
        >
          {/* Header row */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
              {kpi.title}
            </Typography>

            <Box
              sx={{
                width: 32,
                height: 32,
                minWidth: 32,
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {kpi.icon}
            </Box>
          </Stack>

          {/* Main KPI Value + Sparkline */}
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
            <Tooltip title={`Exact Value: ${kpi.fullValue}`} placement="top" arrow>
              <Box>
                <MonoText
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                    fontSize: kpi.isPrimary ? '1.5rem' : '1.35rem',
                  }}
                >
                  {kpi.shortValue}
                </MonoText>
              </Box>
            </Tooltip>

            {/* Sparkline Graphic */}
            <Box sx={{ width: 80, height: 28 }}>
              <svg width="80" height="28" viewBox="0 0 120 30" style={{ overflow: 'visible' }}>
                <path
                  d={kpi.sparkline}
                  fill="none"
                  stroke={kpi.sparkColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          </Stack>

          {/* Sub-status & comparison */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.725rem',
                  color: kpi.isPositive ? '#059669' : '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.25,
                }}
              >
                {kpi.isPositive ? <TrendingUpIcon sx={{ fontSize: 13 }} /> : <TrendingDownIcon sx={{ fontSize: 13 }} />}
                {kpi.change}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.725rem' }}>
                {kpi.comparison}
              </Typography>
            </Stack>

            <Box
              sx={{
                px: 0.8,
                py: 0.2,
                borderRadius: '4px',
                backgroundColor: kpi.statusBg,
                color: kpi.statusColor,
                fontWeight: 700,
                fontSize: '0.65rem',
                border: `1px solid ${kpi.statusColor}33`,
              }}
            >
              {kpi.status}
            </Box>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};
