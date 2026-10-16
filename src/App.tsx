import React, { useState } from 'react';
import { TopNav, NavTab } from './components/TopNav';
import { HeroSection } from './components/HeroSection';
import { FaceClassifier } from './components/FaceClassifier';
import { CNNVisualizer } from './components/CNNVisualizer';
import { DatasetExplorer } from './components/DatasetExplorer';
import { ModelBenchmark } from './components/ModelBenchmark';
import { FaceVerification } from './components/FaceVerification';
import { INDIAN_CRICKETERS, IndianCricketer } from './data/cricketers';
import { ClassificationResult } from './lib/cnnEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('classifier');
  const [selectedPlayerForClassifier, setSelectedPlayerForClassifier] = useState<IndianCricketer>(INDIAN_CRICKETERS[0]);
  const [currentInferenceResult, setCurrentInferenceResult] = useState<ClassificationResult | null>(null);

  // Quick random player test
  const handleQuickTestRandom = () => {
    const randomIndex = Math.floor(Math.random() * INDIAN_CRICKETERS.length);
    setSelectedPlayerForClassifier(INDIAN_CRICKETERS[randomIndex]);
    setActiveTab('classifier');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleInspectCNNFromClassifier = (result: ClassificationResult) => {
    setCurrentInferenceResult(result);
    setActiveTab('cnn-layers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromDataset = (player: IndianCricketer) => {
    setSelectedPlayerForClassifier(player);
    setActiveTab('classifier');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickSample={handleQuickTestRandom}
      />

      {/* Hero Section (shown prominently when on classifier or home) */}
      {activeTab === 'classifier' && (
        <HeroSection
          onStartInference={() => {
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          onViewArchitecture={() => {
            setActiveTab('cnn-layers');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExploreDataset={() => {
            setActiveTab('dataset');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Content Area based on Tab */}
      <main className="flex-1">
        {activeTab === 'classifier' && (
          <FaceClassifier
            key={selectedPlayerForClassifier.id}
            initialPlayerId={selectedPlayerForClassifier.id}
            onInspectCNN={handleInspectCNNFromClassifier}
          />
        )}

        {activeTab === 'cnn-layers' && (
          <CNNVisualizer currentResult={currentInferenceResult} />
        )}

        {activeTab === 'dataset' && (
          <DatasetExplorer onSelectPlayerToTest={handleSelectFromDataset} />
        )}

        {activeTab === 'benchmarks' && <ModelBenchmark />}

        {activeTab === 'verification' && <FaceVerification />}
      </main>

      {/* Quiet, Domain-Native Footer (Frontend Design Constitution Section 1.B) */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CricVision</span>
            <span aria-hidden="true">·</span>
            <span>Indian Cricket Team Member Face Identification System</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>Kaggle Dataset Grounding</span>
            <span aria-hidden="true">·</span>
            <span>Convolutional Neural Network (Conv2D)</span>
            <span aria-hidden="true">·</span>
            <span>Grad-CAM Interpretability</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
