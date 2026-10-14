import React from 'react';
import { Layers } from 'lucide-react';
import { ComparisonTable } from '../types';

interface ComparisonTabProps {
  comparison: ComparisonTable;
}

export const ComparisonTab: React.FC<ComparisonTabProps> = ({ comparison }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <span className="p-1.5 bg-indigo-50 border border-indigo-150 rounded-md text-indigo-600">
          <Layers className="w-4 h-4" />
        </span>
        <div>
          <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">
            Factor-by-Factor Comparison
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Direct side-by-side assessment across key evaluation metrics.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-mono text-xs uppercase tracking-wider">
              <th className="py-3 px-4 font-bold text-[10px] tracking-widest">Evaluation Factor</th>
              <th className="py-3 px-4 font-bold text-[10px] tracking-widest text-emerald-800 bg-emerald-50/30 border-l border-r border-slate-100">
                {comparison.optionA}
              </th>
              <th className="py-3 px-4 font-bold text-[10px] tracking-widest text-indigo-800 bg-indigo-50/30">
                {comparison.optionB}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
            {comparison.rows.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="py-4 px-4 font-bold text-slate-900 font-display">
                  {row.factor}
                </td>
                <td className="py-4 px-4 text-slate-600 bg-emerald-50/[0.05] border-l border-r border-slate-100 group-hover:bg-emerald-50/20 leading-relaxed font-medium">
                  {row.valA}
                </td>
                <td className="py-4 px-4 text-slate-600 bg-indigo-50/[0.05] group-hover:bg-indigo-50/20 leading-relaxed font-medium">
                  {row.valB}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
