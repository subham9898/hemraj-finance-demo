import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Stack, ToggleButton, ToggleButtonGroup, Chip, Tooltip } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';

export const CashFlowChart: React.FC = () => {
  const { cashFlowTrajectory } = useFinance();
  const [range, setRange] = useState<'3m' | '6m' | '12m'>('12m');
  const [chartType, setChartType] = useState<'bar' | 'trend'>('bar');

  const sliceIndex = range === '3m' ? 6 : range === '6m' ? 3 : 0;
  const filteredData = cashFlowTrajectory.slice(sliceIndex);

  const monthLabels = filteredData.map((d) => d.month);
  
  // Convert to Lakhs for clean chart scaling
  const actualInflowSeries = filteredData.map((d) => (d.actualInflow > 0 ? d.actualInflow / 100000 : null));
  const projectedInflowSeries = filteredData.map((d) => (d.actualInflow === 0 ? d.projectedInflow / 100000 : null));
  
  const actualOutflowSeries = filteredData.map((d) => (d.actualOutflow > 0 ? d.actualOutflow / 100000 : null));
  const projectedOutflowSeries = filteredData.map((d) => (d.actualOutflow === 0 ? d.projectedOutflow / 100000 : null));

  const netCashSeries = filteredData.map((d) => d.netCash / 100000);
  
  // Benchmark Working Capital Line (₹120 Lakhs)
  const targetSeries = filteredData.map(() => 120);

  return (
    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '10px' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.25 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                Cash Flow Trajectory & AI Liquidity Forecast
              </Typography>
              <Chip
                label="Target: ₹120L Working Capital"
                size="small"
                sx={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.675rem',
                  height: 20,
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              Historical performance vs 94% confidence AI projection (Values in ₹ Lakhs)
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {/* Legend Indicators */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#059669' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.725rem', color: '#334155' }}>
                  Actual Inflow
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#10b981', opacity: 0.5 }} />
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.725rem', color: '#334155' }}>
                  AI Forecast
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#dc2626' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.725rem', color: '#334155' }}>
                  Outflow
                </Typography>
              </Box>
            </Stack>

            {/* View Mode Toggle */}
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(_, val) => val && setChartType(val)}
              size="small"
              sx={{ height: 28 }}
            >
              <ToggleButton value="bar" sx={{ px: 1, py: 0.2 }}>
                <Tooltip title="Bar Trajectory">
                  <BarChartIcon sx={{ fontSize: 16 }} />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="trend" sx={{ px: 1, py: 0.2 }}>
                <Tooltip title="Net Liquidity Reserve Trend">
                  <ShowChartIcon sx={{ fontSize: 16 }} />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Timeframe Toggle */}
            <ToggleButtonGroup
              value={range}
              exclusive
              onChange={(_, val) => val && setRange(val)}
              size="small"
              sx={{ height: 28 }}
            >
              <ToggleButton value="3m" sx={{ px: 1.2, fontSize: '0.725rem', fontWeight: 600 }}>
                3M
              </ToggleButton>
              <ToggleButton value="6m" sx={{ px: 1.2, fontSize: '0.725rem', fontWeight: 600 }}>
                6M
              </ToggleButton>
              <ToggleButton value="12m" sx={{ px: 1.2, fontSize: '0.725rem', fontWeight: 600 }}>
                12M
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        <Box sx={{ width: '100%', height: 320, pt: 1 }}>
          {chartType === 'bar' ? (
            <BarChart
              height={310}
              xAxis={[
                {
                  scaleType: 'band',
                  data: monthLabels,
                  tickLabelStyle: { fontSize: 11, fontFamily: "'Inter', sans-serif" },
                },
              ]}
              yAxis={[
                {
                  valueFormatter: (value: number | null) => (value ? `₹${value}L` : '₹0'),
                  tickLabelStyle: { fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" },
                },
              ]}
              series={[
                {
                  data: actualInflowSeries.map((v, i) => v || projectedInflowSeries[i] || 0),
                  label: 'Inflows (₹ Lakhs)',
                  color: '#059669',
                  valueFormatter: (val) => (val ? formatCurrency(val * 100000, 'short') : '₹0'),
                },
                {
                  data: actualOutflowSeries.map((v, i) => v || projectedOutflowSeries[i] || 0),
                  label: 'Outflows (₹ Lakhs)',
                  color: '#dc2626',
                  valueFormatter: (val) => (val ? formatCurrency(val * 100000, 'short') : '₹0'),
                },
              ]}
              margin={{ top: 20, bottom: 30, left: 60, right: 20 }}
              borderRadius={4}
            />
          ) : (
            <LineChart
              height={310}
              xAxis={[
                {
                  scaleType: 'point',
                  data: monthLabels,
                  tickLabelStyle: { fontSize: 11, fontFamily: "'Inter', sans-serif" },
                },
              ]}
              yAxis={[
                {
                  valueFormatter: (value: number | null) => (value ? `₹${value}L` : '₹0'),
                  tickLabelStyle: { fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" },
                },
              ]}
              series={[
                {
                  data: netCashSeries,
                  label: 'Net Cash Reserve (₹ Lakhs)',
                  color: '#0284c7',
                  showMark: true,
                  valueFormatter: (val) => (val ? formatCurrency(val * 100000, 'short') : '₹0'),
                },
                {
                  data: targetSeries,
                  label: 'Working Capital Threshold (₹120L)',
                  color: '#f59e0b',
                  showMark: false,
                },
              ]}
              margin={{ top: 20, bottom: 30, left: 60, right: 20 }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
