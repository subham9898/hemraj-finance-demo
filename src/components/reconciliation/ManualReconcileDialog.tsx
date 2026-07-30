import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { BankStatementLine } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { MonoText } from '../common/MonoText';
import { useFinance } from '../../context/FinanceContext';

interface ManualReconcileDialogProps {
  open: boolean;
  onClose: () => void;
  bankLine: BankStatementLine | null;
}

export const ManualReconcileDialog: React.FC<ManualReconcileDialogProps> = ({
  open,
  onClose,
  bankLine,
}) => {
  const { ledgerEntries, approveReconciliation } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLedgerId, setSelectedLedgerId] = useState<string | null>(null);

  if (!bankLine) return null;

  const unreconciledLedger = ledgerEntries.filter((e) => !e.reconciled);

  const filteredLedger = unreconciledLedger.filter(
    (e) =>
      e.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveManual = () => {
    if (!selectedLedgerId) return;
    approveReconciliation(bankLine.id, selectedLedgerId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Manual Bank Reconciliation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pair UTR: {bankLine.utrRef} with internal ledger entry
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Bank Line Summary */}
          <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderRadius: 1.5, border: '1px solid #fecaca' }}>
            <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
              Bank Statement Entry
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
              {bankLine.description}
            </Typography>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Date: {bankLine.date}
              </Typography>
              <MonoText variant="body2" sx={{ fontWeight: 700, color: '#dc2626' }}>
                {formatCurrency(bankLine.amount, 'full')}
              </MonoText>
            </Stack>
          </Box>

          {/* Search ledger */}
          <TextField
            placeholder="Search open invoices or customer name..."
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Unreconciled Ledger List */}
          <Box sx={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 1.5 }}>
            <List disablePadding>
              {filteredLedger.map((entry) => {
                const isSelected = selectedLedgerId === entry.id;
                return (
                  <ListItem key={entry.id} disablePadding sx={{ borderBottom: '1px solid #f3f4f6' }}>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => setSelectedLedgerId(entry.id)}
                      sx={{
                        py: 1.5,
                        '&.Mui-selected': {
                          backgroundColor: '#ecfdf5',
                          '&:hover': { backgroundColor: '#d1fae5' },
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {entry.customerName}
                            </Typography>
                            <MonoText variant="body2" sx={{ fontWeight: 700 }}>
                              {formatCurrency(entry.amount, 'full')}
                            </MonoText>
                          </Stack>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Inv #{entry.invoiceNumber} • Due: {entry.dueDate}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleApproveManual}
          variant="contained"
          color="primary"
          disabled={!selectedLedgerId}
        >
          Confirm Manual Match
        </Button>
      </DialogActions>
    </Dialog>
  );
};
