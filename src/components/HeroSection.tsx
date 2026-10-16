import React from 'react';
import { Play, Layers, Database, ArrowRight } from 'lucide-react';
import { DATASET_METADATA } from '../data/cricketers';

interface HeroSectionProps {
  onStartInference: () => void;
  onViewArchitecture: () => void;
  onExploreDataset: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartInference,
  onViewArchitecture,
  onExploreDataset,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800">
      {/* Background Stadium Hero Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/cricket_face_hero_banner_1792135934862.jpg"
          alt="Cricket Stadium Pitch Floodlights"
          className="w-full h-full object-cover object-center filter brightness-40 contrast-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/50 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          {/* Clean Unboxed Metadata Kicker (Anti-Pill Rule) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-blue-400 font-medium mb-4">
            <span>Deep Learning Computer Vision</span>
            <span aria-hidden="true">·</span>
            <span>Convolutional Neural Network</span>
            <span aria-hidden="true">·</span>
            <span>Kaggle Face Dataset Benchmark</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight text-balance leading-tight mb-4">
            Indian Cricket Team Member Face Identification
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl text-balance">
            Real-time biometric facial recognition and deep feature classification system for Indian cricket stars.
            Trained on multi-angle, high-dynamic-range match portraits with custom Conv2D feature maps and Grad-CAM explainability.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStartInference}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Test Face Classifier</span>
            </button>

            <button
              onClick={onViewArchitecture}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-medium text-sm transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Inspect CNN Layers</span>
            </button>

            <button
              onClick={onExploreDataset}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-slate-500" />
              <span>Browse Dataset ({DATASET_METADATA.totalImages} Images)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Full-width Metric Strip (Anti-Nested Card Rule) */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {DATASET_METADATA.overallAccuracy}%
            </div>
            <div className="text-xs text-slate-400 mt-1">Top-1 Classification Accuracy</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {DATASET_METADATA.top3Accuracy}%
            </div>
            <div className="text-xs text-slate-400 mt-1">Top-3 Cricket Star Recall</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {DATASET_METADATA.totalClasses} Players
            </div>
            <div className="text-xs text-slate-400 mt-1">Captains, Batters & Bowlers</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              &lt; 14ms
            </div>
            <div className="text-xs text-slate-400 mt-1">CNN Forward Pass Latency</div>
          </div>
        </div>
      </div>
    </section>
  );
};
