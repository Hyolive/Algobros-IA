
export enum Timeframe {
  M = '1M',
  W = '1W',
  D = '1D',
  H4 = '4H',
  H1 = '1H',
  M15 = '15min',
  M5 = '5min',
  M1 = '1min'
}

export interface TradeSetup {
  id: string;
  date: string;
  pair: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  rrRatio: number;
  status: 'PENDING' | 'WIN' | 'LOSS' | 'BE';
  notes: string;
  conceptsUsed: string[];
}

export interface AlgoAnalysisResult {
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  narrative: string;
  setup: {
    valid: boolean;
    entry?: number;
    sl?: number;
    tp?: number;
    reasoning?: string;
  };
  conceptsFound: string[];
}

export interface ChartImage {
  timeframe: Timeframe;
  data: string;
}

export interface KnowledgeResource {
  name: string;
  type: 'video' | 'pdf' | 'image' | 'text' | 'docx';
  status: 'LEARNED' | 'PROCESSING' | 'ERROR';
  content?: string;
}
