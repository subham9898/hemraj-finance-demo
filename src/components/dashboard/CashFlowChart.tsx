import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';

export const CashFlowChart: React.FC = () => {
  const { cashFlowTrajectory } = useFinance();
  const [range, setRange] = useState<'6m' | '12m'>('12m');

  const filteredData = range === '6m' ? cashFlowTrajectory.slice(3, 9) : cashFlowTrajectory;

  const monthLabels = filteredData.map((d) => d.month);
  const inflowSeries = filteredData.map((d) => (d.actualInflow > 0 ? d.actualInflow / 100000 : d.projectedInflow / 100000));
  const outflowSeries = filteredData.map((d) => (d.actualOutflow > 0 ? d.actualOutflow / 100000 : d.projectedOutflow / 100000));

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Cash Flow Trajectory (Actual vs AI Projected)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monthly cash inflows, outflows, and net liquidity reserves (Values in ₹ Lakhs)
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#16a34a' }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Inflow (₹ Lakhs)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#dc2626' }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Outflow (₹ Lakhs)
                </Typography>
              </Box>
            </Stack>

            <ToggleButtonGroup
              value={range}
              exclusive
              onChange={(_, val) => val && setRange(val)}
              size="small"
              sx={{ height: 32 }}
            >
              <ToggleButton value="6m" sx={{ px: 1.5, fontSize: '0.75rem', fontWeight: 600 }}>
                6 Months
              </ToggleButton>
              <ToggleButton value="12m" sx={{ px: 1.5, fontSize: '0.75rem', fontWeight: 600 }}>
                1 Year
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        <Box sx={{ width: '100%', height: 320, pt: 1 }}>
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
                data: inflowSeries,
                label: 'Cash Inflows',
                color: '#16a34a',
                valueFormatter: (val) => (val ? formatCurrency(val * 100000, 'short') : '₹0'),
              },
              {
                data: outflowSeries,
                label: 'Cash Outflows',
                color: '#dc2626',
                valueFormatter: (val) => (val ? formatCurrency(val * 100000, 'short') : '₹0'),
              },
            ]}
            margin={{ top: 20, bottom: 30, left: 60, right: 20 }}
            borderRadius={4}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
