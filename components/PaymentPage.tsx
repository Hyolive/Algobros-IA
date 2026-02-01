
import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Zap, UserCircle, ArrowLeft, Lock, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import { sendStrategyEmail, sendAdminNotification } from '../services/emailService';

interface PaymentPageProps {
  onPaymentConfirmed: (planType: 'MONTHLY' | 'YEARLY', txId: string, blockchainDate: string) => void;
  user?: any;
  onBack?: () => void;
}

type PaymentStatus = 'IDLE' | 'VERIFYING' | 'ENCRYPTING' | 'SENDING' | 'SUCCESS';

const PLANS = {
  MONTHLY: { amount: 9.99 },
  YEARLY: { amount: 99.99 }
};

const PaymentPage: React.FC<PaymentPageProps> = ({ onPaymentConfirmed, user, onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState("");
  const [isPasswordMode, setIsPasswordMode] = useState(false); 

  const handleCopy = () => {
    navigator.clipboard.writeText("TNWsbmaDnAwiGha6D6ymwQjPvYb7VePgJV");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    const input = txId.trim();
    if (!input) {
      setError("Please enter your TxID or code.");
      return;
    }

    setStatus('VERIFYING');
    setError(null);

    const upperInput = input.toUpperCase();
    const adminCodes = ["ADMIN2025", "ALGOBROS_ADMIN", "MASTER", "BYPASS", "ADMIN", "ALGOBROSADMIN"];
    const isAdminCode = adminCodes.includes(upperInput);
    const isGiftCode = upperInput.startsWith("ALG-BROS-");

    if (isAdminCode || isGiftCode) {
      setStatus('SUCCESS');
      // On lance l'email en arrière-plan pour ne pas faire attendre l'utilisateur
      if (!user?.welcomeEmailSent) {
          sendStrategyEmail(user?.email || "", user?.firstName || "Trader").catch(e => console.error("Email failed", e));
      }
      onPaymentConfirmed(isAdminCode ? 'YEARLY' : 'MONTHLY', input, new Date().toISOString());
      return;
    }

    if (input.length < 20) {
      setError("Invalid code or TxID format.");
      setStatus('IDLE');
      return;
    }

    try {
      const response = await fetch(`https://apilist.tronscan.org/api/transaction-info?hash=${input}`);
      if (!response.ok) throw new Error("TronScan connection error.");
      const data = await response.json();
      if (!data || !data.hash) throw new Error("TxID not found on blockchain.");
      
      const transfer = data.trc20TransferInfo?.find((t: any) => 
          (t.to_address === "TNWsbmaDnAwiGha6D6ymwQjPvYb7VePgJV") && 
          (t.symbol === "USDT" || t.token_symbol === "USDT")
      );

      if (!transfer) throw new Error("No USDT transfer detected for this TxID.");
      const amount = parseFloat(transfer.amount_str) / 1000000;
      if (amount < 8) throw new Error("Insufficient amount for the license.");

      const plan: 'MONTHLY' | 'YEARLY' = amount >= 80 ? 'YEARLY' : 'MONTHLY';
      
      setStatus('SUCCESS');
      
      if (!user?.welcomeEmailSent) {
          sendStrategyEmail(user?.email || "", user?.firstName || "Trader").catch(e => console.error("Email failed", e));
          sendAdminNotification(user, plan, input).catch(() => {});
      }
      
      // On appelle la confirmation de l'App.tsx qui va gérer la redirection
      onPaymentConfirmed(plan, input, new Date(data.timestamp).toISOString());
    } catch (err: any) {
      setError(err.message);
      setStatus('IDLE');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 px-4">
          {onBack && status === 'IDLE' && (<button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"><ArrowLeft className="w-4 h-4" /> Back</button>)}
          {user && (<div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 px-4 py-2 rounded-full ml-auto"><UserCircle className="w-4 h-4 text-ict-accent" /><span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user.firstName} {user.lastName}</span></div>)}
      </div>
      <div className="w-full max-w-5xl bg-ict-panel border border-gray-800 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        <div className="p-12 md:w-5/12 border-b md:border-b-0 md:border-r border-gray-800 bg-gradient-to-br from-gray-900/40 to-black">
          <div className="flex items-center gap-2 text-ict-accent mb-8"><ShieldCheck className="w-6 h-6" /><span className="font-black tracking-[0.3em] text-xs uppercase">Secure Terminal</span></div>
          <h2 className="text-4xl font-black mb-10 leading-tight">PREMIUM<br/><span className="text-ict-accent">ACCESS</span></h2>
          <div className="space-y-4 mb-12">
            <button onClick={() => setSelectedPlan('MONTHLY')} disabled={status !== 'IDLE'} className={`w-full p-6 rounded-2xl border-2 transition-all flex justify-between items-center ${selectedPlan === 'MONTHLY' ? 'border-ict-accent bg-ict-accent/10' : 'border-gray-800 bg-transparent opacity-50'}`}><div className="text-left font-bold text-gray-200">Monthly Plan</div><div className="font-black text-xl">9.99 USDT</div></button>
            <button onClick={() => setSelectedPlan('YEARLY')} disabled={status !== 'IDLE'} className={`w-full p-6 rounded-2xl border-2 transition-all flex justify-between items-center relative ${selectedPlan === 'YEARLY' ? 'border-ict-accent bg-ict-accent/10' : 'border-gray-800 bg-transparent opacity-50'}`}><div className="absolute -top-3 right-4 bg-ict-accent text-black text-[10px] font-black px-2 py-0.5 rounded">PRO OFFER</div><div className="text-left font-bold text-gray-200">Yearly Professional</div><div className="font-black text-xl">99.99 USDT</div></button>
          </div>
        </div>
        <div className="p-12 md:w-7/12 flex flex-col justify-center bg-black min-h-[500px]">
          {status === 'IDLE' && (
            <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
                <div className="mb-8 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-3xl mb-4 shadow-xl"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TNWsbmaDnAwiGha6D6ymwQjPvYb7VePgJV`} alt="QR" className="w-40 h-40" /></div>
                    <p className="text-3xl font-black text-white italic">{PLANS[selectedPlan].amount} USDT</p>
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">TRON NETWORK (TRC-20)</p>
                </div>
                <div className="space-y-4 mb-8 text-left">
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-3"><span className="text-[10px] font-mono text-gray-400 truncate flex-1 tracking-tighter">TNWsbmaDnAwiGha6D6ymwQjPvYb7VePgJV</span><button onClick={handleCopy} className="text-ict-accent p-2 hover:bg-ict-accent/10 rounded-xl transition-all">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button></div>
                    <div className="relative"><input type={isPasswordMode ? "password" : "text"} autoComplete="off" placeholder="Paste TxID or Code" value={txId} onChange={(e) => setTxId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl text-xs font-mono text-white focus:border-ict-accent focus:outline-none transition-all pr-12" /><button type="button" onClick={() => setIsPasswordMode(!isPasswordMode)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-ict-accent">{isPasswordMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button></div>
                </div>
                <button onClick={handleVerify} className="w-full py-6 bg-ict-accent text-black font-black rounded-2xl hover:bg-green-400 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"><Zap className="w-5 h-5" /> ACTIVATE ACCESS</button>
            </div>
          )}
          {status !== 'IDLE' && (
            <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in">
                <div className="relative"><Loader2 className={`w-16 h-16 text-ict-accent animate-spin`} /></div>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-widest">
                        {status === 'VERIFYING' && "AUTHENTICATING..."}
                        {status === 'SUCCESS' && "WELCOME TRADER"}
                    </h3>
                    <p className="text-[10px] text-ict-accent font-black uppercase mt-2 tracking-widest animate-pulse">
                        {status === 'SUCCESS' ? "Initializing Trading Terminal..." : "Processing secure transaction..."}
                    </p>
                </div>
            </div>
          )}
          {error && (<div className="mt-6 p-4 bg-red-900/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold animate-in shake"><AlertTriangle className="w-5 h-5 flex-shrink-0" /> {error}</div>)}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
