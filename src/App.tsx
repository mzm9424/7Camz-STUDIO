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
import { BookFuaHubWorkspace } from './components/workspaces/BookFuaHubWorkspace';
import { Globe2, ExternalLink, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceType>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(2450);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);

  // Modals
  const [isCreditModalOpen, setIsCreditModalOpen] = useState<boolean>(false);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState<boolean>(false);

  // Studio cross-transfer state
  const [incomingImage, setIncomingImage] = useState<string | undefined>(undefined);
  const [studioPrompt, setStudioPrompt] = useState<string>('');
  const [studioBpm, setStudioBpm] = useState<number>(118);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
    setStudioPrompt(prompt);
    setActiveTab('video');
    showToast('Image and camera prompt sent to Video Studio Timeline.');
  };

  const handleApplyBrief = (brief: StudioProjectBrief) => {
    setStudioPrompt(brief.imagePrompt);
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
    setStudioPrompt(prompt);
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
              credits={credits}
              onDeductCredits={handleDeductCredits}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
              initialPrompt={studioPrompt}
            />
          )}

          {activeTab === 'video' && (
            <VideoStudioWorkspace
              onSaveToVault={handleSaveToVault}
              credits={credits}
              onDeductCredits={handleDeductCredits}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
              incomingImage={incomingImage}
              incomingPrompt={studioPrompt}
            />
          )}

          {activeTab === 'voice' && (
            <VoiceStudioWorkspace
              onSaveToVault={handleSaveToVault}
              credits={credits}
              onDeductCredits={handleDeductCredits}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
              initialScript={studioPrompt}
            />
          )}

          {activeTab === 'music' && (
            <MusicStudioWorkspace
              onSaveToVault={handleSaveToVault}
              credits={credits}
              onDeductCredits={handleDeductCredits}
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
              initialPrompt={studioPrompt}
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

          {activeTab === 'pricing' && (
            <PricingWorkspace
              currentCredits={credits}
              onAddCredits={handleAddCredits}
            />
          )}

          {activeTab === 'bookfua' && (
            <BookFuaHubWorkspace
              onOpenCreditModal={() => setIsCreditModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* BookFUA & Fuaprint Studios Complementary Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060911] text-xs text-slate-400 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white font-display">7Camz-STUDIO</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">In synergy with</span>
            <a
              href="https://bookfua.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Fuaprint Studios (bookfua.com)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-center md:text-right text-slate-400 text-[11px]">
            <span className="text-slate-300 italic">"We decorate the world with premium digital solutions"</span>
            <span className="mx-2 text-slate-600">·</span>
            <a
              href="https://app.bookfua.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              app.bookfua.com
            </a>
            <span className="mx-2 text-slate-600">·</span>
            <button
              onClick={() => setActiveTab('bookfua')}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              BookFUA Hub
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
