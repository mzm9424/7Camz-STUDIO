import React, { useState } from 'react';
import { StudioProjectBrief } from '../../types';
import { X, Sparkles, Copy, Check, ArrowRight, Wand2, Layers, Film, Mic, Music, Image as ImageIcon } from 'lucide-react';

interface ScriptDirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBrief: (brief: StudioProjectBrief) => void;
}

const PRESET_CONCEPTS: StudioProjectBrief[] = [
  {
    conceptTitle: 'Neo-Tokyo Cyber Runner 2099',
    summary: 'High-octane cyberpunk sci-fi chase through rain-slicked skyscraper glass canyons.',
    imagePrompt: 'Cinematic wide-angle view of a futuristic neon city canyon with flying vehicles and glowing architectural glass towers at dusk, golden hour rim reflections, 8k aesthetic, high octane cinematography',
    imageStyle: 'Cyber Cinematic 8K',
    videoPrompt: 'Continuous aerial dolly push forward through holographic skyscraper billboards and flying traffic, anamorphic blue lens flare, 60fps',
    videoMotion: 'Hyper-dolly zoom with anamorphic lens flare',
    voiceScript: 'In 2099, memory is the only currency left worth dying for. Keep running... they are tapping into the grid right now.',
    voicePersona: 'Atlas - Deep Cinematic Narrator',
    musicGenre: 'Darksynth / Cyberpunk Midtempo',
    musicBpm: 128,
    musicMood: 'Aggressive analog pulse with heavy distorted 808 sub and cyber arpeggio',
  },
  {
    conceptTitle: 'Travertine Architectural Fragrance Commercial',
    summary: 'Quiet luxury, minimalist sculptural marble, warm sunlight and warm ambient strings.',
    imagePrompt: 'Minimalist luxury perfume flacon resting on warm raw travertine marble pedestal, soft morning sunlight casting dramatic architectural diagonal shadows, high fashion editorial grade, Leica 50mm f/1.4',
    imageStyle: 'Minimalist Luxury',
    videoPrompt: 'Ultra-slow floating camera orbit around perfume bottle, liquid refraction playing in natural golden sunlight, 120fps slow-motion',
    videoMotion: 'Smooth orbital micro-pan 0.5x speed',
    voiceScript: 'Timeless form. Pure extraction. The new essence born between sunlight and stone.',
    voicePersona: 'Lyra - Soft ASMR & Meditation',
    musicGenre: 'Ambient Neo-Classical',
    musicBpm: 78,
    musicMood: 'Ethereal felt piano chords with gentle tape warmth and sustained cello drones',
  },
  {
    conceptTitle: 'Next-Gen Spatial Computing OS Launch',
    summary: 'High-energy tech keynote revealing holographic gestures and neural creativity.',
    imagePrompt: 'Futuristic creator wearing sleek translucent titanium spatial eyewear, interacting with floating holographic multi-track timeline, clean studio dark slate background, volumetric rim lighting',
    imageStyle: 'Modern Tech Keynote',
    videoPrompt: 'Rapid match-cut between user finger pinch gesture and spatial canvas exploding into 3D audio-visual waveforms, sleek motion graphics',
    videoMotion: 'Dynamic match-cut with speed ramps',
    voiceScript: 'We spent the last three years rethinking the creative canvas from first principles. Today, imagination meets zero latency.',
    voicePersona: 'Nova - Energetic Tech Host',
    musicGenre: 'Future Bass / Tech Innovation',
    musicBpm: 135,
    musicMood: 'Crisp bright synth plucks, uplifting chord drops, punchy modern drums',
  },
];

export const ScriptDirectorModal: React.FC<ScriptDirectorModalProps> = ({
  isOpen,
  onClose,
  onApplyBrief,
}) => {
  const [topicInput, setTopicInput] = useState<string>('');
  const [currentBrief, setCurrentBrief] = useState<StudioProjectBrief>(PRESET_CONCEPTS[0]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleGenerate = () => {
    if (!topicInput.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      // Intelligently generate a coordinated multimodal brief
      const newBrief: StudioProjectBrief = {
        conceptTitle: topicInput,
        summary: `Custom multi-modal creative production designed for "${topicInput}". Coordinated across visual, temporal, vocal and harmonic stems.`,
        imagePrompt: `Masterpiece visual composition showcasing ${topicInput}, dramatic atmospheric lighting, rich tactile textures, cinematic 8k resolution, Leica 35mm aesthetic, photorealistic editorial finish.`,
        imageStyle: 'Cinematic Ultra-Realistic',
        videoPrompt: `Cinematic tracking shot featuring ${topicInput}, sweeping forward camera movement with smooth stabilization, dynamic depth of field shift, 60fps cinematic grade.`,
        videoMotion: 'Smooth cinematic tracking push with lens bokeh',
        voiceScript: `Welcome to the frontier. When you look closely at ${topicInput}, you realize that every detail was crafted with singular purpose. This is where innovation begins.`,
        voicePersona: 'Atlas - Deep Cinematic Narrator',
        musicGenre: 'Cinematic Electronic Hybrid',
        musicBpm: 116,
        musicMood: `Atmospheric synth pad progression transitioning into a driving rhythmic bassline tailored for ${topicInput}.`,
      };
      setCurrentBrief(newBrief);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0c121e] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-display text-white">
              AI Multimodal Creative Director
            </h2>
            <p className="text-xs text-slate-400">
              Transform one concept into coordinated Image, Video, Voice & Music production scripts.
            </p>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Enter Concept, Story Idea, or Brand Brief:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. Deep ocean bioluminescent research expedition submarine..."
              className="flex-1 px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topicInput.trim()}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              {isGenerating ? <Wand2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span>Generate 4-Way Brief</span>
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium shrink-0">Sample Briefs:</span>
            {PRESET_CONCEPTS.map((concept, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBrief(concept)}
                className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 cursor-pointer ${
                  currentBrief.conceptTitle === concept.conceptTitle
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {concept.conceptTitle}
              </button>
            ))}
          </div>
        </div>

        {/* Current Coordinated Brief Preview (4 Quadrants) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentBrief.conceptTitle}</span>
                <span className="text-[11px] font-normal text-slate-400">({currentBrief.summary})</span>
              </h3>
            </div>
            <button
              onClick={() => onApplyBrief(currentBrief)}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Apply to All Studios</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Image Studio Brief */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                    <ImageIcon className="w-4 h-4" />
                    <span>Image Studio Recipe</span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentBrief.imagePrompt, 'image')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Copy Image Prompt"
                  >
                    {copiedSection === 'image' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[11px] text-cyan-300 font-mono-numbers mb-1.5">Style: {currentBrief.imageStyle}</div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                  {currentBrief.imagePrompt}
                </p>
              </div>
            </div>

            {/* 2. Video Studio Brief */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                    <Film className="w-4 h-4" />
                    <span>Video Studio Motion</span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentBrief.videoPrompt, 'video')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Copy Video Prompt"
                  >
                    {copiedSection === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[11px] text-blue-300 font-mono-numbers mb-1.5">Camera: {currentBrief.videoMotion}</div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                  {currentBrief.videoPrompt}
                </p>
              </div>
            </div>

            {/* 3. Voiceover Studio Brief */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                    <Mic className="w-4 h-4" />
                    <span>Voiceover Narration Script</span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentBrief.voiceScript, 'voice')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Copy Voice Script"
                  >
                    {copiedSection === 'voice' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[11px] text-emerald-300 font-mono-numbers mb-1.5">Persona: {currentBrief.voicePersona}</div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/80 italic">
                  "{currentBrief.voiceScript}"
                </p>
              </div>
            </div>

            {/* 4. Music Studio Brief */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
                    <Music className="w-4 h-4" />
                    <span>Music Stem & Beat Direction</span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentBrief.musicMood, 'music')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Copy Music Prompt"
                  >
                    {copiedSection === 'music' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[11px] text-purple-300 font-mono-numbers mb-1.5">
                  {currentBrief.musicGenre} · {currentBrief.musicBpm} BPM
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                  {currentBrief.musicMood}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Applying this brief will set inputs and styles in the Image, Video, Voice & Music studios.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApplyBrief(currentBrief);
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Load Into Workstations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
