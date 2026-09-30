import React, { useState } from 'react';
import { WorkspaceType, MediaItem, StudioProjectBrief } from './types';
import { INITIAL_MEDIA_ITEMS } from './utils/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CreditModal } from './components/CreditModal';
import { ScriptDirectorModal } from './components/workspaces/ScriptDirectorModal';
import { OverviewWorkspace } from './components/workspaces/OverviewWorkspace';
import { ImageStudioWorkspace } from './components/workspaces/ImageStudioWorkspace';
import { VideoStudioWorkspace } from './components/workspaces/VideoStudioWorkspace';
import { VoiceStudioWorkspace } from './components/workspaces/VoiceStudioWorkspace';
import { MusicStudioWorkspace } from './components/workspaces/MusicStudioWorkspace';
import { LiveCamWorkspace } from './components/workspaces/LiveCamWorkspace';
import { MediaVaultWorkspace } from './components/workspaces/MediaVaultWorkspace';
import { PricingWorkspace } from './components/workspaces/PricingWorkspace';
import { VisionEnhanceWorkspace } from './components/workspaces/VisionEnhanceWorkspace';
import { DeploymentsWorkspace } from './components/workspaces/DeploymentsWorkspace';
import { INITIAL_DEPLOYMENTS } from './utils/initialDeployments';
import { ProjectDeployment } from './types';
import { Globe2, ExternalLink, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceType>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(2450);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [deployments, setDeployments] = useState<ProjectDeployment[]>(INITIAL_DEPLOYMENTS);

  // Modals
  const [isCreditModalOpen, setIsCreditModalOpen] = useState<boolean>(false);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState<boolean>(false);

  // Studio cross-transfer state
  const [incomingImage, setIncomingImage] = useState<string | undefined>(undefined);
  const [studioImagePrompt, setStudioImagePrompt] = useState<string>('');
  const [studioVideoPrompt, setStudioVideoPrompt] = useState<string>('');
  const [studioVoiceScript, setStudioVoiceScript] = useState<string>('');
  const [studioMusicPrompt, setStudioMusicPrompt] = useState<string>('');
  const [studioBpm, setStudioBpm] = useState<number>(118);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddDeployment = (dep: ProjectDeployment) => {
    setDeployments((prev) => [dep, ...prev]);
    showToast(`Initiated edge preview deployment for "${dep.name}".`);
  };

  const handleUpdateDeploymentStatus = (id: string, status: 'ready' | 'building' | 'error') => {
    setDeployments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, deployDuration: '32s' } : d))
    );
    showToast(`Deployment "${id}" updated to ${status}!`);
  };

  const handleAddCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
    showToast(`+${amount.toLocaleString()} Credits added to Studio Balance!`);
  };

  const handleDeductCredits = (amount: number): boolean => {
    if (credits < amount) {
      showToast(`Insufficient credits (${credits} available, ${amount} required). Please top up.`);
      return false;
    }
    setCredits((prev) => prev - amount);
    showToast(`Deducted ${amount} Credits.`);
    return true;
  };

  const handleSaveToVault = (item: MediaItem) => {
    setMediaItems((prev) => [item, ...prev]);
    showToast(`Saved "${item.title}" to Media Vault.`);
  };

  const handleDeleteVaultItem = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Asset removed from Studio Vault.');
  };

  const handleSendImageToVideo = (imageUrl: string, prompt: string) => {
    setIncomingImage(imageUrl);
    setStudioVideoPrompt(prompt);
    setActiveTab('video');
    showToast('Image and camera prompt sent to Video Studio Timeline.');
  };

  const handleOpenImageStudio = (imageUrl: string, prompt?: string) => {
    setIncomingImage(imageUrl);
    if (prompt) setStudioImagePrompt(prompt);
    setActiveTab('image');
    showToast('Visual loaded into Image Studio Editor.');
  };

  const handleSendToVisionLab = (imageUrl: string) => {
    setIncomingImage(imageUrl);
    setActiveTab('imagelab');
    showToast('Transferred visual to Vision AI Lab for 4K Enhancement & Palette analysis.');
  };

  const handleApplyBrief = (brief: StudioProjectBrief) => {
    setStudioImagePrompt(brief.imagePrompt);
    setStudioVideoPrompt(brief.videoPrompt);
    setStudioVoiceScript(brief.voiceScript);
    setStudioMusicPrompt(brief.musicPrompt || `${brief.musicGenre}: ${brief.musicMood}`);
    setStudioBpm(brief.musicBpm);
    showToast(`Multimodal brief "${brief.conceptTitle}" loaded into all 4 studios!`);
  };

  const handleSelectMedia = (item: MediaItem) => {
    if (item.type === 'image') {
      setActiveTab('image');
    } else if (item.type === 'video') {
      setActiveTab('video');
    } else if (item.type === 'voice') {
      setActiveTab('voice');
    } else if (item.type === 'music') {
      setActiveTab('music');
    } else {
      setActiveTab('vault');
    }
  };

  const handleQuickGenerate = (prompt: string) => {
    setStudioImagePrompt(prompt);
    setActiveTab('image');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract Compliant Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        credits={credits}
        onOpenCreditModal={() => setIsCreditModalOpen(true)}
        onOpenDirectorModal={() => setIsDirectorModalOpen(true)}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        isSidebarOpen={!isSidebarCollapsed}
      />

      {/* Main Studio Body: Sidebar + Main Content Viewport */}
      <div className="flex-1 flex w-full relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          credits={credits}
          onOpenCreditModal={() => setIsCreditModalOpen(true)}
          onOpenDirectorModal={() => setIsDirectorModalOpen(true)}
        />

        <main className={`flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full transition-all ${
          isSidebarCollapsed ? 'lg:pl-8' : ''
        }`}>
          {activeTab === 'overview' && (
            <OverviewWorkspace
              setActiveTab={setActiveTab}
              mediaItems={mediaItems}
              onSelectMedia={handleSelectMedia}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
              onOpenDirectorModal={() => setIsDirectorModalOpen(true)}
              onQuickGenerate={handleQuickGenerate}
            />
          )}

          {activeTab === 'image' && (
            <ImageStudioWorkspace
              onSaveToVault={handleSaveToVault}
              onSendToVideo={handleSendImageToVideo}
              onSendToVisionLab={handleSendToVisionLab}
              credits={credits}
              onDeductCredits={handleDeductCredits}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
              initialPrompt={studioImagePrompt}
              incomingImage={incomingImage}
            />
          )}

          {activeTab === 'video' && (
            <VideoStudioWorkspace
              onSaveToVault={handleSaveToVault}
              credits={credits}
              onDeductCredits={handleDeductCredits}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
              incomingImage={incomingImage}
              incomingPrompt={studioVideoPrompt}
            />
          )}

          {activeTab === 'voice' && (
            <VoiceStudioWorkspace
              onSaveToVault={handleSaveToVault}
              credits={credits}
              onDeductCredits={handleDeductCredits}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
              initialScript={studioVoiceScript}
            />
          )}

          {activeTab === 'music' && (
            <MusicStudioWorkspace
              onSaveToVault={handleSaveToVault}
              credits={credits}
              onDeductCredits={handleDeductCredits}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
              initialPrompt={studioMusicPrompt}
              initialBpm={studioBpm}
            />
          )}

          {activeTab === 'livecam' && <LiveCamWorkspace />}

          {activeTab === 'vault' && (
            <MediaVaultWorkspace
              mediaItems={mediaItems}
              onOpenInStudio={handleSelectMedia}
              onDeleteItem={handleDeleteVaultItem}
            />
          )}

          {activeTab === 'deployments' && (
            <DeploymentsWorkspace
              deployments={deployments}
              onAddDeployment={handleAddDeployment}
              onUpdateDeploymentStatus={handleUpdateDeploymentStatus}
              mediaItems={mediaItems}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
            />
          )}

          {activeTab === 'pricing' && (
            <PricingWorkspace
              currentCredits={credits}
              onAddCredits={handleAddCredits}
            />
          )}

          {activeTab === 'imagelab' && (
            <VisionEnhanceWorkspace
              onSaveToVault={handleSaveToVault}
              onSendToVideo={handleSendImageToVideo}
              onOpenImageStudio={handleOpenImageStudio}
              credits={credits}
              onDeductCredits={handleDeductCredits}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Studio Workstation Global Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060911] text-xs text-slate-400 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white font-display">7Camz-STUDIO</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Production-Grade All-in-One Creative Workstation</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-slate-400 text-[11px]">
            <button
              onClick={() => setActiveTab('imagelab')}
              className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer transition-colors"
            >
              Vision AI Lab
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setActiveTab('image')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Image Studio
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setActiveTab('video')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Video Studio
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setActiveTab('voice')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Voice Lab
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setActiveTab('music')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Music Studio
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setActiveTab('deployments')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Deployments
            </button>
            <span className="text-slate-700">·</span>
            <button
              onClick={() => setActiveTab('pricing')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Credit Packs
            </button>
          </div>
        </div>
      </footer>

      {/* Credit Pack Top-Up Modal */}
      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        currentCredits={credits}
        onAddCredits={handleAddCredits}
      />

      {/* AI Multimodal Director Modal */}
      <ScriptDirectorModal
        isOpen={isDirectorModalOpen}
        onClose={() => setIsDirectorModalOpen(false)}
        onApplyBrief={handleApplyBrief}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/60 text-white text-xs font-medium shadow-2xl shadow-cyan-950/80 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
