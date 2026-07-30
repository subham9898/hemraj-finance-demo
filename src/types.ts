export type CurrencyMode = 'full' | 'short';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type InvoiceStatus = 'Paid' | 'Overdue' | 'Pending' | 'Disputed';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  daysOverdue: number;
  status: InvoiceStatus;
  region: string;
}

export interface ActivityLog {
  id: string;
  debtorId: string;
  date: string;
  type: 'Call' | 'Email' | 'Payment Promise' | 'Note' | 'Legal Notice';
  summary: string;
  author: string;
}

export interface Debtor {
  id: string;
  name: string;
  companyCode: string;
  contactName: string;
  email: string;
  phone: string;
  region: string;
  totalOutstanding: number;
  current: number;
  d30: number;
  d60: number;
  d90Plus: number;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  avgPaymentDelayDays: number;
  lastContactDate: string;
  creditLimit: number;
  invoices: Invoice[];
}

export interface BankStatementLine {
  id: string;
  date: string;
  utrRef: string;
  description: string;
  amount: number;
  type: 'CR' | 'DR';
  reconciled: boolean;
  matchedLedgerId?: string;
  confidenceScore?: number; // e.g. 98, 85, 52
  matchReason?: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  reconciled: boolean;
}

export interface CashFlowTrajectory {
  month: string;
  actualInflow: number;
  actualOutflow: number;
  projectedInflow: number;
  projectedOutflow: number;
  netCash: number;
}

export interface RegionalPerformance {
  region: string;
  totalReceivables: number;
  avgCollectionDays: number;
  onTimePercent: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface CfoKPIs {
  totalRevenue: number;
  netCashFlow: number;
  overdueBalances: number;
  riskIndex: number; // 0 - 100
}

export type EmailTone = 'Friendly Reminder' | 'Firm Follow-up' | 'Legal Escalation Notice';

export interface CollectionEmailRequest {
  customerName: string;
  totalOutstanding: number;
  overdueInvoices: Array<{ invoiceNumber: string; amount: number; daysOverdue: number }>;
  daysPastDue: number;
  riskLevel: RiskLevel;
  tone: EmailTone;
}

export interface CollectionEmailResponse {
  subject: string;
  body: string;
  tone: EmailTone;
  generatedAt: string;
}

export interface ExecutiveBriefRequest {
  totalRevenue: number;
  netCashFlow: number;
  overdueBalances: number;
  riskIndex: number;
  topDebtors: Array<{ name: string; amount: number; riskLevel: RiskLevel }>;
}

export interface ExecutiveBriefResponse {
  briefPoints: string[];
  strategicRecommendations: string[];
  summaryHeadline: string;
  generatedAt: string;
}
