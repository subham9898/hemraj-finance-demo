import React from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { KpiCards } from './KpiCards';
import { CashFlowChart } from './CashFlowChart';
import { OverdueActionList } from './OverdueActionList';
import { Debtor } from '../../types';

interface DashboardViewProps {
  onDraftEmail: (debtor: Debtor) => void;
  onViewDebtor: (debtorId: string) => void;
  onOpenCfoBrief: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onDraftEmail,
  onViewDebtor,
  onOpenCfoBrief,
}) => {
  return (
    <Stack spacing={3}>
      {/* Header Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Cash Flow & Receivables Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time liquidity monitoring, trajectory forecasts, and overdue debtor action queues
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<AutoAwesomeIcon />}
          onClick={onOpenCfoBrief}
          sx={{
            borderColor: '#fecaca',
            color: '#dc2626',
            backgroundColor: '#fef2f2',
            '&:hover': {
              backgroundColor: '#fee2e2',
            },
          }}
        >
          View Gemini CFO Briefing
        </Button>
      </Box>

      {/* 4 KPI Cards */}
      <KpiCards />

      {/* Cash Flow Trajectory Chart */}
      <CashFlowChart />

      {/* Overdue Action Queue */}
      <OverdueActionList onDraftEmail={onDraftEmail} onViewDebtor={onViewDebtor} />
    </Stack>
  );
};
