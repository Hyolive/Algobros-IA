
import React from 'react';
import { LayoutDashboard, Microscope, BookOpen, History, BrainCircuit, LogOut, User, ShieldCheck, Clock } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  user?: any;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Performance' },
    { id: 'analysis', icon: Microscope, label: 'Market Analysis' },
    { id: 'journal', icon: History, label: 'Trade Journal' },
    { id: 'knowledge', icon: BookOpen, label: 'Knowledge Base' },
  ];

  const getTimeRemaining = () => {
    if (!user?.expiryDate || user?.isAdmin) return null;
    const expiry = new Date(user.expiryDate).getTime();
    const now = new Date().getTime();
    const diff = expiry - now;
    
    if (diff <= 0) return "EXPIRED";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}j restants`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h restantes`;
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="w-64 h-full bg-ict-panel border-r border-gray-800 flex flex-col relative z-50">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <BrainCircuit className="w-8 h-8 text-ict-accent" />
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-ict-text">ALGOBROS</h1>
          <span className="text-[10px] text-ict-accent tracking-widest uppercase font-bold">AI Mentor</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-gray-800 text-ict-accent border-l-4 border-ict-accent'
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}

        {user?.isAdmin && (
          <button
            onClick={() => setView('admin')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mt-8 transition-all duration-200 ${
              currentView === 'admin'
                ? 'bg-ict-accent/10 text-ict-accent border-l-4 border-ict-accent'
                : 'text-gray-600 hover:bg-gray-900 hover:text-ict-accent'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Admin Stats</span>
          </button>
        )}
      </nav>

      <div className="p-4 border-t border-gray-800 bg-ict-panel mt-auto">
        {user && (
          <div className="bg-black/40 rounded-2xl p-4 border border-gray-800 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-ict-accent/20 flex items-center justify-center border border-ict-accent/30">
                <User className="w-4 h-4 text-ict-accent" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-gray-500 font-bold truncate">{user.email}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px] text-ict-accent font-black tracking-widest uppercase">
                    {user.isAdmin ? 'MASTER ADMIN' : 'PREMIUM'}
                  </p>
                  {timeRemaining && !user.isAdmin && (
                    <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold">
                       <Clock className="w-2.5 h-2.5" />
                       {timeRemaining}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors border-t border-gray-800/50 mt-2 pt-2"
            >
              <LogOut className="w-3 h-3" /> Log Out
            </button>
          </div>
        )}

        <div className="bg-black/40 rounded-xl p-4 text-[10px] text-gray-500 font-mono border border-gray-800">
          <p className="flex justify-between font-bold">STATUS: <span className="text-ict-accent">ENCRYPTED</span></p>
          <p className="mt-2 flex justify-between font-bold">MODEL: <span>v3.1 PRO</span></p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
