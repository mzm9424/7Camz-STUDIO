import React, { useState } from 'react';
import { ProjectDeployment, MediaItem } from '../../types';
import {
  ExternalLink,
  GitBranch,
  GitCommit,
  CheckCircle2,
  RefreshCw,
  Clock,
  Terminal,
  Layers,
  Globe2,
  Sparkles,
  Play,
  Monitor,
  Smartphone,
  Tablet,
  X,
  Copy,
  Check,
  Plus,
  Send,
  Zap,
} from 'lucide-react';

interface DeploymentsWorkspaceProps {
  deployments: ProjectDeployment[];
  onAddDeployment: (deployment: ProjectDeployment) => void;
  onUpdateDeploymentStatus: (id: string, status: 'ready' | 'building' | 'error') => void;
  mediaItems: MediaItem[];
  onOpenCreditModal: () => void;
}

export const DeploymentsWorkspace: React.FC<DeploymentsWorkspaceProps> = ({
  deployments,
  onAddDeployment,
  onUpdateDeploymentStatus,
  mediaItems,
  onOpenCreditModal,
}) => {
  const [selectedInspect, setSelectedInspect] = useState<ProjectDeployment | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<ProjectDeployment | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  // New deploy form
  const [newAppName, setNewAppName] = useState<string>('campaign-microsite');
  const [newFramework, setNewFramework] = useState<'Next.js' | 'React SPA' | 'SvelteKit' | 'HTML5 Video'>('Next.js');
  const [newBranch, setNewBranch] = useState<string>('main');
  const [selectedMediaId, setSelectedMediaId] = useState<string>(mediaItems[0]?.id || '');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCreateDeployment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    setIsDeploying(true);

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} (UTC)`;

    const newDep: ProjectDeployment = {
      id: `dep-${Date.now()}`,
      name: newAppName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      appFramework: newFramework,
      target: 'custom',
      status: 'building',
      previewUrl: `https://${newAppName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}-preview.edge.app`,
      updatedAt: formattedDate,
      branch: newBranch,
      commitHash: Math.random().toString(16).substring(2, 9),
      commitMessage: `feat(deploy): published 7Camz studio assets to Vercel Edge`,
      assetsCount: mediaItems.length,
      environment: 'preview',
      deployDuration: 'Building...',
      logs: [
        `[${now.toLocaleTimeString()}] Triggered instant Vercel Git deployment for "${newAppName}"`,
        `[${now.toLocaleTimeString()}] Framework detected: ${newFramework}`,
        `[${now.toLocaleTimeString()}] Bundling multimedia assets and responsive player shell...`,
        `[${now.toLocaleTimeString()}] Compiling edge serverless functions & image optimization...`,
        `[${now.toLocaleTimeString()}] Deploying to global edge network (18 regions)...`,
      ],
    };

    onAddDeployment(newDep);
    setIsDeployModalOpen(false);

    // Simulate build finishing after 3.5 seconds
    setTimeout(() => {
      onUpdateDeploymentStatus(newDep.id, 'ready');
      setIsDeploying(false);
    }, 3500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e1422] border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Vercel for Git & Edge Previews</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2.5">
            <span>Project Deployments & Live Previews</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono-numbers">
              Monorepo CI/CD
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Publish your generated images, videos, audio stems, and creative studio portfolios to live edge preview environments with one click.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Deploy New Preview</span>
          </button>
        </div>
      </div>

      {/* Primary Vercel Git Comment Card (Faithfully inspired by the uploaded visual) */}
      <div className="relative rounded-2xl bg-[#0b0f17] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Card Top Comment Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center gap-3 bg-[#0d121c]">
          {/* Vercel Iconic Black Triangle Avatar */}
          <div className="w-8 h-8 rounded-lg bg-black border border-slate-700 flex items-center justify-center shrink-0 shadow-inner">
            <svg
              viewBox="0 0 76 65"
              fill="white"
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold text-white tracking-tight">vercel</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400 font-mono-numbers">
              bot
            </span>
            <span className="text-slate-400 text-xs">commented on April 14, 2022</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-200">
              The latest updates on your project.{' '}
              <a
                href="https://vercel.com/docs/git"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1"
              >
                <span>Learn more about Vercel for Git</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </p>

            <span className="text-xs text-slate-400 font-mono-numbers">
              Active Monorepo: <strong className="text-cyan-300">7camz-studio</strong>
            </span>
          </div>

          {/* Clean Vercel-Style Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#090d16]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0e1422]/90 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Name</th>
                  <th className="py-3 px-4 sm:px-6">Status</th>
                  <th className="py-3 px-4 sm:px-6">Preview</th>
                  <th className="py-3 px-4 sm:px-6">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {deployments.map((dep) => {
                  const isReady = dep.status === 'ready';
                  const isBuilding = dep.status === 'building';

                  return (
                    <tr
                      key={dep.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Name Column */}
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-white font-mono flex items-center gap-2">
                        <span>{dep.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-400 font-sans font-normal border border-slate-700/40">
                          {dep.appFramework}
                        </span>
                      </td>

                      {/* Status Column with Clickable (Inspect) */}
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        {isReady && (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-emerald-400">✅</span>
                            <span className="font-semibold text-slate-200">Ready</span>
                            <button
                              onClick={() => setSelectedInspect(dep)}
                              className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer ml-0.5"
                            >
                              (Inspect)
                            </button>
                          </div>
                        )}

                        {isBuilding && (
                          <div className="inline-flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                            <span className="font-semibold text-blue-300">Building</span>
                            <button
                              onClick={() => setSelectedInspect(dep)}
                              className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer ml-0.5"
                            >
                              (Inspect)
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Preview Column */}
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        {isReady ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedPreview(dep)}
                              className="text-blue-400 hover:text-blue-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>Visit Preview</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleCopyLink(dep.previewUrl)}
                              className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors cursor-pointer"
                              title="Copy Preview URL"
                            >
                              {copiedLink === dep.previewUrl ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-xs">
                            Generating preview...
                          </span>
                        )}
                      </td>

                      {/* Updated Column */}
                      <td className="py-3.5 px-4 sm:px-6 text-slate-400 font-mono-numbers whitespace-nowrap text-xs">
                        {dep.updatedAt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Monorepo Workspace Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-medium">Production Branch:</span>
              <div className="flex items-center gap-2 text-white font-mono">
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                <span>main · 7c8a91f</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-medium">Edge CDN Acceleration:</span>
              <div className="flex items-center gap-2 text-emerald-400 font-mono">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Global Anycast CDN Active (18 PoPs)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-medium">Studio Collaboration:</span>
              <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Client Review Portal Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspect Terminal Drawer / Modal */}
      {selectedInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#0e1422]">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    Inspect Build: {selectedInspect.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Commit: {selectedInspect.commitHash} · {selectedInspect.branch}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedInspect.status === 'building' && (
                  <button
                    onClick={() => {
                      onUpdateDeploymentStatus(selectedInspect.id, 'ready');
                      setSelectedInspect({ ...selectedInspect, status: 'ready' });
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900/60 transition-colors cursor-pointer"
                  >
                    Force Finish Build
                  </button>
                )}
                <button
                  onClick={() => setSelectedInspect(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 bg-[#06090f] font-mono text-xs text-slate-300">
              <div className="text-slate-500 pb-2 border-b border-slate-800/60 flex justify-between">
                <span>Vercel Edge Build Log</span>
                <span>Duration: {selectedInspect.deployDuration}</span>
              </div>
              {selectedInspect.logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    log.includes('✅')
                      ? 'text-emerald-400 font-semibold'
                      : log.includes('Analyzing') || log.includes('Detected')
                      ? 'text-cyan-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-800 bg-[#0e1422] flex items-center justify-between text-xs text-slate-400">
              <span>Status: <strong className="text-white capitalize">{selectedInspect.status}</strong></span>
              <button
                onClick={() => handleCopyLink(selectedInspect.previewUrl)}
                className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Copy Preview Link</span>
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visit Preview Live Viewer Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0e1422]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{selectedPreview.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Live Preview
                    </span>
                  </h3>
                  <a
                    href={selectedPreview.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 font-mono hover:text-cyan-300 hover:underline flex items-center gap-1"
                  >
                    <span>{selectedPreview.previewUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Responsive Device Switcher */}
              <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    previewDevice === 'tablet' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setSelectedPreview(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live Edge App Preview */}
            <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-auto flex items-center justify-center">
              <div
                className={`transition-all duration-300 h-full w-full rounded-xl overflow-hidden border border-slate-800 bg-[#080c14] flex flex-col shadow-2xl ${
                  previewDevice === 'mobile'
                    ? 'max-w-sm max-h-[640px]'
                    : previewDevice === 'tablet'
                    ? 'max-w-2xl max-h-[720px]'
                    : 'max-w-full'
                }`}
              >
                {/* Simulated browser address bar */}
                <div className="px-4 py-2 bg-[#0e1422] border-b border-slate-800/80 flex items-center gap-2 text-xs">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 px-3 py-1 rounded bg-slate-900/80 text-slate-400 font-mono text-[11px] truncate text-center">
                    🔒 {selectedPreview.previewUrl}
                  </div>
                </div>

                {/* Deployed Microsite Showcase Content */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  <div className="text-center max-w-xl mx-auto space-y-2 pt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      7Camz Creative Showcase · Edge Preview
                    </span>
                    <h2 className="text-2xl font-bold font-display text-white">
                      {selectedPreview.commitMessage}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Powered by 7Camz-STUDIO multimodal neural engine & Fuaprint Studios.
                    </p>
                  </div>

                  {/* Media Grid Showcase inside preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2">
                    {mediaItems.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/70 p-3 space-y-2"
                      >
                        {item.thumbnail ? (
                          <div className="aspect-video rounded-lg overflow-hidden relative">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/70 text-cyan-300">
                              {item.type}
                            </span>
                          </div>
                        ) : (
                          <div className="aspect-video rounded-lg bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                            Audio Stem Master
                          </div>
                        )}
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.prompt}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-4">
                    <button
                      onClick={() => {
                        window.open(selectedPreview.previewUrl, '_blank');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs font-semibold hover:bg-cyan-900 transition-colors cursor-pointer"
                    >
                      <span>Open Live Edge Showcase</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Instant Deploy Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#0e1422]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Deploy New Edge Preview
                </h3>
              </div>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeployment} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  App / Workspace Name
                </label>
                <input
                  type="text"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="e.g. front, next-site, svelte-app"
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Framework
                </label>
                <select
                  value={newFramework}
                  onChange={(e) => setNewFramework(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="Next.js">Next.js (App Router)</option>
                  <option value="React SPA">React SPA (Vite)</option>
                  <option value="SvelteKit">SvelteKit</option>
                  <option value="HTML5 Video">HTML5 Video Player Embed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Git Branch
                </label>
                <input
                  type="text"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDeployModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeploying}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isDeploying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Deploying...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-slate-950" />
                      <span>Publish to Edge</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
