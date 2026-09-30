import React, { useState } from 'react';
import { MediaItem, MediaType, WorkspaceType } from '../../types';
import {
  Search,
  Filter,
  Download,
  Copy,
  Check,
  ExternalLink,
  Film,
  Music2,
  Mic,
  Image as ImageIcon,
  Clock,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

interface MediaVaultWorkspaceProps {
  mediaItems: MediaItem[];
  onOpenInStudio: (item: MediaItem) => void;
  onDeleteItem: (id: string) => void;
}

export const MediaVaultWorkspace: React.FC<MediaVaultWorkspaceProps> = ({
  mediaItems,
  onOpenInStudio,
  onDeleteItem,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const filteredItems = mediaItems.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDownload = (item: MediaItem) => {
    let ext = 'bin';
    if (item.type === 'image') ext = 'png';
    else if (item.type === 'video') ext = 'mp4';
    else if (item.type === 'voice' || item.type === 'music') ext = 'wav';

    const cleanTitle = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename = `${cleanTitle || 'studio-asset'}.${ext}`;

    if (item.url) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = item.url;
      link.click();
    } else {
      // Create a descriptive text record for purely generated audio sessions
      const blob = new Blob([
        `7Camz-STUDIO Asset Manifest\n` +
        `Title: ${item.title}\n` +
        `Type: ${item.type}\n` +
        `Format: ${item.format}\n` +
        `Prompt / Script: ${item.prompt}\n` +
        `Created: ${item.createdAt}\n`
      ], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${cleanTitle || 'studio-voice'}-manifest.txt`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-cyan-400" />;
      case 'video':
        return <Film className="w-4 h-4 text-blue-400" />;
      case 'voice':
        return <Mic className="w-4 h-4 text-emerald-400" />;
      case 'music':
        return <Music2 className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e1422] border border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <span>Studio Media Vault</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-numbers">
              {filteredItems.length} Assets
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Secure cloud storage for all generated and edited images, video cuts, voiceovers, and stems.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts, tags, or titles..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Media Assets' },
          { id: 'image', label: 'Images' },
          { id: 'video', label: 'Videos' },
          { id: 'voice', label: 'Voice Narration' },
          { id: 'music', label: 'Music Stems' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Asset Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <p className="text-sm text-slate-400 mb-2">No media assets match your search criteria.</p>
          <button
            onClick={() => {
              setFilterType('all');
              setSearchQuery('');
            }}
            className="text-xs text-cyan-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              {/* Thumbnail or Audio banner */}
              <div
                onClick={() => setSelectedItem(item)}
                className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer"
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                    {getTypeIcon(item.type)}
                  </div>
                )}

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                  {getTypeIcon(item.type)}
                  <span>{item.type}</span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono-numbers bg-black/80 backdrop-blur-md text-cyan-300">
                  {item.duration || item.dimensions || item.format}
                </div>
              </div>

              {/* Info Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {item.prompt}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <span className="font-mono-numbers text-[11px]">{item.createdAt}</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyPrompt(item.prompt, item.id)}
                      className="p-1.5 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Copy Prompt"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {item.url && (
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-1.5 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Download Asset"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    )}

                    <button
                      onClick={() => onOpenInStudio(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Edit</span>
                      <ExternalLink className="w-3 h-3 text-cyan-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#0c121e] border border-slate-700/80 rounded-2xl overflow-hidden p-6">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {selectedItem.type} Master
              </span>
              <h3 className="text-lg font-bold text-white">{selectedItem.title}</h3>
            </div>

            {selectedItem.thumbnail && (
              <div className="rounded-xl overflow-hidden bg-black mb-4 aspect-video flex items-center justify-center">
                <img
                  src={selectedItem.thumbnail}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 mb-4 text-xs text-slate-300 leading-relaxed">
              <strong className="text-slate-400 block mb-1">Creation Prompt:</strong>
              {selectedItem.prompt}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-400 font-mono-numbers mb-4">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span>Format: </span><strong className="text-white">{selectedItem.format}</strong>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span>Metrics: </span><strong className="text-white">{selectedItem.duration || selectedItem.dimensions}</strong>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span>Credits: </span><strong className="text-cyan-400">{selectedItem.creditsUsed} CR</strong>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span>Timestamp: </span><strong className="text-white">{selectedItem.createdAt}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  onDeleteItem(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Asset</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleDownload(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Master</span>
                </button>

                <button
                  onClick={() => {
                    onOpenInStudio(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Launch in Studio Editor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
