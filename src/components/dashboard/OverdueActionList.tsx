import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { RiskBadge } from '../common/RiskBadge';
import { MonoText } from '../common/MonoText';
import { Debtor } from '../../types';

interface OverdueActionListProps {
  onDraftEmail: (debtor: Debtor) => void;
  onViewDebtor: (debtorId: string) => void;
}

export const OverdueActionList: React.FC<OverdueActionListProps> = ({
  onDraftEmail,
  onViewDebtor,
}) => {
  const { debtors } = useFinance();

  const highPriorityDebtors = debtors
    .filter((d) => d.invoices.some((inv) => inv.status === 'Overdue'))
    .sort((a, b) => b.totalOutstanding - a.totalOutstanding);

  return (
    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '10px' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #f1f5f9',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PriorityHighIcon style={{ fontSize: 16 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
              High-Priority Receivables & Overdue Action Queue
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
            {highPriorityDebtors.length} accounts require action
          </Typography>
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, py: 1.25, fontSize: '0.775rem', color: '#475569' }}>Debtor / Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.25, fontSize: '0.775rem', color: '#475569' }}>Region</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.25, fontSize: '0.775rem', color: '#475569' }}>Total Overdue</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.25, fontSize: '0.775rem', color: '#475569' }}>Max Overdue</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.25, fontSize: '0.775rem', color: '#475569' }}>Risk Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 1.25, fontSize: '0.775rem', color: '#475569' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {highPriorityDebtors.map((debtor) => {
                const maxDaysOverdue = Math.max(
                  ...debtor.invoices.filter((i) => i.status === 'Overdue').map((i) => i.daysOverdue),
                  0
                );

                return (
                  <TableRow key={debtor.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {debtor.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem' }}>
                        {debtor.contactName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.825rem' }}>
                        {debtor.region}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <MonoText variant="body2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                        {formatCurrency(debtor.totalOutstanding, 'full')}
                      </MonoText>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${maxDaysOverdue}d late`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          backgroundColor: maxDaysOverdue > 40 ? '#fef2f2' : '#f8fafc',
                          color: maxDaysOverdue > 40 ? '#b91c1c' : '#475569',
                          border: `1px solid ${maxDaysOverdue > 40 ? '#fee2e2' : '#e2e8f0'}`,
                          borderRadius: '4px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <RiskBadge riskLevel={debtor.riskLevel} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AutoAwesomeIcon style={{ fontSize: 13, color: '#0f172a' }} />}
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

                        <Tooltip title="View Account Ledger">
                          <IconButton
                            size="small"
                            onClick={() => onViewDebtor(debtor.id)}
                            sx={{ border: '1px solid #e2e8f0' }}
                          >
                            <VisibilityIcon style={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
