import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client lazy/safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. AI Collection Email Drafter Route
  app.post('/api/ai/collection-email', async (req, res) => {
    try {
      const { customerName, totalOutstanding, overdueInvoices, daysPastDue, riskLevel, tone } = req.body;

      const formattedInvoices = Array.isArray(overdueInvoices)
        ? overdueInvoices.map((inv: any) => `- Inv #${inv.invoiceNumber}: ₹${inv.amount.toLocaleString('en-IN')} (${inv.daysOverdue} days overdue)`).join('\n')
        : 'All overdue invoices';

      const prompt = `
You are the senior credit controller at HEMRAJ FINANCE, an enterprise financial platform in India.
Draft a professional payment collection email to customer "${customerName}".

Context:
- Customer Name: ${customerName}
- Total Outstanding Balance: ₹${Number(totalOutstanding).toLocaleString('en-IN')}
- Maximum Days Overdue: ${daysPastDue} days
- Risk Level: ${riskLevel}
- Desired Tone: ${tone} (e.g. Friendly Reminder, Firm Follow-up, or Legal Escalation Notice)
- Specific Overdue Invoices:
${formattedInvoices}

Instructions:
- Currency MUST be formatted in Indian Rupees (₹ or INR).
- The tone should match "${tone}".
- Include clear RTGS/NEFT/IMPS payment details instruction placeholder.
- Provide a polite yet firm closing signed by "HEMRAJ FINANCE Accounts Receivables Team".
- Return JSON strictly in this format:
{
  "subject": "Subject line here",
  "body": "Full body text of the email here..."
}
`;

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback response when GEMINI_API_KEY is missing
        return res.json({
          subject: `Payment Reminder: Outstanding Balance for ${customerName} - HEMRAJ FINANCE`,
          body: `Dear ${customerName} Team,\n\nThis is a payment reminder regarding your outstanding balance of ₹${Number(totalOutstanding).toLocaleString('en-IN')} with HEMRAJ FINANCE.\n\nOverdue Invoices:\n${formattedInvoices}\n\nWe kindly request you to process the payment via RTGS/NEFT at your earliest convenience to avoid account hold.\n\nRegards,\nHEMRAJ FINANCE Accounts Receivables Team`,
          tone: tone || 'Firm Follow-up',
          generatedAt: new Date().toISOString(),
          isFallback: true,
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      let parsed = { subject: '', body: '' };
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = {
          subject: `Payment Follow-up: ${customerName}`,
          body: responseText,
        };
      }

      res.json({
        subject: parsed.subject,
        body: parsed.body,
        tone: tone || 'Firm Follow-up',
        generatedAt: new Date().toISOString(),
        isFallback: false,
      });
    } catch (error: any) {
      console.error('Error in collection-email endpoint:', error);
      res.status(500).json({
        error: 'Failed to generate collection email via Gemini AI',
        message: error.message || 'Server error',
      });
    }
  });

  // 2. AI Executive CFO Briefing Route
  app.post('/api/ai/executive-brief', async (req, res) => {
    try {
      const { totalRevenue, netCashFlow, overdueBalances, riskIndex, topDebtors } = req.body;

      const debtorsSummary = Array.isArray(topDebtors)
        ? topDebtors.map((d: any) => `- ${d.name}: ₹${Number(d.amount).toLocaleString('en-IN')} (Risk: ${d.riskLevel})`).join('\n')
        : '';

      const prompt = `
You are the Chief Financial Officer (CFO) & Strategic Advisor at HEMRAJ FINANCE.
Analyze the following cash flow and receivables position and generate an executive C-suite briefing for leadership.

Current Financial State (INR):
- Total Revenue: ₹${Number(totalRevenue).toLocaleString('en-IN')}
- Net Cash Flow: ₹${Number(netCashFlow).toLocaleString('en-IN')}
- Overdue Receivables: ₹${Number(overdueBalances).toLocaleString('en-IN')}
- Receivables Risk Index: ${riskIndex} / 100
- Key Concentrated Accounts:
${debtorsSummary}

Instructions:
- Provide exactly 3 high-impact executive brief bullet points summarizing liquidity position and debtor concentration risk.
- Provide 3 actionable strategic recommendations for working capital optimization, debtor terms adjustment, or early payment discounts in India.
- Provide 1 punchy summary headline.
- All monetary amounts MUST use Indian Rupee currency notation (₹ / Cr / Lakh).
- Return JSON strictly in this format:
{
  "summaryHeadline": "A single compelling executive title",
  "briefPoints": ["Point 1", "Point 2", "Point 3"],
  "strategicRecommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}
`;

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          summaryHeadline: 'Liquidity Remains Robust with Targeted Receivables Focus',
          briefPoints: [
            `Current cash reserves stand at ₹${(netCashFlow / 100000).toFixed(1)}L with strong Q3 operational inflows.`,
            `Overdue balances of ₹${(overdueBalances / 100000).toFixed(1)}L require focused recovery effort on top accounts.`,
            `Overall credit risk index is maintained at a healthy ${riskIndex}/100 benchmark.`,
          ],
          strategicRecommendations: [
            'Enforce strict 30-day payment caps for high-risk accounts exceeding ₹10L exposure.',
            'Offer a 1.5% prompt payment discount for RTGS/IMPS clearing within 7 business days.',
            'Initiate formal legal reminders for all accounts past 60 days overdue.',
          ],
          generatedAt: new Date().toISOString(),
          isFallback: true,
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      let parsed = { summaryHeadline: '', briefPoints: [], strategicRecommendations: [] };
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = {
          summaryHeadline: 'Executive Financial Overview',
          briefPoints: [responseText],
          strategicRecommendations: ['Review credit terms for top accounts'],
        };
      }

      res.json({
        summaryHeadline: parsed.summaryHeadline,
        briefPoints: parsed.briefPoints,
        strategicRecommendations: parsed.strategicRecommendations,
        generatedAt: new Date().toISOString(),
        isFallback: false,
      });
    } catch (error: any) {
      console.error('Error in executive-brief endpoint:', error);
      res.status(500).json({
        error: 'Failed to generate CFO executive brief via Gemini AI',
        message: error.message || 'Server error',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HEMRAJ FINANCE Enterprise Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
