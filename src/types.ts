export interface ProsConsItem {
  id: string;
  text: string;
  impact: number; // 1 to 5
  description?: string;
}

export interface OptionAnalysis {
  optionName: string;
  pros: ProsConsItem[];
  cons: ProsConsItem[];
}

export interface SWOTItem {
  text: string;
  detail: string;
}

export interface SWOTAnalysis {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

export interface ComparisonRow {
  factor: string;
  valA: string;
  valB: string;
}

export interface ComparisonTable {
  optionA: string;
  optionB: string;
  rows: ComparisonRow[];
}

export interface ScoringCriterion {
  name: string;
  weight: number; // 1 to 5
  scoreA: number; // 1 to 10
  scoreB: number; // 1 to 10
}

export interface Scorecard {
  criteria: ScoringCriterion[];
}

export interface DecisionVerdict {
  winner: 'Option A' | 'Option B' | 'Tie';
  winnerName: string;
  analysis: string;
  keyTakeaway: string;
}

export interface Decision {
  id: string;
  title: string;
  description?: string;
  optionA: string;
  optionB: string;
  category: string;
  createdAt: string;
  status: 'pending' | 'completed';
  chosenOption?: 'A' | 'B' | 'None';
  
  // AI-generated modules
  prosCons?: {
    optionA: OptionAnalysis;
    optionB: OptionAnalysis;
  };
  swot?: SWOTAnalysis;
  comparison?: ComparisonTable;
  scorecard?: Scorecard;
  verdict?: DecisionVerdict;
}
