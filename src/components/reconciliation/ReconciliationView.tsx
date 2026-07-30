import React, { useState } from 'react';
import { Box, Stack, Typography, Paper } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { ReconciliationFeed } from './ReconciliationFeed';
import { ManualReconcileDialog } from './ManualReconcileDialog';
import { BankStatementLine } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { MonoText } from '../common/MonoText';

export const ReconciliationView: React.FC = () => {
  const { bankLines } = useFinance();
  const [selectedLine, setSelectedLine] = useState<BankStatementLine | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const pendingCount = bankLines.filter((l) => !l.reconciled).length;
  const totalCount = bankLines.length;
  const autoMatchPercent = Math.round(((totalCount - pendingCount) / totalCount) * 100) || 0;

  const handleOpenManualModal = (line: BankStatementLine) => {
    setSelectedLine(line);
    setDialogOpen(true);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          AI-Powered Bank Statement Reconciliation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Automated payment clearing, UTR verification, and zero-touch ledger posting
        </Typography>
      </Box>

      {/* KPI Stats Bar */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#ffffff' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                backgroundColor: '#f0f9ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CompareArrowsIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Pending Reconciliations
              </Typography>
              <MonoText variant="h6" sx={{ fontWeight: 700, color: pendingCount > 0 ? '#dc2626' : '#16a34a' }}>
                {pendingCount} Transactions
              </MonoText>
            </Box>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#ffffff' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AutoAwesomeIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                AI Match Accuracy Rate
              </Typography>
              <MonoText variant="h6" sx={{ fontWeight: 700, color: '#16a34a' }}>
                {autoMatchPercent}% Auto-Matched
              </MonoText>
            </Box>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#ffffff' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AccountBalanceIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Cleared Cash Inflows
              </Typography>
              <MonoText variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                {formatCurrency(
                  bankLines.filter((l) => l.reconciled && l.type === 'CR').reduce((acc, l) => acc + l.amount, 0),
                  'short'
                )}
              </MonoText>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Main Reconciliation Feed */}
      <ReconciliationFeed onOpenManualModal={handleOpenManualModal} />

      {/* Manual Reconciliation Dialog */}
      <ManualReconcileDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bankLine={selectedLine}
      />
    </Stack>
  );
};
