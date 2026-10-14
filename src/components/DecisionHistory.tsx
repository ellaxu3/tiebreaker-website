import React from 'react';
import { History, Trash2, Award, ArrowRight } from 'lucide-react';
import { Decision } from '../types';

interface DecisionHistoryProps {
  history: Decision[];
  onSelect: (decision: Decision) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  activeId?: string;
}

export const DecisionHistory: React.FC<DecisionHistoryProps> = ({
  history,
  onSelect,
  onDelete,
  onClearAll,
  activeId
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 text-center text-slate-400 text-xs shadow-xs">
        <History className="w-8 h-8 mx-auto mb-2 opacity-30 text-indigo-600" />
        <p className="font-mono font-medium">No past tiebreakers yet.</p>
        <p className="text-[10px] text-slate-400 mt-1">Your decision history is stored securely in your browser cache.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col max-h-[600px] shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
            Decision History
          </h3>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClearAll}
          className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-500 hover:underline transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto pr-1 flex-1">
        {history.map((item) => {
          const isActive = item.id === activeId;
          const isWinnerA = item.verdict?.winner === 'Option A';
          const isWinnerB = item.verdict?.winner === 'Option B';
          const isTie = item.verdict?.winner === 'Tie';

          let winnerTag = 'Tie';
          let winnerClass = 'text-amber-700 bg-amber-50 border-amber-200';
          if (isWinnerA) {
            winnerTag = `Winner: ${item.optionA}`;
            winnerClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
          } else if (isWinnerB) {
            winnerTag = `Winner: ${item.optionB}`;
            winnerClass = 'text-indigo-700 bg-indigo-50 border-indigo-200';
          }

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`p-3 rounded-lg border transition-all cursor-pointer text-left group relative ${
                isActive
                  ? 'bg-indigo-50/50 border-indigo-200 border-l-4 border-l-indigo-600 shadow-xs'
                  : 'bg-slate-50/50 border-slate-150 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {item.category || 'General'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                  title="Delete decision"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className={`text-xs md:text-sm font-semibold transition-colors line-clamp-1 mb-2 ${
                isActive ? 'text-indigo-950 font-bold' : 'text-slate-700 group-hover:text-slate-900'
              }`}>
                {item.title}
              </h4>

              {item.verdict && (
                <div className="flex items-center justify-between text-[10px] mt-1 border-t border-slate-100 pt-2">
                  <span className={`px-2 py-0.5 rounded border truncate max-w-[140px] font-mono font-medium ${winnerClass}`}>
                    {winnerTag}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
