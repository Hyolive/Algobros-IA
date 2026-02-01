
import React, { useRef, useState } from 'react';
import { Upload, FileText, Video, Image as ImageIcon, CheckCircle, Loader2, AlertCircle, Eye, ChevronDown, ChevronUp, Trash2, BrainCircuit } from 'lucide-react';
import { KnowledgeResource } from '../types';

interface KnowledgeBaseProps {
  resources: KnowledgeResource[];
  onUpload: (files: File[]) => void;
  onClear?: () => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ resources, onUpload, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    onUpload(Array.from(files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Knowledge Base</h2>
            <p className="text-gray-400 text-sm">Train the AI with your own mentorship materials.</p>
        </div>
        {onClear && resources.length > 0 && (
            <button 
                onClick={onClear} 
                className="flex items-center gap-2 px-4 py-2 bg-red-900/10 text-red-500 border border-red-900/30 rounded-full hover:bg-red-900/20 transition-colors text-[10px] font-black uppercase tracking-widest"
            >
                <Trash2 className="w-3.5 h-3.5" /> Wipe Memory
            </button>
        )}
      </header>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Upload Card */}
        <div className="lg:w-1/2 bg-ict-panel p-8 md:p-12 rounded-[2.5rem] border border-gray-800 flex flex-col items-center justify-center text-center border-dashed border-2 border-gray-700 hover:border-ict-accent transition-all group shadow-xl">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept=".pdf,.txt,.mp4,.png,.jpg,.jpeg,.docx"
            />
            <div className="bg-gray-800 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-ict-accent/20 group-hover:scale-110 transition-all duration-300">
                <Upload className="w-8 h-8 text-ict-accent" />
            </div>
            <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tighter">Upload Intelligence</h3>
            <p className="text-gray-500 text-xs md:text-sm mb-8 max-w-xs leading-relaxed">
                Upload videos, PDFs, or Docx files. The AI will extract the logic and apply it to your chart analysis.
            </p>
            <button 
              onClick={handleSelectFiles} 
              className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-ict-accent hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-2xl shadow-ict-accent/20 active:scale-95"
            >
                CHOOSE FILES
            </button>
        </div>

        {/* List Card */}
        <div className="lg:w-1/2 bg-ict-panel p-6 md:p-8 rounded-[2.5rem] border border-gray-800 flex flex-col shadow-xl min-h-[400px]">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
              <BrainCircuit className="w-5 h-5 text-ict-accent" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Active AI Memory</h3>
              <span className="ml-auto bg-gray-900 px-3 py-1 rounded-full text-[10px] font-black text-gray-500 border border-gray-800">
                {resources.length} ITEMS
              </span>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {resources.length === 0 && (
                    <div className="text-center text-gray-700 py-16 flex flex-col items-center">
                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold text-xs uppercase tracking-widest mb-1">Memory is Offline</p>
                        <p className="text-[10px] text-gray-600 max-w-[200px]">Feed the engine to unlock model-specific analysis.</p>
                    </div>
                )}
                {resources.map((res, i) => (
                    <div key={i} className={`flex flex-col gap-2 p-4 rounded-2xl border transition-all ${
                        res.status === 'ERROR' ? 'bg-red-900/10 border-red-900/20' : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${res.status === 'ERROR' ? 'bg-red-500/10' : 'bg-gray-800'}`}>
                                {res.type === 'video' ? <Video className="w-4 h-4 text-gray-400" /> : <FileText className="w-4 h-4 text-gray-400" />}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <span className={`text-xs font-black truncate block tracking-tighter uppercase ${res.status === 'ERROR' ? 'text-red-400' : 'text-gray-300'}`}>
                                    {res.name}
                                </span>
                            </div>
                            <div className="shrink-0 flex items-center gap-3">
                                {res.status === 'PROCESSING' && (
                                  <div className="flex items-center gap-1.5 text-[9px] font-black text-yellow-500 uppercase tracking-widest">
                                    <Loader2 className="w-3 h-3 animate-spin"/> Processing
                                  </div>
                                )}
                                {res.status === 'LEARNED' && (
                                    <button onClick={() => toggleExpand(i)} className="text-gray-600 hover:text-white transition-colors">
                                        {expandedIndex === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                )}
                                {res.status === 'ERROR' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            </div>
                        </div>
                        {expandedIndex === i && res.content && (
                            <div className="mt-2 p-4 bg-black/40 rounded-xl border border-gray-800/50 text-[10px] text-gray-400 font-mono leading-relaxed whitespace-pre-wrap animate-in slide-in-from-top-2">
                                <div className="text-ict-accent font-black uppercase mb-2 border-b border-gray-800/50 pb-1 flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3" /> Learned intelligence
                                </div>
                                {res.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
