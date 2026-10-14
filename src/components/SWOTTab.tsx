import React from 'react';
import { ArrowUpRight, AlertTriangle, Lightbulb, ShieldAlert } from 'lucide-react';
import { SWOTAnalysis } from '../types';

interface SWOTTabProps {
  swot: SWOTAnalysis;
}

export const SWOTTab: React.FC<SWOTTabProps> = ({ swot }) => {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-lg mx-auto">
        <h3 className="text-base font-display font-bold text-slate-900 uppercase tracking-widest text-[11px]">
          SWOT Strategic Matrix
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Evaluating the internal advantages, liabilities, external avenues, and critical hazards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:bg-emerald-50/10 transition-all flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-display font-bold text-xs uppercase tracking-wider mb-4">
              <span className="p-1.5 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-600">
                <ArrowUpRight className="w-4 h-4" />
              </span>
              Strengths (Internal / Positive)
            </div>
            <div className="space-y-4">
              {swot.strengths.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <h5 className="text-emerald-950 font-bold text-xs md:text-sm">
                    {item.text}
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-300 hover:bg-amber-50/10 transition-all flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-display font-bold text-xs uppercase tracking-wider mb-4">
              <span className="p-1.5 bg-amber-50 border border-amber-100 rounded-md text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </span>
              Weaknesses (Internal / Negative)
            </div>
            <div className="space-y-4">
              {swot.weaknesses.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <h5 className="text-amber-950 font-bold text-xs md:text-sm">
                    {item.text}
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:bg-indigo-50/10 transition-all flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-indigo-800 font-display font-bold text-xs uppercase tracking-wider mb-4">
              <span className="p-1.5 bg-indigo-50 border border-indigo-100 rounded-md text-indigo-600">
                <Lightbulb className="w-4 h-4" />
              </span>
              Opportunities (External / Positive)
            </div>
            <div className="space-y-4">
              {swot.opportunities.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <h5 className="text-indigo-950 font-bold text-xs md:text-sm">
                    {item.text}
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Threats */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-rose-300 hover:bg-rose-50/10 transition-all flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-rose-800 font-display font-bold text-xs uppercase tracking-wider mb-4">
              <span className="p-1.5 bg-rose-50 border border-rose-100 rounded-md text-rose-600">
                <ShieldAlert className="w-4 h-4" />
              </span>
              Threats (External / Negative)
            </div>
            <div className="space-y-4">
              {swot.threats.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <h5 className="text-rose-950 font-bold text-xs md:text-sm">
                    {item.text}
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
