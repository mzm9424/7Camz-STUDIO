import React, { useState, useRef, useEffect } from 'react';
import { MediaItem, TimelineClip } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Film,
  Camera,
  Layers,
  Volume2,
  Type,
  Check,
  RefreshCw,
  Clock,
  Scissors,
  Repeat,
} from 'lucide-react';

interface VideoStudioWorkspaceProps {
  onSaveToVault: (item: MediaItem) => void;
  credits: number;
  onDeductCredits: (amount: number) => boolean;
  onOpenCreditModal: () => void;
  incomingImage?: string;
  incomingPrompt?: string;
}

export const VideoStudioWorkspace: React.FC<VideoStudioWorkspaceProps> = ({
  onSaveToVault,
  credits,
  onDeductCredits,
  onOpenCreditModal,
  incomingImage,
  incomingPrompt,
}) => {
  const [prompt, setPrompt] = useState<string>(
    incomingPrompt || 'Continuous aerial dolly push through neon skyscraper canyons, atmospheric fog, rain droplets on camera lens, 60fps'
  );
  const [motionIntensity, setMotionIntensity] = useState<number>(7);
  const [cameraStyle, setCameraStyle] = useState<string>('dolly_push');
  const [fps, setFps] = useState<number>(60);
  const [duration, setDuration] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [subtitleText, setSubtitleText] = useState<string>('7Camz Neural Cinematic Sequence');
  const [subtitleStyle, setSubtitleStyle] = useState<'cyber' | 'minimal' | 'yellow'>('cyber');

  // Multi-track clips
  const [clips, setClips] = useState<TimelineClip[]>([
    { id: 'clip-v1', title: 'Cyber City Establishing', track: 'video', start: 0, duration: 5, color: '#3b82f6' },
    { id: 'clip-v2', title: 'Anamorphic Flythrough', track: 'video', start: 5, duration: 5, color: '#06b6d4' },
    { id: 'clip-a1', title: 'Cinematic Sub-bass & Drone', track: 'audio', start: 0, duration: 10, color: '#8b5cf6' },
    { id: 'clip-t1', title: 'Caption: 7Camz Cinematic', track: 'subtitle', start: 1, duration: 6, color: '#f59e0b' },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  // Load initial background image for video rendering
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = incomingImage || '/src/assets/images/sample_cinematic_landscape_1790451823686.jpg';
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, [incomingImage]);

  // Video playback loop on canvas
  useEffect(() => {
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt;
          if (next >= duration) {
            return isLooping ? 0 : duration;
          }
          return next;
        });
      }

      // Draw canvas frame
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          ctx.clearRect(0, 0, w, h);

          // Calculate normalized progress (0 to 1)
          const progress = duration > 0 ? currentTime / duration : 0;

          // Camera motion simulation
          const img = bgImageRef.current;
          if (img && img.complete) {
            ctx.save();

            let scale = 1.0;
            let transX = 0;
            let transY = 0;

            if (cameraStyle === 'dolly_push') {
              scale = 1.0 + progress * (motionIntensity * 0.04);
              transY = -progress * 15;
            } else if (cameraStyle === 'pan_right') {
              scale = 1.15;
              transX = -progress * (motionIntensity * 12);
            } else if (cameraStyle === 'orbital') {
              scale = 1.1 + Math.sin(progress * Math.PI) * 0.1;
              transX = Math.sin(progress * Math.PI * 2) * 15;
              transY = Math.cos(progress * Math.PI * 2) * 8;
            } else {
              scale = 1.05 + Math.sin(progress * Math.PI) * 0.05;
            }

            // Draw image with simulated camera transform
            ctx.translate(w / 2, h / 2);
            ctx.scale(scale, scale);
            ctx.translate(-w / 2 + transX, -h / 2 + transY);

            ctx.drawImage(img, 0, 0, w, h);
            ctx.restore();
          } else {
            // Gradient fallback
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, '#090d16');
            grad.addColorStop(1, '#1e293b');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
          }

          // Atmospheric dust particles
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          for (let i = 0; i < 25; i++) {
            const px = ((i * 47 + currentTime * 40 * (i % 3 + 1)) % w);
            const py = ((i * 31 + Math.sin(currentTime + i) * 20) % h);
            ctx.beginPath();
            ctx.arc(px, py, (i % 3) * 0.8 + 0.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Cinematic letterbox bars
          const letterboxH = h * 0.06;
          ctx.fillStyle = '#060a12';
          ctx.fillRect(0, 0, w, letterboxH);
          ctx.fillRect(0, h - letterboxH, w, letterboxH);

          // Subtitle overlay (if between start and end)
          if (subtitleText && currentTime > 0.5 && currentTime < duration - 0.5) {
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            if (subtitleStyle === 'cyber') {
              ctx.font = 'bold 20px "JetBrains Mono", monospace';
              ctx.fillStyle = '#22d3ee';
              ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
              ctx.shadowBlur = 10;
            } else if (subtitleStyle === 'yellow') {
              ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
              ctx.fillStyle = '#fde047';
              ctx.shadowColor = '#000000';
              ctx.shadowBlur = 6;
            } else {
              ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
              ctx.fillStyle = '#f8fafc';
              ctx.shadowColor = '#000000';
              ctx.shadowBlur = 4;
            }

            ctx.fillText(subtitleText, w / 2, h - letterboxH - 16);
            ctx.restore();
          }

          // Frame timestamp watermark in top right
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.textAlign = 'right';
          const currentFrame = Math.floor(currentTime * fps);
          const totalFrames = Math.floor(duration * fps);
          ctx.fillText(`FR ${currentFrame} / ${totalFrames} · ${fps} FPS`, w - 16, letterboxH - 6);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, duration, isLooping, currentTime, cameraStyle, motionIntensity, fps, subtitleText, subtitleStyle]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const success = onDeductCredits(30);
    if (!success) {
      onOpenCreditModal();
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      // Refresh background plate and start playing
      setIsGenerating(false);
      setCurrentTime(0);
      setIsPlaying(true);
    }, 1500);
  };

  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
  };

  const handleCaptureFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `7camz-frame-${Math.floor(currentTime * 100)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSaveVault = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const item: MediaItem = {
      id: `vid-${Date.now()}`,
      title: prompt.slice(0, 32) || 'Cinematic Video Render',
      type: 'video',
      url: canvas.toDataURL('image/png'),
      thumbnail: canvas.toDataURL('image/png'),
      prompt,
      createdAt: 'Just now',
      tags: ['Video Master', `${fps}fps`, `${duration}s`, cameraStyle],
      duration: formatTimecode(duration),
      dimensions: '1920 x 1080',
      format: 'MP4 / ProRes',
      creditsUsed: 30,
    };
    onSaveToVault(item);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e1422] border border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <span>Video Studio & Timeline Motion Engine</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono-numbers">
              Timeline v4.2
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Generate cinematic motion, sequence camera dynamics, and edit multi-track video, audio & subtitles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCaptureFrame}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Capture Frame</span>
          </button>
          <button
            onClick={handleSaveVault}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm shadow-blue-500/20"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Project</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Motion Prompts & Camera Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Video Motion Prompt
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe subject motion, camera speed, atmospheric lighting..."
                className="w-full p-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Camera Motion Selection */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Camera Dynamics & Lens
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'dolly_push', name: 'Dolly Push Forward' },
                  { id: 'pan_right', name: 'Horizontal Pan Tracking' },
                  { id: 'orbital', name: 'Orbital 360 Sweep' },
                  { id: 'tilt_reveal', name: 'Vertical Tilt Reveal' },
                ].map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => setCameraStyle(cam.id)}
                    className={`p-2.5 rounded-lg text-left font-semibold border transition-all cursor-pointer ${
                      cameraStyle === cam.id
                        ? 'bg-blue-950/60 border-blue-500 text-blue-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cam.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Motion Intensity Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Motion Scale Intensity</span>
                <span className="font-mono-numbers text-cyan-400">{motionIntensity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={motionIntensity}
                onChange={(e) => setMotionIntensity(Number(e.target.value))}
                className="w-full accent-blue-400 cursor-pointer"
              />
            </div>

            {/* Framerate & Duration */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Timeline FPS
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                  {[24, 30, 60].map((val) => (
                    <button
                      key={val}
                      onClick={() => setFps(val)}
                      className={`py-1 text-[11px] font-mono-numbers rounded font-medium transition-colors cursor-pointer ${
                        fps === val
                          ? 'bg-blue-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {val}fps
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Clip Duration
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                  {[5, 10, 15].map((val) => (
                    <button
                      key={val}
                      onClick={() => {
                        setDuration(val);
                        if (currentTime > val) setCurrentTime(0);
                      }}
                      className={`py-1 text-[11px] font-mono-numbers rounded font-medium transition-colors cursor-pointer ${
                        duration === val
                          ? 'bg-blue-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {val}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subtitle / Caption Customizer */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Overlay Subtitle Track
              </label>
              <input
                type="text"
                value={subtitleText}
                onChange={(e) => setSubtitleText(e.target.value)}
                placeholder="Subtitle text to display on video..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                {(['cyber', 'yellow', 'minimal'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setSubtitleStyle(style)}
                    className={`flex-1 py-1 text-[11px] font-medium rounded border capitalize transition-colors cursor-pointer ${
                      subtitleStyle === style
                        ? 'bg-blue-950 border-blue-400 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {style} Style
                  </button>
                ))}
              </div>
            </div>

            {/* Render Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Keyframe Vectors...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Render Video Master (30 Credits)</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Studio Balance: <strong className="text-cyan-300 font-mono-numbers">{credits} CR</strong></span>
              <button onClick={onOpenCreditModal} className="text-cyan-400 hover:underline">
                + Add Credits
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Canvas Video Viewport & Multi-Track Timeline */}
        <div className="lg:col-span-7 space-y-4">
          {/* Canvas Video Monitor */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-2xl">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-contain"
            />

            {/* Player Controls Scrim at Bottom of Viewport */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-white text-slate-950 hover:bg-cyan-300 rounded-full transition-colors cursor-pointer shadow-md"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Rewind to start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    isLooping ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-400 hover:text-white'
                  }`}
                  title={isLooping ? 'Looping enabled' : 'Looping disabled'}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Timecode display */}
                <div className="text-xs font-mono-numbers text-white font-bold ml-2">
                  <span className="text-cyan-400">{formatTimecode(currentTime)}</span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="text-slate-300">{formatTimecode(duration)}</span>
                </div>
              </div>

              <div className="text-xs font-mono-numbers text-slate-400">
                {cameraStyle.toUpperCase()} · {fps} FPS
              </div>
            </div>
          </div>

          {/* Scrubber Bar */}
          <div className="px-2">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.05"
              value={currentTime}
              onChange={handleScrubberChange}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Multi-Track Timeline Editor */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Multi-Track Sequence Tracks</span>
              </div>
              <span className="text-[11px] font-mono-numbers text-slate-400">
                Playhead: {currentTime.toFixed(2)}s
              </span>
            </div>

            {/* Track 1: Video Track */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                  <Film className="w-3.5 h-3.5" />
                  <span>V1: Primary Motion Video</span>
                </span>
                <span>{duration}s</span>
              </div>
              <div className="relative h-10 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center p-1">
                <div
                  className="h-full rounded bg-gradient-to-r from-blue-700 to-cyan-600 flex items-center px-3 text-xs text-white font-medium border border-blue-400/40"
                  style={{ width: '100%' }}
                >
                  <span className="truncate">{prompt.slice(0, 48)}</span>
                </div>
                {/* Playhead marker line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Track 2: Audio Track */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>A1: Atmospheric Soundtrack</span>
                </span>
                <span>Stereo 48kHz</span>
              </div>
              <div className="relative h-8 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center p-1">
                <div
                  className="h-full rounded bg-gradient-to-r from-purple-800 to-indigo-700 flex items-center px-3 text-[11px] text-purple-200 border border-purple-500/30"
                  style={{ width: '100%' }}
                >
                  <span>♪ Cyber Ambient Soundscape Stem</span>
                </div>
                {/* Playhead line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Track 3: Subtitle Track */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Type className="w-3.5 h-3.5" />
                  <span>T1: Neural Captions</span>
                </span>
                <span>Active</span>
              </div>
              <div className="relative h-7 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center p-1">
                <div
                  className="h-full rounded bg-amber-950/80 text-amber-300 border border-amber-600/40 flex items-center px-2 text-[10px] font-mono-numbers truncate ml-[10%] w-[80%]"
                >
                  "{subtitleText}"
                </div>
                {/* Playhead line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
