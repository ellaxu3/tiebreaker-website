import { useState, useEffect } from 'react';
import {
  Sparkles,
  GitBranch,
  Scale,
  FileText,
  Layers,
  Target,
  LayoutDashboard,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Decision } from './types';
import { DecisionForm } from './components/DecisionForm';
import { VerdictTab } from './components/VerdictTab';
import { ProsConsTab } from './components/ProsConsTab';
import { SWOTTab } from './components/SWOTTab';
import { ComparisonTab } from './components/ComparisonTab';
import { ScorecardTab } from './components/ScorecardTab';
import { DecisionHistory } from './components/DecisionHistory';

const LOADING_STEPS = [
  'Assembling your decision details...',
  'Sifting through immediate trade-offs...',
  'Generating multi-option SWOT structures...',
  'Drafting factor-by-factor comparisons...',
  'Calibrating weighted scorecard utilities...',
  'Breaking the tie. Deliberating final verdict...'
];

export default function App() {
  const [history, setHistory] = useState<Decision[]>([]);
  const [activeDecision, setActiveDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'verdict' | 'proscons' | 'swot' | 'comparison' | 'scorecard'>('verdict');

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tiebreaker_decisions');
      if (stored) {
        const parsed = JSON.parse(stored) as Decision[];
        setHistory(parsed);
        if (parsed.length > 0) {
          setActiveDecision(parsed[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load decisions from cache:', err);
    }
  }, []);

  // Sync loading steps during processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const saveToHistory = (newDecision: Decision) => {
    const updated = [newDecision, ...history.filter((d) => d.id !== newDecision.id)];
    setHistory(updated);
    setActiveDecision(newDecision);
    localStorage.setItem('tiebreaker_decisions', JSON.stringify(updated));
  };

  const handleDeleteDecision = (id: string) => {
    const updated = history.filter((d) => d.id !== id);
    setHistory(updated);
    localStorage.setItem('tiebreaker_decisions', JSON.stringify(updated));

    if (activeDecision?.id === id) {
      setActiveDecision(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire decision history? This cannot be undone.')) {
      setHistory([]);
      setActiveDecision(null);
      localStorage.removeItem('tiebreaker_decisions');
    }
  };

  const handleAnalyze = async (formData: {
    title: string;
    description: string;
    optionA: string;
    optionB: string;
    category: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tiebreaker/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || 'Server error during decision analysis.');
      }

      const analysisResult = await response.json();

      const newDecision: Decision = {
        id: crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        optionA: formData.optionA,
        optionB: formData.optionB,
        category: formData.category,
        createdAt: new Date().toISOString(),
        status: 'completed',
        ...analysisResult,
      };

      saveToHistory(newDecision);
      setActiveTab('verdict');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while communicating with the Tiebreaker service.');
    } finally {
      setIsLoading(false);
    }
  };

  // Compute metric totals for header/dashboard
  const decisionsCount = history.length;
  const tiesCount = history.filter((d) => d.verdict?.winner === 'Tie').length;
  const optionAWinners = history.filter((d) => d.verdict?.winner === 'Option A').length;
  const optionBWinners = history.filter((d) => d.verdict?.winner === 'Option B').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-indigo-600 rotate-45 flex items-center justify-center shadow-md">
              <GitBranch className="w-4 h-4 text-white -rotate-45" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                The Tiebreaker
              </h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                Decision Intelligence
              </p>
            </div>
          </div>

          {/* Top Quick Stats Grid (Desktop only) */}
          {decisionsCount > 0 && (
            <div className="hidden md:flex items-center gap-6 text-xs font-mono border-l border-slate-200 pl-6">
              <div>
                <span className="text-slate-400">Decisions Made:</span>{' '}
                <span className="text-slate-800 font-semibold">{decisionsCount}</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div>
                <span className="text-slate-400">A Favored:</span>{' '}
                <span className="text-emerald-600 font-semibold">{optionAWinners}</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div>
                <span className="text-slate-400">B Favored:</span>{' '}
                <span className="text-indigo-600 font-semibold">{optionBWinners}</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div>
                <span className="text-slate-400">Ties:</span>{' '}
                <span className="text-amber-600 font-semibold">{tiesCount}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Inputs and History (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <DecisionForm onSubmit={handleAnalyze} isLoading={isLoading} />
          <DecisionHistory
            history={history}
            onSelect={(d) => {
              setActiveDecision(d);
              setActiveTab('verdict');
            }}
            onDelete={handleDeleteDecision}
            onClearAll={handleClearAllHistory}
            activeId={activeDecision?.id}
          />
        </div>

        {/* Right column: Interactive Analysis Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col min-h-[400px]">
          {isLoading ? (
            /* Loading State Screen */
            <div className="bg-white border border-slate-200 rounded-xl p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] shadow-xs">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="font-display font-bold text-lg text-slate-800">Consulting the Tiebreaker</h3>
                <p className="text-sm text-slate-500 font-mono min-h-[20px] transition-all duration-300">
                  {LOADING_STEPS[loadingStepIndex]}
                </p>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : error ? (
            /* Error Fallback Panel */
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-display font-bold text-rose-800">Analysis Error</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{error}</p>
                <p className="text-xs text-slate-500 font-mono mt-2">
                  Please verify your internet connection or check your GEMINI_API_KEY settings.
                </p>
              </div>
            </div>
          ) : activeDecision ? (
            /* Analysis Workspace Tabbed Panel */
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Header section for selected decision */}
              <div className="bg-white border border-slate-200 shadow-xs p-6 rounded-xl space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                  <span>{activeDecision.category}</span>
                  <span>•</span>
                  <span>
                    Created:{' '}
                    {new Date(activeDecision.createdAt).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 leading-tight">
                  {activeDecision.title}
                </h2>
                {activeDecision.description && (
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed border-t border-slate-100 pt-3 mt-1">
                    {activeDecision.description}
                  </p>
                )}
              </div>

              {/* High Quality Tab Navigation Bar */}
              <div className="flex flex-wrap border-b border-slate-200 gap-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('verdict')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'verdict'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/30'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Verdict Recommendation
                </button>
                <button
                  onClick={() => setActiveTab('proscons')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'proscons'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/30'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  Pros & Cons
                </button>
                <button
                  onClick={() => setActiveTab('swot')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'swot'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/30'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  SWOT Analysis
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'comparison'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/30'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Comparison Table
                </button>
                <button
                  onClick={() => setActiveTab('scorecard')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'scorecard'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/30'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Weighted Scorecard
                </button>
              </div>

              {/* Tab Display Area */}
              <div className="flex-1 min-h-[300px]">
                {activeTab === 'verdict' && activeDecision.verdict && (
                  <VerdictTab
                    verdict={activeDecision.verdict}
                    optionA={activeDecision.optionA}
                    optionB={activeDecision.optionB}
                  />
                )}
                {activeTab === 'proscons' && activeDecision.prosCons && (
                  <ProsConsTab
                    optionA={activeDecision.prosCons.optionA}
                    optionB={activeDecision.prosCons.optionB}
                  />
                )}
                {activeTab === 'swot' && activeDecision.swot && (
                  <SWOTTab swot={activeDecision.swot} />
                )}
                {activeTab === 'comparison' && activeDecision.comparison && (
                  <ComparisonTab comparison={activeDecision.comparison} />
                )}
                {activeTab === 'scorecard' && activeDecision.scorecard && (
                  <ScorecardTab
                    scorecard={activeDecision.scorecard}
                    optionA={activeDecision.optionA}
                    optionB={activeDecision.optionB}
                  />
                )}
              </div>
            </div>
          ) : (
            /* Empty state (No decisions analyzed yet) */
            <div className="bg-white border border-slate-200 rounded-xl p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] shadow-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-indigo-600">
                <GitBranch className="w-12 h-12 stroke-1 rotate-90 mx-auto animate-pulse" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-800">No active deliberation</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Enter a critical decision topic, define Option A & Option B, and click{' '}
                  <strong className="text-indigo-650 font-bold">Break the Tie</strong> on the left. The Tiebreaker AI
                  will draft a multi-dimensional matrix to help you decide.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl text-left text-xs font-mono text-slate-400 pt-4 border-t border-slate-150">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Pros/Cons side-by-side with weight impact metrics.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>SWOT Matrix detailing opportunities & structural threats.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Weighted score multiplier scorecard calculator.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Humble Footer */}
      <footer className="border-t border-slate-200 py-6 mt-12 bg-white text-center text-2xs font-mono text-slate-500">
        <p>© 2026 The Tiebreaker Decision Platform. Powered by Google Gemini AI.</p>
        <p className="mt-1">All evaluations are advisory. Your agency remains absolute.</p>
      </footer>
    </div>
  );
}
