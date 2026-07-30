import React from 'react';
import { Box, Stack, Typography, Button, Paper } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { CriticalAlertsBanner } from './CriticalAlertsBanner';
import { LiquidityRunwayBar } from './LiquidityRunwayBar';
import { KpiCards } from './KpiCards';
import { AiInsightsPanel } from './AiInsightsPanel';
import { CashFlowChart } from './CashFlowChart';
import { FinanceWidgetsGrid } from './FinanceWidgetsGrid';
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
    <Stack spacing={2.5}>
      {/* Executive Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', fontSize: '1.35rem' }}>
            Cash Flow & Receivables Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.825rem' }}>
            Enterprise liquidity monitoring, AI-driven trajectory forecasts, aging distribution & automated collection queues
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
          onClick={onOpenCfoBrief}
          sx={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'none',
            px: 2,
            py: 0.75,
            borderRadius: '6px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#1e293b',
              boxShadow: 'none',
            },
          }}
        >
          Generate Gemini CFO Briefing
        </Button>
      </Box>

      {/* Hierarchy Step 1: Critical Alerts Banner */}
      <CriticalAlertsBanner
        onReviewHighRisk={() => {
          const element = document.getElementById('high-risk-queue');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenCfoBrief={onOpenCfoBrief}
      />

      {/* Hierarchy Step 2: Cash Position & Runway Bar */}
      <LiquidityRunwayBar />

      {/* Hierarchy Step 3: Enhanced KPI Cards with Sparklines */}
      <KpiCards />

      {/* Hierarchy Step 4: Persistent AI Insights Panel */}
      <AiInsightsPanel onOpenCfoBrief={onOpenCfoBrief} />

      {/* Hierarchy Step 5: Cash Flow Trajectory & Forecast Chart */}
      <CashFlowChart />

      {/* Hierarchy Step 6: Finance Widgets Grid (Aging Buckets, Bank Balances, Collection Funnel, Commitments) */}
      <Box id="high-risk-queue">
        <FinanceWidgetsGrid onDraftEmail={onDraftEmail} onViewDebtor={onViewDebtor} />
      </Box>

      {/* Hierarchy Step 7: Overdue Receivables Action List */}
      <OverdueActionList onDraftEmail={onDraftEmail} onViewDebtor={onViewDebtor} />
    </Stack>
  );
};
