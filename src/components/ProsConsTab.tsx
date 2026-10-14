import React from 'react';
import { PlusCircle, MinusCircle, AlertCircle } from 'lucide-react';
import { OptionAnalysis } from '../types';

interface ProsConsTabProps {
  optionA: OptionAnalysis;
  optionB: OptionAnalysis;
}

export const ProsConsTab: React.FC<ProsConsTabProps> = ({ optionA, optionB }) => {
  const renderImpactDots = (impact: number, type: 'pro' | 'con') => {
    const dots = [];
    const colorClass = type === 'pro' ? 'bg-emerald-500' : 'bg-rose-500';
    for (let i = 1; i <= 5; i++) {
      dots.push(
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-all ${
            i <= impact ? colorClass : 'bg-slate-200'
          }`}
          title={`Impact Weight: ${impact}/5`}
        />
      );
    }
    return <div className="flex gap-1 items-center">{dots}</div>;
  };

  const renderList = (option: OptionAnalysis, title: string, isOptionA: boolean) => {
    const titleColor = isOptionA ? 'text-emerald-700' : 'text-indigo-700';
    const headerBg = isOptionA ? 'bg-emerald-50/50 text-emerald-900' : 'bg-indigo-50/50 text-indigo-900';
    const borderColor = 'border-slate-200';

    return (
      <div className={`bg-white rounded-xl border ${borderColor} flex-1 shadow-xs overflow-hidden`}>
        {/* Card Header resembling Design HTML structure */}
        <div className={`flex items-center justify-between px-5 py-4 border-b border-slate-200 ${headerBg}`}>
          <h4 className="text-sm font-bold tracking-tight uppercase">
            {option.optionName}
          </h4>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${titleColor}`}>
            {isOptionA ? 'Option A' : 'Option B'}
          </span>
        </div>

        <div className="p-5 space-y-6">
          {/* Pros Section */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 uppercase tracking-widest">
              <PlusCircle className="w-4 h-4" /> Pros
            </h5>
            {option.pros.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No pros identified.</p>
            ) : (
              <div className="space-y-3">
                {option.pros.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50/50 rounded-lg border border-slate-150 hover:border-slate-300 transition-colors group"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="text-slate-800 font-semibold text-xs md:text-sm leading-snug">
                        {item.text}
                      </span>
                      {renderImpactDots(item.impact, 'pro')}
                    </div>
                    {item.description && (
                      <p className="text-slate-500 text-xs leading-relaxed mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cons Section */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold text-rose-600 flex items-center gap-1.5 uppercase tracking-widest">
              <MinusCircle className="w-4 h-4" /> Cons
            </h5>
            {option.cons.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No cons identified.</p>
            ) : (
              <div className="space-y-3">
                {option.cons.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50/50 rounded-lg border border-slate-150 hover:border-slate-300 transition-colors group"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="text-slate-800 font-semibold text-xs md:text-sm leading-snug">
                        {item.text}
                      </span>
                      {renderImpactDots(item.impact, 'con')}
                    </div>
                    {item.description && (
                      <p className="text-slate-500 text-xs leading-relaxed mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-slate-500 bg-white border border-slate-200 px-4 py-2.5 rounded-lg shadow-xs">
        <AlertCircle className="w-4 h-4 text-indigo-500" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Note: Small dots represent impact weight from 1 (minor) to 5 (critical).
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {renderList(optionA, 'Option A', true)}
        {renderList(optionB, 'Option B', false)}
      </div>
    </div>
  );
};
