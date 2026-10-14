import React from 'react';
import { Target, Star } from 'lucide-react';
import { Scorecard } from '../types';

interface ScorecardTabProps {
  scorecard: Scorecard;
  optionA: string;
  optionB: string;
}

export const ScorecardTab: React.FC<ScorecardTabProps> = ({ scorecard, optionA, optionB }) => {
  // Calculate weighted sums
  let totalWeight = 0;
  let weightedScoreA = 0;
  let weightedScoreB = 0;

  scorecard.criteria.forEach((item) => {
    totalWeight += item.weight;
    weightedScoreA += item.scoreA * item.weight;
    weightedScoreB += item.scoreB * item.weight;
  });

  const maxPossible = totalWeight * 10;
  const finalPercentA = maxPossible > 0 ? Math.round((weightedScoreA / maxPossible) * 100) : 0;
  const finalPercentB = maxPossible > 0 ? Math.round((weightedScoreB / maxPossible) * 100) : 0;

  const isWinnerA = finalPercentA > finalPercentB;
  const isWinnerB = finalPercentB > finalPercentA;

  return (
    <div className="space-y-6">
      {/* Weighted Decision Matrix Title */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-6">
          <span className="p-1.5 bg-indigo-50 border border-indigo-150 rounded-md text-indigo-600">
            <Target className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">
              Weighted Scorecard Calculator
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Quantitative comparison weighted by factor importance (1-5).
            </p>
          </div>
        </div>

        {/* Big visual Score meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-slate-100 pb-6">
          {/* Option A Score card */}
          <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-200 relative">
            {isWinnerA && (
              <span className="absolute top-3 right-3 flex items-center gap-1 text-emerald-700 font-bold text-[10px] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-current" /> Leader
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Option A</span>
            <h4 className="text-sm font-bold text-slate-800 mt-1 mb-3 truncate" title={optionA}>
              {optionA}
            </h4>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-display font-extrabold text-slate-900">{finalPercentA}%</span>
              <span className="text-xs text-slate-400 font-medium">Weighted Utility Score</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${finalPercentA}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">
              <span>Points: {weightedScoreA} / {maxPossible}</span>
              <span>Weight sum: {totalWeight}</span>
            </div>
          </div>

          {/* Option B Score card */}
          <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-200 relative">
            {isWinnerB && (
              <span className="absolute top-3 right-3 flex items-center gap-1 text-indigo-700 font-bold text-[10px] uppercase tracking-wider bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-current" /> Leader
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Option B</span>
            <h4 className="text-sm font-bold text-slate-800 mt-1 mb-3 truncate" title={optionB}>
              {optionB}
            </h4>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-display font-extrabold text-slate-900">{finalPercentB}%</span>
              <span className="text-xs text-slate-400 font-medium">Weighted Utility Score</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${finalPercentB}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">
              <span>Points: {weightedScoreB} / {maxPossible}</span>
              <span>Weight sum: {totalWeight}</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown list */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Criterion Breakdown
          </h4>
          <div className="space-y-4">
            {scorecard.criteria.map((item, index) => {
              const maxScore = 10;
              const pctA = (item.scoreA / maxScore) * 100;
              const pctB = (item.scoreB / maxScore) * 100;

              return (
                <div
                  key={index}
                  className="p-4 bg-slate-50/30 rounded-lg border border-slate-150 space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h5 className="text-sm font-bold text-slate-800">{item.name}</h5>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Weight multiplier: {item.weight}x
                      </span>
                    </div>
                    {/* Weight badge */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < item.weight ? 'bg-amber-500' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Option A bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-500 font-medium text-[11px]">
                        <span>A: {optionA}</span>
                        <span className="text-emerald-700 font-bold">{item.scoreA} / 10</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${pctA}%` }}
                        />
                      </div>
                    </div>

                    {/* Option B bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-500 font-medium text-[11px]">
                        <span>B: {optionB}</span>
                        <span className="text-indigo-700 font-bold">{item.scoreB} / 10</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${pctB}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
