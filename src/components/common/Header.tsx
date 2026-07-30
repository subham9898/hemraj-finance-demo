import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Popover,
  Badge,
  Stack,
  TextField,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useFinance } from '../../context/FinanceContext';

export const Header: React.FC = () => {
  const { dateRange, setDateRange, resetToDemoData } = useFinance();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [datePopoverAnchor, setDatePopoverAnchor] = useState<HTMLButtonElement | null>(null);
  const [notifAnchor, setNotifAnchor] = useState<HTMLButtonElement | null>(null);

  const handleDateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDatePopoverAnchor(event.currentTarget);
  };

  const handleDateClose = () => {
    setDatePopoverAnchor(null);
  };

  const handleNotifClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchor(null);
  };

  const confirmReset = () => {
    resetToDemoData();
    setResetDialogOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 }, minHeight: '64px' }}>
        {/* Brand & Identity */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 1.5,
              backgroundColor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <AccountBalanceIcon fontSize="small" />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: '#111827' }}>
                HEMRAJ FINANCE
              </Typography>
              <Chip
                label="₹ INR"
                size="small"
                icon={<CurrencyRupeeIcon style={{ fontSize: 13, color: '#dc2626' }} />}
                sx={{
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 20,
                  border: '1px solid #fecaca',
                }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Enterprise Cash Flow & Receivables Automation Platform
            </Typography>
          </Box>
        </Stack>

        {/* Live Status & Quick Actions */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          {/* Status Indicator */}
          <Chip
            icon={<CheckCircleIcon style={{ fontSize: 14, color: '#16a34a' }} />}
            label="Live Sync"
            size="small"
            sx={{
              backgroundColor: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              fontWeight: 600,
              fontSize: '0.75rem',
              display: { xs: 'none', md: 'inline-flex' },
            }}
          />

          {/* Date Filter Button */}
          <Button
            size="small"
            variant="outlined"
            startIcon={<DateRangeIcon fontSize="small" />}
            onClick={handleDateClick}
            sx={{
              borderColor: '#e5e7eb',
              color: '#374151',
              fontSize: '0.8rem',
              px: 1.5,
              py: 0.5,
            }}
          >
            {dateRange.startDate} - {dateRange.endDate}
          </Button>

          {/* Date Filter Popover */}
          <Popover
            open={Boolean(datePopoverAnchor)}
            anchorEl={datePopoverAnchor}
            onClose={handleDateClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { p: 2.5, width: 320 } } }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Filter Date Range
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                fullWidth
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="End Date"
                type="date"
                size="small"
                fullWidth
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Button variant="contained" color="primary" size="small" onClick={handleDateClose}>
                Apply Range
              </Button>
            </Stack>
          </Popover>

          {/* Notifications Button */}
          <Tooltip title="System Notifications">
            <IconButton onClick={handleNotifClick} size="small" sx={{ border: '1px solid #e5e7eb', p: 0.8 }}>
              <Badge badgeContent={3} color="error" variant="dot">
                <NotificationsNoneIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Popover */}
          <Popover
            open={Boolean(notifAnchor)}
            anchorEl={notifAnchor}
            onClose={handleNotifClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { p: 2, width: 320 } } }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Recent Alerts
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ p: 1, backgroundColor: '#fef2f2', borderRadius: 1, border: '1px solid #fecaca' }}>
                <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                  High Overdue Notice
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Reliance Logistics overdue by 49 days (₹8,50,000). Action required.
                </Typography>
              </Box>
              <Box sx={{ p: 1, backgroundColor: '#f0fdf4', borderRadius: 1, border: '1px solid #bbf7d0' }}>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  Reconciliation Match
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  NEFT transaction HDFCR520 matched 98% with INV HF-2026-1042.
                </Typography>
              </Box>
            </Stack>
          </Popover>

          {/* Reset Demo Data Button */}
          <Tooltip title="Reset application to initial demo dataset">
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<RestartAltIcon fontSize="small" />}
              onClick={() => setResetDialogOpen(true)}
              sx={{
                borderColor: '#e5e7eb',
                color: '#6b7280',
                fontSize: '0.75rem',
                textTransform: 'none',
              }}
            >
              Reset Demo Data
            </Button>
          </Tooltip>
        </Stack>

        {/* Reset Confirmation Dialog */}
        <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
          <DialogTitle sx={{ fontWeight: 600 }}>Reset Demo Financial Data?</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: '0.875rem' }}>
              This will restore all debtors, open invoices, activity logs, and bank statement reconciliations to the initial HEMRAJ FINANCE demo dataset.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setResetDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={confirmReset} color="primary" variant="contained">
              Confirm Reset
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};
