
import React from 'react';
import { 
  BrainCircuit, Zap, ChevronRight, Check, Mail, Layers, 
  Cpu, Database, LineChart, Target, Activity, 
  BookOpen, Fingerprint, Video, History, Search, Code, Workflow, ShieldCheck, ArrowDown
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-ict-accent selection:text-black font-sans">
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-ict-accent/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[140px]"></div>
      </div>

      {/* Header Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-white/10 sticky top-0 bg-black/95 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ict-accent/10 rounded-xl flex items-center justify-center border border-ict-accent/30">
            <BrainCircuit className="w-6 h-6 text-ict-accent" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
            ALGOBROS <span className="text-ict-accent">AI</span>
          </span>
        </div>
        <button 
          onClick={onStart} 
          className="px-8 py-3 bg-ict-accent text-black font-black rounded-full hover:scale-105 transition-all shadow-[0_0_25px_rgba(0,255,157,0.5)] text-xs uppercase tracking-widest"
        >
          GET STARTED
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 px-6 text-center z-10">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ict-accent/10 border border-ict-accent/30 text-ict-accent text-[10px] font-black mb-8 tracking-[0.4em] uppercase">
            <Activity className="w-3 h-3" /> QUANTUM ANALYSIS ENGINE v3.1 ONLINE
          </div>
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase italic text-white">
            RECURSIVE <br/>
            <span className="text-ict-accent text-glow">INTELLIGENCE</span> <br/>
            ARCHITECTURE
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
            Algobros AI synthesizes your strategy and history into a private intelligence that executes institutional order flow across 8 timeframes, learning recursively to eliminate trading blind spots.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStart} 
              className="px-14 py-7 bg-white text-black text-2xl font-black rounded-3xl hover:bg-ict-accent transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 uppercase tracking-tighter italic"
            >
              GET STARTED <ChevronRight className="w-8 h-8" />
            </button>
            <div className="hidden md:flex flex-col items-start text-left border-l border-white/10 pl-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-ict-accent">Infrastructure Status</span>
              <span className="text-xs font-bold text-gray-400">Gemini 3 Pro Core / 8-TF Sync / Cloud Memory</span>
            </div>
          </div>
          
          <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-600">Scroll to Explore Infrastructure</span>
            <ArrowDown className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </section>

      {/* CORE CAPABILITY */}
      <section className="py-32 px-6 max-w-7xl mx-auto z-10 relative border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="w-12 h-12 bg-ict-accent/10 rounded-2xl flex items-center justify-center border border-ict-accent/30 mb-6">
              <BrainCircuit className="w-6 h-6 text-ict-accent" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-none text-white">
              HOW THE AI <br/><span className="text-ict-accent">LEARNS</span> FROM YOU
            </h2>
            <div className="space-y-6 text-gray-300 font-medium text-lg leading-relaxed">
              <p>
                Unlike generic signal bots, Algobros AI is an empty vessel designed to be filled with <span className="text-white font-bold italic">your specific edge</span>. Through the Knowledge Base, you upload the mentorship videos you study or the PDFs you've written. 
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-ict-accent/50 transition-colors">
                  <Video className="text-ict-accent w-6 h-6 mb-3" />
                  <p className="text-white font-black uppercase text-[10px] tracking-widest mb-1">Video Logic</p>
                  <p className="text-[10px] text-gray-500 leading-tight">Extracts technical signatures directly from video frames.</p>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-400/50 transition-colors">
                  <BookOpen className="text-blue-400 w-6 h-6 mb-3" />
                  <p className="text-white font-black uppercase text-[10px] tracking-widest mb-1">Doc Integration</p>
                  <p className="text-[10px] text-gray-500 leading-tight">Parses PDFs and Journal entries to build a rule-based engine.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#080808] p-1 md:p-10 rounded-[4rem] border border-ict-accent/20 shadow-[0_0_80px_rgba(0,255,157,0.05)] overflow-hidden">
             <div className="bg-black rounded-[3.5rem] p-8 space-y-8 relative border border-white/5">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-ict-accent animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Neural Syncing...</span>
                   </div>
                   <Activity className="w-4 h-4 text-ict-accent/30" />
                </div>
                <div className="space-y-4">
                   <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                      <div className="h-full bg-ict-accent w-[85%] animate-[pulse_2s_infinite]"></div>
                   </div>
                   <div className="h-2 w-[70%] bg-gray-900 rounded-full overflow-hidden">
                      <div className="h-full bg-ict-accent w-[40%]"></div>
                   </div>
                   <div className="h-2 w-[90%] bg-gray-900 rounded-full overflow-hidden">
                      <div className="h-full bg-ict-accent w-[95%]"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto z-10 relative">
        <div className="text-center mb-24">
           <h2 className="text-5xl md:text-9xl font-black uppercase italic tracking-tighter leading-none mb-4 text-white">LICENSING <span className="text-ict-accent">TIERS</span></h2>
           <p className="text-gray-400 font-black uppercase tracking-[0.6em] text-[10px]">Deploy the infrastructure that fits your scale.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* MONTHLY CARD */}
          <div className="p-12 bg-[#0c0c0c] border-4 border-white/20 rounded-[4rem] flex flex-col items-center text-center hover:border-white/40 hover:bg-[#111] transition-all shadow-2xl group">
            <h3 className="text-3xl font-black uppercase italic mb-2 text-white group-hover:text-ict-accent transition-colors">Standard Quant</h3>
            <p className="text-gray-600 text-[10px] font-black tracking-[0.3em] uppercase mb-10">MONTHLY LICENSE ACCESS</p>
            <div className="text-7xl font-black mb-12 text-white">9.99<span className="text-xl text-gray-600 ml-1">USDT</span></div>
            <button onClick={onStart} className="w-full py-6 bg-white text-black font-black rounded-2xl hover:bg-ict-accent transition-all uppercase tracking-widest text-[11px] shadow-xl">GET STARTED</button>
          </div>

          {/* YEARLY CARD */}
          <div className="p-12 bg-ict-accent/[0.03] border-4 border-ict-accent rounded-[4rem] flex flex-col items-center text-center relative overflow-hidden shadow-[0_0_60px_rgba(0,255,157,0.15)] group">
            <div className="absolute top-8 right-8 bg-ict-accent text-black text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-2xl animate-pulse">ELITE CHOICE</div>
            <h3 className="text-3xl font-black uppercase italic mb-2 text-white">Yearly Elite</h3>
            <p className="text-ict-accent/60 text-[10px] font-black tracking-[0.3em] uppercase mb-10">ANNUAL PROFESSIONAL LICENSE</p>
            <div className="text-7xl font-black mb-12 text-ict-accent">99.99<span className="text-xl text-gray-500 ml-1">USDT</span></div>
            <button onClick={onStart} className="w-full py-6 bg-ict-accent text-black font-black rounded-2xl hover:scale-[1.03] transition-all uppercase tracking-widest text-[11px] shadow-[0_0_40px_rgba(0,255,157,0.5)]">GET STARTED</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-32 px-6 border-t border-white/10 z-10 relative bg-black/80">
        <div className="max-w-7xl mx-auto">
           <div className="grid md:grid-cols-3 gap-24 mb-24">
              <div className="col-span-1">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 bg-ict-accent/10 rounded-2xl flex items-center justify-center border border-ict-accent/30">
                      <BrainCircuit className="w-8 h-8 text-ict-accent" />
                    </div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">ALGOBROS <span className="text-ict-accent">AI</span></h2>
                 </div>
                 <p className="text-gray-400 text-lg leading-relaxed font-medium">
                    The institutional standard for recursive algorithmic market analysis. Engineering probability through deep neural learning and Smart Money logic.
                 </p>
              </div>
              
              <div className="col-span-1">
                 <h4 className="text-xs font-black uppercase tracking-widest text-white mb-10 border-b border-white/5 pb-4">Terminal Access</h4>
                 <div className="space-y-8">
                    <a href="mailto:AlgobrosIA@gmail.com" className="text-xl font-black text-ict-accent flex items-center gap-3 hover:underline">
                       <Mail className="w-6 h-6" /> AlgobrosIA@gmail.com
                    </a>
                 </div>
              </div>
           </div>

           <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
              <p className="text-gray-800 text-[10px] font-black uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} ALGOBROS QUANT SOLUTIONS GROUP.
              </p>
           </div>
        </div>
      </footer>

      <style>{`
        .text-glow {
          text-shadow: 0 0 40px rgba(0, 255, 157, 0.5);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
