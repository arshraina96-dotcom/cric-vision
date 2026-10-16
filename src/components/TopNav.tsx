import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

export type NavTab = 'classifier' | 'cnn-layers' | 'dataset' | 'benchmarks' | 'verification';

interface TopNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onQuickSample: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onQuickSample,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('classifier');
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Cric<span className="text-blue-500">Vision</span>
            </span>
          </a>
        </div>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectTab('classifier')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'classifier'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Face Classifier
          </button>

          <button
            onClick={() => onSelectTab('cnn-layers')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'cnn-layers'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CNN Activations & Grad-CAM
          </button>

          <button
            onClick={() => onSelectTab('dataset')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'dataset'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dataset & Augmentation
          </button>

          <button
            onClick={() => onSelectTab('benchmarks')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'benchmarks'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Model Benchmarks
          </button>

          <button
            onClick={() => onSelectTab('verification')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'verification'
                ? 'text-white border-b-2 border-blue-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1:1 Face Verification
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickSample}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Test Sample</span>
          </button>
        </div>
      </div>
    </header>
  );
};
