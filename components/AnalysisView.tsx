
import React, { useState } from 'react';
import { Upload, X, Play, Loader2, AlertTriangle, CheckCircle, BrainCircuit, Microscope, Zap } from 'lucide-react';
import { Timeframe, ChartImage, AlgoAnalysisResult, KnowledgeResource, TradeSetup } from '../types';
import { analyzeCharts } from '../services/geminiService';

interface AnalysisViewProps {
  onSaveTrade: (result: AlgoAnalysisResult) => void;
  resources: KnowledgeResource[];
  tradeHistory: TradeSetup[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ onSaveTrade, resources, tradeHistory }) => {
  const [images, setImages] = useState<ChartImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AlgoAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeResources = resources.filter(r => r.status === 'LEARNED');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, timeframe: Timeframe) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImages(prev => {
        const filtered = prev.filter(img => img.timeframe !== timeframe);
        return [...filtered, { timeframe, data: base64 }];
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (timeframe: Timeframe) => {
    setImages(prev => prev.filter(img => img.timeframe !== timeframe));
  };

  const runAnalysis = async () => {
    if (images.length === 0) {
      setError("Please upload at least one chart.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCharts(images, activeResources, tradeHistory);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const requiredTimeframes = [Timeframe.M, Timeframe.W, Timeframe.D, Timeframe.H4, Timeframe.H1, Timeframe.M15, Timeframe.M5, Timeframe.M1];

  return (
    <div className="p-4 md:p-8 flex flex-col min-h-full">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Market Analysis</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-gray-400 text-sm">Upload multi-timeframe for deep analysis.</p>
            {activeResources.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-ict-accent bg-green-900/20 px-2 py-0.5 rounded border border-green-500/30 font-bold uppercase tracking-wider">
                    <BrainCircuit className="w-3 h-3" />
                    AI Memory: {activeResources.length}
                </span>
            )}
            <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded border border-blue-500/30 font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3" />
                Learning Mode Active
            </span>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-6 py-4 md:py-3 rounded-xl font-black transition-all text-sm uppercase tracking-widest ${
            loading 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-ict-accent text-black hover:bg-green-400 shadow-[0_0_20px_rgba(0,255,157,0.3)]'
          }`}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          {loading ? 'AI IS THINKING...' : 'Start Analysis'}
        </button>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-200 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 space-y-4">
            <div className="grid grid-cols-2 gap-3">
            {requiredTimeframes.map((tf) => {
                const img = images.find(i => i.timeframe === tf);
                return (
                <div key={tf} className="relative aspect-video bg-gray-900 border border-gray-800 rounded-xl flex flex-col items-center justify-center group overflow-hidden">
                    {img ? (
                    <>
                        <img src={img.data} alt={tf} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        <button 
                        onClick={() => removeImage(tf)}
                        className="absolute top-2 right-2 bg-black/80 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors"
                        >
                        <X className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 text-[10px] font-black text-ict-accent rounded uppercase tracking-tighter">
                        {tf}
                        </span>
                    </>
                    ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-ict-accent hover:bg-gray-800 transition-all">
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{tf}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, tf)} />
                    </label>
                    )}
                </div>
                );
            })}
            </div>
        </div>

        <div className="lg:w-2/3 bg-ict-panel border border-gray-800 rounded-3xl p-6 md:p-8 overflow-hidden flex flex-col min-h-[400px]">
            {!result && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-700 text-center px-4">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                      <Microscope className="w-8 h-8 opacity-40" />
                    </div>
                    <p className="font-bold text-sm uppercase tracking-widest mb-1">Waiting for Data</p>
                    <p className="text-xs text-gray-600 max-w-xs">Upload your charts. AI will learn from your past {tradeHistory.length} outcomes to refine this analysis.</p>
                </div>
            )}
            
            {loading && (
                <div className="space-y-6 animate-pulse flex-1 flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-ict-accent/10 border-t-ict-accent rounded-full animate-spin"></div>
                      <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-ict-accent animate-pulse" />
                    </div>
                    <div className="text-center space-y-2 mt-4">
                      <p className="text-lg font-black text-white italic uppercase tracking-[0.2em]">Deep Learning Loop</p>
                      <p className="text-[10px] text-ict-accent font-black uppercase tracking-widest">Integrating Performance History...</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">ALGO BIAS</h3>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest border ${
                                result.bias === 'BULLISH' ? 'bg-green-900/20 text-green-400 border-green-500/30' :
                                result.bias === 'BEARISH' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
                                'bg-gray-800 text-gray-400 border-gray-700'
                            }`}>
                                {result.bias}
                            </span>
                        </div>
                        {result.setup.valid ? (
                            <div className="flex items-center gap-2 text-ict-accent bg-ict-accent/10 px-3 py-1 rounded-full border border-ict-accent/30 self-start sm:self-auto">
                                <CheckCircle className="w-4 h-4" /> 
                                <span className="text-[10px] font-black uppercase tracking-widest">SETUP VALID</span>
                            </div>
                        ) : (
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-3 py-1 bg-gray-900 rounded-full border border-gray-800">
                                NO TRADE DETECTED
                            </span>
                        )}
                    </div>

                    <div className="bg-gray-900/40 p-5 rounded-2xl border border-gray-800 relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-[8px] font-black text-blue-400/50 uppercase tracking-widest">Adaptive Analysis v3.2</div>
                        <h4 className="text-xs font-black text-ict-accent uppercase tracking-widest mb-3">Narrative & Performance Alignment</h4>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{result.narrative}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {result.conceptsFound.map((concept, idx) => (
                            <span key={idx} className="bg-blue-900/10 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
                                {concept}
                            </span>
                        ))}
                    </div>

                    {result.setup.valid && (
                        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-3xl p-6 mt-4 shadow-2xl">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 pb-2 border-b border-gray-800 flex items-center gap-2">
                              Execution Parameters
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 uppercase font-black">Entry</p>
                                    <p className="text-lg font-mono font-black text-white">{result.setup.entry}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 uppercase font-black">Stop Loss</p>
                                    <p className="text-lg font-mono font-black text-ict-loss">{result.setup.sl}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 uppercase font-black">Take Profit</p>
                                    <p className="text-lg font-mono font-black text-ict-accent">{result.setup.tp}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 uppercase font-black">Risk Reward</p>
                                    <p className="text-lg font-mono font-black text-blue-400">
                                        1:{((Math.abs((result.setup.tp || 0) - (result.setup.entry || 0))) / (Math.max(0.0001, Math.abs((result.setup.entry || 0) - (result.setup.sl || 1))))).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-800">
                                <p className="text-xs text-gray-400 leading-relaxed">
                                  <span className="text-white font-black uppercase mr-2 tracking-widest">AI Logic:</span> 
                                  {result.setup.reasoning}
                                </p>
                            </div>
                            <button 
                              onClick={() => onSaveTrade(result)} 
                              className="mt-8 w-full py-4 bg-white/5 hover:bg-ict-accent hover:text-black border border-white/10 rounded-2xl text-white font-black transition-all text-xs uppercase tracking-widest active:scale-95"
                            >
                                SAVE TO JOURNAL
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
