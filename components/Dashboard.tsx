
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TradeSetup } from '../types';
import { FileDown, CheckCircle, Zap, ShieldAlert } from 'lucide-react';
import { STRATEGY_FILES } from '../constants/strategyFiles';

interface DashboardProps {
  trades: TradeSetup[];
}

const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.status === 'WIN').length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : '0.0';
  
  const data = trades.map((t, i) => ({
    name: `T${i + 1}`,
    pnl: t.status === 'WIN' ? t.rrRatio : t.status === 'LOSS' ? -1 : 0
  }));

  const downloadFile = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Performance</h2>
          <p className="text-gray-400 text-sm">Deep dive into your trading metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-ict-accent/10 border border-ict-accent/30 px-4 py-2 rounded-full">
            <Zap className="w-3 h-3 text-ict-accent fill-ict-accent" />
            <span className="text-[9px] font-black text-ict-accent uppercase tracking-[0.2em]">Premium Active</span>
        </div>
      </header>

      {/* Sustainability Advice Alert */}
      <div className="bg-ict-accent/5 border border-ict-accent/20 p-5 md:p-6 rounded-[2rem] flex items-center gap-4 md:gap-6 animate-in fade-in slide-in-from-top-4 duration-700 shadow-xl shadow-ict-accent/5">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-ict-accent/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-ict-accent" />
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] md:text-xs font-black text-ict-accent uppercase tracking-[0.2em] mb-1">Algorithmic Discipline</h4>
            <p className="text-gray-300 text-xs md:text-sm font-medium leading-relaxed">
              Sustainability notice: Strictly recommend a <span className="text-white font-bold">MAX OF 2 TRADES PER DAY</span>. High-probability results require extreme selective focus.
            </p>
          </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-ict-panel p-5 rounded-2xl border border-gray-800 shadow-lg">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Win Rate</p>
          <p className="text-2xl md:text-4xl font-black text-ict-accent mt-1">{winRate}%</p>
        </div>
        <div className="bg-ict-panel p-5 rounded-2xl border border-gray-800 shadow-lg">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Trades</p>
          <p className="text-2xl md:text-4xl font-black text-white mt-1">{totalTrades}</p>
        </div>
        <div className="bg-ict-panel p-5 rounded-2xl border border-gray-800 shadow-lg">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Avg RR</p>
          <p className="text-2xl md:text-4xl font-black text-blue-400 mt-1">1:4.2</p>
        </div>
        <div className="bg-ict-panel p-5 rounded-2xl border border-gray-800 shadow-lg">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Net R</p>
          <p className="text-2xl md:text-4xl font-black text-purple-400 mt-1">+{data.reduce((acc, curr) => acc + curr.pnl, 0)}R</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-ict-panel p-6 rounded-2xl border border-gray-800 min-h-[300px] md:h-96 shadow-xl">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">PnL Curve (R-Multiple)</h3>
            <div className="h-[200px] md:h-[calc(100%-2.5rem)]">
              <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} tickMargin={10} />
                  <YAxis stroke="#666" fontSize={10} />
                  <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px' }}
                  cursor={{ fill: '#222' }}
                  />
                  <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#00ff9d' : '#ff3333'} />
                  ))}
                  </Bar>
              </BarChart>
              </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-ict-panel p-6 rounded-2xl border border-gray-800 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Resources</h3>
                <span className="text-[9px] font-black text-ict-accent bg-ict-accent/10 px-2 py-0.5 rounded-full border border-ict-accent/30 flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> SENT
                </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                Your algorithmic models are dispatched to your email. Download backup copies here.
            </p>
            <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar flex-1 max-h-60 lg:max-h-none">
                {STRATEGY_FILES.map((file, i) => (
                    <button 
                        key={i} 
                        onClick={() => downloadFile(file.name, file.content)}
                        className="w-full flex items-center justify-between p-4 bg-black/40 border border-gray-800 rounded-xl hover:border-ict-accent hover:bg-ict-accent/5 transition-all group active:scale-95"
                    >
                        <div className="flex flex-col text-left overflow-hidden">
                            <span className="text-xs font-black text-gray-300 truncate group-hover:text-white uppercase tracking-tighter">{file.name.replace('.txt', '')}</span>
                            <span className="text-[9px] text-gray-600 font-mono font-bold">BACKUP DOC</span>
                        </div>
                        <FileDown className="w-4 h-4 text-gray-600 group-hover:text-ict-accent transition-colors" />
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
