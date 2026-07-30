import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Chip, Tooltip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { MonoText } from '../common/MonoText';

export const KpiCards: React.FC = () => {
  const { debtors, cfoKPIs } = useFinance();

  const liveOutstanding = debtors.reduce((acc, d) => acc + d.totalOutstanding, 0);

  const kpis = [
    {
      title: 'Total Inflows (Current Month)',
      shortValue: formatCurrency(18500000, 'short'),
      fullValue: formatCurrency(18500000, 'full'),
      change: '+12.4%',
      isPositive: true,
      comparison: 'vs last month (₹1.65Cr)',
      icon: <PriceCheckIcon sx={{ color: '#0f172a', fontSize: 20 }} />,
    },
    {
      title: 'Total Outflows (Current Month)',
      shortValue: formatCurrency(11200000, 'short'),
      fullValue: formatCurrency(11200000, 'full'),
      change: '-4.2%',
      isPositive: true,
      comparison: 'vs last month (₹1.17Cr)',
      icon: <MoneyOffIcon sx={{ color: '#0f172a', fontSize: 20 }} />,
    },
    {
      title: 'Outstanding Debtors Balance',
      shortValue: formatCurrency(liveOutstanding, 'short'),
      fullValue: formatCurrency(liveOutstanding, 'full'),
      change: '+8.1%',
      isPositive: false,
      comparison: '7 accounts overdue past 30d',
      icon: <WarningAmberIcon sx={{ color: '#0f172a', fontSize: 20 }} />,
    },
    {
      title: 'Net Cash Reserve Balance',
      shortValue: formatCurrency(cfoKPIs.netCashFlow, 'short'),
      fullValue: formatCurrency(cfoKPIs.netCashFlow, 'full'),
      change: '+18.6%',
      isPositive: true,
      comparison: 'includes latest AI matches',
      icon: <AccountBalanceWalletIcon sx={{ color: '#0f172a', fontSize: 20 }} />,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 2,
      }}
    >
      {kpis.map((kpi, idx) => (
        <Card
          key={idx}
          elevation={0}
          sx={{
            height: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            transition: 'border-color 0.2s ease',
            '&:hover': {
              borderColor: '#cbd5e1',
            },
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.825rem' }}>
                {kpi.title}
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
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

            <Tooltip title={`Exact Amount: ${kpi.fullValue}`} placement="top" arrow>
              <Box>
                <MonoText variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1, letterSpacing: '-0.02em' }}>
                  {kpi.shortValue}
                </MonoText>
              </Box>
            </Tooltip>

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
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
                {kpi.isPositive ? (
                  <TrendingUpIcon style={{ fontSize: 13 }} />
                ) : (
                  <TrendingDownIcon style={{ fontSize: 13 }} />
                )}
                {kpi.change}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.725rem' }}>
                {kpi.comparison}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
