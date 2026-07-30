import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { MonoText } from '../common/MonoText';

export const AnalyticsView: React.FC = () => {
  const { debtors, regionalStats } = useFinance();

  const totalCurrent = debtors.reduce((acc, d) => acc + d.current, 0);
  const total30 = debtors.reduce((acc, d) => acc + d.d30, 0);
  const total60 = debtors.reduce((acc, d) => acc + d.d60, 0);
  const total90 = debtors.reduce((acc, d) => acc + d.d90Plus, 0);

  const dsoMonths = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const dsoValues = [34, 31, 29, 28, 25, 22];

  const pieData = [
    { id: 0, value: totalCurrent / 100000, label: 'Current (0-30d)', color: '#16a34a' },
    { id: 1, value: total30 / 100000, label: '30-60 Days Overdue', color: '#d97706' },
    { id: 2, value: total60 / 100000, label: '61-90 Days Overdue', color: '#ea580c' },
    { id: 3, value: total90 / 100000, label: '90+ Days Overdue', color: '#dc2626' },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Financial Analytics & Collection Trends
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Receivables ageing distribution, collection velocity metrics, and regional risk breakdown
        </Typography>
      </Box>

      {/* Charts Box Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2.5,
        }}
      >
        {/* Collection Velocity (DSO) */}
        <Card variant="outlined">
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Days Sales Outstanding (DSO) Velocity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Average days to convert receivables into cleared cash (Lower is better)
            </Typography>

            <Box sx={{ height: 260, width: '100%' }}>
              <LineChart
                height={250}
                xAxis={[
                  {
                    scaleType: 'point',
                    data: dsoMonths,
                    tickLabelStyle: { fontSize: 11 },
                  },
                ]}
                yAxis={[
                  {
                    valueFormatter: (val: number | null) => (val ? `${val} Days` : '0d'),
                    tickLabelStyle: { fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" },
                  },
                ]}
                series={[
                  {
                    data: dsoValues,
                    label: 'Avg Collection Period (Days)',
                    color: '#d32f2f',
                    showMark: true,
                  },
                ]}
                margin={{ top: 20, bottom: 30, left: 60, right: 20 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Ageing Distribution */}
        <Card variant="outlined">
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Receivables Ageing Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Total outstanding volume categorized by overdue time brackets (₹ Lakhs)
            </Typography>

            <Box sx={{ height: 260, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <PieChart
                height={250}
                series={[
                  {
                    data: pieData,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    valueFormatter: (item) => formatCurrency(item.value * 100000, 'short'),
                  },
                ]}
                margin={{ top: 20, bottom: 20, left: 20, right: 120 }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Regional Performance Table */}
      <Card variant="outlined">
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Regional Collection Performance Matrix
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Granular breakdown of collection speed, on-time payment %, and risk distribution across Indian territories
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Territory / Region</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Total Receivables</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Avg Collection Period</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 1.5 }}>On-Time Payment %</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Low/Medium vs High/Critical Risk</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {regionalStats.map((reg) => (
                  <TableRow key={reg.region} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {reg.region}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <MonoText variant="body2" sx={{ fontWeight: 700 }}>
                        {formatCurrency(reg.totalReceivables, 'full')}
                      </MonoText>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {reg.avgCollectionDays} days
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 140 }}>
                        <LinearProgress
                          variant="determinate"
                          value={reg.onTimePercent}
                          sx={{
                            flexGrow: 1,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#fee2e2',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: reg.onTimePercent > 80 ? '#16a34a' : '#d97706',
                            },
                          }}
                        />
                        <MonoText variant="caption" sx={{ fontWeight: 700 }}>
                          {reg.onTimePercent}%
                        </MonoText>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        Low: {reg.riskDistribution.low}% | Med: {reg.riskDistribution.medium}% | Critical:{' '}
                        {reg.riskDistribution.critical}%
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
};
