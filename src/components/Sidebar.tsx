import React from 'react';
import { WorkspaceType } from '../types';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Video as VideoIcon,
  Mic,
  Music2,
  Video,
  FolderArchive,
  CreditCard,
  Globe2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Rocket,
} from 'lucide-react';

interface SidebarProps {
  activeTab: WorkspaceType;
  setActiveTab: (tab: WorkspaceType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  credits: number;
  onOpenCreditModal: () => void;
  onOpenDirectorModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  credits,
  onOpenCreditModal,
  onOpenDirectorModal,
}) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'image', label: 'Image Studio', icon: ImageIcon },
    { id: 'video', label: 'Video Studio', icon: VideoIcon },
    { id: 'voice', label: 'Voice Lab', icon: Mic },
    { id: 'music', label: 'Music Studio', icon: Music2 },
    { id: 'livecam', label: 'LiveCam & OBS', icon: Video },
    { id: 'vault', label: 'Media Vault', icon: FolderArchive },
    { id: 'deployments', label: 'Deployments', icon: Rocket },
    { id: 'imagelab', label: 'Vision AI Lab', icon: Sparkles, highlight: true },
    { id: 'pricing', label: 'Credit Packs', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {!isCollapsed && (
        <div
          onClick={() => setIsCollapsed(true)}
          className="fixed inset-0 top-[53px] bg-black/60 backdrop-blur-xs z-25 lg:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-[53px] h-[calc(100vh-53px)] z-30 flex flex-col justify-between bg-[#0b0f17] border-r border-slate-800/80 transition-all duration-200 shrink-0 ${
          isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-64 shadow-2xl lg:shadow-none'
        }`}
      >
        {/* Navigation list */}
        <div className="p-3 space-y-1">
          <div className="flex items-center justify-between px-2 py-2 mb-2">
            {!isCollapsed && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Workspaces
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors ml-auto cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as WorkspaceType);
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    setIsCollapsed(true);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/90 text-cyan-300 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-cyan-400' : (item as any).highlight ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate whitespace-nowrap text-left">{item.label}</span>
                )}
              </div>
              {!isCollapsed && (item as any).highlight && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-numbers">
                  4K AI
                </span>
              )}
            </button>
          );
        })}

        {/* Studio Engine Status Widget */}
        {!isCollapsed && (
          <div className="pt-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-semibold text-slate-300">Vision Engine</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">4K Active</span>
            </div>
          </div>
        )}

        {/* AI Director launcher banner in sidebar */}
        {!isCollapsed && (
          <div className="pt-4 mt-4 border-t border-slate-800/60">
            <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-950/40 to-blue-950/30 border border-cyan-800/40">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-xs font-semibold text-cyan-200">Multimodal Director</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                Coordinate 1 prompt into Image, Video, Voice & Music simultaneously.
              </p>
              <button
                onClick={onOpenDirectorModal}
                className="w-full py-1.5 px-2.5 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors font-sans cursor-pointer whitespace-nowrap"
              >
                Launch Director
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom credits & studio status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Studio Balance</span>
              <span className="font-mono-numbers text-cyan-300 font-bold">{credits.toLocaleString()} CR</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                style={{ width: `${Math.min(100, (credits / 5000) * 100)}%` }}
              />
            </div>
            <button
              onClick={onOpenCreditModal}
              className="w-full py-1.5 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/80 rounded border border-slate-700/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Get Credit Packs</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenCreditModal}
            className="w-full flex justify-center py-2 text-amber-400 hover:text-amber-300"
            title="Studio Balance: Click to top up"
          >
            <Zap className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  </>
);
};
