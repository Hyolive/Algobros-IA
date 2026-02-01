import React from 'react';
import { BrainCircuit, Wrench, Clock, Mail, AlertCircle, Shield, Server } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-gray-800/10 rounded-full blur-[120px]"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px),
                           linear-gradient(to bottom, #333 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex flex-col items-center mb-16">
            <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/30 mb-6 animate-pulse">
              <BrainCircuit className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-3 text-white">
              ALGOBROS <span className="text-amber-500">AI</span>
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
              <Shield className="w-3 h-3 text-amber-500" />
              <span className="text-amber-500 text-xs font-black uppercase tracking-widest">
                SYSTEM UPDATE IN PROGRESS
              </span>
            </div>
          </div>

          {/* Maintenance Icon */}
          <div className="relative mb-12">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-500/20 to-transparent rounded-full flex items-center justify-center border border-amber-500/30 animate-spin-slow">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full flex items-center justify-center border border-amber-500/20">
                <Wrench className="w-12 h-12 text-amber-500" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <AlertCircle className="w-16 h-16 text-amber-500 animate-pulse" />
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 leading-tight text-white">
            <span className="text-amber-500">UNDER</span> <br />
            MAINTENANCE
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-xl mx-auto font-medium">
            We're currently upgrading our infrastructure to deliver an even better experience. 
            Please check back soon.
          </p>

          {/* Status Information */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 mx-auto mb-4 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-white font-bold mb-2">Estimated Time</h3>
              <p className="text-gray-400 text-sm">24-48 Hours</p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 mx-auto mb-4 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Server className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-white font-bold mb-2">System Status</h3>
              <p className="text-gray-400 text-sm">Infrastructure Update</p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 mx-auto mb-4 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-white font-bold mb-2">Contact</h3>
              <p className="text-gray-400 text-sm">AlgobrosIA@gmail.com</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              <span>Update Progress</span>
              <span>65%</span>
            </div>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-pulse"
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-gray-500 text-sm mb-4">
              For urgent inquiries, please contact us at:
            </p>
            <a 
              href="mailto:AlgobrosIA@gmail.com" 
              className="inline-flex items-center gap-3 text-amber-500 hover:text-amber-400 font-bold text-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              AlgobrosIA@gmail.com
            </a>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-gray-700 text-xs font-black uppercase tracking-widest">
              &copy; {new Date().getFullYear()} ALGOBROS QUANT SOLUTIONS GROUP
            </p>
            <p className="text-gray-800 text-[10px] mt-2 uppercase tracking-wider">
              All systems undergoing scheduled maintenance
            </p>
          </div>
        </div>
      </main>

      {/* Animated Background Elements */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse"></div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
