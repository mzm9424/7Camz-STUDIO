import React from 'react';
import { WorkspaceType } from '../types';
import { Coins, Sparkles, ExternalLink, Globe2, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: WorkspaceType;
  setActiveTab: (tab: WorkspaceType) => void;
  credits: number;
  onOpenCreditModal: () => void;
  onOpenDirectorModal: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  credits,
  onOpenCreditModal,
  onOpenDirectorModal,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-3 sm:px-6 py-3 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Wordmark with Mobile Menu Toggle & Vision AI Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-white font-display flex items-center gap-2 hover:text-cyan-400 transition-colors shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>7Camz-STUDIO</span>
        </a>

        {/* Vision AI Engine Status Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Vision AI 4K Active</span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('overview')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeTab === 'overview' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('imagelab')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'imagelab' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Vision Lab</span>
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeTab === 'image' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Image Studio
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeTab === 'video' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Video Studio
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeTab === 'voice' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Voice Lab
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeTab === 'music' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Music Studio
        </button>
        <button
          onClick={() => setActiveTab('livecam')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeTab === 'livecam' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          LiveCam
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${
            activeTab === 'vault' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          Vault
        </button>
        <button
          onClick={() => setActiveTab('deployments')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'deployments' ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5' : ''
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Deployments</span>
        </button>
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenCreditModal}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          title="Click to view plans and add credits"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono-numbers text-amber-300 font-bold">{credits.toLocaleString()}</span>
          <span className="text-slate-400 hidden sm:inline">Credits</span>
          <span className="text-cyan-400 text-[11px] font-medium">+ Add</span>
        </button>

        <button
          onClick={onOpenDirectorModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg shadow-sm shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap font-bold"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>AI Director</span>
        </button>
      </div>
    </header>
  );
};
