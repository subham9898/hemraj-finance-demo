import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  TextField,
  Chip,
  Skeleton,
  Alert,
  IconButton,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { Debtor, EmailTone } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { useFinance } from '../../context/FinanceContext';

interface AiEmailDialogProps {
  open: boolean;
  onClose: () => void;
  debtor: Debtor | null;
}

export const AiEmailDialog: React.FC<AiEmailDialogProps> = ({ open, onClose, debtor }) => {
  const { addActivityLog } = useFinance();
  const [tone, setTone] = useState<EmailTone>('Firm Follow-up');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [sentNotice, setSentNotice] = useState<boolean>(false);

  useEffect(() => {
    if (debtor) {
      if (debtor.riskLevel === 'Critical') {
        setTone('Legal Escalation Notice');
      } else if (debtor.riskLevel === 'High') {
        setTone('Firm Follow-up');
      } else {
        setTone('Friendly Reminder');
      }
      generateEmail(
        debtor,
        debtor.riskLevel === 'Critical'
          ? 'Legal Escalation Notice'
          : debtor.riskLevel === 'High'
          ? 'Firm Follow-up'
          : 'Friendly Reminder'
      );
    }
  }, [debtor]);

  const generateEmail = async (currentDebtor: Debtor, selectedTone: EmailTone) => {
    if (!currentDebtor) return;
    setLoading(true);
    setError(null);
    setSentNotice(false);

    const overdueInvoices = currentDebtor.invoices.filter((i) => i.status === 'Overdue');
    const maxDaysOverdue = Math.max(...overdueInvoices.map((i) => i.daysOverdue), 0);

    try {
      const response = await fetch('/api/ai/collection-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: currentDebtor.name,
          totalOutstanding: currentDebtor.totalOutstanding,
          overdueInvoices: overdueInvoices.map((i) => ({
            invoiceNumber: i.invoiceNumber,
            amount: i.amount,
            daysOverdue: i.daysOverdue,
          })),
          daysPastDue: maxDaysOverdue,
          riskLevel: currentDebtor.riskLevel,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setSubject(data.subject || '');
      setBody(data.body || '');
    } catch (err: any) {
      console.error('Error generating email:', err);
      setError('Failed to reach Gemini AI backend. Using standard fallback reminder format.');
      setSubject(`Overdue Payment Follow-up: ${currentDebtor.name} - HEMRAJ FINANCE`);
      setBody(
        `Dear ${currentDebtor.contactName},\n\nWe are following up on overdue invoices totaling ${formatCurrency(
          currentDebtor.totalOutstanding,
          'full'
        )} for ${currentDebtor.name}.\n\nPlease arrange for payment via RTGS/NEFT at your earliest convenience.\n\nRegards,\nHEMRAJ FINANCE Accounts Receivables`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToneChange = (newTone: EmailTone) => {
    setTone(newTone);
    if (debtor) {
      generateEmail(debtor, newTone);
    }
  };

  const handleCopy = () => {
    const textToCopy = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogAsSent = () => {
    if (!debtor) return;
    addActivityLog({
      debtorId: debtor.id,
      type: tone === 'Legal Escalation Notice' ? 'Legal Notice' : 'Email',
      summary: `Sent [${tone}] via AI Drafter regarding ${formatCurrency(debtor.totalOutstanding, 'full')} total overdue.`,
      author: 'Gemini AI Assistant',
    });
    setSentNotice(true);
  };

  if (!debtor) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle sx={{ m: 0, p: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              AI Collection Email Drafter
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generated via Gemini 3.6 Flash model for {debtor.name}
            </Typography>
          </Box>
        </Stack>

        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {/* Tone Selector Buttons */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Select Escalation Tone & Communication Style:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {(['Friendly Reminder', 'Firm Follow-up', 'Legal Escalation Notice'] as EmailTone[]).map((t) => {
                const isSelected = tone === t;
                return (
                  <Chip
                    key={t}
                    label={t}
                    onClick={() => handleToneChange(t)}
                    clickable
                    sx={{
                      fontWeight: 600,
                      px: 1,
                      backgroundColor: isSelected ? '#dc2626' : '#f3f4f6',
                      color: isSelected ? '#ffffff' : '#374151',
                      border: `1px solid ${isSelected ? '#b71c1c' : '#e5e7eb'}`,
                      '&:hover': {
                        backgroundColor: isSelected ? '#b71c1c' : '#e5e7eb',
                      },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>

          {/* Context summary bar */}
          <Box sx={{ p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1.5, border: '1px solid #e5e7eb' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2">
                <strong>Debtor:</strong> {debtor.name} ({debtor.contactName})
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                Total Overdue: {formatCurrency(debtor.totalOutstanding, 'full')}
              </Typography>
            </Stack>
          </Box>

          {error && <Alert severity="warning">{error}</Alert>}

          {sentNotice && (
            <Alert severity="success" icon={<CheckIcon />}>
              Email successfully logged to debtor activity timeline!
            </Alert>
          )}

          {/* Generated Email Form */}
          {loading ? (
            <Stack spacing={2}>
              <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 1 }} />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <TextField
                label="Email Subject Line"
                size="small"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                slotProps={{
                  input: { sx: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.875rem' } },
                }}
              />

              <TextField
                label="Email Body Content"
                multiline
                rows={9}
                fullWidth
                value={body}
                onChange={(e) => setBody(e.target.value)}
                slotProps={{
                  input: { sx: { fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', lineHeight: 1.6 } },
                }}
              />
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
          onClick={handleCopy}
          disabled={loading}
          sx={{ borderColor: '#e5e7eb' }}
        >
          {copied ? 'Copied to Clipboard!' : 'Copy Email'}
        </Button>

        <Stack direction="row" spacing={1.5}>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={handleLogAsSent}
            disabled={loading || sentNotice}
          >
            Log Activity & Send
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
