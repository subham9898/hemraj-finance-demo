import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Popover,
  Badge,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Avatar,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SearchIcon from '@mui/icons-material/Search';
import { useFinance } from '../../context/FinanceContext';

export const Header: React.FC = () => {
  const { dateRange, setDateRange, resetToDemoData, debtors } = useFinance();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [datePopoverAnchor, setDatePopoverAnchor] = useState<HTMLButtonElement | null>(null);
  const [notifAnchor, setNotifAnchor] = useState<HTMLButtonElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAnchor, setSearchAnchor] = useState<HTMLElement | null>(null);

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

  const filteredSearchResults = searchQuery.trim()
    ? debtors.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.companyCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.25,
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      {/* Left: Global Workspace Search */}
      <Box sx={{ width: { xs: 200, sm: 300, md: 360 } }}>
        <TextField
          size="small"
          placeholder="Global Search (Debtor, Invoice, UTR Ref...)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchAnchor(e.currentTarget);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#64748b' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#f8fafc',
              fontSize: '0.8rem',
              borderRadius: '6px',
              '& fieldset': {
                borderColor: '#e2e8f0',
              },
              '&:hover fieldset': {
                borderColor: '#cbd5e1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0f172a',
              },
            },
          }}
        />

        {/* Global Search Results Popover */}
        <Popover
          open={Boolean(searchQuery.trim() && filteredSearchResults.length > 0)}
          anchorEl={searchAnchor}
          onClose={() => setSearchQuery('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{ paper: { sx: { p: 1.5, width: 360, maxHeight: 300 } } }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 1, display: 'block' }}>
            Matching Accounts ({filteredSearchResults.length})
          </Typography>
          <Stack spacing={1}>
            {filteredSearchResults.map((debtor) => (
              <Box
                key={debtor.id}
                sx={{
                  p: 1,
                  borderRadius: '4px',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f1f5f9' },
                }}
                onClick={() => setSearchQuery('')}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.825rem' }}>
                  {debtor.name} ({debtor.companyCode})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Outstanding: ₹{(debtor.totalOutstanding / 100000).toFixed(2)}L • {debtor.region}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Popover>
      </Box>

      {/* Right: Live Status, Date Filter, Notifications, Reset, User Avatar */}
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
        {/* Status Indicator */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.75,
            px: 1.2,
            py: 0.4,
            borderRadius: '9999px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #d1fae5',
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} />
          <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700, fontSize: '0.725rem' }}>
            Live Sync Active
          </Typography>
        </Box>

        {/* Date Filter Button */}
        <Button
          size="small"
          variant="outlined"
          startIcon={<DateRangeIcon fontSize="small" sx={{ color: '#475569' }} />}
          onClick={handleDateClick}
          sx={{
            borderColor: '#e2e8f0',
            backgroundColor: '#ffffff',
            color: '#334155',
            fontSize: '0.775rem',
            fontWeight: 600,
            px: 1.5,
            py: 0.5,
            textTransform: 'none',
            '&:hover': {
              borderColor: '#cbd5e1',
              backgroundColor: '#f8fafc',
            },
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
          <IconButton
            onClick={handleNotifClick}
            size="small"
            sx={{
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              p: 0.8,
              '&:hover': { backgroundColor: '#f8fafc' },
            }}
          >
            <Badge badgeContent={3} color="error" variant="dot">
              <NotificationsNoneIcon fontSize="small" sx={{ color: '#475569' }} />
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
          <IconButton
            size="small"
            onClick={() => setResetDialogOpen(true)}
            sx={{
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#64748b',
              p: 0.8,
              '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
            }}
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* User Profile Avatar */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', pl: 1, borderLeft: '1px solid #f1f5f9' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#0f172a', fontSize: '0.8rem', fontWeight: 700 }}>RH</Avatar>
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem', lineHeight: 1.1, color: '#0f172a' }}>
              Rajesh Hemraj
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem' }}>
              Chief Financial Officer
            </Typography>
          </Box>
        </Stack>
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
    </Box>
  );
};
