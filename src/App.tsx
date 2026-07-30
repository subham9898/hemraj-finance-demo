import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Toolbar } from '@mui/material';
import { theme } from './theme';
import { FinanceProvider } from './context/FinanceContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DashboardView } from './components/dashboard/DashboardView';
import { DebtorsView } from './components/debtors/DebtorsView';
import { ReconciliationView } from './components/reconciliation/ReconciliationView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ExecutiveBriefingView } from './components/executive/ExecutiveBriefingView';
import { AiEmailDialog } from './components/debtors/AiEmailDialog';
import { Debtor } from './types';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Global AI Collection Email Dialog state for quick triggers from Dashboard
  const [globalAiDebtor, setGlobalAiDebtor] = useState<Debtor | null>(null);
  const [globalAiOpen, setGlobalAiOpen] = useState<boolean>(false);

  const handleDraftEmailFromDashboard = (debtor: Debtor) => {
    setGlobalAiDebtor(debtor);
    setGlobalAiOpen(true);
  };

  const handleViewDebtorFromDashboard = (debtorId: string) => {
    setActiveTab('debtors');
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ErrorBoundary fallbackTitle="Dashboard Module Error">
            <DashboardView
              onDraftEmail={handleDraftEmailFromDashboard}
              onViewDebtor={handleViewDebtorFromDashboard}
              onOpenCfoBrief={() => setActiveTab('executive')}
            />
          </ErrorBoundary>
        );
      case 'debtors':
        return (
          <ErrorBoundary fallbackTitle="Debtors Ledger Module Error">
            <DebtorsView />
          </ErrorBoundary>
        );
      case 'reconciliation':
        return (
          <ErrorBoundary fallbackTitle="Bank Reconciliation Module Error">
            <ReconciliationView />
          </ErrorBoundary>
        );
      case 'analytics':
        return (
          <ErrorBoundary fallbackTitle="Financial Analytics Module Error">
            <AnalyticsView />
          </ErrorBoundary>
        );
      case 'executive':
        return (
          <ErrorBoundary fallbackTitle="Executive CFO Briefing Module Error">
            <ExecutiveBriefingView />
          </ErrorBoundary>
        );
      default:
        return <DashboardView onDraftEmail={handleDraftEmailFromDashboard} onViewDebtor={handleViewDebtorFromDashboard} onOpenCfoBrief={() => setActiveTab('executive')} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Top Header */}
      <Header />

      {/* Body: Sidebar + Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Workspace */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { sm: `calc(100% - ${sidebarCollapsed ? 68 : 240}px)` },
            transition: 'width 0.2s ease',
            backgroundColor: '#f8f9fa',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {renderActiveModule()}
        </Box>
      </Box>

      {/* Global AI Collection Email Dialog */}
      <AiEmailDialog
        open={globalAiOpen}
        onClose={() => setGlobalAiOpen(false)}
        debtor={globalAiDebtor}
      />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </ThemeProvider>
  );
}
