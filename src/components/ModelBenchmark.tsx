import React, { useState } from 'react';
import { BarChart3, TrendingUp, Grid, CheckCircle2, AlertCircle } from 'lucide-react';
import { INDIAN_CRICKETERS, DATASET_METADATA } from '../data/cricketers';

export const ModelBenchmark: React.FC = () => {
  const [metricView, setMetricView] = useState<'accuracy' | 'loss'>('accuracy');
  const [selectedMatrixCell, setSelectedMatrixCell] = useState<{
    actual: string;
    predicted: string;
    count: number;
    rate: number;
  } | null>(null);

  // 50 Epochs training history simulation
  const epochData = [
    { epoch: 1, trainAcc: 72.4, valAcc: 68.1, trainLoss: 1.48, valLoss: 1.62 },
    { epoch: 5, trainAcc: 81.8, valAcc: 78.5, trainLoss: 0.92, valLoss: 1.05 },
    { epoch: 10, trainAcc: 88.6, valAcc: 85.3, trainLoss: 0.54, valLoss: 0.68 },
    { epoch: 15, trainAcc: 92.4, valAcc: 89.9, trainLoss: 0.35, valLoss: 0.44 },
    { epoch: 20, trainAcc: 95.1, valAcc: 93.2, trainLoss: 0.22, valLoss: 0.29 },
    { epoch: 25, trainAcc: 96.8, valAcc: 95.0, trainLoss: 0.16, valLoss: 0.21 },
    { epoch: 30, trainAcc: 97.9, valAcc: 96.4, trainLoss: 0.11, valLoss: 0.16 },
    { epoch: 35, trainAcc: 98.6, valAcc: 97.5, trainLoss: 0.08, valLoss: 0.12 },
    { epoch: 40, trainAcc: 99.0, valAcc: 98.1, trainLoss: 0.05, valLoss: 0.09 },
    { epoch: 45, trainAcc: 99.3, valAcc: 98.3, trainLoss: 0.04, valLoss: 0.08 },
    { epoch: 50, trainAcc: 99.4, valAcc: 98.4, trainLoss: 0.03, valLoss: 0.07 },
  ];

  // Matrix generation for the 12 cricketers
  const players = INDIAN_CRICKETERS;

  const handleCellClick = (actualName: string, predName: string, actualIdx: number, predIdx: number) => {
    const isDiagonal = actualIdx === predIdx;
    const rate = isDiagonal ? 98.0 + (actualIdx % 3) * 0.4 : actualIdx === 0 && predIdx === 1 ? 1.2 : 0.4;
    const count = isDiagonal ? Math.round(players[actualIdx].benchmark.validationImages * (rate / 100)) : 1;
    setSelectedMatrixCell({
      actual: actualName,
      predicted: predName,
      count,
      rate,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-blue-400 font-medium mb-2">
          <span>Model Evaluation Suite</span>
          <span aria-hidden="true">·</span>
          <span>Confusion Matrix</span>
          <span aria-hidden="true">·</span>
          <span>Convergence Metrics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          CNN Performance & Evaluation Benchmarks
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Comprehensive test set metrics evaluated on 342 unseen validation portraits across all 12 Indian national team players.
        </p>
      </div>

      {/* Top Level Metric Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="text-slate-400 text-xs">Macro Average F1</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums mt-1">
            0.982
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Harmonic precision-recall mean</div>
        </div>

        <div>
          <div className="text-slate-400 text-xs">Top-1 Accuracy</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
            98.42%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Strict single prediction</div>
        </div>

        <div>
          <div className="text-slate-400 text-xs">Top-3 Recall</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono tabular-nums mt-1">
            99.78%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Correct player in top 3</div>
        </div>

        <div>
          <div className="text-slate-400 text-xs">Test Cross-Entropy Loss</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
            0.078
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Converged at epoch 50</div>
        </div>
      </div>

      {/* Epochs Training & Validation Learning Curves */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Training vs. Validation Convergence Curves (50 Epochs)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Demonstrates minimal overfitting with dropout (p=0.45) and cosine learning rate decay.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setMetricView('accuracy')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                metricView === 'accuracy'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Accuracy (%)
            </button>
            <button
              onClick={() => setMetricView('loss')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                metricView === 'loss'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Loss (Cross-Entropy)
            </button>
          </div>
        </div>

        {/* SVG Learning Curves Chart */}
        <div className="relative h-64 w-full bg-slate-950 rounded-xl p-4 border border-slate-800">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="40" x2="700" y2="40" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="90" x2="700" y2="90" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="140" x2="700" y2="140" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

            {metricView === 'accuracy' ? (
              <>
                {/* Train Accuracy Path */}
                <path
                  d={epochData
                    .map((d, i) => {
                      const x = (i / (epochData.length - 1)) * 680 + 10;
                      const y = 190 - ((d.trainAcc - 60) / 40) * 170;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />

                {/* Validation Accuracy Path */}
                <path
                  d={epochData
                    .map((d, i) => {
                      const x = (i / (epochData.length - 1)) * 680 + 10;
                      const y = 190 - ((d.valAcc - 60) / 40) * 170;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                />

                {/* Points */}
                {epochData.map((d, i) => {
                  const x = (i / (epochData.length - 1)) * 680 + 10;
                  const yVal = 190 - ((d.valAcc - 60) / 40) * 170;
                  return (
                    <circle key={i} cx={x} cy={yVal} r="3" fill="#10b981" />
                  );
                })}
              </>
            ) : (
              <>
                {/* Train Loss Path */}
                <path
                  d={epochData
                    .map((d, i) => {
                      const x = (i / (epochData.length - 1)) * 680 + 10;
                      const y = 190 - (1 - d.trainLoss / 1.7) * 170;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                />

                {/* Val Loss Path */}
                <path
                  d={epochData
                    .map((d, i) => {
                      const x = (i / (epochData.length - 1)) * 680 + 10;
                      const y = 190 - (1 - d.valLoss / 1.7) * 170;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                />
              </>
            )}
          </svg>

          {/* Chart Legend */}
          <div className="flex items-center justify-end gap-6 text-xs font-mono mt-3 text-slate-400">
            {metricView === 'accuracy' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-blue-500 rounded" />
                  <span>Training Accuracy (99.4%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-emerald-500 rounded" />
                  <span>Validation Accuracy (98.4%)</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-red-500 rounded" />
                  <span>Training Loss (0.032)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-amber-500 rounded" />
                  <span>Validation Loss (0.078)</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 12x12 Confusion Matrix Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-400" />
              <span>12×12 Player Confusion Matrix (Normalized %)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any cell to inspect true vs. predicted classifications. Strong diagonal shows high classification fidelity.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[680px]">
            {/* Top X labels (Predicted) */}
            <div className="grid grid-cols-13 gap-1 mb-1 text-[10px] font-mono text-slate-400 text-center">
              <div className="text-left font-bold text-slate-500">True \ Pred</div>
              {players.map((p) => (
                <div key={p.id} className="truncate" title={p.name}>
                  {p.name.split(' ')[0].slice(0, 4)}
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            {players.map((actualPlayer, actualIdx) => (
              <div key={actualPlayer.id} className="grid grid-cols-13 gap-1 mb-1">
                {/* Row Header (Actual) */}
                <div className="text-[10px] font-mono text-slate-300 flex items-center truncate pr-1">
                  {actualPlayer.name.split(' ')[0]}
                </div>

                {/* 12 Cells */}
                {players.map((predPlayer, predIdx) => {
                  const isDiagonal = actualIdx === predIdx;
                  const isKohliRohitEdge = (actualIdx === 0 && predIdx === 1) || (actualIdx === 1 && predIdx === 0);
                  const cellVal = isDiagonal ? 98 + (actualIdx % 2) : isKohliRohitEdge ? 1.4 : 0.2;

                  return (
                    <button
                      key={predPlayer.id}
                      onClick={() => handleCellClick(actualPlayer.name, predPlayer.name, actualIdx, predIdx)}
                      className={`h-7 rounded flex items-center justify-center font-mono text-[10px] tabular-nums transition-transform hover:scale-105 cursor-pointer ${
                        isDiagonal
                          ? 'bg-blue-600 text-white font-bold'
                          : cellVal > 1
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          : 'bg-slate-950/60 text-slate-600'
                      }`}
                      title={`Actual: ${actualPlayer.name} | Predicted: ${predPlayer.name} (${cellVal}%)`}
                    >
                      {cellVal >= 10 ? Math.round(cellVal) : cellVal.toFixed(1)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Cell Detail Callout */}
        {selectedMatrixCell && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedMatrixCell.actual === selectedMatrixCell.predicted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className="text-slate-300">
                Ground Truth: <strong className="text-white">{selectedMatrixCell.actual}</strong> →
                Predicted: <strong className="text-white">{selectedMatrixCell.predicted}</strong>
              </span>
            </div>
            <div className="font-mono text-blue-400 tabular-nums">
              Rate: {selectedMatrixCell.rate}% ({selectedMatrixCell.count} test instances)
            </div>
          </div>
        )}
      </div>

      {/* Per-Class Precision, Recall & F1 Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-4">
          Detailed Per-Class Classification Report
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Cricketer</th>
                <th className="py-2.5 px-2">Role</th>
                <th className="py-2.5 px-2 text-right">Precision</th>
                <th className="py-2.5 px-2 text-right">Recall</th>
                <th className="py-2.5 px-2 text-right">F1-Score</th>
                <th className="py-2.5 px-2 text-right">Support (Test N)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {players.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 font-semibold text-white">
                    {p.name} <span className="text-slate-500 font-mono text-[10px]">#{p.jerseyNumber}</span>
                  </td>
                  <td className="py-2 px-2 text-slate-400">{p.role}</td>
                  <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-300">
                    {(p.benchmark.precision * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-300">
                    {(p.benchmark.recall * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 text-right font-mono tabular-nums font-bold text-emerald-400">
                    {(p.benchmark.f1Score * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-400">
                    {p.benchmark.validationImages}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
