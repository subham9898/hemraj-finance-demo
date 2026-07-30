import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  LinearProgress,
  Skeleton,
  Alert,
  Divider,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RefreshIcon from '@mui/icons-material/Refresh';
import PrintIcon from '@mui/icons-material/Print';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { MonoText } from '../common/MonoText';
import { RiskBadge } from '../common/RiskBadge';

export const ExecutiveBriefingView: React.FC = () => {
  const { debtors, cfoKPIs } = useFinance();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headline, setHeadline] = useState('Liquidity Reserves Sound with Concentrated Recovery Focus');
  const [briefPoints, setBriefPoints] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const totalReceivables = debtors.reduce((acc, d) => acc + d.totalOutstanding, 0);
  const topDebtors = [...debtors]
    .sort((a, b) => b.totalOutstanding - a.totalOutstanding)
    .slice(0, 4);

  const fetchBrief = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/executive-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalRevenue: cfoKPIs.totalRevenue,
          netCashFlow: cfoKPIs.netCashFlow,
          overdueBalances: totalReceivables,
          riskIndex: cfoKPIs.riskIndex,
          topDebtors: topDebtors.map((d) => ({
            name: d.name,
            amount: d.totalOutstanding,
            riskLevel: d.riskLevel,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setHeadline(data.summaryHeadline || 'Executive Financial Position Briefing');
      setBriefPoints(data.briefPoints || []);
      setRecommendations(data.strategicRecommendations || []);
    } catch (err: any) {
      console.error('Error fetching executive brief:', err);
      setError('Unable to reach Gemini AI server. Displaying cached CFO baseline brief.');
      setBriefPoints([
        `Net cash reserves stand at ${formatCurrency(cfoKPIs.netCashFlow, 'short')} with Q3 operational inflows remaining strong.`,
        `Top 3 concentrated accounts represent ${Math.round(
          ((topDebtors[0]?.totalOutstanding + topDebtors[1]?.totalOutstanding) / totalReceivables) * 100
        )}% of all receivables.`,
        `Overall credit risk index is benchmarked at ${cfoKPIs.riskIndex}/100.`,
      ]);
      setRecommendations([
        'Enforce strict 30-day payment caps for accounts exceeding ₹10 Lakhs total exposure.',
        'Implement 1.5% prompt payment discount for RTGS settlements processed within 7 business days.',
        'Issue formal legal escalation notices for accounts past 60 days delinquent.',
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, []);

  return (
    <Stack spacing={3}>
      {/* Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Executive CFO Briefing & Strategic AI Intelligence
          </Typography>
          <Typography variant="body2" color="text.secondary">
            C-Suite liquidity position, credit risk exposure ranking, and Gemini AI working capital advice
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            sx={{ borderColor: '#e5e7eb' }}
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchBrief}
            disabled={loading}
          >
            Refresh AI Briefing
          </Button>
        </Stack>
      </Box>

      {/* C-Suite KPI Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2.5,
        }}
      >
        <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: '#ffffff' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Total YTD Revenue
          </Typography>
          <MonoText variant="h4" sx={{ fontWeight: 700, color: '#111827', mt: 0.5 }}>
            {formatCurrency(cfoKPIs.totalRevenue, 'short')}
          </MonoText>
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
            +14.2% YoY Growth
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: '#ffffff' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Net Cleared Cash Reserves
          </Typography>
          <MonoText variant="h4" sx={{ fontWeight: 700, color: '#d32f2f', mt: 0.5 }}>
            {formatCurrency(cfoKPIs.netCashFlow, 'short')}
          </MonoText>
          <Typography variant="caption" color="text.secondary">
            Healthy 4.2x Working Capital Buffer
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: '#ffffff' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Total Overdue Receivables
          </Typography>
          <MonoText variant="h4" sx={{ fontWeight: 700, color: '#dc2626', mt: 0.5 }}>
            {formatCurrency(totalReceivables, 'short')}
          </MonoText>
          <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
            7 Accounts Past 30 Days
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: '#ffffff' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Receivables Risk Index
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'baseline', mt: 0.5, mb: 1 }}>
            <MonoText variant="h4" sx={{ fontWeight: 700, color: '#d97706' }}>
              {cfoKPIs.riskIndex}
            </MonoText>
            <Typography variant="caption" color="text.secondary">
              / 100
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={cfoKPIs.riskIndex}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#fef3c7',
              '& .MuiLinearProgress-bar': { backgroundColor: '#d97706' },
            }}
          />
        </Paper>
      </Box>

      {/* Main Content: Gemini AI CFO Brief + Concentrated Risk */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: 2.5,
        }}
      >
        {/* Gemini AI CFO Assistant Panel */}
        <Card variant="outlined" sx={{ border: '1px solid #fecaca', backgroundColor: '#fffdfd' }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AutoAwesomeIcon />
              </Box>
              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Gemini AI CFO Assistant Brief
                  </Typography>
                  <Chip label="Automated" size="small" color="error" sx={{ height: 20, fontSize: '0.68rem' }} />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Real-time synthesis powered by Gemini 3.6 Flash
                </Typography>
              </Box>
            </Stack>

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            {loading ? (
              <Stack spacing={2} sx={{ py: 2 }}>
                <Skeleton variant="text" width="80%" height={32} />
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
              </Stack>
            ) : (
              <Stack spacing={2.5}>
                <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderRadius: 1.5, border: '1px solid #fee2e2' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#b71c1c' }}>
                    {headline}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 1 }}>
                    Core Liquidity & Risk Synthesis (3-Point Summary):
                  </Typography>
                  <Stack spacing={1}>
                    {briefPoints.map((pt, idx) => (
                      <Paper key={idx} variant="outlined" sx={{ p: 1.5, backgroundColor: '#ffffff' }}>
                        <Typography variant="body2" color="text.primary">
                          • {pt}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 1 }}>
                    Strategic Working Capital Recommendations:
                  </Typography>
                  <Stack spacing={1}>
                    {recommendations.map((rec, idx) => (
                      <Paper key={idx} variant="outlined" sx={{ p: 1.5, backgroundColor: '#ffffff', borderLeft: '3px solid #dc2626' }}>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                          {idx + 1}. {rec}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Concentrated Account Risk Ranking */}
        <Card variant="outlined">
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
              <WarningAmberIcon color="error" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Concentrated Account Exposure
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Top accounts representing highest single-debtor concentration risk
            </Typography>

            <Stack spacing={2}>
              {topDebtors.map((debtor, idx) => {
                const exposurePercent = Math.round((debtor.totalOutstanding / totalReceivables) * 100);

                return (
                  <Paper key={debtor.id} variant="outlined" sx={{ p: 2, backgroundColor: '#ffffff' }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          #{idx + 1} {debtor.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {debtor.region}
                        </Typography>
                      </Box>
                      <RiskBadge riskLevel={debtor.riskLevel} />
                    </Stack>

                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Outstanding:
                      </Typography>
                      <MonoText variant="body2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                        {formatCurrency(debtor.totalOutstanding, 'full')}
                      </MonoText>
                    </Stack>

                    <Box>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Exposure of Total Receivables:
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {exposurePercent}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={exposurePercent * 2}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#fee2e2',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#dc2626' },
                        }}
                      />
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
};
