import React from 'react';
import { Box, Paper, Typography, Stack, LinearProgress, Chip, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Tooltip, Button } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import LayersIcon from '@mui/icons-material/Layers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MonoText } from '../common/MonoText';
import { formatCurrency } from '../../utils/formatCurrency';
import { useFinance } from '../../context/FinanceContext';
import { RiskBadge } from '../common/RiskBadge';
import { Debtor } from '../../types';

interface FinanceWidgetsGridProps {
  onDraftEmail: (debtor: Debtor) => void;
  onViewDebtor: (debtorId: string) => void;
}

export const FinanceWidgetsGrid: React.FC<FinanceWidgetsGridProps> = ({ onDraftEmail, onViewDebtor }) => {
  const { debtors } = useFinance();

  // Calculate Aging Buckets from Debtors
  const currentTotal = debtors.reduce((acc, d) => acc + d.current, 0);
  const d30Total = debtors.reduce((acc, d) => acc + d.d30, 0);
  const d60Total = debtors.reduce((acc, d) => acc + d.d60, 0);
  const d90PlusTotal = debtors.reduce((acc, d) => acc + d.d90Plus, 0);
  const totalReceivables = currentTotal + d30Total + d60Total + d90PlusTotal;

  const agingBuckets = [
    { label: 'Current (Not Due)', amount: currentTotal, percentage: (currentTotal / totalReceivables) * 100, color: '#10b981' },
    { label: '1 - 30 Days Overdue', amount: d30Total, percentage: (d30Total / totalReceivables) * 100, color: '#f59e0b' },
    { label: '31 - 60 Days Overdue', amount: d60Total, percentage: (d60Total / totalReceivables) * 100, color: '#f97316' },
    { label: '61+ Days Overdue', amount: d90PlusTotal, percentage: (d90PlusTotal / totalReceivables) * 100, color: '#ef4444' },
  ];

  // Bank Account Balances
  const bankAccounts = [
    { name: 'HDFC Bank (Primary Operating)', accountNo: '••• 8842', balance: 14250000, type: 'Current Account', status: 'Active Sync' },
    { name: 'ICICI Bank (Treasury Reserve)', accountNo: '••• 4120', balance: 8500000, type: 'Fixed Deposit', status: 'Active Sync' },
    { name: 'SBI Corporate (Tax & Payroll)', accountNo: '••• 1093', balance: 2100000, type: 'Escrow Account', status: 'Active Sync' },
  ];

  // Upcoming Payment Obligations
  const obligations = [
    { payee: 'Monthly Employee Payroll', category: 'Payroll', amount: 3200000, dueDate: '2026-08-01', risk: 'Critical' },
    { payee: 'GST Statutory Tax Deposit', category: 'Tax Liability', amount: 1850000, dueDate: '2026-08-05', risk: 'High' },
    { payee: 'Tata Consultancy Cloud Infra', category: 'Vendor Payout', amount: 420000, dueDate: '2026-08-08', risk: 'Low' },
  ];

  // Top high-risk debtors
  const highRiskDebtors = debtors
    .filter((d) => d.riskLevel === 'High' || d.riskLevel === 'Critical')
    .sort((a, b) => b.totalOutstanding - a.totalOutstanding)
    .slice(0, 3);

  return (
    <Stack spacing={2.5}>
      {/* 2-Column Grid: Aging Buckets & Bank Balances */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
        {/* Receivable Aging Buckets */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '6px', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                <LayersIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                Receivable Aging Distribution
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Total: {formatCurrency(totalReceivables, 'short')}
            </Typography>
          </Stack>

          <Stack spacing={1.75}>
            {agingBuckets.map((bucket, idx) => (
              <Box key={idx}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#334155' }}>
                    {bucket.label}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <MonoText variant="body2" sx={{ fontWeight: 700, fontSize: '0.825rem', color: '#0f172a' }}>
                      {formatCurrency(bucket.amount, 'short')}
                    </MonoText>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem' }}>
                      ({bucket.percentage.toFixed(1)}%)
                    </Typography>
                  </Stack>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={bucket.percentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#f1f5f9',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: bucket.color,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* Bank Balance Summary */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '6px', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                <AccountBalanceIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                Bank Account Liquidity Summary
              </Typography>
            </Stack>
            <Chip label="3 Connected Feed Accounts" size="small" sx={{ fontSize: '0.675rem', fontWeight: 600, height: 20, backgroundColor: '#f1f5f9' }} />
          </Stack>

          <Stack spacing={1.25}>
            {bankAccounts.map((acc, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 1.25,
                  borderRadius: '6px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.825rem', color: '#0f172a' }}>
                    {acc.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem' }}>
                    {acc.accountNo} • {acc.type}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <MonoText variant="body2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                    {formatCurrency(acc.balance, 'short')}
                  </MonoText>
                  <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, fontSize: '0.675rem' }}>
                    ● {acc.status}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* 2-Column Grid: Collection Funnel & Upcoming Obligations */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
        {/* Collection Conversion Pipeline */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '6px', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
              <FilterAltIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              Monthly Collection Funnel Pipeline
            </Typography>
          </Stack>

          <Stack spacing={1.25}>
            <Box sx={{ p: 1.25, borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
                  1. Total Invoiced (Month)
                </Typography>
                <MonoText variant="body2" sx={{ fontWeight: 700 }}>
                  ₹2,10,00,000
                </MonoText>
              </Stack>
            </Box>

            <Box sx={{ p: 1.25, borderRadius: '6px', backgroundColor: '#f0f9ff', border: '1px solid #e0f2fe' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0369a1' }}>
                  2. Payment Promises Confirmed (88.0%)
                </Typography>
                <MonoText variant="body2" sx={{ fontWeight: 700, color: '#0369a1' }}>
                  ₹1,84,80,000
                </MonoText>
              </Stack>
            </Box>

            <Box sx={{ p: 1.25, borderRadius: '6px', backgroundColor: '#f0fdf4', border: '1px solid #d1fae5' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#047857' }}>
                  3. Reconciled & Cleared (82.5%)
                </Typography>
                <MonoText variant="body2" sx={{ fontWeight: 800, color: '#047857' }}>
                  ₹1,73,25,000
                </MonoText>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Upcoming Payment Obligations */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '6px', backgroundColor: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
              <EventRepeatIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              Upcoming Outflow Commitments
            </Typography>
          </Stack>

          <Stack spacing={1.25}>
            {obligations.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 1.25,
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.825rem', color: '#0f172a' }}>
                    {item.payee}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem' }}>
                    {item.category} • Due {item.dueDate}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <MonoText variant="body2" sx={{ fontWeight: 800, fontSize: '0.875rem', color: '#dc2626' }}>
                    {formatCurrency(item.amount, 'short')}
                  </MonoText>
                  <Chip
                    label={item.risk}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      backgroundColor: item.risk === 'Critical' ? '#fef2f2' : '#f8fafc',
                      color: item.risk === 'Critical' ? '#b91c1c' : '#475569',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* High-Risk Debtors Queue */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
            High-Risk Debtors Action Queue
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {highRiskDebtors.length} priority accounts requiring action
          </Typography>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>Customer / Debtor</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>Region</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>Total Overdue</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>Avg Delay</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>Risk Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>Quick Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {highRiskDebtors.map((debtor) => (
              <TableRow key={debtor.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.825rem', color: '#0f172a' }}>
                    {debtor.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem' }}>
                    {debtor.contactName} ({debtor.companyCode})
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {debtor.region}
                  </Typography>
                </TableCell>
                <TableCell>
                  <MonoText variant="body2" sx={{ fontWeight: 800, color: '#dc2626', fontSize: '0.85rem' }}>
                    {formatCurrency(debtor.totalOutstanding, 'short')}
                  </MonoText>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    +{debtor.avgPaymentDelayDays} days
                  </Typography>
                </TableCell>
                <TableCell>
                  <RiskBadge riskLevel={debtor.riskLevel} />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AutoAwesomeIcon sx={{ fontSize: 13, color: '#0f172a' }} />}
                      onClick={() => onDraftEmail(debtor)}
                      sx={{
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        py: 0.3,
                        px: 1.2,
                        textTransform: 'none',
                        borderColor: '#cbd5e1',
                        color: '#0f172a',
                        '&:hover': { borderColor: '#0f172a', backgroundColor: '#f8fafc' },
                      }}
                    >
                      Draft AI Email
                    </Button>
                    <Tooltip title="View Debtor Ledger">
                      <IconButton size="small" onClick={() => onViewDebtor(debtor.id)} sx={{ border: '1px solid #e2e8f0' }}>
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
};
