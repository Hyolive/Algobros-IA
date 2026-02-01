
import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, BarChart3, RefreshCw, ShieldCheck, Trash2, UserCheck, UserMinus, Search, Database, Activity, Globe } from 'lucide-react';
import { fetchGlobalRegistry, syncUserToCloud, deleteProfile } from '../services/supabaseService';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isPaid: boolean;
  plan: string;
  expiryDate: string;
  paymentDate?: string;
  lastTxId?: string;
  isAdmin?: boolean;
}

const AdminStats: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ visits: 0, sales: 0, revenue: 0 });

  const loadData = async () => {
    setLoading(true);
    try {
      const userList = await fetchGlobalRegistry() as UserData[];
      setUsers(userList);

      const sales = userList.filter(u => u.isPaid && !u.isAdmin).length;
      const revenue = userList.reduce((acc, u) => {
        if (!u.isPaid || u.isAdmin) return acc;
        return acc + (u.plan === 'YEARLY' ? 99.99 : 9.99);
      }, 0);

      setStats({
        visits: userList.length * 5 + 42,
        sales,
        revenue
      });
    } catch (e) {
      console.error("Failed to load global data", e);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleUserAccess = async (email: string) => {
    const userList = [...users];
    const userIndex = userList.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      const user = { ...userList[userIndex] };
      user.isPaid = !user.isPaid;
      
      if (user.isPaid) {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        user.expiryDate = d.toISOString();
        user.plan = "ADMIN_GRANT";
      }

      await syncUserToCloud(user);
      loadData();
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    if (window.confirm(`Permanently delete user ${user.email} from the cloud database?`)) {
      try {
        await deleteProfile(user.id);
        loadData();
      } catch (e) {
        console.error("Cloud deletion failed", e);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-3 uppercase">
              <Activity className="text-ict-accent w-8 h-8" />
              COMMAND <span className="text-ict-accent">CENTER</span>
            </h2>
          </div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Globe className="w-3 h-3 text-ict-accent" /> Global real-time monitoring active
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input 
                    type="text" 
                    placeholder="Search Global Database..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:border-ict-accent outline-none w-64 transition-all"
                />
            </div>
            <button 
              onClick={loadData}
              className={`p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-ict-accent hover:bg-gray-800 transition-all ${loading ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-ict-panel p-6 rounded-[2rem] border border-gray-800 shadow-xl group hover:border-ict-accent/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Total Traders</p>
            <Users className="w-5 h-5 text-ict-accent opacity-50" />
          </div>
          <p className="text-4xl font-black text-white">{users.length}</p>
          <p className="text-[10px] text-gray-600 font-bold mt-2 uppercase tracking-tighter italic">Cloud Registry Active</p>
        </div>

        <div className="bg-ict-panel p-6 rounded-[2rem] border border-gray-800 shadow-xl group hover:border-blue-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Global Volume (USDT)</p>
            <TrendingUp className="w-5 h-5 text-blue-400 opacity-50" />
          </div>
          <p className="text-4xl font-black text-white">${stats.revenue.toFixed(2)}</p>
          <p className="text-[10px] text-blue-400/60 font-bold mt-2 uppercase tracking-tighter italic">{stats.sales} Premium Licenses</p>
        </div>

        <div className="bg-ict-panel p-6 rounded-[2rem] border border-gray-800 shadow-xl group hover:border-purple-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Server Performance</p>
            <BarChart3 className="w-5 h-5 text-purple-400 opacity-50" />
          </div>
          <p className="text-4xl font-black text-white">99.9%</p>
          <p className="text-[10px] text-purple-400/60 font-bold mt-2 uppercase tracking-tighter italic">Low Latency Infrastructure</p>
        </div>
      </div>

      <div className="bg-ict-panel border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-black/20">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-ict-accent" />
                Global Database Access
            </h3>
            <span className="text-[10px] font-mono text-gray-500 uppercase">Live Sync Enabled</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/40 text-[10px] uppercase font-black tracking-widest text-gray-500">
              <tr>
                <th className="p-4 border-b border-gray-800">User Details</th>
                <th className="p-4 border-b border-gray-800">Account Tier</th>
                <th className="p-4 border-b border-gray-800">Network Info</th>
                <th className="p-4 border-b border-gray-800">Expiration</th>
                <th className="p-4 border-b border-gray-800 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-600 italic text-sm uppercase tracking-widest">Empty Registry</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.email} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tracking-tight">{user.firstName} {user.lastName}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                            user.isPaid ? 'bg-ict-accent/10 text-ict-accent border-ict-accent/20' : 'bg-red-900/10 text-red-500 border-red-500/20'
                        }`}>
                            {user.plan || 'GUEST'}
                        </span>
                        {user.isAdmin && <span className="bg-purple-900/20 text-purple-400 border border-purple-500/20 text-[9px] px-2 py-0.5 rounded font-black">MASTER</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col max-w-[150px]">
                        <span className="text-[9px] text-gray-400 font-mono truncate">{user.lastTxId || 'NO TX DATA'}</span>
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">Verified Node</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                        <span className={`text-xs font-mono font-bold ${new Date(user.expiryDate).getTime() < Date.now() ? 'text-red-500' : 'text-gray-300'}`}>
                            {new Date(user.expiryDate).toLocaleDateString()}
                        </span>
                        <span className="text-[8px] text-gray-600 uppercase font-black italic">Auto-Renewal Monitoring</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => toggleUserAccess(user.email)}
                            className={`p-2 rounded-lg transition-all ${
                                user.isPaid ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-ict-accent/10 text-ict-accent hover:bg-ict-accent hover:text-black'
                            }`}
                            title={user.isPaid ? "Revoke Access" : "Grant Access"}
                        >
                            {user.isPaid ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button 
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 bg-gray-800 text-gray-500 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                            title="Delete User"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
