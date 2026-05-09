import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeStatement } from '../api';
import { AIResponse } from '../types';
import { parseCsv } from '../utils/fileParser';
import { parsePdf } from '../utils/pdfParser';
import UploadScreen from '../components/UploadScreen';
import LoadingScreen from '../components/LoadingScreen';
import Overview from '../components/Dashboard/Overview';
import Transactions from '../components/Dashboard/Transactions';
import Categories from '../components/Dashboard/Categories';
import Advisor from '../components/Dashboard/Advisor';
import Plan from '../components/Dashboard/Plan';
import Chat from '../components/Dashboard/Chat';
import '../styles.css';

type TabName = 'overview' | 'transactions' | 'categories' | 'advisor' | 'plan' | 'chat';

const defaultTab: TabName = 'overview';

const extractJson = (text: string) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('AI response did not contain valid JSON.');
  }
  return JSON.parse(match[0]) as AIResponse;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabName>(defaultTab);

  const readFileText = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      return parseCsv(file);
    }
    if (ext === 'pdf') {
      return parsePdf(file);
    }
    throw new Error('Please upload a PDF or CSV bank statement.');
  };

  const buildPrompt = (text: string, name: string) => {
    return `You are an expert financial analyst AI. Analyze this bank statement thoroughly. Return ONLY valid JSON — no markdown fences, no explanation, nothing else.

Required JSON structure:
{
  "currency": "INR",
  "period": "01 Apr – 08 Apr 2026",
  "totalIncome": 3980,
  "totalExpenses": 3980,
  "netSavings": 0,
  "savingsRate": 0,
  "healthScore": 4.8,
  "healthLabel": "Needs Attention",
  "summary": "2-3 sentence honest financial summary. Be specific with numbers.",
  "transactions": [
    {"date":"07 Apr","description":"UPI — Kabilan V","amount":500,"type":"expense","category":"Transfers","balance":5.01}
  ],
  "expenseCategories": [
    {"name":"Topup / Recharge","amount":2560,"pct":64.3}
  ],
  "incomeSources": [
    {"name":"ATM Cash Deposits","amount":1600,"pct":40.2}
  ],
  "dailyFlow": [
    {"date":"02 Apr","income":200,"expense":200}
  ],
  "leaks": [
    {
      "title":"Daily LiteTopup Habit",
      "subtitle":"6 top-ups in 7 days averaging ₹427/day",
      "icon":"📱",
      "severity":"high",
      "amount":2560,
      "potentialSave":960,
      "tips":[
        "Switch to a 28-day prepaid plan — saves ₹960/month vs daily top-ups",
        "Set one fixed recharge day per week, e.g. every Monday",
        "Enable low-balance alerts to stop panic top-ups"
      ]
    }
  ],
  "budgetRows": [
    {"category":"Topup / Recharge","icon":"📱","actual":2560,"target":300,"action":"Buy monthly prepaid plan once"}
  ],
  "budgetSavingsRow": {"category":"💰 Savings","icon":"💰","actual":0,"target":800,"action":"Transfer on day income arrives"},
  "weekPlan": [
    {"week":"Week 1","title":"Set Up the System","desc":"Buy monthly recharge on Day 1. Open RD or savings sub-account. Transfer 20% of any income received immediately before spending."}
  ],
  "goals": [
    {"icon":"🛡️","title":"Emergency Fund","desc":"1 month of expenses as safety net","amount":"₹4,000","period":"3 months"}
  ]
}

Rules:
- "type": "income" for credits, "expense" for debits
- Categories: Food & Dining | Shopping | Transport | Topup/Recharge | Utilities | Entertainment | Health | Rent/Housing | Transfers | Other
- healthScore: 1–10 (10=excellent savings, disciplined; 1=zero savings, all money out same day)
- Identify 2–4 money leaks with specific, actionable tips
- budgetRows: realistic next-month targets — show where to cut
- weekPlan: exactly 4 weeks of concrete actions
- 3 savings goals with timelines
- All amounts as positive numbers
- Max 60 transactions in array
- Detect currency from statement context (default INR)
- savingsRate: percentage 0–100

Bank statement file: ${name}
Statement content:
${text.slice(0, 12000)}`;
  };

  const analyzeFile = async (file: File) => {
    setError(undefined);
    setLoading(true);
    setStep(1);
    setFileName(file.name);

    try {
      const text = await readFileText(file);
      setStep(2);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setStep(3);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to analyze statements.');
      }

      const result = await analyzeStatement(buildPrompt(text, file.name), token, file.name);
      setStep(4);
      const parsed = extractJson(result);
      setAnalysis(parsed);
      setActiveTab(defaultTab);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected analysis error');
      setAnalysis(null);
      if (err instanceof Error && err.message.includes('Unauthorized')) {
         handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(undefined);
    setFileName('');
    setActiveTab(defaultTab);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="app">
      <div id="topbar">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 18 18" fill="none">
              <path d="M2 13L6 5L10 9.5L13 7L16 13" stroke="#0B0D09" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="brand-name">Fin<span>Sight</span></div>
        </div>
        <div className="topbar-actions">
          {fileName && (
            <div className="chip-file">
              📄 <span>{fileName}</span>
            </div>
          )}
          {analysis && (
            <button className="btn-new" onClick={reset}>
              ↑ Upload New Statement
            </button>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {!analysis && !loading && <UploadScreen onFileSelected={analyzeFile} error={error} />}
      {loading && <LoadingScreen step={step} />}

      {analysis && !loading && (
        <div className="screen active" id="s-dash">
          <div className="banner">
            <strong>📊 {analysis.period}</strong> — {analysis.summary}
          </div>

          <div className="metrics">
            <div className="mc c-lime">
              <div className="mc-tag">Total Income</div>
              <div className="mc-val">₹{analysis.totalIncome.toLocaleString()}</div>
              <div className="mc-sub">{analysis.incomeSources.length} source(s) detected</div>
              <div className="mc-glow" />
            </div>
            <div className="mc c-red">
              <div className="mc-tag">Total Expenses</div>
              <div className="mc-val">₹{analysis.totalExpenses.toLocaleString()}</div>
              <div className="mc-sub">{analysis.expenseCategories.length} categories</div>
              <div className="mc-glow" />
            </div>
            <div className="mc c-sky">
              <div className="mc-tag">Net Savings</div>
              <div className="mc-val">₹{analysis.netSavings.toLocaleString()}</div>
              <div className="mc-sub">{analysis.savingsRate.toFixed(1)}% savings rate</div>
              <div className="mc-glow" />
            </div>
            <div className="mc c-amb">
              <div className="mc-tag">Transactions</div>
              <div className="mc-val">{analysis.transactions.length}</div>
              <div className="mc-sub">{analysis.period}</div>
              <div className="mc-glow" />
            </div>
          </div>

          <div className="tabbar">
            <button className={`tb ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              📊 Overview
            </button>
            <button className={`tb ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
              📋 Transactions
            </button>
            <button className={`tb ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
              🏷️ Categories
            </button>
            <button className={`tb ${activeTab === 'advisor' ? 'active' : ''}`} onClick={() => setActiveTab('advisor')}>
              🔍 Advisor
            </button>
            <button className={`tb ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>
              📅 Next Month Plan
            </button>
            <button className={`tb ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              💬 Ask AI
            </button>
          </div>

          <div className={`panel ${activeTab === 'overview' ? 'active' : ''}`}>
            <Overview data={analysis} />
          </div>

          <div className={`panel ${activeTab === 'transactions' ? 'active' : ''}`}>
            <Transactions data={analysis} />
          </div>

          <div className={`panel ${activeTab === 'categories' ? 'active' : ''}`}>
            <Categories data={analysis} />
          </div>

          <div className={`panel ${activeTab === 'advisor' ? 'active' : ''}`}>
            <Advisor data={analysis} />
          </div>

          <div className={`panel ${activeTab === 'plan' ? 'active' : ''}`}>
            <Plan data={analysis} />
          </div>

          <div className={`panel ${activeTab === 'chat' ? 'active' : ''}`}>
            <Chat />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
