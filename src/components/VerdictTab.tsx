import React from 'react';
import { Award, Zap, HelpCircle, RefreshCw } from 'lucide-react';
import { DecisionVerdict } from '../types';

interface VerdictTabProps {
  verdict: DecisionVerdict;
  optionA: string;
  optionB: string;
}

export const VerdictTab: React.FC<VerdictTabProps> = ({ verdict, optionA, optionB }) => {
  const isWinnerA = verdict.winner === 'Option A';
  const isWinnerB = verdict.winner === 'Option B';
  const isTie = verdict.winner === 'Tie';

  // Choose colors and name based on winner
  let winnerColor = 'from-violet-600 to-indigo-600';
  let winnerTextClass = 'text-indigo-600';
  let badgeColor = 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold';
  let bgGradient = 'from-indigo-500/5 via-transparent to-transparent';
  let winnerDisplayName = 'It\'s a Close Tie';

  if (isWinnerA) {
    winnerColor = 'from-emerald-600 to-teal-600';
    winnerTextClass = 'text-emerald-600';
    badgeColor = 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold';
    bgGradient = 'from-emerald-500/5 via-transparent to-transparent';
    winnerDisplayName = optionA;
  } else if (isWinnerB) {
    winnerColor = 'from-indigo-600 to-indigo-700';
    winnerTextClass = 'text-indigo-600';
    badgeColor = 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold';
    bgGradient = 'from-indigo-500/5 via-transparent to-transparent';
    winnerDisplayName = optionB;
  }

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs relative overflow-hidden bg-gradient-to-br ${bgGradient}`}>
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Verdict Card */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-widest rounded-full border ${badgeColor}`}>
              {isTie ? 'Tie' : 'Recommended Choice'}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900">
            {winnerDisplayName}
          </h3>
          <div className="text-xs text-slate-500 font-medium">
            {isTie ? (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                Both options score equally well. Review the trade-offs below.
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Award className={`w-4 h-4 ${winnerTextClass}`} />
                The Tiebreaker model favors Option {isWinnerA ? 'A' : 'B'} for your goals.
              </span>
            )}
          </div>
        </div>

        {/* Big visual Score Icon */}
        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${winnerColor} flex items-center justify-center shadow-xs shrink-0`}>
          {isTie ? (
            <HelpCircle className="w-7 h-7 text-white font-bold" />
          ) : (
            <Zap className="w-7 h-7 text-white fill-current" />
          )}
        </div>
      </div>

      {/* Actionable Key Takeaway in beautiful dark theme card for High Contrast Balanced row feeling */}
      <div className="bg-indigo-950 border border-indigo-900 rounded-xl p-5 mb-6 flex items-start gap-4 text-white shadow-xs">
        <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-emerald-400 shrink-0">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5">AI Tiebreaker Recommendation</h4>
          <p className="text-indigo-50 text-sm md:text-base leading-relaxed font-light">
            {verdict.keyTakeaway}
          </p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deep Tactical Analysis</h4>
        <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-4">
          {verdict.analysis.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-slate-600 font-medium leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
