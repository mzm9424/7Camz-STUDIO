import React, { useState } from 'react';
import { WorkspaceType, MediaItem, StudioProjectBrief } from '../../types';
import {
  Sparkles,
  Image as ImageIcon,
  Film,
  Mic,
  Music2,
  Video,
  ArrowRight,
  Zap,
  Play,
  Download,
  Copy,
  Sliders,
  Check,
  Globe2,
  ExternalLink,
  GraduationCap,
  Award,
} from 'lucide-react';

interface OverviewWorkspaceProps {
  setActiveTab: (tab: WorkspaceType) => void;
  mediaItems: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  onOpenCreditModal: () => void;
  onOpenDirectorModal: () => void;
  onQuickGenerate: (prompt: string) => void;
}

export const OverviewWorkspace: React.FC<OverviewWorkspaceProps> = ({
  setActiveTab,
  mediaItems,
  onSelectMedia,
  onOpenCreditModal,
  onOpenDirectorModal,
  onQuickGenerate,
}) => {
  const [quickPrompt, setQuickPrompt] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onQuickGenerate(quickPrompt);
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Showcase Section */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0e1422] shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_multimedia_studio_1790451799150.jpg"
            alt="7Camz-STUDIO Multimedia Workstation"
            className="w-full h-full object-cover object-center opacity-30 filter saturate-150"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090d16] via-[#090d16]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Next-Generation Neural Production Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white mb-4 leading-tight">
            Create & Edit <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">Images, Videos, Voice & Music</span> in One Unified Canvas.
          </h1>

          <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed max-w-2xl">
            7Camz-STUDIO combines deep generative AI with professional timeline editing, real-time procedural synthesizers, voice cloning, and live OBS broadcast overlays.
          </p>

          {/* Quick Prompt Bar */}
          <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-2 max-w-2xl mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Describe anything (e.g., Cyberpunk rain street race with heavy synthwave beat)..."
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={!quickPrompt.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate Studio</span>
            </button>
          </form>

          {/* Quick metadata line */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>4 Workspaces</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Audio Engine</span>
            <span aria-hidden="true">·</span>
            <span>Live Web Audio Synthesizer</span>
            <span aria-hidden="true">·</span>
            <span>Zero GPU Queue</span>
          </div>
        </div>
      </div>

      {/* 4 Studio Core Workspaces Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white">Creative Production Suites</h2>
            <p className="text-xs text-slate-400">Dedicated creative engines with live editing toolkits</p>
          </div>
          <button
            onClick={onOpenDirectorModal}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open AI Director</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Image Studio */}
          <div
            onClick={() => setActiveTab('image')}
            className="group relative p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono-numbers text-slate-400">4K / Inpaint</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                Image Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Text-to-Image generation, lighting adjustments, inpaint brush, aspect ratio crops, and resolution upscaling.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
              <span>Open Image Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Video Studio */}
          <div
            onClick={() => setActiveTab('video')}
            className="group relative p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/50 text-blue-400 group-hover:scale-105 transition-transform">
                  <Film className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono-numbers text-slate-400">Timeline / 60FPS</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                Video Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Multi-track timeline, camera motion controls (dolly, orbit, pan), dynamic particle canvas, and subtitle generator.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:translate-x-0.5 transition-transform">
              <span>Open Video Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Voice Studio */}
          <div
            onClick={() => setActiveTab('voice')}
            className="group relative p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 group-hover:scale-105 transition-transform">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono-numbers text-slate-400">Live TTS / FX</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                Voice Lab
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Real text-to-speech voice generation with emotional pitch dials, voice changer presets, and real audio frequency visualizer.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
              <span>Open Voice Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Music Studio */}
          <div
            onClick={() => setActiveTab('music')}
            className="group relative p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-800/50 text-purple-400 group-hover:scale-105 transition-transform">
                  <Music2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono-numbers text-slate-400">16-Step Sequencer</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                Music Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                AI prompt synthesizer, interactive 16-step beatmaker with real Web Audio 808s, and 4-channel stem mixer.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:translate-x-0.5 transition-transform">
              <span>Open Music Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Studio Projects & Media Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white">Recent Studio Renders</h2>
            <p className="text-xs text-slate-400">Inspect, remix, or edit your latest multimedia creations</p>
          </div>
          <button
            onClick={() => setActiveTab('vault')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All in Vault ({mediaItems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mediaItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMedia(item)}
              className="group bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-cyan-400">
                    <Mic className="w-8 h-8" />
                  </div>
                )}

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                  {item.type}
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[11px] font-mono-numbers bg-black/80 backdrop-blur-md text-cyan-300">
                  {item.duration || item.dimensions || item.format}
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {item.prompt}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>{item.createdAt}</span>
                  <div className="flex items-center gap-1 text-cyan-400 font-semibold group-hover:underline">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BookFUA & Fuaprint Studios Official Ecosystem Synergy Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#070d18] via-[#0d1628] to-[#0a101f] border border-cyan-500/30 shadow-xl relative overflow-hidden bookfua-glow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe2 className="w-4 h-4" />
              <span>Official Creative Agency Integration</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400">bookfua.com</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-white mb-2">
              Powered in Synergy with Fuaprint Studios & BookFUA
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              "We decorate the world with premium digital solutions." Seamlessly transition from 7Camz automated generative creation to Fuaprint Studios human post-production, branding masterclasses, and global ad campaigns.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('bookfua')}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch BookFUA Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href="https://bookfua.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Visit bookfua.com</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </a>

              <a
                href="https://app.bookfua.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-slate-400 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
              >
                <span>app.bookfua.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <Award className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white">Agency Quality</div>
              <div className="text-[10px] text-slate-400">Fuaprint Studios</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <GraduationCap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-white">Masterclasses</div>
              <div className="text-[10px] text-slate-400">CapCut · AI · Ads</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookfua-inspired Studio Station Highlights: LiveCam & Credit Packs Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LiveCam / OBS integration */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0e1628] to-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Video className="w-4 h-4" />
              <span>LiveCam & Broadcast Overlays</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Stream Directly to OBS, YouTube & Twitch
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Apply real-time cinema color LUTs, virtual lower-third graphic cards, and studio camera calibration right inside your browser window.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('livecam')}
            className="w-fit px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Launch LiveCam Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Credit System Overview */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#131b2c] to-slate-900 border border-cyan-900/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              <span>Creator Credit Architecture</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Pay As You Create · Zero Subscription Locks
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Purchase one-time credit packs starting at $19. Every render grants 100% commercial licensing and lossless cloud vault storage.
            </p>
          </div>
          <button
            onClick={onOpenCreditModal}
            className="w-fit px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <span>View Credit Packs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
