import React, { useState, useRef, useEffect } from 'react';
import { MediaItem, VoicePreset } from '../../types';
import { VOICE_PRESETS } from '../../utils/initialData';
import { TTSEngine, audioEngine } from '../../utils/audioEngine';
import {
  Mic,
  Play,
  Square,
  Sparkles,
  Download,
  Volume2,
  Check,
  RefreshCw,
  Sliders,
  Radio,
  Languages,
  Activity,
} from 'lucide-react';

interface VoiceStudioWorkspaceProps {
  onSaveToVault: (item: MediaItem) => void;
  credits: number;
  onDeductCredits: (amount: number) => boolean;
  onOpenCreditModal: () => void;
  initialScript?: string;
}

const SCRIPT_TEMPLATES = [
  {
    title: 'Cinematic Prologue',
    text: 'Before the neon towers pierced the clouds, humanity made one final transmission into the deep void.',
  },
  {
    title: 'Tech Keynote',
    text: 'Today, we are announcing an entirely new creative paradigm. No latency. Complete multimodal synthesis.',
  },
  {
    title: 'Commercial Spot',
    text: 'Designed for visionary artists and sound architects. Experience 7Camz Studio today and redefine your workflow.',
  },
  {
    title: 'Calm ASMR',
    text: 'Close your eyes. Listen to the gentle rain falling against the glass, and let your mind drift into focus.',
  },
];

export const VoiceStudioWorkspace: React.FC<VoiceStudioWorkspaceProps> = ({
  onSaveToVault,
  credits,
  onDeductCredits,
  onOpenCreditModal,
  initialScript,
}) => {
  const [scriptText, setScriptText] = useState<string>(
    initialScript ||
      'In a world shaped by imagination, 7Camz Studio gives you absolute power over light, movement, and sound.'
  );
  const [selectedVoice, setSelectedVoice] = useState<VoicePreset>(VOICE_PRESETS[0]);
  const [pitch, setPitch] = useState<number>(1.0);
  const [speed, setSpeed] = useState<number>(1.0);
  const [activeFx, setActiveFx] = useState<string>('studio');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Audio spectrum visualization loop
  useEffect(() => {
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(32);

    const draw = () => {
      audioEngine.getVisualizerData(dataArray);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Render sleek audio frequency equalizer bars
      const barCount = 28;
      const barWidth = (w / barCount) - 3;

      for (let i = 0; i < barCount; i++) {
        // If speaking, use dynamic frequency data; otherwise draw subtle resting bars
        let barHeight = isSpeaking
          ? ((dataArray[i % dataArray.length] / 255) * h * 0.8) + Math.random() * 18 + 6
          : Math.sin(Date.now() * 0.003 + i * 0.3) * 6 + 10;

        const x = i * (barWidth + 3);
        const y = h - barHeight;

        // Gradient from cyan to purple
        const grad = ctx.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, '#22d3ee');
        grad.addColorStop(1, '#818cf8');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSpeaking]);

  const handleSpeak = () => {
    if (!scriptText.trim()) return;

    if (isSpeaking) {
      TTSEngine.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    TTSEngine.speak({
      text: scriptText,
      pitch: pitch,
      rate: speed,
      voiceName: selectedVoice.name,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleGenerateClone = () => {
    const success = onDeductCredits(10);
    if (!success) {
      onOpenCreditModal();
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      handleSpeak();
    }, 900);
  };

  const handleSaveToVault = () => {
    const item: MediaItem = {
      id: `voice-${Date.now()}`,
      title: `${selectedVoice.name} - ${scriptText.slice(0, 24)}...`,
      type: 'voice',
      url: '',
      thumbnail: '',
      prompt: scriptText,
      createdAt: 'Just now',
      tags: [selectedVoice.name, `${speed}x speed`, activeFx],
      duration: '00:32',
      format: 'WAV 48kHz Lossless',
      creditsUsed: 10,
    };
    onSaveToVault(item);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e1422] border border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <span>Voice Lab & Neural Speech Synthesizer</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono-numbers">
              Speech v3.8
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Generate authentic human narration, voice cloning profiles, and studio vocal processing.
          </p>
        </div>

        <button
          onClick={handleSaveToVault}
          className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm shadow-emerald-500/20"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Save Voice Stem</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Script Editor & Voice Selection */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Narration Script
                </label>
                <span className="text-xs text-slate-400 font-mono-numbers">
                  {scriptText.length} characters
                </span>
              </div>
              <textarea
                rows={5}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Type or paste narration script..."
                className="w-full p-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Quick Script Templates */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Quick Script Templates
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SCRIPT_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setScriptText(tpl.text)}
                    className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-left text-xs text-slate-300 hover:text-white transition-colors cursor-pointer truncate"
                  >
                    {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Persona Selector */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Studio Voice Persona ({VOICE_PRESETS.length} Profiles)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {VOICE_PRESETS.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVoice(v)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedVoice.id === v.id
                        ? 'bg-emerald-950/50 border-emerald-500/80 ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                        <span className="text-xs font-bold text-white">{v.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">({v.gender})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{v.role}</p>
                    </div>
                    <span className="text-[10px] font-mono-numbers text-slate-400">{v.accent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audio Spectrum Visualizer, Dials & Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real Audio Spectrum Canvas */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Live Audio Spectrum</span>
              </span>
              <span className="text-xs font-mono-numbers text-emerald-400">
                {isSpeaking ? 'TRANSMITTING' : 'STANDBY'}
              </span>
            </div>

            {/* Spectrum Visualizer Viewport */}
            <div className="h-28 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center p-2 relative overflow-hidden">
              <canvas
                ref={visualizerCanvasRef}
                width={380}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Audio Emotion & Modulation Dials */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Vocal Pitch Dynamic</span>
                  <span className="font-mono-numbers text-emerald-400">{pitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Pacing & Speaking Rate</span>
                  <span className="font-mono-numbers text-emerald-400">{speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.6"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Voice FX Processor Rack */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                FX Filter Processor
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'studio', name: 'Studio Clean' },
                  { id: 'reverb', name: 'Cathedral Reverb' },
                  { id: 'radio', name: 'Vintage Radio' },
                ].map((fx) => (
                  <button
                    key={fx.id}
                    onClick={() => setActiveFx(fx.id)}
                    className={`py-1.5 px-2 rounded text-center border font-medium transition-colors cursor-pointer ${
                      activeFx === fx.id
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {fx.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Play/Speak Action Button */}
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={handleSpeak}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  isSpeaking
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop Speech</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Listen Live Voice</span>
                  </>
                )}
              </button>

              <button
                onClick={handleGenerateClone}
                disabled={isGenerating}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
                <span>Render Stem (10 CR)</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Studio Balance: <strong className="text-cyan-300 font-mono-numbers">{credits} CR</strong></span>
              <button onClick={onOpenCreditModal} className="text-cyan-400 hover:underline">
                + Add Credits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
