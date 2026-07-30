import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { RiskBadge } from '../common/RiskBadge';
import { MonoText } from '../common/MonoText';
import { Debtor, RiskLevel } from '../../types';

interface DebtorsGridProps {
  onSelectDebtor: (debtor: Debtor) => void;
  onDraftEmail: (debtor: Debtor) => void;
}

export const DebtorsGrid: React.FC<DebtorsGridProps> = ({ onSelectDebtor, onDraftEmail }) => {
  const { debtors } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const filteredDebtors = debtors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.companyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.contactName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = selectedRisk === 'All' || d.riskLevel === selectedRisk;
    const matchesRegion = selectedRegion === 'All' || d.region.includes(selectedRegion);

    return matchesSearch && matchesRisk && matchesRegion;
  });

  const columns: GridColDef<Debtor>[] = [
    {
      field: 'name',
      headerName: 'Debtor / Company Name',
      flex: 1.8,
      minWidth: 280,
      renderCell: (params) => (
        <Stack spacing={0.2} sx={{ justifyContent: 'center', height: '100%', width: '100%', overflow: 'hidden' }}>
          <Typography
            variant="body2"
            color="text.primary"
            noWrap
            sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: '0.875rem' }}
          >
            {params.row.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ lineHeight: 1.2, fontSize: '0.75rem' }}
          >
            {params.row.companyCode} • {params.row.contactName}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'region',
      headerName: 'Region',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.85rem' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'totalOutstanding',
      headerName: 'Total Outstanding',
      flex: 1.1,
      minWidth: 150,
      renderCell: (params) => (
        <MonoText variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
          {formatCurrency(params.value, 'full')}
        </MonoText>
      ),
    },
    {
      field: 'd30',
      headerName: '1-30 Days',
      flex: 0.8,
      minWidth: 105,
      renderCell: (params) => (
        <MonoText variant="body2" color={params.value > 0 ? '#d97706' : 'text.secondary'}>
          {params.value > 0 ? formatCurrency(params.value, 'short') : '—'}
        </MonoText>
      ),
    },
    {
      field: 'd60',
      headerName: '31-60 Days',
      flex: 0.8,
      minWidth: 105,
      renderCell: (params) => (
        <MonoText variant="body2" color={params.value > 0 ? '#ea580c' : 'text.secondary'}>
          {params.value > 0 ? formatCurrency(params.value, 'short') : '—'}
        </MonoText>
      ),
    },
    {
      field: 'd90Plus',
      headerName: '90+ Days',
      flex: 0.8,
      minWidth: 105,
      renderCell: (params) => (
        <MonoText variant="body2" sx={{ fontWeight: params.value > 0 ? 700 : 400, color: params.value > 0 ? '#dc2626' : 'text.secondary' }}>
          {params.value > 0 ? formatCurrency(params.value, 'short') : '—'}
        </MonoText>
      ),
    },
    {
      field: 'riskLevel',
      headerName: 'Risk Level',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => <RiskBadge riskLevel={params.value as RiskLevel} />,
    },
    {
      field: 'avgPaymentDelayDays',
      headerName: 'Avg Delay',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {params.value} days
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AutoAwesomeIcon style={{ fontSize: 13, color: '#0f172a' }} />}
            onClick={(e) => {
              e.stopPropagation();
              onDraftEmail(params.row);
            }}
            sx={{
              fontSize: '0.725rem',
              fontWeight: 600,
              py: 0.4,
              px: 1.2,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              borderColor: '#cbd5e1',
              color: '#0f172a',
              backgroundColor: '#ffffff',
              '&:hover': {
                borderColor: '#0f172a',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Draft AI Email
          </Button>
          <Tooltip title="View Debtor Details & Invoices">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onSelectDebtor(params.row);
              }}
              sx={{ border: '1px solid #e5e7eb' }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: '#ffffff' }}>
      {/* Search & Filters Header */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', mb: 2.5 }}>
        <TextField
          placeholder="Search customer, code, or contact..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: { xs: '100%', sm: 260 }, maxWidth: { md: 380 } }}
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

        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            select
            label="Risk Level Filter"
            size="small"
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            sx={{ width: 160 }}
          >
            <MenuItem value="All">All Risk Levels</MenuItem>
            <MenuItem value="Low">Low Risk</MenuItem>
            <MenuItem value="Medium">Medium Risk</MenuItem>
            <MenuItem value="High">High Risk</MenuItem>
            <MenuItem value="Critical">Critical Risk</MenuItem>
          </TextField>

          <TextField
            select
            label="Region Filter"
            size="small"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            sx={{ width: 160 }}
          >
            <MenuItem value="All">All Regions</MenuItem>
            <MenuItem value="West">West (Mumbai/Pune)</MenuItem>
            <MenuItem value="South">South (Bengaluru/Hyd)</MenuItem>
            <MenuItem value="North">North (Delhi NCR)</MenuItem>
            <MenuItem value="East">East (Kolkata)</MenuItem>
            <MenuItem value="International">International</MenuItem>
          </TextField>
        </Stack>
      </Stack>

      {/* MUI X DataGrid */}
      <Box sx={{ height: 530, width: '100%' }}>
        <DataGrid
          rows={filteredDebtors}
          columns={columns}
          rowHeight={72}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          onRowClick={(params) => onSelectDebtor(params.row)}
          disableRowSelectionOnClick
          sx={{
            cursor: 'pointer',
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              py: 0.5,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f9fafb',
              borderBottom: '2px solid #e5e7eb',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              fontSize: '0.825rem',
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: '#f9fafb',
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};
