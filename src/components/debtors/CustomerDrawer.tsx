import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Stack,
  IconButton,
  Divider,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EmailIcon from '@mui/icons-material/Email';
import GavelIcon from '@mui/icons-material/Gavel';
import HandshakeIcon from '@mui/icons-material/Handshake';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Debtor, ActivityLog } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { RiskBadge } from '../common/RiskBadge';
import { MonoText } from '../common/MonoText';
import { useFinance } from '../../context/FinanceContext';

interface CustomerDrawerProps {
  open: boolean;
  onClose: () => void;
  debtor: Debtor | null;
  onOpenDraftEmail: (debtor: Debtor) => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  open,
  onClose,
  debtor,
  onOpenDraftEmail,
}) => {
  const { activityLogs, addActivityLog } = useFinance();
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [logType, setLogType] = useState<ActivityLog['type']>('Call');
  const [logSummary, setLogSummary] = useState('');

  if (!debtor) return null;

  const debtorLogs = activityLogs.filter((log) => log.debtorId === debtor.id);

  const handleAddLog = () => {
    if (!logSummary.trim()) return;
    addActivityLog({
      debtorId: debtor.id,
      type: logType,
      summary: logSummary,
      author: 'Finance Admin',
    });
    setLogSummary('');
    setLogDialogOpen(false);
  };

  const getLogIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'Call':
        return <PhoneInTalkIcon style={{ fontSize: 14 }} />;
      case 'Email':
        return <EmailIcon style={{ fontSize: 14 }} />;
      case 'Legal Notice':
        return <GavelIcon style={{ fontSize: 14 }} />;
      case 'Payment Promise':
        return <HandshakeIcon style={{ fontSize: 14 }} />;
      default:
        return <NoteAddIcon style={{ fontSize: 14 }} />;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: 540 }, p: 0, backgroundColor: '#ffffff' },
        },
      }}
    >
      {/* Drawer Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {debtor.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Code: {debtor.companyCode} | Region: {debtor.region}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ border: '1px solid #e5e7eb' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mt: 2 }}>
          <RiskBadge riskLevel={debtor.riskLevel} size="medium" />
          <Chip
            label={`Risk Score: ${debtor.riskScore}/100`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
        </Stack>
      </Box>

      {/* Drawer Body */}
      <Box sx={{ p: 3, overflowY: 'auto', flexGrow: 1 }}>
        <Stack spacing={3}>
          {/* Summary Financial Metric Box */}
          <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#fdfbfb', borderColor: '#f3f4f6' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Total Outstanding Balance
                </Typography>
                <MonoText variant="h5" sx={{ fontWeight: 700, color: '#dc2626' }}>
                  {formatCurrency(debtor.totalOutstanding, 'full')}
                </MonoText>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Credit Limit / Avg Delay
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(debtor.creditLimit, 'short')} / {debtor.avgPaymentDelayDays} days
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Quick Action Buttons */}
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<AutoAwesomeIcon />}
              onClick={() => onOpenDraftEmail(debtor)}
              sx={{ fontSize: '0.8rem', py: 1 }}
            >
              Draft AI Email
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              startIcon={<PhoneInTalkIcon />}
              onClick={() => setLogDialogOpen(true)}
              sx={{ fontSize: '0.8rem', py: 1, borderColor: '#e5e7eb' }}
            >
              Log Call / Note
            </Button>
          </Stack>

          <Divider />

          {/* Invoices Breakdown Table */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Active Invoice Breakdown ({debtor.invoices.length})
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {debtor.invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <MonoText variant="body2" sx={{ fontWeight: 600 }}>
                          {inv.invoiceNumber}
                        </MonoText>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {inv.dueDate} ({inv.daysOverdue > 0 ? `${inv.daysOverdue}d late` : 'Pending'})
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <MonoText variant="body2" sx={{ fontWeight: 700 }}>
                          {formatCurrency(inv.amount, 'full')}
                        </MonoText>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={inv.status}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            backgroundColor: inv.status === 'Paid' ? '#ecfdf5' : '#fef2f2',
                            color: inv.status === 'Paid' ? '#16a34a' : '#dc2626',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider />

          {/* Activity Timeline */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Communication & Recovery Timeline
            </Typography>

            {debtorLogs.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No recorded logs yet for this account.
              </Typography>
            ) : (
              <Timeline sx={{ p: 0, m: 0 }}>
                {debtorLogs.map((log) => (
                  <TimelineItem key={log.id} sx={{ '&:before': { display: 'none' } }}>
                    <TimelineOppositeContent sx={{ display: 'none' }} />
                    <TimelineSeparator>
                      <TimelineDot color={log.type === 'Legal Notice' ? 'error' : 'primary'} sx={{ p: 0.8 }}>
                        {getLogIcon(log.type)}
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '6px', px: 2 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.primary" sx={{ fontWeight: 700 }}>
                          {log.type} — {log.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {log.date}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                        {log.summary}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            )}
          </Box>
        </Stack>
      </Box>

      {/* Log Activity Dialog */}
      <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Log Communication / Action</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              select
              label="Interaction Type"
              size="small"
              fullWidth
              value={logType}
              onChange={(e) => setLogType(e.target.value as ActivityLog['type'])}
            >
              <MenuItem value="Call">Phone Call</MenuItem>
              <MenuItem value="Email">Email Communication</MenuItem>
              <MenuItem value="Payment Promise">Payment Promise</MenuItem>
              <MenuItem value="Note">Internal Note</MenuItem>
              <MenuItem value="Legal Notice">Legal Notice</MenuItem>
            </TextField>

            <TextField
              label="Summary / Notes"
              multiline
              rows={3}
              fullWidth
              value={logSummary}
              onChange={(e) => setLogSummary(e.target.value)}
              placeholder="e.g. Spoke with CFO. Agreed to pay ₹5L by next Monday."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setLogDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAddLog} variant="contained" color="primary">
            Save Log Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};
