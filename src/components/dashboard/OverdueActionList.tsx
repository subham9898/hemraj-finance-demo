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
    <Card variant="outlined">
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PriorityHighIcon style={{ fontSize: 18 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              High-Priority Receivables & Overdue Action Queue
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {highPriorityDebtors.length} accounts require action
          </Typography>
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Debtor / Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Region</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Total Overdue</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Max Overdue</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Risk Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 1.5 }}>
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
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                        {debtor.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {debtor.contactName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
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
                        label={`${maxDaysOverdue} days late`}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          backgroundColor: maxDaysOverdue > 40 ? '#fef2f2' : '#fff7ed',
                          color: maxDaysOverdue > 40 ? '#dc2626' : '#ea580c',
                          border: `1px solid ${maxDaysOverdue > 40 ? '#fecaca' : '#ffedd5'}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <RiskBadge riskLevel={debtor.riskLevel} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<AutoAwesomeIcon style={{ fontSize: 14 }} />}
                          onClick={() => onDraftEmail(debtor)}
                          sx={{ fontSize: '0.75rem', py: 0.5, px: 1.2 }}
                        >
                          Draft AI Email
                        </Button>

                        <Tooltip title="View Account Ledger">
                          <IconButton
                            size="small"
                            onClick={() => onViewDebtor(debtor.id)}
                            sx={{ border: '1px solid #e5e7eb' }}
                          >
                            <VisibilityIcon fontSize="small" />
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
