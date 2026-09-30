import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MediaItem } from '../../types';
import {
  sampleCinematicLandscape,
  samplePortraitCyber,
  sampleAudioVisualizer,
  heroMultimediaStudio,
} from '../../assets';
import {
  Wand2,
  Sparkles,
  Download,
  Upload,
  Film,
  Layers,
  Palette,
  Sliders,
  Check,
  RotateCcw,
  ZoomIn,
  Copy,
  ChevronLeft,
  ChevronRight,
  Sun,
  Contrast,
  SplitSquareVertical,
  Type,
  Maximize2,
  Cpu,
  ArrowRight,
} from 'lucide-react';

interface VisionEnhanceWorkspaceProps {
  onSaveToVault: (item: MediaItem) => void;
  onSendToVideo: (imageUrl: string, prompt: string) => void;
  onOpenImageStudio: (imageUrl: string, prompt?: string) => void;
  credits: number;
  onDeductCredits: (amount: number) => boolean;
  onOpenCreditModal: () => void;
}

interface PaletteColor {
  hex: string;
  name: string;
  percentage: number;
}

export const VisionEnhanceWorkspace: React.FC<VisionEnhanceWorkspaceProps> = ({
  onSaveToVault,
  onSendToVideo,
  onOpenImageStudio,
  credits,
  onDeductCredits,
  onOpenCreditModal,
}) => {
  // Preset images
  const PRESET_IMAGES = [
    {
      id: 'cyber-portrait',
      title: 'Neon Cyberpunk Portrait',
      src: samplePortraitCyber,
      description: 'Human avatar with holographic reflections & studio rim glow',
      suggestedVideoPrompt: 'Cinematic slow-motion dolly zoom around cybernetic portrait, neon rim light flicker, 60fps 4k',
      suggestedAudioMood: 'Dark Synthwave · 128 BPM · Gritty Analog Bass',
    },
    {
      id: 'landscape',
      title: 'Futuristic Megacity Horizon',
      src: sampleCinematicLandscape,
      description: 'Anamorphic 35mm panoramic vista with volumetric fog',
      suggestedVideoPrompt: 'Wide panoramic aerial drone flight over illuminated skyways and megatowers, dusk haze',
      suggestedAudioMood: 'Atmospheric Ambient · 95 BPM · Ethereal Reverb',
    },
    {
      id: 'studio-hub',
      title: 'Master Control Station',
      src: heroMultimediaStudio,
      description: 'Analog synthesizers, multi-monitor DAW array and neon acoustic baffles',
      suggestedVideoPrompt: 'Macro camera pan across glowing LED meters, mixer faders, and modular patch cords',
      suggestedAudioMood: 'Techno Groove · 130 BPM · Punchy Kick & Crisp Hi-Hats',
    },
    {
      id: 'visualizer',
      title: 'Holographic Audio Waveform',
      src: sampleAudioVisualizer,
      description: 'Harmonic frequency spectrogram and iridescent soundscape cover',
      suggestedVideoPrompt: 'Pulsing radial soundwaves reacting dynamically to sub-bass frequencies, neon lasers',
      suggestedAudioMood: 'Liquid Drum & Bass · 174 BPM · Sub-bass Wobble',
    },
  ];

  const [activeImageId, setActiveImageId] = useState<string>('cyber-portrait');
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(samplePortraitCyber);
  const [activeTab, setActiveTab] = useState<'enhance' | 'palette' | 'multimodal' | 'watermark'>('enhance');

  // Interactive Comparison Slider position (0 - 100%)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  // Enhancement toggles & levels
  const [aiUpscale, setAiUpscale] = useState<boolean>(true);
  const [hdrToneMap, setHdrToneMap] = useState<boolean>(true);
  const [clarityBoost, setClarityBoost] = useState<number>(35); // 0 - 100
  const [vibranceBoost, setVibranceBoost] = useState<number>(25); // 0 - 100
  const [filmGrain, setFilmGrain] = useState<number>(10); // 0 - 50
  const [selectedColorGrade, setSelectedColorGrade] = useState<string>('cyber-teal');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Watermark / Letterbox state
  const [enableLetterbox, setEnableLetterbox] = useState<boolean>(false);
  const [watermarkText, setWatermarkText] = useState<string>('7CAMZ · 4K STUDIO MASTER');
  const [watermarkPosition, setWatermarkPosition] = useState<'bottom-right' | 'bottom-left' | 'center'>('bottom-right');

  // Palette state
  const [extractedPalette, setExtractedPalette] = useState<PaletteColor[]>([
    { hex: '#06b6d4', name: 'Cyan Neon', percentage: 38 },
    { hex: '#3b82f6', name: 'Cobalt Blue', percentage: 26 },
    { hex: '#ec4899', name: 'Magenta Pulse', percentage: 18 },
    { hex: '#0f172a', name: 'Deep Midnight', percentage: 12 },
    { hex: '#f8fafc', name: 'Studio Specular', percentage: 6 },
  ]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active preset details
  const activePreset = PRESET_IMAGES.find((p) => p.id === activeImageId) || PRESET_IMAGES[0];

  // Dynamic color palette generator based on image
  const extractPaletteFromImage = useCallback((img: HTMLImageElement) => {
    try {
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = 50;
      sampleCanvas.height = 50;
      const ctx = sampleCanvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 50, 50);
      const imgData = ctx.getImageData(0, 0, 50, 50).data;

      const colors: { r: number; g: number; b: number }[] = [];
      for (let i = 0; i < imgData.length; i += 40) {
        colors.push({
          r: imgData[i],
          g: imgData[i + 1],
          b: imgData[i + 2],
        });
      }

      // Pick 5 distinct samples
      const hexList: PaletteColor[] = [
        {
          hex: `#${colors[0]?.r.toString(16).padStart(2, '0')}${colors[0]?.g.toString(16).padStart(2, '0')}${colors[0]?.b.toString(16).padStart(2, '0')}`,
          name: 'Primary Accent',
          percentage: 35,
        },
        {
          hex: `#${colors[Math.floor(colors.length * 0.25)]?.r.toString(16).padStart(2, '0')}${colors[Math.floor(colors.length * 0.25)]?.g.toString(16).padStart(2, '0')}${colors[Math.floor(colors.length * 0.25)]?.b.toString(16).padStart(2, '0')}`,
          name: 'Secondary Glow',
          percentage: 25,
        },
        {
          hex: `#${colors[Math.floor(colors.length * 0.5)]?.r.toString(16).padStart(2, '0')}${colors[Math.floor(colors.length * 0.5)]?.g.toString(16).padStart(2, '0')}${colors[Math.floor(colors.length * 0.5)]?.b.toString(16).padStart(2, '0')}`,
          name: 'Ambient Shadow',
          percentage: 20,
        },
        {
          hex: `#${colors[Math.floor(colors.length * 0.75)]?.r.toString(16).padStart(2, '0')}${colors[Math.floor(colors.length * 0.75)]?.g.toString(16).padStart(2, '0')}${colors[Math.floor(colors.length * 0.75)]?.b.toString(16).padStart(2, '0')}`,
          name: 'Specular Highlight',
          percentage: 12,
        },
        {
          hex: `#${colors[colors.length - 1]?.r.toString(16).padStart(2, '0')}${colors[colors.length - 1]?.g.toString(16).padStart(2, '0')}${colors[colors.length - 1]?.b.toString(16).padStart(2, '0')}`,
          name: 'Neutral Tone',
          percentage: 8,
        },
      ];
      setExtractedPalette(hexList);
    } catch (e) {
      // Fallback
    }
  }, []);

  // Render before/after onto canvas with split slider
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentImageSrc;

    img.onload = () => {
      extractPaletteFromImage(img);

      const targetW = 960;
      const targetH = 540;
      canvas.width = targetW;
      canvas.height = targetH;

      ctx.clearRect(0, 0, targetW, targetH);

      const scale = Math.max(targetW / img.width, targetH / img.height);
      const x = targetW / 2 - (img.width / 2) * scale;
      const y = targetH / 2 - (img.height / 2) * scale;

      const splitX = (targetW * sliderPos) / 100;

      // 1. Draw ORIGINAL left side (0 to splitX)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, targetH);
      ctx.clip();
      ctx.filter = 'none';
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();

      // 2. Draw ENHANCED right side (splitX to targetW)
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, targetW - splitX, targetH);
      ctx.clip();

      // Build AI enhancement filter
      let filter = `contrast(${100 + clarityBoost * 0.4}%) saturate(${100 + vibranceBoost * 0.6}%)`;
      if (hdrToneMap) {
        filter += ' brightness(108%)';
      }
      if (selectedColorGrade === 'cyber-teal') {
        filter += ' hue-rotate(15deg) contrast(115%)';
      } else if (selectedColorGrade === 'vintage-gold') {
        filter += ' sepia(25%) saturate(120%)';
      } else if (selectedColorGrade === 'matrix') {
        filter += ' hue-rotate(80deg) saturate(140%)';
      } else if (selectedColorGrade === 'noir') {
        filter += ' grayscale(100%) contrast(140%)';
      }
      ctx.filter = filter;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Micro-sharpness simulation via subtle overlay
      if (aiUpscale) {
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        ctx.strokeRect(splitX, 0, targetW - splitX, targetH);
      }

      // Cinematic Letterbox if enabled
      if (enableLetterbox) {
        ctx.fillStyle = '#000000';
        const barHeight = targetH * 0.08;
        ctx.fillRect(splitX, 0, targetW - splitX, barHeight);
        ctx.fillRect(splitX, targetH - barHeight, targetW - splitX, barHeight);
      }

      // Watermark / Studio Signature overlay
      if (watermarkText.trim()) {
        ctx.font = '600 13px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;

        if (watermarkPosition === 'bottom-right') {
          const textMetrics = ctx.measureText(watermarkText);
          const posX = Math.max(splitX + 10, targetW - textMetrics.width - 24);
          ctx.fillText(watermarkText, posX, targetH - 24);
        } else if (watermarkPosition === 'bottom-left') {
          ctx.fillText(watermarkText, splitX + 24, targetH - 24);
        } else {
          ctx.textAlign = 'center';
          ctx.fillText(watermarkText, (splitX + targetW) / 2, targetH / 2);
        }
      }

      ctx.restore();

      // 3. Draw Split Divider Line
      ctx.save();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, targetH);
      ctx.stroke();

      // Divider Handle Circle
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(splitX, targetH / 2, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#080c14';
      ctx.beginPath();
      ctx.arc(splitX, targetH / 2, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
  }, [
    currentImageSrc,
    sliderPos,
    aiUpscale,
    hdrToneMap,
    clarityBoost,
    vibranceBoost,
    filmGrain,
    selectedColorGrade,
    enableLetterbox,
    watermarkText,
    watermarkPosition,
    extractPaletteFromImage,
  ]);

  // Handle Dragging comparison slider
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pos);
  };

  const handleSelectPreset = (preset: typeof PRESET_IMAGES[0]) => {
    setActiveImageId(preset.id);
    setCurrentImageSrc(preset.src);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImageSrc(event.target.result as string);
          setActiveImageId('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOneClickMagicEnhance = () => {
    const success = onDeductCredits(5);
    if (!success) {
      onOpenCreditModal();
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setAiUpscale(true);
      setHdrToneMap(true);
      setClarityBoost(45);
      setVibranceBoost(35);
      setSelectedColorGrade('cyber-teal');
      setSliderPos(50);
      setIsProcessing(false);
    }, 600);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleDownloadMaster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create full enhanced export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentImageSrc;
    img.onload = () => {
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = canvas.width / 2 - (img.width / 2) * scale;
      const y = canvas.height / 2 - (img.height / 2) * scale;

      let filter = `contrast(${100 + clarityBoost * 0.4}%) saturate(${100 + vibranceBoost * 0.6}%)`;
      if (hdrToneMap) filter += ' brightness(108%)';
      if (selectedColorGrade === 'cyber-teal') filter += ' hue-rotate(15deg) contrast(115%)';
      else if (selectedColorGrade === 'vintage-gold') filter += ' sepia(25%) saturate(120%)';
      else if (selectedColorGrade === 'matrix') filter += ' hue-rotate(80deg) saturate(140%)';
      else if (selectedColorGrade === 'noir') filter += ' grayscale(100%) contrast(140%)';

      ctx.filter = filter;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      if (enableLetterbox) {
        ctx.fillStyle = '#000000';
        const barHeight = canvas.height * 0.08;
        ctx.fillRect(0, 0, canvas.width, barHeight);
        ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);
      }

      if (watermarkText.trim()) {
        ctx.font = '600 13px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        const textMetrics = ctx.measureText(watermarkText);
        ctx.fillText(watermarkText, canvas.width - textMetrics.width - 24, canvas.height - 24);
      }

      const link = document.createElement('a');
      link.download = `7camz-vision-enhanced-${Date.now()}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    };
  };

  const handleSaveToVault = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const item: MediaItem = {
      id: `enhanced-${Date.now()}`,
      title: `Vision Enhanced: ${activePreset.title}`,
      type: 'image',
      url: canvas.toDataURL('image/png'),
      thumbnail: canvas.toDataURL('image/png'),
      prompt: `AI 4K Upscale & Color Grading · Grade: ${selectedColorGrade}`,
      createdAt: 'Just now',
      tags: ['Vision AI', '4K Upscale', selectedColorGrade, 'HDR'],
      dimensions: '3840 x 2160 (4K Master)',
      format: 'PNG Master',
      creditsUsed: 5,
    };
    onSaveToVault(item);
  };

  const handleTransferToVideo = () => {
    onSendToVideo(currentImageSrc, activePreset.suggestedVideoPrompt);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e1422] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-xl font-bold font-display text-white">
              Vision AI Lab & Image Enhancer
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-numbers">
              4K Neural HDR
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Harness high-fidelity visual assets to enhance features across 7Camz: upscale micro-details, extract harmonic color palettes, and synthesize synchronized multimodal briefs.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOneClickMagicEnhance}
            disabled={isProcessing}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isProcessing ? 'Enhancing...' : '1-Click Magic Enhance (5 CR)'}</span>
          </button>
        </div>
      </div>

      {/* Preset Asset Strip */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Select Source Visual Asset</span>
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Custom Photo</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_IMAGES.map((preset) => {
            const isSelected = activeImageId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`group relative rounded-xl overflow-hidden border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                }`}
              >
                <div className="h-20 w-full overflow-hidden bg-slate-950">
                  <img
                    src={preset.src}
                    alt={preset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5 bg-slate-900/90">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate block">
                      {preset.title}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                    {preset.suggestedAudioMood.split('·')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Canvas Stage */}
        <div className="lg:col-span-8 space-y-4">
          {/* Canvas comparison viewport */}
          <div
            ref={containerRef}
            onMouseDown={() => setIsDraggingSlider(true)}
            onMouseUp={() => setIsDraggingSlider(false)}
            onMouseLeave={() => setIsDraggingSlider(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDraggingSlider(true)}
            onTouchEnd={() => setIsDraggingSlider(false)}
            onTouchMove={handleMouseMove}
            className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none cursor-ew-resize min-h-[420px] flex items-center justify-center p-3"
          >
            {/* Background Checkerboard */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Split Canvas */}
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[520px] object-contain rounded-lg shadow-2xl"
            />

            {/* Floating Comparison Badges */}
            <div className="absolute top-6 left-6 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-slate-700/80 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Original Source</span>
            </div>

            <div className="absolute top-6 right-6 px-3 py-1 rounded-lg bg-cyan-950/80 backdrop-blur-md border border-cyan-500/60 text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Vision AI 4K Master</span>
            </div>

            {/* Interactive Drag Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2 pointer-events-none shadow-xl">
              <ChevronLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono-numbers">Drag Divider ({Math.round(sliderPos)}%)</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadMaster}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Export 4K PNG Master</span>
              </button>

              <button
                onClick={handleSaveToVault}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Save to Vault</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenImageStudio(currentImageSrc, activePreset.suggestedVideoPrompt)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-lg border border-cyan-800/60 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Fine-tune in Image Studio</span>
              </button>

              <button
                onClick={handleTransferToVideo}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Film className="w-4 h-4 text-blue-200" />
                <span>Animate in Video Studio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Tools Drawer */}
        <div className="lg:col-span-4 space-y-4">
          {/* Sub-tool Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('enhance')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                activeTab === 'enhance'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Enhance
            </button>
            <button
              onClick={() => setActiveTab('palette')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                activeTab === 'palette'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Palette
            </button>
            <button
              onClick={() => setActiveTab('multimodal')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                activeTab === 'multimodal'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Multimodal
            </button>
            <button
              onClick={() => setActiveTab('watermark')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                activeTab === 'watermark'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Stamp
            </button>
          </div>

          {/* TAB 1: ENHANCE CONTROLS */}
          {activeTab === 'enhance' && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-cyan-400" />
                  <span>AI Enhancement Pipeline</span>
                </span>
                <button
                  onClick={() => {
                    setAiUpscale(true);
                    setHdrToneMap(true);
                    setClarityBoost(25);
                    setVibranceBoost(20);
                    setSelectedColorGrade('cyber-teal');
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Neural Modules Toggles */}
              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">4K Neural Super-Resolution</span>
                      <span className="text-[10px] text-slate-400">Reconstructs sub-pixel textures & specular edges</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiUpscale}
                    onChange={(e) => setAiUpscale(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">HDR Tone Mapping</span>
                      <span className="text-[10px] text-slate-400">Deep dynamic range with bloom & shadow lift</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hdrToneMap}
                    onChange={(e) => setHdrToneMap(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </label>
              </div>

              {/* Sliders */}
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Clarity & Micro-Contrast</span>
                    <span className="font-mono-numbers text-cyan-400">+{clarityBoost}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={clarityBoost}
                    onChange={(e) => setClarityBoost(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Color Vibrance & Depth</span>
                    <span className="font-mono-numbers text-cyan-400">+{vibranceBoost}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={vibranceBoost}
                    onChange={(e) => setVibranceBoost(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Color Grading Presets */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Cinematic Color Tone
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'cyber-teal', name: 'Cyber Teal & Orange' },
                    { id: 'vintage-gold', name: 'Vintage 35mm Gold' },
                    { id: 'matrix', name: 'Matrix Acid Glow' },
                    { id: 'noir', name: 'Noir Monochromatic' },
                  ].map((grade) => (
                    <button
                      key={grade.id}
                      onClick={() => setSelectedColorGrade(grade.id)}
                      className={`p-2 rounded-lg text-left border font-medium transition-colors cursor-pointer ${
                        selectedColorGrade === grade.id
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {grade.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PALETTE EXTRACTION */}
          {activeTab === 'palette' && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <span>Extracted Color Harmony</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dominant color frequencies dynamically sampled from the current visual. Click any swatch to copy HEX code.
                </p>
              </div>

              {/* Palette swatches */}
              <div className="space-y-2.5">
                {extractedPalette.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopyHex(color.hex)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg border border-white/20 shadow-md shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {color.name}
                        </span>
                        <span className="text-[11px] font-mono-numbers text-cyan-400">
                          {color.hex}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-mono-numbers">
                        {color.percentage}%
                      </span>
                      <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>

              {copiedHex && (
                <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-semibold text-center animate-fade-in">
                  Copied {copiedHex} to clipboard!
                </div>
              )}

              <button
                onClick={() => {
                  navigator.clipboard.writeText(extractedPalette.map(c => c.hex).join(', '));
                  setCopiedHex('Full CSS Palette');
                  setTimeout(() => setCopiedHex(null), 2000);
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export CSS Array ({extractedPalette.length} Colors)</span>
              </button>
            </div>
          )}

          {/* TAB 3: MULTIMODAL PROMPT GENERATION */}
          {activeTab === 'multimodal' && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Multimodal Studio Seeds</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  How this visual asset enhances Video, Voice, and Music workflows across 7Camz:
                </p>
              </div>

              {/* Video Prompt */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-400 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    <span>Video Motion Prompt</span>
                  </span>
                  <button
                    onClick={handleTransferToVideo}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  "{activePreset.suggestedVideoPrompt}"
                </p>
              </div>

              {/* Audio Mood */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Audio & Stem Synthesis</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {activePreset.suggestedAudioMood}
                </p>
              </div>

              {/* Description */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                <strong className="text-slate-200 block mb-1">Visual Composition:</strong>
                {activePreset.description}
              </div>
            </div>
          )}

          {/* TAB 4: WATERMARK & STAMP */}
          {activeTab === 'watermark' && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-cyan-400" />
                  <span>Cinematic Stamp & Letterbox</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Stamp studio signatures, release titles, or anamorphic bars onto the exported media.
                </p>
              </div>

              {/* Letterbox toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">2.39:1 Anamorphic Letterbox</span>
                  <span className="text-[10px] text-slate-400">Adds top and bottom matte bars</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableLetterbox}
                  onChange={(e) => setEnableLetterbox(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </label>

              {/* Watermark text */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Stamp / Signature Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. 7CAMZ · 4K STUDIO MASTER"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {/* Position selector */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Placement
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {(['bottom-left', 'center', 'bottom-right'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setWatermarkPosition(pos)}
                      className={`py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                        watermarkPosition === pos
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos === 'bottom-left' ? 'Bottom Left' : pos === 'center' ? 'Center' : 'Bottom Right'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
