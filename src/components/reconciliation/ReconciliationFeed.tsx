import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BuildIcon from '@mui/icons-material/Build';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { MonoText } from '../common/MonoText';
import { BankStatementLine } from '../../types';

interface ReconciliationFeedProps {
  onOpenManualModal: (line: BankStatementLine) => void;
}

export const ReconciliationFeed: React.FC<ReconciliationFeedProps> = ({ onOpenManualModal }) => {
  const { bankLines, ledgerEntries, approveReconciliation } = useFinance();
  const [tabFilter, setTabFilter] = useState<'pending' | 'reconciled' | 'all'>('pending');

  const pendingLines = bankLines.filter((l) => !l.reconciled);
  const reconciledLines = bankLines.filter((l) => l.reconciled);

  const activeLines =
    tabFilter === 'pending' ? pendingLines : tabFilter === 'reconciled' ? reconciledLines : bankLines;

  const getConfidenceBadge = (score?: number) => {
    if (!score) return null;

    if (score >= 95) {
      return (
        <Chip
          label={`Exact Match ${score}%`}
          size="small"
          icon={<CheckCircleIcon style={{ fontSize: 13, color: '#16a34a' }} />}
          sx={{
            backgroundColor: '#ecfdf5',
            color: '#16a34a',
            border: '1px solid #a7f3d0',
            fontWeight: 700,
            fontSize: '0.7rem',
          }}
        />
      );
    }
    if (score >= 75) {
      return (
        <Chip
          label={`High Suggestion ${score}%`}
          size="small"
          icon={<AutoAwesomeIcon style={{ fontSize: 13, color: '#0284c7' }} />}
          sx={{
            backgroundColor: '#f0f9ff',
            color: '#0284c7',
            border: '1px solid #bae6fd',
            fontWeight: 700,
            fontSize: '0.7rem',
          }}
        />
      );
    }
    return (
      <Chip
        label={`Manual Review ${score}%`}
        size="small"
        icon={<BuildIcon style={{ fontSize: 13, color: '#d97706' }} />}
        sx={{
          backgroundColor: '#fffbeb',
          color: '#d97706',
          border: '1px solid #fde68a',
          fontWeight: 700,
          fontSize: '0.7rem',
        }}
      />
    );
  };

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            mb: 2.5,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              AI Bank Statement Reconciliation Feed
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Automated pattern matching between bank UTR remittances and internal open invoices
            </Typography>
          </Box>

          <Tabs
            value={tabFilter}
            onChange={(_, val) => setTabFilter(val)}
            sx={{
              minHeight: 36,
              '& .MuiTab-root': { minHeight: 36, py: 0.5, fontSize: '0.8rem', fontWeight: 600 },
            }}
          >
            <Tab
              value="pending"
              label={
                <Badge badgeContent={pendingLines.length} color="error" sx={{ pr: 1.5 }}>
                  Pending Matches
                </Badge>
              }
            />
            <Tab value="reconciled" label={`Reconciled (${reconciledLines.length})`} />
            <Tab value="all" label="All Feeds" />
          </Tabs>
        </Stack>

        <Stack spacing={2}>
          {activeLines.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9fafb' }}>
              <DoneAllIcon sx={{ fontSize: 40, color: '#16a34a', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                All Bank Statement Lines Reconciled!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No pending unmatched bank statement entries in this view.
              </Typography>
            </Paper>
          ) : (
            activeLines.map((line) => {
              const matchedLedger = ledgerEntries.find((e) => e.id === line.matchedLedgerId);

              return (
                <Paper
                  key={line.id}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    backgroundColor: line.reconciled ? '#fdfdfd' : '#ffffff',
                    borderColor: line.reconciled ? '#e5e7eb' : line.confidenceScore && line.confidenceScore >= 95 ? '#b9f6ca' : '#e5e7eb',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '5fr 4fr 3fr' },
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    {/* Left: Bank Statement Line */}
                    <Box sx={{ borderRight: { md: '1px solid #f3f4f6' }, pr: { md: 2 } }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                        <Chip
                          label={line.type}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            backgroundColor: line.type === 'CR' ? '#ecfdf5' : '#fef2f2',
                            color: line.type === 'CR' ? '#16a34a' : '#dc2626',
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                          UTR: {line.utrRef}
                        </Typography>
                      </Stack>

                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                        {line.description}
                      </Typography>

                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Bank Date: {line.date}
                        </Typography>
                        <MonoText variant="subtitle1" sx={{ fontWeight: 700, color: line.type === 'CR' ? '#16a34a' : '#dc2626' }}>
                          {formatCurrency(line.amount, 'full')}
                        </MonoText>
                      </Stack>
                    </Box>

                    {/* Middle: AI Match Suggestion */}
                    <Box sx={{ px: { md: 1 } }}>
                      {matchedLedger ? (
                        <Box>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                            {getConfidenceBadge(line.confidenceScore)}
                          </Stack>
                          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 700 }}>
                            {matchedLedger.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Inv #{matchedLedger.invoiceNumber} • Amount: {formatCurrency(matchedLedger.amount, 'short')}
                          </Typography>
                          {line.matchReason && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', mt: 0.5 }}>
                              AI Logic: {line.matchReason}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Box>
                          {getConfidenceBadge(line.confidenceScore)}
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {line.matchReason || 'No exact automated match found. Requires manual pairing.'}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Right: Actions */}
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Stack direction="row" spacing={1}>
                        {line.reconciled ? (
                          <Chip
                            label="Reconciled"
                            color="success"
                            size="small"
                            icon={<CheckCircleIcon style={{ fontSize: 14 }} />}
                            sx={{ fontWeight: 700 }}
                          />
                        ) : (
                          <>
                            {line.matchedLedgerId && (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<CheckCircleIcon style={{ fontSize: 14 }} />}
                                onClick={() => approveReconciliation(line.id)}
                                sx={{ fontSize: '0.75rem', py: 0.6 }}
                              >
                                Approve Match
                              </Button>
                            )}

                            <Button
                              variant="outlined"
                              color="inherit"
                              size="small"
                              onClick={() => onOpenManualModal(line)}
                              sx={{ fontSize: '0.75rem', py: 0.6, borderColor: '#e5e7eb' }}
                            >
                              Manual Match
                            </Button>
                          </>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </Paper>
              );
            })
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
