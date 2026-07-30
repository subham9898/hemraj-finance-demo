import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Debtor,
  Invoice,
  BankStatementLine,
  LedgerEntry,
  ActivityLog,
  CashFlowTrajectory,
  RegionalPerformance,
  CfoKPIs,
  InvoiceStatus,
} from '../types';
import {
  INITIAL_DEBTORS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_BANK_STATEMENT_LINES,
  INITIAL_LEDGER_ENTRIES,
  CASH_FLOW_TRAJECTORY,
  REGIONAL_PERFORMANCE,
  INITIAL_CFO_KPIS,
} from '../data/mockData';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface FinanceContextType {
  debtors: Debtor[];
  activityLogs: ActivityLog[];
  bankLines: BankStatementLine[];
  ledgerEntries: LedgerEntry[];
  cashFlowTrajectory: CashFlowTrajectory[];
  regionalStats: RegionalPerformance[];
  cfoKPIs: CfoKPIs;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  approveReconciliation: (bankLineId: string, ledgerEntryId?: string) => void;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'date'>) => void;
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus) => void;
  resetToDemoData: () => void;
}

const STORAGE_KEY = 'hemraj_finance_state_v2';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [debtors, setDebtors] = useState<Debtor[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_debtors`);
      return saved ? JSON.parse(saved) : INITIAL_DEBTORS;
    } catch {
      return INITIAL_DEBTORS;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [bankLines, setBankLines] = useState<BankStatementLine[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_bankLines`);
      return saved ? JSON.parse(saved) : INITIAL_BANK_STATEMENT_LINES;
    } catch {
      return INITIAL_BANK_STATEMENT_LINES;
    }
  });

  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ledgerEntries`);
      return saved ? JSON.parse(saved) : INITIAL_LEDGER_ENTRIES;
    } catch {
      return INITIAL_LEDGER_ENTRIES;
    }
  });

  const [cfoKPIs, setCfoKPIs] = useState<CfoKPIs>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cfoKPIs`);
      return saved ? JSON.parse(saved) : INITIAL_CFO_KPIS;
    } catch {
      return INITIAL_CFO_KPIS;
    }
  });

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_debtors`, JSON.stringify(debtors));
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(activityLogs));
      localStorage.setItem(`${STORAGE_KEY}_bankLines`, JSON.stringify(bankLines));
      localStorage.setItem(`${STORAGE_KEY}_ledgerEntries`, JSON.stringify(ledgerEntries));
      localStorage.setItem(`${STORAGE_KEY}_cfoKPIs`, JSON.stringify(cfoKPIs));
    } catch (e) {
      console.warn('Failed to save finance state to localStorage:', e);
    }
  }, [debtors, activityLogs, bankLines, ledgerEntries, cfoKPIs]);

  const approveReconciliation = (bankLineId: string, ledgerEntryId?: string) => {
    const bankLine = bankLines.find((b) => b.id === bankLineId);
    if (!bankLine) return;

    const matchedId = ledgerEntryId || bankLine.matchedLedgerId;

    // Update bank line status
    setBankLines((prev) =>
      prev.map((line) =>
        line.id === bankLineId ? { ...line, reconciled: true } : line
      )
    );

    // Update ledger entry if matched
    if (matchedId) {
      setLedgerEntries((prev) =>
        prev.map((entry) =>
          entry.id === matchedId ? { ...entry, reconciled: true } : entry
        )
      );

      // Also update matching invoice status in debtors
      setDebtors((prevDebtors) =>
        prevDebtors.map((debtor) => {
          const updatedInvoices = debtor.invoices.map((inv) => {
            if (inv.id === matchedId) {
              return { ...inv, status: 'Paid' as InvoiceStatus, daysOverdue: 0 };
            }
            return inv;
          });

          // Recalculate outstanding total
          const newTotal = updatedInvoices
            .filter((inv) => inv.status !== 'Paid')
            .reduce((acc, inv) => acc + inv.amount, 0);

          return {
            ...debtor,
            totalOutstanding: newTotal,
            invoices: updatedInvoices,
          };
        })
      );
    }

    // Update CFO Net Cash Flow
    setCfoKPIs((prev) => ({
      ...prev,
      netCashFlow: prev.netCashFlow + bankLine.amount,
      overdueBalances: Math.max(0, prev.overdueBalances - bankLine.amount),
    }));
  };

  const addActivityLog = (logData: Omit<ActivityLog, 'id' | 'date'>) => {
    const newLog: ActivityLog = {
      ...logData,
      id: `act-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    // Update lastContactDate on debtor
    setDebtors((prev) =>
      prev.map((d) =>
        d.id === logData.debtorId
          ? { ...d, lastContactDate: new Date().toISOString().split('T')[0] }
          : d
      )
    );
  };

  const updateInvoiceStatus = (invoiceId: string, status: InvoiceStatus) => {
    setDebtors((prevDebtors) =>
      prevDebtors.map((debtor) => {
        const hasInvoice = debtor.invoices.some((i) => i.id === invoiceId);
        if (!hasInvoice) return debtor;

        const updatedInvoices = debtor.invoices.map((inv) =>
          inv.id === invoiceId ? { ...inv, status } : inv
        );

        const newTotal = updatedInvoices
          .filter((inv) => inv.status !== 'Paid')
          .reduce((acc, inv) => acc + inv.amount, 0);

        return {
          ...debtor,
          totalOutstanding: newTotal,
          invoices: updatedInvoices,
        };
      })
    );
  };

  const resetToDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_debtors`);
    localStorage.removeItem(`${STORAGE_KEY}_logs`);
    localStorage.removeItem(`${STORAGE_KEY}_bankLines`);
    localStorage.removeItem(`${STORAGE_KEY}_ledgerEntries`);
    localStorage.removeItem(`${STORAGE_KEY}_cfoKPIs`);

    setDebtors(INITIAL_DEBTORS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setBankLines(INITIAL_BANK_STATEMENT_LINES);
    setLedgerEntries(INITIAL_LEDGER_ENTRIES);
    setCfoKPIs(INITIAL_CFO_KPIS);
  };

  return (
    <FinanceContext.Provider
      value={{
        debtors,
        activityLogs,
        bankLines,
        ledgerEntries,
        cashFlowTrajectory: CASH_FLOW_TRAJECTORY,
        regionalStats: REGIONAL_PERFORMANCE,
        cfoKPIs,
        dateRange,
        setDateRange,
        approveReconciliation,
        addActivityLog,
        updateInvoiceStatus,
        resetToDemoData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
