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
      icon: <PriceCheckIcon sx={{ color: '#16a34a' }} />,
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
    },
    {
      title: 'Total Outflows (Current Month)',
      shortValue: formatCurrency(11200000, 'short'),
      fullValue: formatCurrency(11200000, 'full'),
      change: '-4.2%',
      isPositive: true,
      comparison: 'vs last month (₹1.17Cr)',
      icon: <MoneyOffIcon sx={{ color: '#0284c7' }} />,
      bgColor: '#f0f9ff',
      borderColor: '#bae6fd',
    },
    {
      title: 'Outstanding Debtors Balance',
      shortValue: formatCurrency(liveOutstanding, 'short'),
      fullValue: formatCurrency(liveOutstanding, 'full'),
      change: '+8.1%',
      isPositive: false,
      comparison: '7 accounts overdue past 30d',
      icon: <WarningAmberIcon sx={{ color: '#dc2626' }} />,
      bgColor: '#fef2f2',
      borderColor: '#fecaca',
    },
    {
      title: 'Net Cash Reserve Balance',
      shortValue: formatCurrency(cfoKPIs.netCashFlow, 'short'),
      fullValue: formatCurrency(cfoKPIs.netCashFlow, 'full'),
      change: '+18.6%',
      isPositive: true,
      comparison: 'includes latest AI matches',
      icon: <AccountBalanceWalletIcon sx={{ color: '#d32f2f' }} />,
      bgColor: '#fff5f5',
      borderColor: '#fed7d7',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      {kpis.map((kpi, idx) => (
        <Card
          key={idx}
          variant="outlined"
          sx={{
            height: '100%',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {kpi.title}
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  backgroundColor: kpi.bgColor,
                  border: `1px solid ${kpi.borderColor}`,
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
                <MonoText variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                  {kpi.shortValue}
                </MonoText>
              </Box>
            </Tooltip>

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Chip
                size="small"
                icon={kpi.isPositive ? <TrendingUpIcon style={{ fontSize: 13 }} /> : <TrendingDownIcon style={{ fontSize: 13 }} />}
                label={kpi.change}
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: kpi.isPositive ? '#ecfdf5' : '#fef2f2',
                  color: kpi.isPositive ? '#16a34a' : '#dc2626',
                  border: `1px solid ${kpi.isPositive ? '#a7f3d0' : '#fecaca'}`,
                }}
              />
              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.75rem' }}>
                {kpi.comparison}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
