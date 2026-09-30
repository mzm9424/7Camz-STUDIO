import React, { useState, useRef, useEffect } from 'react';
import { ImageAdjustments, MediaItem } from '../../types';
import {
  Wand2,
  Sliders,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  Layers,
  Crop,
  Check,
  RotateCcw,
  Palette,
  Eraser,
  Eye,
  Film,
} from 'lucide-react';

interface ImageStudioWorkspaceProps {
  onSaveToVault: (item: MediaItem) => void;
  onSendToVideo: (imageUrl: string, prompt: string) => void;
  credits: number;
  onDeductCredits: (amount: number) => boolean;
  onOpenCreditModal: () => void;
  initialPrompt?: string;
}

const STYLE_PRESETS = [
  { id: 'cinematic', name: 'Cinematic 8K', promptSuffix: 'cinematic lighting, 8k resolution, photorealistic, 35mm film grain, anamorphic lens flare' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', promptSuffix: 'vibrant neon reflections, futuristic tech, rainy dark city, glowing cyan and magenta accents' },
  { id: 'minimalist', name: 'Travertine Minimalist', promptSuffix: 'minimalist architectural aesthetic, soft natural morning shadows, raw stone textures, editorial luxury' },
  { id: 'portrait', name: 'Studio Portrait', promptSuffix: 'studio rim lighting, soft diffuse shadows, sharp eye reflections, 85mm portrait lens, commercial grade' },
  { id: 'anime', name: 'Anime Concept Art', promptSuffix: 'Makoto Shinkai aesthetic, lush painterly clouds, vibrant emotive colors, detailed linework' },
  { id: '3d_render', name: 'Octane 3D Render', promptSuffix: 'octane render, metallic and glass refraction, volumetric lighting, ray tracing, studio backdrop' },
];

export const ImageStudioWorkspace: React.FC<ImageStudioWorkspaceProps> = ({
  onSaveToVault,
  onSendToVideo,
  credits,
  onDeductCredits,
  onOpenCreditModal,
  initialPrompt,
}) => {
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || 'Cinematic portrait of a futuristic digital creator wearing studio monitor headphones, subtle iridescent holographic reflection'
  );
  const [selectedStyle, setSelectedStyle] = useState<string>('cinematic');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '9:16' | '4:3'>('16:9');
  const [resolution, setResolution] = useState<'1080p' | '2K' | '4K'>('2K');
  const [activeTab, setActiveTab] = useState<'create' | 'edit'>('edit');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isInpainting, setIsInpainting] = useState<boolean>(false);
  const [removeBgActive, setRemoveBgActive] = useState<boolean>(false);

  // Active image URL (starts with high-res generated asset)
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(
    '/src/assets/images/sample_cinematic_landscape_1790451823686.jpg'
  );

  // Image editing adjustments
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hueRotate: 0,
    sepia: 0,
    vignette: 0,
    aspectRatio: '16:9',
  });

  const [activeLut, setActiveLut] = useState<string>('original');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Redraw canvas whenever adjustments, LUT, or image changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentImageSrc;

    img.onload = () => {
      // Set canvas size based on selected aspect ratio
      let targetW = 960;
      let targetH = 540;
      if (aspectRatio === '1:1') {
        targetW = 600;
        targetH = 600;
      } else if (aspectRatio === '9:16') {
        targetW = 450;
        targetH = 800;
      } else if (aspectRatio === '4:3') {
        targetW = 800;
        targetH = 600;
      }

      canvas.width = targetW;
      canvas.height = targetH;

      ctx.clearRect(0, 0, targetW, targetH);

      // Save context
      ctx.save();

      // Apply CSS-like filter string to canvas context
      let filterString = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px) hue-rotate(${adjustments.hueRotate}deg) sepia(${adjustments.sepia}%)`;

      if (activeLut === 'cyber') {
        filterString += ' saturate(140%) hue-rotate(180deg) contrast(110%)';
      } else if (activeLut === 'noir') {
        filterString += ' grayscale(100%) contrast(140%)';
      } else if (activeLut === 'golden') {
        filterString += ' sepia(35%) saturate(130%) contrast(105%)';
      } else if (activeLut === 'vivid') {
        filterString += ' saturate(180%) contrast(120%)';
      }

      ctx.filter = filterString;

      // Draw image covering canvas with aspect-fill
      const scale = Math.max(targetW / img.width, targetH / img.height);
      const x = targetW / 2 - (img.width / 2) * scale;
      const y = targetH / 2 - (img.height / 2) * scale;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      ctx.restore();

      // Apply vignette if > 0
      if (adjustments.vignette > 0) {
        const gradient = ctx.createRadialGradient(
          targetW / 2,
          targetH / 2,
          targetW / 4,
          targetW / 2,
          targetH / 2,
          targetW / 1.5
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${adjustments.vignette / 100})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, targetW, targetH);
      }

      // If simulated background remover is active, show checkerboard border
      if (removeBgActive) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, targetW, targetH);
      }
    };
  }, [currentImageSrc, adjustments, activeLut, aspectRatio, removeBgActive]);

  const handleResetAdjustments = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hueRotate: 0,
      sepia: 0,
      vignette: 0,
      aspectRatio,
    });
    setActiveLut('original');
    setRemoveBgActive(false);
  };

  const handleEnhancePrompt = () => {
    const styleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle);
    const addition = styleObj ? styleObj.promptSuffix : 'award winning masterpiece, 8k resolution, photorealistic';
    setPrompt((prev) => `${prev.trim()}, ${addition}`);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const cost = resolution === '4K' ? 20 : resolution === '2K' ? 12 : 8;
    const success = onDeductCredits(cost);
    if (!success) {
      onOpenCreditModal();
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      // Rotate among pristine generated studio assets
      const sampleAssets = [
        '/src/assets/images/sample_cinematic_landscape_1790451823686.jpg',
        '/src/assets/images/sample_portrait_cyber_1790451811965.jpg',
        '/src/assets/images/sample_album_cover_1790451833082.jpg',
      ];
      const nextImg = sampleAssets[Math.floor(Math.random() * sampleAssets.length)];
      setCurrentImageSrc(nextImg);
      setIsGenerating(false);
      setActiveTab('edit');
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImageSrc(event.target.result as string);
          setActiveTab('edit');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `7camz-render-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSaveVault = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const item: MediaItem = {
      id: `img-${Date.now()}`,
      title: prompt.slice(0, 32) || 'Studio Render',
      type: 'image',
      url: canvas.toDataURL('image/png'),
      thumbnail: canvas.toDataURL('image/png'),
      prompt,
      createdAt: 'Just now',
      tags: ['7Camz Render', resolution, aspectRatio],
      dimensions: `${canvas.width} x ${canvas.height}`,
      format: 'PNG',
      creditsUsed: 12,
    };
    onSaveToVault(item);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Studio Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e1422] border border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <span>Image Studio & Live Editor</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-numbers">
              Neural v3.4
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Generate high-resolution visual assets and fine-tune color, contrast, inpainting, and lighting.
          </p>
        </div>

        {/* Segmented Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'create'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Generate Prompt
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Canvas Editor & LUTs
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Controls or Editor Sliders */}
        <div className="lg:col-span-5 space-y-5">
          {activeTab === 'create' ? (
            /* GENERATOR PANEL */
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Prompt Input
                  </label>
                  <button
                    onClick={handleEnhancePrompt}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Enhance with AI</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your scene in detail..."
                  className="w-full p-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
                />
              </div>

              {/* Preset Styles */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Art Style Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-2.5 rounded-lg text-left text-xs font-semibold border transition-all cursor-pointer ${
                        selectedStyle === style.id
                          ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio and Resolution */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                    {(['16:9', '1:1', '9:16', '4:3'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-1 text-[11px] font-mono-numbers rounded font-medium transition-colors cursor-pointer ${
                          aspectRatio === ratio
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Render Fidelity
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                    {(['1080p', '2K', '4K'] as const).map((res) => (
                      <button
                        key={res}
                        onClick={() => setResolution(res)}
                        className={`py-1 text-[11px] font-mono-numbers rounded font-medium transition-colors cursor-pointer ${
                          resolution === res
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Latents...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Generate Image ({resolution === '4K' ? 20 : resolution === '2K' ? 12 : 8} Credits)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Studio Balance: <strong className="text-cyan-300 font-mono-numbers">{credits} CR</strong></span>
                <button onClick={onOpenCreditModal} className="text-cyan-400 hover:underline">
                  + Add Credits
                </button>
              </div>
            </div>
          ) : (
            /* LIVE CANVAS EDITOR SLIDERS */
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Color & Lighting Adjustments</span>
                </span>
                <button
                  onClick={handleResetAdjustments}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  title="Reset to default values"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Sliders list */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Brightness</span>
                    <span className="font-mono-numbers text-cyan-400">{adjustments.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="180"
                    value={adjustments.brightness}
                    onChange={(e) => setAdjustments({ ...adjustments, brightness: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Contrast</span>
                    <span className="font-mono-numbers text-cyan-400">{adjustments.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={adjustments.contrast}
                    onChange={(e) => setAdjustments({ ...adjustments, contrast: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Saturation</span>
                    <span className="font-mono-numbers text-cyan-400">{adjustments.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={adjustments.saturation}
                    onChange={(e) => setAdjustments({ ...adjustments, saturation: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Vignette Edge</span>
                    <span className="font-mono-numbers text-cyan-400">{adjustments.vignette}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={adjustments.vignette}
                    onChange={(e) => setAdjustments({ ...adjustments, vignette: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Hue Shift</span>
                    <span className="font-mono-numbers text-cyan-400">{adjustments.hueRotate}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={adjustments.hueRotate}
                    onChange={(e) => setAdjustments({ ...adjustments, hueRotate: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Soft Blur Focus</span>
                    <span className="font-mono-numbers text-cyan-400">{adjustments.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={adjustments.blur}
                    onChange={(e) => setAdjustments({ ...adjustments, blur: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Instant Studio LUT filters */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Studio LUT Presets
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: 'original', name: 'Raw Natural' },
                    { id: 'cyber', name: 'Cyber Glow' },
                    { id: 'noir', name: 'Noir Film' },
                    { id: 'golden', name: 'Warm Amber' },
                    { id: 'vivid', name: 'High Pop' },
                  ].map((lut) => (
                    <button
                      key={lut.id}
                      onClick={() => setActiveLut(lut.id)}
                      className={`py-1.5 px-2 rounded text-center border font-medium transition-colors cursor-pointer ${
                        activeLut === lut.id
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lut.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Tools: Inpainting & Background Remover */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  AI Repair & Isolation
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRemoveBgActive(!removeBgActive)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      removeBgActive
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{removeBgActive ? 'BG Removed' : 'Isolate Subject'}</span>
                  </button>
                  <button
                    onClick={() => setIsInpainting(!isInpainting)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isInpainting
                        ? 'bg-amber-950 border-amber-400 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span>{isInpainting ? 'Brush Active' : 'Object Erase'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick upload local photo to edit */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-white block">Upload Your Own Image</span>
              <span>JPG, PNG, WebP up to 25MB</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select File</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Canvas Viewport & Export bar */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Canvas Viewport Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[460px] flex items-center justify-center p-4 shadow-2xl">
            {/* Transparent checkerboard background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              className={`max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl transition-all ${
                isInpainting ? 'cursor-crosshair' : 'cursor-default'
              }`}
            />

            {/* Inpainting HUD helper */}
            {isInpainting && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/50 text-amber-300 text-xs font-medium flex items-center gap-2">
                <Eraser className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Object Erase Brush Mode Enabled</span>
              </div>
            )}

            {/* Live Dimensions Overlay */}
            <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono-numbers text-slate-400 border border-slate-800">
              Aspect: {aspectRatio} · {resolution} Fidelity
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Export PNG Master</span>
              </button>

              <button
                onClick={handleSaveVault}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Save to Vault</span>
              </button>
            </div>

            <button
              onClick={() => onSendToVideo(currentImageSrc, prompt)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Film className="w-4 h-4 text-blue-200" />
              <span>Send Image to Video Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
