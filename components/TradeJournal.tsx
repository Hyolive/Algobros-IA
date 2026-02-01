
import React from 'react';
import { TradeSetup } from '../types';
import { Calendar, ArrowUpCircle, ArrowDownCircle, Target, ShieldAlert, CheckCircle2, XCircle, Slash } from 'lucide-react';

interface TradeJournalProps {
  trades: TradeSetup[];
  onUpdateStatus?: (tradeId: string, status: 'WIN' | 'LOSS' | 'BE') => void;
}

const TradeJournal: React.FC<TradeJournalProps> = ({ trades, onUpdateStatus }) => {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Trade Journal</h2>
        <p className="text-gray-400 text-sm md:text-base mt-1">Cloud historical record with recursive learning.</p>
      </header>

      <div className="md:hidden bg-ict-accent/5 border border-ict-accent/20 p-4 rounded-2xl flex items-start gap-3 mb-6">
        <ShieldAlert className="w-5 h-5 text-ict-accent shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-300 font-medium">
          Outcome required: Set result to <span className="text-white font-bold">WIN or LOSS</span> so the AI can learn from the setup.
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-ict-panel rounded-xl border border-gray-800 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-800">
            <tr>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">RR</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Action / Status</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="p-4 text-gray-300 font-mono text-sm">{trade.date}</td>
                <td className="p-4 text-white font-bold">{trade.pair}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded ${
                    trade.direction === 'LONG' ? 'bg-green-900/30 text-green-400 border border-green-500/20' : 'bg-red-900/30 text-red-400 border border-red-500/20'
                  }`}>
                    {trade.direction === 'LONG' ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                    {trade.direction}
                  </span>
                </td>
                <td className="p-4 text-gray-300 font-mono text-sm">{trade.entryPrice}</td>
                <td className="p-4 text-gray-300 text-sm">1:{trade.rrRatio}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    {trade.status === 'PENDING' ? (
                      <>
                        <button onClick={() => onUpdateStatus?.(trade.id, 'WIN')} className="p-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500 hover:text-black transition-all" title="Mark Win">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onUpdateStatus?.(trade.id, 'LOSS')} className="p-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Mark Loss">
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => onUpdateStatus?.(trade.id, 'BE')} className="p-1.5 bg-gray-500/10 text-gray-500 border border-gray-500/20 rounded-lg hover:bg-gray-500 hover:text-white transition-all" title="Mark Break-Even">
                          <Slash className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                        trade.status === 'WIN' ? 'bg-ict-accent/20 text-ict-accent border border-ict-accent/30' : 
                        trade.status === 'LOSS' ? 'bg-red-900/20 text-red-400 border border-red-500/30' : 
                        'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                        {trade.status}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  {trade.status === 'WIN' && <span className="text-ict-accent font-black tracking-tight">+ {trade.rrRatio}R</span>}
                  {trade.status === 'LOSS' && <span className="text-ict-loss font-black tracking-tight">- 1.00R</span>}
                  {trade.status === 'BE' && <span className="text-gray-400 font-black tracking-tight">0.00R</span>}
                  {trade.status === 'PENDING' && <span className="text-gray-600 font-mono italic text-[10px]">ACTIVE...</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {trades.map((trade) => (
          <div key={trade.id} className="bg-ict-panel border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${trade.direction === 'LONG' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-white font-black text-lg tracking-tight">{trade.pair}</span>
                <span className="text-gray-500 text-[10px] font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {trade.date}
                </span>
              </div>
              <div className="flex gap-2">
                {trade.status === 'PENDING' ? (
                  <div className="flex gap-1.5">
                    <button onClick={() => onUpdateStatus?.(trade.id, 'WIN')} className="px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md text-[9px] font-black">WIN</button>
                    <button onClick={() => onUpdateStatus?.(trade.id, 'LOSS')} className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md text-[9px] font-black">LOSS</button>
                  </div>
                ) : (
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                    trade.status === 'WIN' ? 'bg-ict-accent/10 text-ict-accent border-ict-accent/30' : 
                    trade.status === 'LOSS' ? 'bg-red-900/10 text-red-400 border-red-500/30' : 
                    'bg-gray-800 text-gray-400 border-gray-700'
                  }`}>
                    {trade.status}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Execution</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black flex items-center gap-1 ${trade.direction === 'LONG' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.direction === 'LONG' ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                    {trade.direction}
                  </span>
                  <span className="text-xs text-gray-300 font-mono">@ {trade.entryPrice}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Net Outcome</p>
                {trade.status === 'WIN' ? (
                  <span className="text-ict-accent font-black text-sm tracking-tight">+ {trade.rrRatio}R</span>
                ) : trade.status === 'LOSS' ? (
                  <span className="text-ict-loss font-black text-sm tracking-tight">- 1.00R</span>
                ) : (
                  <span className="text-gray-500 text-sm font-mono italic">Running...</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {trades.length === 0 && (
        <div className="bg-ict-panel border border-gray-800 border-dashed rounded-2xl p-12 text-center">
          <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-500 font-medium">Cloud Journal Empty.</p>
          <p className="text-xs text-gray-600 mt-1">AI learning loop will activate once data is recorded.</p>
        </div>
      )}
    </div>
  );
};

export default TradeJournal;
