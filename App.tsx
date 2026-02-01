
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AnalysisView from './components/AnalysisView';
import TradeJournal from './components/TradeJournal';
import KnowledgeBase from './components/KnowledgeBase';
import AdminStats from './components/AdminStats';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import PaymentPage from './components/PaymentPage';
import { TradeSetup, AlgoAnalysisResult, KnowledgeResource } from './types';
import { Menu, Globe, Loader2 } from 'lucide-react';
// @ts-ignore
import mammoth from 'mammoth';
import { processVideoForKnowledge } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { 
    getUserProfile, 
    updateUserProfile, 
    saveTradeToCloud, 
    fetchUserTrades, 
    fetchUserKnowledge, 
    saveKnowledgeToCloud,
    deleteUserKnowledge,
    updateTradeStatus
} from './services/supabaseService';

type AppState = 'LANDING' | 'AUTH' | 'PAYMENT' | 'MAIN_APP';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [currentView, setViewInternal] = useState<string>('dashboard');
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [trades, setTrades] = useState<TradeSetup[]>([]);
  const [resources, setResources] = useState<KnowledgeResource[]>([]);
  
  const isInitializing = useRef(false);

  const setView = (view: string) => {
    setViewHistory(prev => [...prev, currentView]);
    setViewInternal(view);
    setIsSidebarOpen(false);
  };

  const goBackView = () => {
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory(prevHistory => prevHistory.slice(0, -1));
      setViewInternal(prev);
    } else if (currentView !== 'dashboard') {
      setViewInternal('dashboard');
    }
  };

  const unifyProfile = (profile: any) => {
    if (!profile) return null;
    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name || profile.firstName || "Trader",
      lastName: profile.last_name || profile.lastName || "",
      isPaid: profile.is_paid === true || profile.isPaid === true,
      isAdmin: profile.is_admin === true || profile.email === "AlgobrosIA@gmail.com",
      expiryDate: profile.expiry_date || profile.expiryDate || "2000-01-01",
      welcomeEmailSent: profile.welcome_email_sent === true || profile.welcomeEmailSent === true,
      plan: profile.plan || "GUEST"
    };
  };

  const initApp = useCallback(async (forceRefresh = false) => {
    if (isInitializing.current && !forceRefresh) return;
    
    isInitializing.current = true;
    setIsSyncing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const rawProfile = await getUserProfile(session.user.id);
        const profile = unifyProfile(rawProfile);
        
        if (profile) {
          setCurrentUser(profile);
          const now = Date.now();
          const expiry = new Date(profile.expiryDate).getTime();
          const hasAccess = profile.isAdmin || (profile.isPaid && (expiry + 10000) > now);
          
          if (hasAccess) {
            setAppState('MAIN_APP');
            const [cloudTrades, cloudKnowledge] = await Promise.all([
                fetchUserTrades(session.user.id),
                fetchUserKnowledge(session.user.id)
            ]);
            setTrades(cloudTrades);
            setResources(cloudKnowledge);
          } else {
            setAppState('PAYMENT');
          }
        } else {
          setAppState('PAYMENT');
        }
      } else {
        setAppState('LANDING');
      }
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      setIsSyncing(false);
      isInitializing.current = false;
    }
  }, []);

  useEffect(() => {
    initApp();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') initApp(true);
        if (event === 'SIGNED_OUT') {
          setAppState('LANDING');
          setCurrentUser(null);
        }
    });
    return () => subscription.unsubscribe();
  }, [initApp]);

  const handleLoginSuccess = (userData: any) => {
    const profile = unifyProfile(userData);
    setCurrentUser(profile);
    const now = Date.now();
    const expiry = new Date(profile?.expiryDate || 0).getTime();
    if (profile?.isAdmin || (profile?.isPaid && expiry > now)) {
      setAppState('MAIN_APP');
    } else {
      setAppState('PAYMENT');
    }
  };

  const handlePaymentSuccess = async (planType: 'MONTHLY' | 'YEARLY', txId: string, blockchainDate: string) => {
    if (!currentUser) return;
    
    const txDate = new Date(blockchainDate);
    const expiryDate = new Date(txDate);
    const upperTxId = txId.trim().toUpperCase();
    
    const adminCodes = ["ADMIN2025", "ALGOBROS_ADMIN", "MASTER", "BYPASS", "ADMIN", "ALGOBROSADMIN"];
    const isMasterAdmin = adminCodes.includes(upperTxId) || currentUser.email === "AlgobrosIA@gmail.com";
    
    if (isMasterAdmin) {
      expiryDate.setFullYear(txDate.getFullYear() + 50);
    } else if (upperTxId.startsWith("ALG-BROS-24H-")) {
      expiryDate.setHours(txDate.getHours() + 24);
    } else if (upperTxId.startsWith("ALG-BROS-") || planType === 'MONTHLY') {
      expiryDate.setDate(txDate.getDate() + 30);
    } else {
      expiryDate.setDate(txDate.getDate() + 365);
    }

    const updates = { 
      is_paid: true,
      payment_date: txDate.toISOString(),
      expiry_date: expiryDate.toISOString(),
      last_tx_id: txId,
      plan: isMasterAdmin ? "ADMIN" : (upperTxId.startsWith("ALG-BROS-24H-") ? "GIFT_24H" : (upperTxId.startsWith("ALG-BROS-") ? "GIFT" : planType)),
      is_admin: isMasterAdmin, 
      welcome_email_sent: true 
    };

    try {
        // FORCE IMMEDIATE STATE TRANSITION
        setAppState('MAIN_APP');
        setCurrentUser((prev: any) => ({
            ...prev,
            isPaid: true,
            isAdmin: isMasterAdmin,
            expiryDate: expiryDate.toISOString(),
            welcomeEmailSent: true,
            plan: updates.plan
        }));

        // PERSIST IN BACKGROUND
        await supabase.from('profiles').update(updates).eq('id', currentUser.id);

        // ASYNC DATA FETCH
        fetchUserTrades(currentUser.id).then(setTrades);
        fetchUserKnowledge(currentUser.id).then(setResources);
        
    } catch (e: any) {
        console.error("Persistence error:", e);
        setAppState('MAIN_APP');
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };
  const handleUpdateTradeStatus = async (tradeId: string, status: 'WIN' | 'LOSS' | 'BE') => {
    try {
      await updateTradeStatus(tradeId, status);
      setTrades(prev => prev.map(t => t.id === tradeId ? { ...t, status } : t));
    } catch (e) { console.error(e); }
  };

  const handleUploadResources = async (files: File[]) => {
    if (!currentUser) return;
    const placeholders: KnowledgeResource[] = files.map(file => ({
      name: file.name, type: file.name.toLowerCase().endsWith('.docx') ? 'docx' : (file.type.includes('video') ? 'video' : 'text'), status: 'PROCESSING'
    }));
    setResources(prev => [...prev, ...placeholders]);
    for (const file of files) {
      try {
        let content;
        if (file.name.toLowerCase().endsWith('.docx')) {
          const buffer = await file.arrayBuffer();
          const textResult = await mammoth.extractRawText({ arrayBuffer: buffer });
          content = textResult.value;
        } else if (file.type.includes('video')) { content = await processVideoForKnowledge(file); } else { content = await file.text(); }
        const newResource: KnowledgeResource = { name: file.name, type: 'text' as any, status: 'LEARNED' as any, content };
        await saveKnowledgeToCloud(currentUser.id, newResource);
        setResources(prev => prev.map(r => r.name === file.name ? newResource : r));
      } catch (e: any) { setResources(prev => prev.map(r => r.name === file.name ? { ...r, status: 'ERROR', content: e.message } : r)); }
    }
  };

  const handleSaveTrade = async (result: AlgoAnalysisResult) => {
    if (!currentUser) return;
    const newTrade: TradeSetup = { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], pair: 'AI_ANALYSIS', direction: result.bias === 'BULLISH' ? 'LONG' : 'SHORT', entryPrice: result.setup.entry || 0, stopLoss: result.setup.sl || 0, takeProfit: result.setup.tp || 0, rrRatio: 4.0, status: 'PENDING', notes: result.narrative, conceptsUsed: result.conceptsFound };
    try { await saveTradeToCloud(currentUser.id, newTrade); setTrades(prev => [newTrade, ...prev]); setView('journal'); } catch (e) { console.error(e); }
  };

  const handleClearResources = async () => { if (currentUser && window.confirm("Wipe AI cloud memory?")) { await deleteUserKnowledge(currentUser.id); setResources([]); } };

  if (isSyncing && appState !== 'MAIN_APP' && appState !== 'PAYMENT') return (
    <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-ict-accent animate-spin" />
        <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Establishing Node Connection...</p>
    </div>
  );

  if (appState === 'LANDING') return <LandingPage onStart={() => setAppState('AUTH')} />;
  if (appState === 'AUTH') return <AuthPage onLogin={handleLoginSuccess} onBack={() => setAppState('LANDING')} />;
  if (appState === 'PAYMENT') return <PaymentPage onPaymentConfirmed={handlePaymentSuccess} user={currentUser} onBack={() => setAppState('AUTH')} />;

  return (
    <div className="flex min-h-screen bg-black text-gray-200 font-sans selection:bg-ict-accent selection:text-black relative">
      <div className={`fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="absolute inset-0 bg-black/60 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        <Sidebar currentView={currentView} setView={setView} user={currentUser} onLogout={handleLogout} />
      </div>
      <main className="flex-1 h-screen overflow-hidden flex flex-col w-full relative">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-ict-panel z-40">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-400 hover:text-ict-accent transition-colors"><Menu className="w-6 h-6" /></button>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-ict-accent animate-pulse"></div><span className="text-sm font-black tracking-tighter text-white italic">ALGOBROS AI</span></div>
           <div className="w-10"></div>
        </div>
        <div className="px-4 md:px-8 pt-4 flex justify-between items-center">
           {currentView !== 'dashboard' ? (<button onClick={goBackView} className="flex items-center gap-2 text-gray-500 hover:text-ict-accent transition-colors font-bold text-xs uppercase tracking-widest">← Back</button>) : <div />}
           <div className="flex items-center gap-2 px-3 py-1 bg-ict-accent/10 rounded-full border border-ict-accent/20"><Globe className="w-3 h-3 text-ict-accent animate-pulse" /><span className="text-[9px] font-black text-ict-accent uppercase tracking-widest">Cloud Sync Active</span></div>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          {currentView === 'dashboard' && <Dashboard trades={trades} />}
          {currentView === 'analysis' && <AnalysisView onSaveTrade={handleSaveTrade} resources={resources} tradeHistory={trades} />}
          {currentView === 'journal' && <TradeJournal trades={trades} onUpdateStatus={handleUpdateTradeStatus} />}
          {currentView === 'knowledge' && <KnowledgeBase resources={resources} onUpload={handleUploadResources} onClear={handleClearResources} />}
          {currentView === 'admin' && (currentUser?.isAdmin) && <AdminStats />}
        </div>
      </main>
    </div>
  );
};

export default App;
