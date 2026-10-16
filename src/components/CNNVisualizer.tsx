import React, { useState } from 'react';
import { Layers, Cpu, Eye, Sliders, Info, Zap } from 'lucide-react';
import { INDIAN_CRICKETERS, IndianCricketer } from '../data/cricketers';
import { ClassificationResult, CNN_KERNELS } from '../lib/cnnEngine';

interface CNNVisualizerProps {
  currentResult: ClassificationResult | null;
  onSelectPlayerForAnalysis?: (player: IndianCricketer) => void;
}

export const CNNVisualizer: React.FC<CNNVisualizerProps> = ({
  currentResult,
}) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.75);
  const [activeKernelKey, setActiveKernelKey] = useState<keyof typeof CNN_KERNELS>('sobelHorizontal');

  const player = currentResult?.topPlayer || INDIAN_CRICKETERS[0];

  const cnnLayers = [
    {
      id: 'input',
      title: 'Input Tensor',
      shape: '128 × 128 × 3',
      params: 0,
      receptiveField: '1 × 1 px',
      description: 'Normalized RGB face region cropped and centered via facial landmark bounding coordinates.',
    },
    {
      id: 'conv1',
      title: 'Conv2D Block 1 (16 Filters, 3×3)',
      shape: '128 × 128 × 16',
      params: 448,
      receptiveField: '3 × 3 px',
      description: 'First convolutional layer extracting low-level edge angles, contrast gradients, hair boundaries, and specular highlights.',
    },
    {
      id: 'pool1',
      title: 'MaxPool2D (2×2, Stride 2)',
      shape: '64 × 64 × 16',
      params: 0,
      receptiveField: '6 × 6 px',
      description: 'Spatial downsampling to achieve translational invariance against slight head tilts or minor camera shifts.',
    },
    {
      id: 'conv2',
      title: 'Conv2D Block 2 (32 Filters, 3×3)',
      shape: '64 × 64 × 32',
      params: 4640,
      receptiveField: '14 × 14 px',
      description: 'Mid-level feature representations: curves of jawline, nose contours, eyelid margins, and beard textures.',
    },
    {
      id: 'pool2',
      title: 'MaxPool2D (2×2, Stride 2)',
      shape: '32 × 32 × 32',
      params: 0,
      receptiveField: '28 × 28 px',
      description: 'Second pooling layer retaining maximal responses while reducing spatial computation footprint.',
    },
    {
      id: 'conv3',
      title: 'Conv2D Block 3 (64 Filters, 3×3)',
      shape: '32 × 32 × 64',
      params: 18496,
      receptiveField: '60 × 60 px',
      description: 'High-level semantic facial parts: inter-ocular distance geometry, lip curvature, and chin morphology.',
    },
    {
      id: 'dense',
      title: 'Dense Latent Embedding (128 Units)',
      shape: '128 Vector',
      params: 2097280,
      receptiveField: 'Full Viewport',
      description: 'Fully connected projection mapping high-dimensional convolutions into a compact 128-D metric embedding space.',
    },
    {
      id: 'softmax',
      title: 'Softmax Classifier (12 Classes)',
      shape: '12 Classes',
      params: 1548,
      receptiveField: 'Global',
      description: 'Final normalized exponential distribution producing class probabilities for all 12 Indian cricketers.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-blue-400 font-medium mb-2">
          <span>Convolutional Neural Network Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Layer Activations</span>
          <span aria-hidden="true">·</span>
          <span>Grad-CAM Interpretability</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          CNN Feature Extraction & Attention Engine
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Observe how the convolutional kernels filter input face pixels through progressive receptive fields,
          culminating in a 128-dimensional biometric latent representation for {player.name}.
        </p>
      </div>

      {/* Layer Architecture Pipeline Overview */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>8-Stage Deep Convolutional Feed-Forward Pipeline</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {cnnLayers.map((layer, index) => {
            const isSelected = selectedLayerIndex === index;
            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayerIndex(index)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/40 text-white ring-1 ring-blue-500/60'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-500">Stage 0{index + 1}</div>
                <div className="text-xs font-bold text-white mt-1 leading-snug line-clamp-2">
                  {layer.title.split('(')[0]}
                </div>
                <div className="text-[11px] font-mono text-blue-400 mt-2 tabular-nums">
                  {layer.shape}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Layer Deep-Dive Drawer */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <span className="text-slate-500 font-mono text-[11px]">ACTIVE LAYER INSPECTION</span>
              <h4 className="text-sm font-bold text-white">
                {cnnLayers[selectedLayerIndex].title}
              </h4>
            </div>

            <div className="flex items-center gap-4 text-slate-300 font-mono tabular-nums text-[11px]">
              <div>
                <span className="text-slate-500">Output Shape: </span>
                <span className="text-blue-400 font-semibold">{cnnLayers[selectedLayerIndex].shape}</span>
              </div>
              <div>
                <span className="text-slate-500">Trainable Params: </span>
                <span className="text-emerald-400 font-semibold">{cnnLayers[selectedLayerIndex].params.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500">Receptive Field: </span>
                <span>{cnnLayers[selectedLayerIndex].receptiveField}</span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-slate-300 leading-relaxed">
            {cnnLayers[selectedLayerIndex].description}
          </p>
        </div>
      </div>

      {/* Two-Column Grid: 2D Feature Maps & Grad-CAM Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 2D Filter Activations on Current Face (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Convolutional Feature Maps (Conv2D Layer 1)</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">16 channels</span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Real 2D convolution filters applied to {player.name}’s input image. Notice how directional gradients isolate specific facial contours.
            </p>

            {currentResult?.layerActivations[0]?.featureMaps ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentResult.layerActivations[0].featureMaps.map((mapUrl, i) => {
                  const filterNames = [
                    'Sobel-X Horizontal',
                    'Sobel-Y Vertical',
                    'Laplacian Contour',
                    'Sharpen & Texture',
                  ];
                  return (
                    <div key={i} className="space-y-1">
                      <div className="aspect-square rounded-lg overflow-hidden border border-slate-800 bg-black">
                        <img
                          src={mapUrl}
                          alt={`Filter ${i}`}
                          className="w-full h-full object-cover filter contrast-125"
                        />
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        {filterNames[i] || `Filter #${i + 1}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-xl">
                Run inference on a player image to render activation maps.
              </div>
            )}

            {/* 3x3 Convolution Kernel Weight Matrix Inspector */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-semibold text-slate-300">Inspect Active 3×3 Weight Matrix:</span>
                <div className="flex gap-1">
                  {(['sobelHorizontal', 'sobelVertical', 'laplacianEdges', 'ridgeDetection'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveKernelKey(key)}
                      className={`px-2 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                        activeKernelKey === key
                          ? 'bg-blue-600 text-white font-medium'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {key === 'sobelHorizontal' ? 'Sobel-X' : key === 'sobelVertical' ? 'Sobel-Y' : key === 'laplacianEdges' ? 'Laplacian' : 'Ridge'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3x3 Matrix Grid */}
              <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto p-2 bg-slate-950 rounded-lg border border-slate-800">
                {CNN_KERNELS[activeKernelKey].map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={`h-9 flex items-center justify-center font-mono text-xs rounded ${
                        val > 0
                          ? 'bg-blue-950/70 text-blue-300 font-bold border border-blue-900'
                          : val < 0
                          ? 'bg-rose-950/70 text-rose-300 font-bold border border-rose-900'
                          : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {val > 0 ? `+${val}` : val}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Grad-CAM Saliency Map (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Grad-CAM Saliency & Attention Map</span>
              </h3>
              <span className="text-xs text-amber-400 font-mono font-medium">Class: {player.name}</span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Gradient-weighted Class Activation Mapping computes the gradient of the winning class score
              with respect to feature maps in the final Conv layer, highlighting regions that dictated the classification.
            </p>

            {/* Visualizer Frame with Heatmap Overlay */}
            <div className="relative aspect-square max-w-[340px] mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              {currentResult?.gradCamHeatmapUrl ? (
                <>
                  {/* Base stylized face */}
                  <div className="w-full h-full flex items-center justify-center bg-slate-950">
                    <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
                      <rect width="100" height="100" fill="#0f172a" />
                      <ellipse cx="50" cy="50" rx="28" ry="34" fill="#334155" />
                      <ellipse cx="40" cy="45" rx="4" ry="2.5" fill="#e2e8f0" />
                      <ellipse cx="60" cy="45" rx="4" ry="2.5" fill="#e2e8f0" />
                      <path d="M50,44 L48,56 L53,56" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
                      <path d="M42,68 Q50,73 58,68" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
                    </svg>
                  </div>

                  {/* Heatmap Overlay */}
                  <img
                    src={currentResult.gradCamHeatmapUrl}
                    alt="Grad-CAM Saliency"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen transition-opacity"
                    style={{ opacity: heatmapOpacity }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                  Heatmap available after face identification
                </div>
              )}
            </div>

            {/* Heatmap Opacity Control */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-4 text-xs">
              <span className="text-slate-400 font-medium">Heatmap Opacity:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                className="w-48 accent-blue-500 cursor-pointer"
              />
              <span className="font-mono text-slate-300 tabular-nums">
                {Math.round(heatmapOpacity * 100)}%
              </span>
            </div>

            {/* Salient Attention Hotspots */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1.5">
              <div className="font-semibold text-slate-300">Identified Attention Hotspots:</div>
              <ul className="text-slate-400 space-y-1 list-disc list-inside">
                <li>
                  <span className="text-rose-400 font-medium">Nasal Dorsum & Cheekbones:</span> High gradient magnitude anchor
                </li>
                <li>
                  <span className="text-amber-400 font-medium">Mandibular Angle & Stubble:</span> Distinguishes {player.name} from similar facial contours
                </li>
                <li>
                  <span className="text-cyan-400 font-medium">Inter-ocular Horizon:</span> Validates head orientation and tilt invariance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 128-Dimensional Biometric Latent Vector Strip */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>128-Dimensional Dense Metric Embedding Vector</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Normalized unit-hypersphere vector v in ℝ¹²⁸ extracted from the penultimate fully connected layer.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-md">
            L2-Norm: 1.00000
          </span>
        </div>

        {/* Vector Spectrum Visualizer Bar */}
        <div className="h-10 w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-end p-1 gap-[2px]">
          {(currentResult?.embeddingVector || new Array(128).fill(0.08)).map((val, idx) => {
            const heightPct = Math.min(100, Math.max(10, Math.abs(val) * 700));
            const isPositive = val >= 0;
            return (
              <div
                key={idx}
                className="flex-1 rounded-xs transition-all hover:opacity-100 opacity-80"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: isPositive ? '#3b82f6' : '#ec4899',
                }}
                title={`Dim [${idx}]: ${val.toFixed(4)}`}
              />
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2">
          <span>Dimension [0] (Geometry)</span>
          <span>Dimension [64] (Mid Frequencies)</span>
          <span>Dimension [127] (Texture Residuals)</span>
        </div>
      </div>
    </div>
  );
};
