import React, { useState } from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';
import { DECISION_PRESETS } from '../data/presets';

interface DecisionFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    optionA: string;
    optionB: string;
    category: string;
  }) => void;
  isLoading: boolean;
}

const CATEGORIES = [
  'Career & Work',
  'Finance & Investing',
  'Relationships & Life',
  'Purchases & Tech',
  'Business & Startups',
  'Health & Lifestyle',
  'Other'
];

export const DecisionForm: React.FC<DecisionFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleLoadPreset = (preset: typeof DECISION_PRESETS[0]) => {
    setTitle(preset.title || '');
    setDescription(preset.description || '');
    setOptionA(preset.optionA || '');
    setOptionB(preset.optionB || '');
    setCategory(preset.category || CATEGORIES[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !optionA.trim() || !optionB.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      category
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <h2 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        Analyze New Decision
      </h2>

      {/* Preset Buttons */}
      <div className="mb-6">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Or try a classic challenge preset:
        </label>
        <div className="flex flex-wrap gap-2">
          {DECISION_PRESETS.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-left font-medium cursor-pointer"
            >
              {preset.title?.split('?')[0] || preset.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Decision Topic <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Should I accept the job offer in Seattle or stay in Austin?"
            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 text-sm font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="optionA" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Option A <span className="text-rose-500">*</span>
            </label>
            <input
              id="optionA"
              type="text"
              required
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="e.g. Seattle Job"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-emerald-700 font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 text-sm"
            />
          </div>

          <div>
            <label htmlFor="optionB" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Option B <span className="text-rose-500">*</span>
            </label>
            <input
              id="optionB"
              type="text"
              required
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="e.g. Stay in Austin"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-indigo-700 font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label htmlFor="category" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all text-sm font-medium cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            Constraints & Context <span className="text-slate-400 text-[10px] font-normal lowercase">(Optional)</span>
            <span className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-48 bg-slate-900 text-[11px] text-slate-200 p-2 rounded shadow-xl z-50 normal-case font-normal leading-normal">
                Mention key factors like finances, location, emotional ties, or time constraints to get a highly customized evaluation.
              </span>
            </span>
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Seattle pays 20% more but has high cost of living. In Austin I have a great community but fewer growth opportunities."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 text-xs resize-none font-medium leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !title.trim() || !optionA.trim() || !optionB.trim()}
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Deliberating Decision...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-current" />
              Break the Tie
            </>
          )}
        </button>
      </form>
    </div>
  );
};
