import React, { useState, useRef, useEffect } from 'react';
import { Database, Filter, Sliders, RefreshCw, Layers, Award, Image as ImageIcon } from 'lucide-react';
import { INDIAN_CRICKETERS, IndianCricketer, DATASET_METADATA } from '../data/cricketers';
import { PlayerAvatar } from './PlayerAvatar';

interface DatasetExplorerProps {
  onSelectPlayerToTest: (player: IndianCricketer) => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({
  onSelectPlayerToTest,
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [selectedPlayer, setSelectedPlayer] = useState<IndianCricketer>(INDIAN_CRICKETERS[0]);

  // Augmentation controls
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1.0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const augCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filtered cricketers
  const filteredCricketers = INDIAN_CRICKETERS.filter((c) => {
    if (roleFilter === 'All') return true;
    if (roleFilter === 'Batter') return c.role.includes('Batter');
    if (roleFilter === 'Bowler') return c.role.includes('Bowler');
    if (roleFilter === 'All-rounder') return c.role === 'All-rounder';
    return true;
  });

  // Render augmented face on canvas
  const renderAugmentedCanvas = () => {
    const canvas = augCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const size = 320;
    canvas.width = size;
    canvas.height = size;

    ctx.save();
    ctx.clearRect(0, 0, size, size);

    // Apply CSS-like filter transformations
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Move to center for rotation & zoom
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(isFlipped ? -zoom : zoom, zoom);
    ctx.translate(-size / 2, -size / 2);

    // Draw stylized player background & face
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Jersey collar
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.ellipse(size / 2, size * 1.05, size * 0.45, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Neck & Head
    ctx.fillStyle = '#d49b73';
    ctx.fillRect(size * 0.44, size * 0.62, size * 0.12, size * 0.2);

    ctx.fillStyle = '#e2a77e';
    ctx.beginPath();
    ctx.ellipse(size / 2, size * 0.46, size * 0.24, size * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = selectedPlayer.id === 'sachin-tendulkar' ? '#1c1917' : '#09090b';
    ctx.beginPath();
    ctx.ellipse(size / 2, size * 0.28, size * 0.25, size * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.ellipse(size * 0.4, size * 0.42, 6, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(size * 0.6, size * 0.42, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.strokeStyle = '#b47b54';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(size * 0.5, size * 0.42);
    ctx.lineTo(size * 0.48, size * 0.54);
    ctx.lineTo(size * 0.53, size * 0.54);
    ctx.stroke();

    // Mouth
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(size * 0.43, size * 0.64);
    ctx.quadraticCurveTo(size * 0.5, size * 0.67, size * 0.57, size * 0.64);
    ctx.stroke();

    ctx.restore();
  };

  useEffect(() => {
    renderAugmentedCanvas();
  }, [selectedPlayer, rotation, zoom, brightness, contrast, isFlipped]);

  const resetAugmentation = () => {
    setRotation(0);
    setZoom(1.0);
    setBrightness(100);
    setContrast(100);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-blue-400 font-medium mb-2">
          <span>Kaggle & Google Dataset Search Grounding</span>
          <span aria-hidden="true">·</span>
          <span>Indian Cricket Team Face Corpus</span>
          <span aria-hidden="true">·</span>
          <span>Augmentation Pipeline</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dataset Corpus & Data Augmentation Laboratory
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Sourced from Kaggle Indian Cricket Players datasets and match broadcast captures.
          Contains {DATASET_METADATA.totalImages} annotated portraits across {DATASET_METADATA.totalClasses} cricketers with pose, lighting, and helmet occlusion variations.
        </p>
      </div>

      {/* Dataset Statistics Grid (Anti-Nested Card Rule) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span>Dataset Composition & Stratified Splits</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-slate-400 text-xs">Total Images</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
              {DATASET_METADATA.totalImages.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">12 balanced classes</div>
          </div>

          <div>
            <div className="text-slate-400 text-xs">Training Partition (70%)</div>
            <div className="text-2xl font-bold text-blue-400 font-mono tabular-nums mt-1">
              {Math.round(DATASET_METADATA.totalImages * DATASET_METADATA.trainSplit).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">With data augmentation</div>
          </div>

          <div>
            <div className="text-slate-400 text-xs">Validation Partition (15%)</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
              {Math.round(DATASET_METADATA.totalImages * DATASET_METADATA.valSplit).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Hyperparameter tuning</div>
          </div>

          <div>
            <div className="text-slate-400 text-xs">Test Partition (15%)</div>
            <div className="text-2xl font-bold text-purple-400 font-mono tabular-nums mt-1">
              {Math.round(DATASET_METADATA.totalImages * DATASET_METADATA.testSplit).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Blind evaluation benchmark</div>
          </div>
        </div>

        {/* Train Split Visual Bar */}
        <div className="mt-6">
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div className="bg-blue-600 h-full" style={{ width: '70%' }} title="Train 70%" />
            <div className="bg-emerald-500 h-full" style={{ width: '15%' }} title="Validation 15%" />
            <div className="bg-purple-500 h-full" style={{ width: '15%' }} title="Test 15%" />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 mt-2 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              Train (70%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Val (15%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              Test (15%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Player Dataset Explorer + Augmentation Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Player Roster & Kaggle Class Metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-semibold text-white">
                Player Classes ({filteredCricketers.length} of {INDIAN_CRICKETERS.length})
              </h3>

              {/* Role filter buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                {['All', 'Batter', 'Bowler', 'All-rounder'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      roleFilter === role
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Cricketers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2.5 px-3">Cricketer</th>
                    <th className="py-2.5 px-2">Role</th>
                    <th className="py-2.5 px-2 text-right">Train Images</th>
                    <th className="py-2.5 px-2 text-right">Val Images</th>
                    <th className="py-2.5 px-2 text-right">F1 Score</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCricketers.map((c) => {
                    const isSelected = selectedPlayer.id === c.id;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedPlayer(c)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-950/30'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <PlayerAvatar player={c} size="sm" showJerseyNumber={false} />
                            <div>
                              <div className="font-semibold text-white">{c.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">#{c.jerseyNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-slate-300">{c.role}</td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-300">
                          {c.benchmark.trainingImages}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-300">
                          {c.benchmark.validationImages}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums font-semibold text-emerald-400">
                          {(c.benchmark.f1Score * 100).toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPlayerToTest(c);
                            }}
                            className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white rounded transition-colors cursor-pointer"
                          >
                            Classify Face
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Interactive Data Augmentation Lab (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>Augmentation Preview Simulator</span>
              </h3>
              <button
                onClick={resetAugmentation}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Convolutional models require data augmentation to avoid overfitting to specific angles, lighting, or jersey shadows.
            </p>

            {/* Augmented Canvas Viewport */}
            <div className="relative aspect-square max-w-[280px] mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center shadow-inner">
              <canvas ref={augCanvasRef} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-blue-400">
                Tensor: {selectedPlayer.name}
              </div>
            </div>

            {/* Augmentation Sliders */}
            <div className="mt-6 space-y-3 text-xs">
              {/* Rotation */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400 w-24">Rotation:</span>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                  className="flex-1 accent-blue-500 cursor-pointer"
                />
                <span className="font-mono text-slate-300 w-12 text-right tabular-nums">
                  {rotation}°
                </span>
              </div>

              {/* Zoom */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400 w-24">Zoom Scale:</span>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-blue-500 cursor-pointer"
                />
                <span className="font-mono text-slate-300 w-12 text-right tabular-nums">
                  {zoom.toFixed(2)}×
                </span>
              </div>

              {/* Brightness */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400 w-24">Brightness:</span>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="flex-1 accent-blue-500 cursor-pointer"
                />
                <span className="font-mono text-slate-300 w-12 text-right tabular-nums">
                  {brightness}%
                </span>
              </div>

              {/* Contrast */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400 w-24">Contrast:</span>
                <input
                  type="range"
                  min="60"
                  max="140"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  className="flex-1 accent-blue-500 cursor-pointer"
                />
                <span className="font-mono text-slate-300 w-12 text-right tabular-nums">
                  {contrast}%
                </span>
              </div>

              {/* Horizontal Flip */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Random Horizontal Flip:</span>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    isFlipped
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isFlipped ? 'Flipped (Mirror)' : 'Normal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
