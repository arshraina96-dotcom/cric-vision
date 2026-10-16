import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  RotateCcw,
  Eye,
  Sliders,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { INDIAN_CRICKETERS, IndianCricketer } from '../data/cricketers';
import { runCNNInference, ClassificationResult } from '../lib/cnnEngine';
import { PlayerAvatar } from './PlayerAvatar';

interface FaceClassifierProps {
  onInspectCNN?: (result: ClassificationResult) => void;
  initialPlayerId?: string;
}

export const FaceClassifier: React.FC<FaceClassifierProps> = ({
  onInspectCNN,
  initialPlayerId,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<IndianCricketer>(() => {
    if (initialPlayerId) {
      const p = INDIAN_CRICKETERS.find((c) => c.id === initialPlayerId);
      if (p) return p;
    }
    return INDIAN_CRICKETERS[0]; // Default Virat Kohli
  });

  const [inputMode, setInputMode] = useState<'sample' | 'upload' | 'webcam'>('sample');
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState<ClassificationResult | null>(null);

  // Overlay toggles
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [showGradCam, setShowGradCam] = useState<boolean>(false);

  // Gemini Deep Multimodal verification state
  const [geminiResult, setGeminiResult] = useState<any | null>(null);
  const [isVerifyingWithGemini, setIsVerifyingWithGemini] = useState<boolean>(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);

  // Webcam stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to draw the simulated cricket portrait on canvas
  const drawPlayerToCanvas = (player: IndianCricketer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = 400;
    const h = 400;
    canvas.width = w;
    canvas.height = h;

    // Background gradient - stadium floodlight vibe
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e293b');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Stadium lighting beams
    ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.beginPath();
    ctx.moveTo(w * 0.1, 0);
    ctx.lineTo(w * 0.5, h);
    ctx.lineTo(w * 0.3, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(96, 165, 250, 0.08)';
    ctx.beginPath();
    ctx.moveTo(w * 0.9, 0);
    ctx.lineTo(w * 0.7, h);
    ctx.lineTo(w * 0.5, h);
    ctx.closePath();
    ctx.fill();

    // Indian Cricket Jersey Collar & Shoulders
    const jerseyGrad = ctx.createLinearGradient(0, h * 0.75, 0, h);
    jerseyGrad.addColorStop(0, '#1d4ed8');
    jerseyGrad.addColorStop(1, '#172554');
    ctx.fillStyle = jerseyGrad;
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 1.05, w * 0.45, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tricolor neck border
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.82, w * 0.16, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.84, w * 0.16, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();

    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.86, w * 0.16, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();

    // Neck
    ctx.fillStyle = '#d49b73';
    ctx.fillRect(w * 0.44, h * 0.62, w * 0.12, h * 0.2);

    // Head
    const headX = w / 2;
    const headY = h * 0.46;
    const headRx = w * 0.22;
    const headRy = h * 0.26;

    ctx.fillStyle = '#e2a77e';
    ctx.beginPath();
    ctx.ellipse(headX, headY, headRx, headRy, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair styling
    ctx.fillStyle = player.id === 'sachin-tendulkar' ? '#1c1917' : '#09090b';
    ctx.beginPath();
    if (player.id === 'sachin-tendulkar') {
      ctx.arc(headX, headY * 0.7, headRx * 1.08, Math.PI * 0.8, Math.PI * 2.2);
    } else {
      ctx.ellipse(headX, headY * 0.65, headRx * 1.02, headRy * 0.5, 0, Math.PI, 0);
    }
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(w * 0.36, h * 0.38);
    ctx.lineTo(w * 0.46, h * 0.37);
    ctx.moveTo(w * 0.54, h * 0.37);
    ctx.lineTo(w * 0.64, h * 0.38);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.ellipse(w * 0.41, h * 0.42, 7, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.59, h * 0.42, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Light reflection in eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w * 0.41 - 2, h * 0.42 - 1, 2, 0, Math.PI * 2);
    ctx.arc(w * 0.59 - 2, h * 0.42 - 1, 2, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.strokeStyle = '#b47b54';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.4);
    ctx.lineTo(w * 0.48, h * 0.53);
    ctx.lineTo(w * 0.53, h * 0.53);
    ctx.stroke();

    // Lips
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.44, h * 0.62);
    ctx.quadraticCurveTo(w * 0.5, h * 0.65, w * 0.56, h * 0.62);
    ctx.stroke();

    // Beard contours
    const hasBeard = ['virat-kohli', 'rohit-sharma', 'ravindra-jadeja', 'kl-rahul', 'mohammed-shami'].includes(player.id);
    if (hasBeard) {
      ctx.fillStyle = player.id === 'ms-dhoni' ? '#52525b' : 'rgba(28, 25, 23, 0.9)';
      ctx.beginPath();
      ctx.moveTo(w * 0.32, h * 0.5);
      ctx.quadraticCurveTo(w * 0.35, h * 0.72, headX, h * 0.73);
      ctx.quadraticCurveTo(w * 0.65, h * 0.72, w * 0.68, h * 0.5);
      ctx.quadraticCurveTo(w * 0.64, h * 0.68, headX, h * 0.69);
      ctx.quadraticCurveTo(w * 0.36, h * 0.68, w * 0.32, h * 0.5);
      ctx.fill();
    }

    const dataUrl = canvas.toDataURL('image/jpeg');
    setImageSrc(dataUrl);

    // Trigger CNN pipeline
    triggerInference(canvas, player.id);
  };

  const triggerInference = async (canvas: HTMLCanvasElement, preferredId?: string) => {
    setIsProcessing(true);
    setGeminiResult(null);
    setGeminiError(null);
    try {
      const result = await runCNNInference(canvas, preferredId);
      setInferenceResult(result);
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Initial load
  useEffect(() => {
    drawPlayerToCanvas(selectedPlayer);
  }, []);

  const handleSelectSample = (player: IndianCricketer) => {
    setSelectedPlayer(player);
    setInputMode('sample');
    stopWebcam();
    drawPlayerToCanvas(player);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        canvas.width = 400;
        canvas.height = 400;
        ctx.drawImage(img, 0, 0, 400, 400);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageSrc(dataUrl);
        setInputMode('upload');
        stopWebcam();
        triggerInference(canvas);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Start webcam
  const startWebcam = async () => {
    setInputMode('webcam');
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 400, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access unavailable. You can use sample players or upload photos.');
    }
  };

  // Capture frame from webcam
  const captureWebcamFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 400;
    canvas.height = 400;
    ctx.drawImage(videoRef.current, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImageSrc(dataUrl);
    stopWebcam();
    triggerInference(canvas);
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Trigger Gemini Deep Verification
  const handleDeepVerification = async () => {
    if (!imageSrc) return;
    setIsVerifyingWithGemini(true);
    setGeminiError(null);
    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageSrc,
          mimeType: 'image/jpeg',
          playerHint: inferenceResult?.topPlayer.name,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Deep verification failed');
      }
      setGeminiResult(data.data);
    } catch (err: any) {
      console.error('Deep verification error:', err);
      setGeminiError(err.message || 'Verification service temporarily unavailable.');
    } finally {
      setIsVerifyingWithGemini(false);
    }
  };

  const currentResult = inferenceResult;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Convolutional Face Identification Pipeline
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Input an Indian cricket team image to perform facial landmark localization and CNN softmax classification.
          </p>
        </div>

        {/* Input source selector (Functional segmented button control) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => {
              setInputMode('sample');
              stopWebcam();
              drawPlayerToCanvas(selectedPlayer);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              inputMode === 'sample'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sample Roster
          </button>

          <button
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              inputMode === 'upload'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          <button
            onClick={startWebcam}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              inputMode === 'webcam'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Webcam</span>
          </button>
        </div>
      </div>

      {/* Quick Player Roster Grid (when in sample mode) */}
      {inputMode === 'sample' && (
        <div className="py-4 border-b border-slate-800/80">
          <div className="text-xs font-medium text-slate-400 mb-2">
            Select Indian Cricketer Test Sample:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {INDIAN_CRICKETERS.map((p) => {
              const isSelected = selectedPlayer.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectSample(p)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/40 text-white ring-1 ring-blue-500/50'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <PlayerAvatar player={p} size="sm" showJerseyNumber={false} />
                  <div>
                    <div className="text-xs font-semibold leading-tight text-white">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">#{p.jerseyNumber} · {p.role}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Classifier Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Image Canvas & Vision Overlays (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl aspect-square flex items-center justify-center">
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Webcam video if live */}
            {isCameraActive ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={captureWebcamFrame}
                  className="absolute bottom-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Frame for Face ID</span>
                </button>
              </div>
            ) : imageSrc ? (
              <div className="relative w-full h-full">
                {/* Rendered Face Image */}
                <img
                  src={imageSrc}
                  alt="Cricket Face Subject"
                  className="w-full h-full object-cover"
                />

                {/* Optional Grad-CAM Heatmap Overlay */}
                {showGradCam && currentResult?.gradCamHeatmapUrl && (
                  <img
                    src={currentResult.gradCamHeatmapUrl}
                    alt="Grad-CAM Attention Heatmap"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70 pointer-events-none transition-opacity"
                  />
                )}

                {/* SVG Computer Vision Overlays */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 400 400"
                >
                  {/* Face Bounding Box */}
                  {showBoundingBox && currentResult && (
                    <g>
                      <rect
                        x={currentResult.boundingBox.x}
                        y={currentResult.boundingBox.y}
                        width={currentResult.boundingBox.width}
                        height={currentResult.boundingBox.height}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="6 3"
                        rx="8"
                      />
                      {/* Corner Target Markers */}
                      <path
                        d={`M${currentResult.boundingBox.x},${currentResult.boundingBox.y + 16} L${currentResult.boundingBox.x},${currentResult.boundingBox.y} L${currentResult.boundingBox.x + 16},${currentResult.boundingBox.y}`}
                        stroke="#60a5fa"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d={`M${currentResult.boundingBox.x + currentResult.boundingBox.width - 16},${currentResult.boundingBox.y} L${currentResult.boundingBox.x + currentResult.boundingBox.width},${currentResult.boundingBox.y} L${currentResult.boundingBox.x + currentResult.boundingBox.width},${currentResult.boundingBox.y + 16}`}
                        stroke="#60a5fa"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d={`M${currentResult.boundingBox.x},${currentResult.boundingBox.y + currentResult.boundingBox.height - 16} L${currentResult.boundingBox.x},${currentResult.boundingBox.y + currentResult.boundingBox.height} L${currentResult.boundingBox.x + 16},${currentResult.boundingBox.y + currentResult.boundingBox.height}`}
                        stroke="#60a5fa"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d={`M${currentResult.boundingBox.x + currentResult.boundingBox.width - 16},${currentResult.boundingBox.y + currentResult.boundingBox.height} L${currentResult.boundingBox.x + currentResult.boundingBox.width},${currentResult.boundingBox.y + currentResult.boundingBox.height} L${currentResult.boundingBox.x + currentResult.boundingBox.width},${currentResult.boundingBox.y + currentResult.boundingBox.height - 16}`}
                        stroke="#60a5fa"
                        strokeWidth="3"
                        fill="none"
                      />

                      {/* Header Label Tag on Box */}
                      <rect
                        x={currentResult.boundingBox.x}
                        y={Math.max(10, currentResult.boundingBox.y - 24)}
                        width="150"
                        height="20"
                        fill="#1d4ed8"
                        rx="4"
                      />
                      <text
                        x={currentResult.boundingBox.x + 6}
                        y={Math.max(24, currentResult.boundingBox.y - 10)}
                        fill="#ffffff"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {currentResult.topPlayer.name} ({currentResult.confidence}%)
                      </text>
                    </g>
                  )}

                  {/* Facial Biometric Landmarks */}
                  {showLandmarks && currentResult && (
                    <g>
                      {/* Inter-pupillary Eye Horizon Line */}
                      <line
                        x1={currentResult.landmarks.leftEye.x}
                        y1={currentResult.landmarks.leftEye.y}
                        x2={currentResult.landmarks.rightEye.x}
                        y2={currentResult.landmarks.rightEye.y}
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                      />

                      {/* Nose-to-Mouth Triangle */}
                      <polygon
                        points={`${currentResult.landmarks.noseTip.x},${currentResult.landmarks.noseTip.y} ${currentResult.landmarks.mouthLeft.x},${currentResult.landmarks.mouthLeft.y} ${currentResult.landmarks.mouthRight.x},${currentResult.landmarks.mouthRight.y}`}
                        fill="rgba(56, 189, 248, 0.12)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />

                      {/* Landmark Anchor Points */}
                      {Object.entries(currentResult.landmarks).map(([key, pt]) => (
                        <g key={key}>
                          <circle cx={pt.x} cy={pt.y} r="3" fill="#38bdf8" />
                          <circle cx={pt.x} cy={pt.y} r="6" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.6" />
                        </g>
                      ))}
                    </g>
                  )}
                </svg>
              </div>
            ) : (
              <div className="text-slate-500 text-sm">No image loaded</div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center gap-2">
                <Activity className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="text-xs font-mono text-blue-400">Running Conv2D Forward Pass...</span>
              </div>
            )}
          </div>

          {/* Camera Error banner if any */}
          {cameraError && (
            <div className="p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-800 rounded-lg">
              {cameraError}
            </div>
          )}

          {/* Vision Layer Overlay Toggles */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <span className="font-medium text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Vision Overlays:</span>
            </span>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showBoundingBox}
                  onChange={(e) => setShowBoundingBox(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Bounding Box</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showLandmarks}
                  onChange={(e) => setShowLandmarks(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Facial Landmarks</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showGradCam}
                  onChange={(e) => setShowGradCam(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-amber-400 font-medium">Grad-CAM Heatmap</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Classification Results & Deep Biometrics (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {currentResult ? (
            <>
              {/* Primary Player Match Card */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <PlayerAvatar player={currentResult.topPlayer} size="lg" />
                    <div>
                      <div className="text-xs text-blue-400 font-medium tracking-wide">
                        IDENTIFIED INDIAN CRICKETER
                      </div>
                      <h3 className="text-2xl font-extrabold text-white tracking-tight">
                        {currentResult.topPlayer.name}
                      </h3>
                      {/* Clean unboxed metadata with separators */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>Jersey #{currentResult.topPlayer.jerseyNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{currentResult.topPlayer.role}</span>
                        <span aria-hidden="true">·</span>
                        <span>{currentResult.topPlayer.battingStyle}</span>
                        <span aria-hidden="true">·</span>
                        <span>Debut {currentResult.topPlayer.debutYear}</span>
                      </div>
                    </div>
                  </div>

                  {/* Classification Confidence Meter */}
                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-400">Model Confidence</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                      {currentResult.confidence}%
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                      latency: {currentResult.inferenceTimeMs}ms
                    </div>
                  </div>
                </div>

                {/* Key Career Highlights */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Matches</span>
                    <span className="font-semibold text-white font-mono tabular-nums">
                      {currentResult.topPlayer.stats.matches}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">
                      {currentResult.topPlayer.role.includes('Bowler') ? 'Wickets' : 'International Runs'}
                    </span>
                    <span className="font-semibold text-white font-mono tabular-nums">
                      {currentResult.topPlayer.role.includes('Bowler')
                        ? currentResult.topPlayer.stats.wickets
                        : currentResult.topPlayer.stats.runs?.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Hometown / State</span>
                    <span className="font-semibold text-white">{currentResult.topPlayer.hometown}</span>
                  </div>
                </div>

                {/* ICC Trophies list */}
                <div className="mt-3 text-xs text-slate-400">
                  <span className="text-slate-500 font-medium mr-1.5">Honors:</span>
                  <span>{currentResult.topPlayer.stats.iccTrophies.join(' · ')}</span>
                </div>
              </div>

              {/* CNN Probability Ranking Distribution */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span>Top-5 Class Probabilities (Softmax Distribution)</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">12 classes</span>
                </div>

                <div className="space-y-2.5">
                  {currentResult.probabilities.slice(0, 5).map((item, idx) => (
                    <div key={item.player.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500 text-[11px] w-4">{idx + 1}.</span>
                          <span className="font-medium text-slate-200">{item.player.name}</span>
                          <span className="text-slate-500 text-[11px]">#{item.player.jerseyNumber}</span>
                        </div>
                        <span className="font-mono text-slate-300 tabular-nums font-semibold">
                          {item.probability.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            idx === 0
                              ? 'bg-blue-500'
                              : idx === 1
                              ? 'bg-blue-600/70'
                              : 'bg-slate-600/50'
                          }`}
                          style={{ width: `${Math.min(100, item.probability)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biometric Feature Signature Extraction */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Facial Feature Extractor Matches</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {currentResult.biometricMatches.map((bm, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
                        <span>{bm.feature}</span>
                        <span className="font-mono text-emerald-400 tabular-nums">{bm.score}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{bm.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Inspect CNN Activations & Deep AI Verification */}
              <div className="flex flex-wrap items-center gap-3">
                {onInspectCNN && (
                  <button
                    onClick={() => onInspectCNN(currentResult)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Inspect Layer Activations & Weights</span>
                  </button>
                )}

                <button
                  onClick={handleDeepVerification}
                  disabled={isVerifyingWithGemini}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{isVerifyingWithGemini ? 'Analyzing Image Context...' : 'Run Deep AI Match Verification'}</span>
                </button>
              </div>

              {/* Deep Gemini Verification Result Section */}
              {geminiResult && (
                <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-900/60 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-semibold uppercase tracking-wider text-[11px]">
                      Deep Multimodal Verification Result
                    </span>
                    <span className="font-mono text-emerald-400 font-bold tabular-nums">
                      {geminiResult.confidence}% confidence
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white">
                    {geminiResult.identifiedPlayer} · Jersey #{geminiResult.jerseyNumber} ({geminiResult.role})
                  </div>

                  {geminiResult.matchContextEra && (
                    <div className="text-slate-300">
                      <span className="text-slate-500 mr-1.5">Context & Era:</span>
                      {geminiResult.matchContextEra}
                    </div>
                  )}

                  {geminiResult.careerMilestone && (
                    <div className="text-slate-300">
                      <span className="text-slate-500 mr-1.5">Career Milestone:</span>
                      {geminiResult.careerMilestone}
                    </div>
                  )}

                  {geminiResult.cnnExplainability && (
                    <div className="p-3 bg-slate-900/80 rounded-lg text-slate-300 leading-relaxed border border-slate-800">
                      <span className="text-blue-400 font-semibold block mb-1">
                        Biometric & Convolutional Reasoning:
                      </span>
                      {geminiResult.cnnExplainability}
                    </div>
                  )}
                </div>
              )}

              {geminiError && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                  {geminiError}
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
              Select an Indian cricket player or upload a photo to start face identification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
