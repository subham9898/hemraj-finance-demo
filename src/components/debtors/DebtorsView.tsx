import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { DebtorsGrid } from './DebtorsGrid';
import { CustomerDrawer } from './CustomerDrawer';
import { AiEmailDialog } from './AiEmailDialog';
import { Debtor } from '../../types';

interface DebtorsViewProps {
  initialSelectedDebtorId?: string | null;
}

export const DebtorsView: React.FC<DebtorsViewProps> = ({ initialSelectedDebtorId: _initialSelectedDebtorId }) => {
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiDebtor, setAiDebtor] = useState<Debtor | null>(null);

  const handleSelectDebtor = (debtor: Debtor) => {
    setSelectedDebtor(debtor);
    setDrawerOpen(true);
  };

  const handleOpenDraftEmail = (debtor: Debtor) => {
    setAiDebtor(debtor);
    setAiDialogOpen(true);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Debtors Ledger & Accounts Receivable Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comprehensive debtor profiling, ageing buckets, credit risk scores, and AI collection drafting
        </Typography>
      </Box>

      <DebtorsGrid onSelectDebtor={handleSelectDebtor} onDraftEmail={handleOpenDraftEmail} />

      {/* Customer Drawer Side Panel */}
      <CustomerDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        debtor={selectedDebtor}
        onOpenDraftEmail={handleOpenDraftEmail}
      />

      {/* AI Collection Email Dialog */}
      <AiEmailDialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        debtor={aiDebtor}
      />
    </Stack>
  );
};
