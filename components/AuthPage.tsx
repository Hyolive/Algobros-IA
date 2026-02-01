
import React, { useState } from 'react';
import { BrainCircuit, Loader2, ShieldCheck, Mail, ArrowRight, AlertCircle, ArrowLeft, Lock, Info, ExternalLink } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface AuthPageProps {
  onLogin: (userData: any) => void;
  onBack?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { first_name: firstName, last_name: lastName } }
        });
        
        if (signUpError) throw signUpError;
        
        if (data.user) {
          // Utilisation de snake_case pour correspondre au reste de l'app et à Supabase
          await supabase.from('profiles').upsert([{
            id: data.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            is_paid: false,
            expiry_date: new Date().toISOString()
          }]);
          
          if (data.session) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
            onLogin(profile || data.user);
          } else {
            alert("Account created! You can now log in.");
            setIsSignUp(false);
          }
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          onLogin(profile || data.user);
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ict-accent/10 rounded-full blur-[140px]"></div>
      {onBack && (
        <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest z-20">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
      <div className="w-full max-w-md bg-ict-panel border border-gray-800 p-10 rounded-[3rem] text-center relative z-10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-ict-accent/10 rounded-2xl flex items-center justify-center border border-ict-accent/20">
            <BrainCircuit className="w-8 h-8 text-ict-accent" />
          </div>
        </div>
        <h2 className="text-2xl font-black mb-2 text-white italic">{isSignUp ? 'JOIN' : 'ACCESS'} <span className="text-ict-accent">ALGOBROS</span></h2>
        <p className="text-gray-500 mb-8 font-medium text-xs px-4">{isSignUp ? 'Create your privileged access.' : 'Log in to access the terminal.'}</p>
        <form onSubmit={handleAuth} className="w-full space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-xs text-white focus:border-ict-accent outline-none" required />
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-xs text-white focus:border-ict-accent outline-none" required />
              </div>
            )}
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-800 p-3 pl-10 rounded-xl text-xs text-white focus:border-ict-accent outline-none" required />
            </div>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-800 p-3 pl-10 rounded-xl text-xs text-white focus:border-ict-accent outline-none" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-ict-accent text-black font-black rounded-xl hover:bg-green-400 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,255,157,0.2)]">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (<>{isSignUp ? 'CREATE MY ACCESS' : 'UNLOCK'} <ArrowRight className="w-4 h-4" /></>)}
            </button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-6 text-[10px] text-gray-500 hover:text-ict-accent font-bold uppercase tracking-widest transition-colors">{isSignUp ? 'Already have an account? Log in' : 'No account? Create access'}</button>
        {error && (<div className="mt-6 p-4 bg-red-900/10 border border-red-500/30 rounded-2xl text-left space-y-3 animate-in fade-in slide-in-from-top-2"><div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest"><AlertCircle className="w-4 h-4 shrink-0" /> System Alert</div><p className="text-gray-300 text-[11px] leading-relaxed font-medium">{error}</p></div>)}
        <div className="mt-10 flex items-center justify-center gap-2 text-[9px] text-gray-600 uppercase tracking-widest font-bold pt-6 border-t border-gray-800/50"><ShieldCheck className="w-3 h-3 text-ict-accent" />MILITARY GRADE ENCRYPTION ACTIVE</div>
      </div>
    </div>
  );
};

export default AuthPage;
