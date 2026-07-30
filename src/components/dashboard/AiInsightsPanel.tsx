import React from 'react';
import { Box, Paper, Stack, Typography, Button, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface AiInsightsPanelProps {
  onOpenCfoBrief: () => void;
}

export const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({ onOpenCfoBrief }) => {
  const topRisks = [
    {
      id: 'risk-1',
      title: 'Reliance Logistics Concentration',
      detail: '₹8.5L overdue (49d late). Concentration risk exceeds 18% of total outstanding receivables.',
      severity: 'High',
      impact: '₹8,50,000',
    },
    {
      id: 'risk-2',
      title: 'Upcoming Tax & Vendor Outflows',
      detail: '₹42.5L statutory GST & vendor payments due on Aug 15. Requires early invoice clearance.',
      severity: 'Medium',
      impact: '₹42,50,000',
    },
    {
      id: 'risk-3',
      title: 'Delayed Collections in North Region',
      detail: 'DSO in North Delhi NCR expanded from 24 to 38 days over the last 60-day cycle.',
      severity: 'Medium',
      impact: '38 Days DSO',
    },
  ];

  const recommendations = [
    'Trigger automated Escalation Notice to Reliance Logistics finance head.',
    'Fast-track NEFT reconciliation for 3 pending bank credits worth ₹14.2L.',
    'Offer 1.5% early payment discount to Sun Pharma (East Region) to unlock ₹9.8L ahead of tax deadline.',
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', mb: 2 }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: '#faf5ff',
              border: '1px solid #f3e8ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.975rem', color: '#0f172a' }}>
                AI Liquidity & Risk Intelligence
              </Typography>
              <Chip
                label="94.2% Confidence Score"
                size="small"
                sx={{
                  backgroundColor: '#f3e8ff',
                  color: '#7e22ce',
                  fontWeight: 700,
                  fontSize: '0.675rem',
                  height: 20,
                  borderRadius: '4px',
                  border: '1px solid #e9d5ff',
                }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem' }}>
              Real-time automated scanning across 247 ledger entries, bank statement feeds, and customer payment histories
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          size="small"
          onClick={onOpenCfoBrief}
          startIcon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
          endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
          sx={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.775rem',
            textTransform: 'none',
            px: 2,
            py: 0.6,
            borderRadius: '6px',
            boxShadow: 'none',
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: '#1e293b',
              boxShadow: 'none',
            },
          }}
        >
          View Full CFO Briefing
        </Button>
      </Stack>

      <GridContainer>
        {/* Top Financial Risks Column */}
        <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: 320 } }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
            <ReportProblemIcon sx={{ fontSize: 16, color: '#dc2626' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.825rem' }}>
              Top Financial Risks Detected
            </Typography>
          </Stack>

          <Stack spacing={1}>
            {topRisks.map((risk) => (
              <Box
                key={risk.id}
                sx={{
                  p: 1.25,
                  borderRadius: '6px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#e2e8f0',
                    backgroundColor: '#ffffff',
                  },
                }}
              >
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.825rem', color: '#0f172a' }}>
                    {risk.title}
                  </Typography>
                  <Chip
                    label={risk.impact}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: risk.severity === 'High' ? '#fef2f2' : '#fffbeb',
                      color: risk.severity === 'High' ? '#991b1b' : '#b45309',
                      border: `1px solid ${risk.severity === 'High' ? '#fecaca' : '#fef3c7'}`,
                    }}
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem', display: 'block' }}>
                  {risk.detail}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Recommended Actions Column */}
        <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: 320 } }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: '#059669' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.825rem' }}>
              Recommended Strategic Interventions
            </Typography>
          </Stack>

          <Stack spacing={1}>
            {recommendations.map((rec, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 1.25,
                  borderRadius: '6px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #d1fae5',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    minWidth: 20,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    mt: 0.1,
                  }}
                >
                  {idx + 1}
                </Box>
                <Typography variant="caption" sx={{ color: '#064e3b', fontWeight: 600, fontSize: '0.775rem', lineHeight: 1.4 }}>
                  {rec}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </GridContainer>
    </Paper>
  );
};

const GridContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
      gap: 2,
    }}
  >
    {children}
  </Box>
);
