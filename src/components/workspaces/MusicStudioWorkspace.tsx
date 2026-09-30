import React, { useState, useRef, useEffect } from 'react';
import { MediaItem, StemChannel } from '../../types';
import { INITIAL_STEMS } from '../../utils/initialData';
import { audioEngine } from '../../utils/audioEngine';
import {
  Play,
  Square,
  Sparkles,
  Download,
  Volume2,
  VolumeX,
  Music2,
  Check,
  RefreshCw,
  Sliders,
  Disc,
  FastForward,
  RotateCcw,
} from 'lucide-react';

interface MusicStudioWorkspaceProps {
  onSaveToVault: (item: MediaItem) => void;
  credits: number;
  onDeductCredits: (amount: number) => boolean;
  onOpenCreditModal: () => void;
  initialPrompt?: string;
  initialBpm?: number;
}

const GENRE_PRESETS = [
  { name: 'Synthwave 1984', bpm: 118, mood: 'Analog saw pads, driving 808 sub, nostalgic tape compression' },
  { name: 'Cyberpunk Midtempo', bpm: 130, mood: 'Aggressive industrial drums, glitch risers, heavy cyber bass' },
  { name: 'Lo-Fi Study Chill', bpm: 82, mood: 'Muffled vinyl hiss, warm electric piano, laidback lazy drums' },
  { name: 'Cinematic Orchestral', bpm: 95, mood: 'Volumetric timpani, soaring strings, brass swells, hybrid synths' },
];

export const MusicStudioWorkspace: React.FC<MusicStudioWorkspaceProps> = ({
  onSaveToVault,
  credits,
  onDeductCredits,
  onOpenCreditModal,
  initialPrompt,
  initialBpm,
}) => {
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || 'Surreal cosmic soundwave album artwork, vibrant fluid soundwaves intertwining with a glowing celestial sphere, 118 BPM'
  );
  const [bpm, setBpm] = useState<number>(initialBpm || 118);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 16-step grid for 4 drum/synth instruments
  const [grid, setGrid] = useState<{
    kick: boolean[];
    snare: boolean[];
    hihat: boolean[];
    synth: boolean[];
  }>({
    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    synth: [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
  });

  // Stem channels
  const [stems, setStems] = useState<StemChannel[]>(INITIAL_STEMS);

  // Sequencer timer ref
  const timerRef = useRef<number | null>(null);

  // Sequencer playback loop
  useEffect(() => {
    if (isPlaying) {
      // 16th note interval in milliseconds
      const intervalMs = (60 / bpm / 4) * 1000;

      timerRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % 16;

          // Check which instruments are active at nextStep
          if (grid.kick[nextStep]) audioEngine.playKick();
          if (grid.snare[nextStep]) audioEngine.playSnare();
          if (grid.hihat[nextStep]) audioEngine.playHiHat();
          if (grid.synth[nextStep]) audioEngine.playSynthBass(nextStep);

          return nextStep;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, grid]);

  const togglePad = (instrument: 'kick' | 'snare' | 'hihat' | 'synth', index: number) => {
    // Audition sound on pad click
    if (!grid[instrument][index]) {
      if (instrument === 'kick') audioEngine.playKick();
      if (instrument === 'snare') audioEngine.playSnare();
      if (instrument === 'hihat') audioEngine.playHiHat();
      if (instrument === 'synth') audioEngine.playSynthBass(index);
    }

    setGrid((prev) => {
      const copy = [...prev[instrument]];
      copy[index] = !copy[index];
      return { ...prev, [instrument]: copy };
    });
  };

  const handleApplyPreset = (preset: typeof GENRE_PRESETS[0]) => {
    setBpm(preset.bpm);
    setPrompt(preset.mood);

    if (preset.name.includes('Lo-Fi')) {
      setGrid({
        kick: [true, false, false, false, false, false, false, true, false, false, true, false, false, false, false, false],
        snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        hihat: [true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true],
        synth: [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
      });
    } else if (preset.name.includes('Trap')) {
      setGrid({
        kick: [true, false, false, false, false, false, true, false, false, true, false, false, false, false, false, false],
        snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
        synth: [true, false, false, false, false, false, true, false, false, false, true, false, false, false, true, false],
      });
    } else {
      setGrid({
        kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
        snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
        synth: [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
      });
    }
  };

  const handleGenerate = () => {
    const success = onDeductCredits(25);
    if (!success) {
      onOpenCreditModal();
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsPlaying(true);
    }, 1300);
  };

  const toggleMute = (id: string) => {
    setStems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isMuted: !s.isMuted } : s))
    );
  };

  const toggleSolo = (id: string) => {
    setStems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isSolo: !s.isSolo } : s))
    );
  };

  const updateStemVolume = (id: string, vol: number) => {
    setStems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, volume: vol } : s))
    );
  };

  const handleSaveToVault = () => {
    const item: MediaItem = {
      id: `music-${Date.now()}`,
      title: `Track: ${prompt.slice(0, 28)}`,
      type: 'music',
      url: '/src/assets/images/sample_album_cover_1790451833082.jpg',
      thumbnail: '/src/assets/images/sample_album_cover_1790451833082.jpg',
      prompt,
      createdAt: 'Just now',
      tags: [`${bpm} BPM`, 'WAV Master', '4 Stems'],
      duration: '02:30',
      format: 'WAV 24-bit / 48kHz',
      creditsUsed: 25,
    };
    onSaveToVault(item);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e1422] border border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <span>Music Studio & 16-Step Sequencer</span>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono-numbers">
              Synth v5.0
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Synthesize original backing tracks, sequence interactive drum beats with real Web Audio 808s, and mix stems.
          </p>
        </div>

        <button
          onClick={handleSaveToVault}
          className="px-4 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm shadow-purple-500/20"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Save Track Stems</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Track Prompt, Genre Presets & Artwork */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Music Track Prompt & Vibe
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe genre, instruments, mood, tempo..."
                className="w-full p-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Genre Presets */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Genre & Groove Presets
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {GENRE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-purple-500/60 text-left transition-all cursor-pointer"
                  >
                    <div className="font-bold text-white mb-0.5">{preset.name}</div>
                    <div className="text-[10px] text-purple-300 font-mono-numbers">{preset.bpm} BPM</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tempo BPM Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Tempo / Clock BPM</span>
                <span className="font-mono-numbers text-purple-400 font-bold">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min="70"
                max="160"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            {/* Synthesizer Album Card Preview */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <img
                src="/src/assets/images/sample_album_cover_1790451833082.jpg"
                alt="Track Master Cover"
                className="w-16 h-16 rounded-lg object-cover border border-purple-500/40 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">Cosmic Soundwave v2</div>
                <div className="text-[11px] text-purple-300 font-mono-numbers">Mastered: 24-Bit / 48kHz WAV</div>
                <div className="text-[10px] text-slate-400 mt-1">4 Isolated Stem Channels Ready</div>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Audio Matrix...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Generate Full Track (25 Credits)</span>
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

        {/* Right Column: Real 16-Step Beatmaker & 4-Stem Mixer */}
        <div className="lg:col-span-7 space-y-4">
          {/* Real 16-Step Sequencer Console */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2.5 rounded-full font-bold transition-all cursor-pointer shadow-md flex items-center justify-center ${
                    isPlaying
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                  }`}
                  title={isPlaying ? 'Stop Sequencer' : 'Play Sequencer'}
                >
                  {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    16-Step Beat Sequencer
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Click any pad to toggle beat · Real Web Audio output
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono-numbers text-cyan-400">
                <span>STEP: {currentStep + 1} / 16</span>
              </div>
            </div>

            {/* Step Grid (4 Instruments x 16 Steps) */}
            <div className="space-y-2.5 pt-2">
              {[
                { key: 'kick' as const, label: '808 KICK', color: '#06b6d4' },
                { key: 'snare' as const, label: 'SNARE', color: '#3b82f6' },
                { key: 'hihat' as const, label: 'HI-HAT', color: '#8b5cf6' },
                { key: 'synth' as const, label: 'SYNTH BASS', color: '#ec4899' },
              ].map((inst) => (
                <div key={inst.key} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono-numbers">
                    <span className="font-bold text-white">{inst.label}</span>
                    <span>1/16th</span>
                  </div>
                  <div className="grid grid-cols-16 gap-1">
                    {grid[inst.key].map((isActive, stepIdx) => {
                      const isCurrent = currentStep === stepIdx && isPlaying;
                      return (
                        <button
                          key={stepIdx}
                          onClick={() => togglePad(inst.key, stepIdx)}
                          className={`h-9 rounded-md transition-all cursor-pointer relative ${
                            isActive
                              ? 'shadow-sm'
                              : 'bg-slate-950 border border-slate-800/80 hover:border-slate-700'
                          } ${isCurrent ? 'ring-2 ring-white scale-105 z-10' : ''}`}
                          style={{
                            backgroundColor: isActive ? inst.color : undefined,
                          }}
                          title={`${inst.label} Step ${stepIdx + 1}`}
                        >
                          {/* Quarter beat accent dots */}
                          {stepIdx % 4 === 0 && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-500/50" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Channel Stem Mixer */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Isolated Stem Channel Mixer</span>
              </span>
              <span className="text-[11px] font-mono-numbers text-slate-400">
                Lossless Output Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stems.map((stem) => (
                <div
                  key={stem.id}
                  className={`p-3 rounded-xl border transition-all ${
                    stem.isMuted
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stem.color }} />
                      <span className="text-xs font-bold text-white">{stem.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleMute(stem.id)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                          stem.isMuted
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        MUTE
                      </button>
                      <button
                        onClick={() => toggleSolo(stem.id)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                          stem.isSolo
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        SOLO
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono-numbers">
                      <span>Gain Level</span>
                      <span className="text-purple-300 font-bold">{stem.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stem.volume}
                      onChange={(e) => updateStemVolume(stem.id, Number(e.target.value))}
                      className="w-full accent-purple-400 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
